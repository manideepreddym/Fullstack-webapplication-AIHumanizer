import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.21.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { text, documentId } = await req.json();
    if (!text || !documentId) {
      throw new Error('Missing required fields');
    }

    // Simulate AI processing
    const words = text.split(' ');
    const humanizedWords = words.map(word => {
      // Add some variety
      if (Math.random() > 0.8) {
        return word + (Math.random() > 0.5 ? ' really' : ' actually');
      }
      return word;
    });
    const humanizedText = humanizedWords.join(' ');

    // Update the document with humanized text
    const { error: updateError } = await supabaseClient
      .from('documents')
      .update({
        humanized_text: humanizedText,
        status: 'completed'
      })
      .eq('id', documentId);

    if (updateError) {
      throw updateError;
    }

    return new Response(
      JSON.stringify({ success: true, humanizedText }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});