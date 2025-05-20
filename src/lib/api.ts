import { supabase } from './supabaseClient';
import type { Document, UserCredits } from './types';

const UNDETECTABLE_API_KEY = import.meta.env.VITE_UNDETECTABLE_API_KEY;

export async function getUserCredits(userId: string): Promise<UserCredits | null> {
  const { data, error } = await supabase
    .from('user_credits')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) throw error;
  return data;
}

export async function getUserDocuments(userId: string): Promise<Document[]> {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

async function submitForHumanization(text: string): Promise<string> {
  const response = await fetch('https://humanize.undetectable.ai/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': UNDETECTABLE_API_KEY
    },
    body: JSON.stringify({
      content: text,
      readability: "High School",
      purpose: "General Writing",
      strength: "More Human",
      model: "v11"
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to submit text for humanization');
  }

  const data = await response.json();
  return data.id;
}

async function getHumanizedDocument(documentId: string): Promise<string> {
  const response = await fetch('https://humanize.undetectable.ai/document', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': UNDETECTABLE_API_KEY
    },
    body: JSON.stringify({ id: documentId })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to retrieve humanized text');
  }

  const data = await response.json();
  return data.output || '';
}

async function pollForCompletion(documentId: string, maxAttempts = 12): Promise<string> {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const humanizedText = await getHumanizedDocument(documentId);
      if (humanizedText) {
        return humanizedText;
      }
    } catch (error) {
      console.error('Error polling for completion:', error);
    }
    await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds between attempts
  }
  throw new Error('Timeout waiting for humanization to complete');
}

export async function createDocument(
  userId: string,
  text: string,
  title: string = 'Untitled Document'
): Promise<Document> {
  // First check if user has enough credits
  const credits = await getUserCredits(userId);
  const wordsCount = text.trim().split(/\s+/).length;
  
  if (!credits || credits.credits_remaining < wordsCount) {
    throw new Error('Insufficient credits. Please upgrade your plan to continue.');
  }

  if (wordsCount < 50) {
    throw new Error('Text must be at least 50 words long.');
  }

  if (wordsCount > 15000) {
    throw new Error('Text cannot exceed 15,000 words.');
  }

  // Create document first
  const { data: document, error: docError } = await supabase
    .from('documents')
    .insert({
      user_id: userId,
      title,
      original_text: text,
      words_count: wordsCount,
      credits_used: wordsCount,
      status: 'pending'
    })
    .select()
    .single();

  if (docError) throw docError;

  try {
    // Submit text for humanization
    const undetectableDocId = await submitForHumanization(text);
    
    // Poll for completion
    const humanizedText = await pollForCompletion(undetectableDocId);

    // Update document with humanized text
    const { error: updateError } = await supabase
      .from('documents')
      .update({
        humanized_text: humanizedText,
        status: 'completed'
      })
      .eq('id', document.id);

    if (updateError) throw updateError;

    // Deduct credits
    await deductCredits(userId, wordsCount);

    return { ...document, humanized_text: humanizedText, status: 'completed' };
  } catch (error) {
    // Update document status to error if humanization fails
    await updateDocumentStatus(document.id, 'error');
    throw error;
  }
}

export async function updateDocumentStatus(
  documentId: string,
  status: Document['status'],
  humanizedText?: string
): Promise<void> {
  const { error } = await supabase
    .from('documents')
    .update({
      status,
      ...(humanizedText && { humanized_text: humanizedText })
    })
    .eq('id', documentId);

  if (error) throw error;
}

export async function deductCredits(userId: string, creditsToDeduct: number): Promise<void> {
  const { data, error } = await supabase.rpc('deduct_credits', {
    user_id: userId,
    credits_to_deduct: creditsToDeduct
  });

  if (error) {
    throw new Error('Failed to deduct credits. Please try again.');
  }

  if (!data) {
    throw new Error('Insufficient credits. Please upgrade your plan to continue.');
  }
}