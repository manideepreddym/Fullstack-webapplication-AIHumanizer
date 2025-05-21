import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wand2 } from 'lucide-react';
import Button from '../components/Button';
import { supabase } from '../lib/supabaseClient';
import { createDocument, getUserCredits } from '../lib/api';
import type { UserCredits } from '../lib/types';

const Rewriter: React.FC = () => {
  const navigate = useNavigate();
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [tone, setTone] = useState('casual');
  const [length, setLength] = useState('same');
  const [credits, setCredits] = useState<UserCredits | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        try {
          const credits = await getUserCredits(session.user.id);
          setCredits(credits);
        } catch (error) {
          console.error('Error fetching credits:', error);
        }
      }
    };

    checkAuth();
  }, []);

  const handleRewrite = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate('/login');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const document = await createDocument(session.user.id, inputText);
      setOutputText(document.humanized_text || '');
      
      // Refresh credits after successful operation
      const updatedCredits = await getUserCredits(session.user.id);
      setCredits(updatedCredits);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="animate-fadeIn">
      <section className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">AI Text Rewriter</h1>
            <p className="text-xl text-purple-100">
              Transform your AI-generated content into natural, engaging text that connects with readers.
            </p>
            {credits && (
              <p className="mt-4 text-lg text-purple-100">
                Credits remaining: {credits.credits_remaining}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-50 rounded-xl p-6 md:p-8 shadow-sm">
              {error && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-600 rounded-md p-4">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"> {/* Increased mb-6 to mb-8 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tone
                  </label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  >
                    <option value="casual">Casual</option>
                    <option value="professional">Professional</option>
                    <option value="friendly">Friendly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Length
                  </label>
                  <select
                    value={length}
                    onChange={(e) => setLength(e.target.value)}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  >
                    <option value="shorter">Shorter</option>
                    <option value="same">Same Length</option>
                    <option value="longer">Longer</option>
                  </select>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Input Text
                  </label>
                  <textarea
                    rows={6}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    placeholder="Paste your AI-generated text here..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                  ></textarea>
                </div>

                <div className="flex justify-center">
                  <Button
                    onClick={handleRewrite}
                    disabled={!inputText || isProcessing}
                    className="flex items-center space-x-2"
                  >
                    {isProcessing ? (
                      <>
                        <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Wand2 className="h-5 w-5" />
                        <span>Humanize Text</span>
                      </>
                    )}
                  </Button>
                </div>

                {outputText && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Humanized Output
                    </label>
                    <div className="w-full rounded-lg border border-gray-300 bg-white p-4 text-gray-700 min-h-[120px]"> {/* Added min-h-[120px] */}
                      {outputText}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Rewriter;