import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Wand2 } from 'lucide-react';
import Button from '../components/Button';

const Home: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');

  const handleHumanize = () => {
    // Mock humanization process
    const mockOutput = inputText
      .split('.')
      .map(sentence => sentence.trim())
      .filter(sentence => sentence.length > 0)
      .map(sentence => {
        // Add some variety to make it seem more "human"
        const transitions = ['Moreover', 'Additionally', 'Furthermore', 'In fact'];
        return Math.random() > 0.8 
          ? `${transitions[Math.floor(Math.random() * transitions.length)]}, ${sentence.toLowerCase()}`
          : sentence;
      })
      .join('. ');
    
    setOutputText(mockOutput);
  };

  return (
    <div className="animate-fadeIn">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="max-w-lg md:mt-0 mt-8"> {/* Added mt-8 for mobile when image is hidden */}
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                AI Humanizer
              </h1>
              <p className="text-xl text-purple-100 mb-8">
                Transform AI-generated text into natural, human-like writing that connects with your audience.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
  <Link to="/pricing">
    <Button 
      variant="secondary" 
      size="lg"
      className="bg-transparent border-none text-white hover:bg-transparent sm:mb-0 mb-4" // Added sm:mb-0 mb-4
    >
      Get Started
    </Button>
  </Link>
  <Link to="/rewriter">
    <Button 
      variant="outline" 
      size="lg" 
      className="bg-transparent border-white text-white hover:bg-white/10" // Added hover:border-purple-300 for subtle effect
    >
      Try Demo
    </Button>
  </Link>
</div>

            </div>
            <div className="hidden md:block">
              <div className="relative bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20 shadow-xl">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="space-y-2 font-mono text-sm">
                  <div className="text-purple-200">Humanizing text...</div>
                  <div className="text-green-300">✓ Analyzing structure</div>
                  <div className="text-green-300">✓ Adjusting tone</div>
                  <div className="text-green-300">✓ Adding variations</div>
                  <div className="text-white">Output ready!</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16"> {/* Increased mb-12 to mb-16 */}
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Try It Now</h2>
              <p className="text-xl text-gray-600 mb-8"> {/* Added mb-8 */}
                Experience the power of AI Humanizer with this free demo
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 md:p-8 shadow-sm">
              <div className="space-y-6">
                <div>
                  <label htmlFor="input" className="block text-sm font-medium text-gray-700 mb-2">
                    Input Text
                  </label>
                  <textarea
                    id="input"
                    rows={4}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    placeholder="Paste your AI-generated text here..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                  ></textarea>
                </div>

                <div className="flex justify-center">
                  <Button
                    onClick={handleHumanize}
                    disabled={!inputText}
                    className="flex items-center space-x-2"
                  >
                    <Wand2 className="h-5 w-5" />
                    <span>Humanize</span>
                  </Button>
                </div>

                {outputText && (
                  <div>
                    <label htmlFor="output" className="block text-sm font-medium text-gray-700 mb-2">
                      Humanized Output
                    </label>
                    <div
                      id="output"
                      className="w-full rounded-lg border border-gray-300 bg-white p-4 text-gray-700 min-h-[100px]" // Added min-h-[100px]
                    >
                      {outputText}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose AI Humanizer?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12"> {/* Added mb-12 */}
              Transform your AI content into engaging, natural-sounding text that resonates with readers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Natural Flow',
                description:
                  'Our AI analyzes context and adds natural transitions to make your content flow smoothly.',
              },
              {
                title: 'Tone Adjustment',
                description:
                  'Maintain consistent tone and style while making the text more engaging and relatable.',
              },
              {
                title: 'Quick Results',
                description:
                  'Get instant results with our powerful AI engine, saving you time and effort.',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-8 hover:shadow-md transition-shadow duration-300"
              >
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                  <Wand2 className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-8">{feature.description}</p> {/* Increased mb-6 to mb-8 */}
                <Link
                  to="/pricing"
                  className="inline-flex items-center text-purple-600 font-medium hover:text-purple-700 hover:underline transition-colors duration-200" // Added hover:underline
                >
                  Learn more
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl overflow-hidden shadow-xl">
            <div className="px-6 py-16 md:py-20 md:px-12 text-center text-white"> {/* Changed py-12 to py-16 md:py-20 */}
              <h2 className="text-3xl font-bold mb-4">
                Ready to humanize your content?
              </h2>
              <p className="text-xl text-purple-100 mb-10 max-w-3xl mx-auto"> {/* Increased mb-8 to mb-10 */}
                Join thousands of content creators using AI Humanizer to produce engaging, natural-sounding content.
              </p>
              <Link to="/pricing">
                <Button variant="secondary" size="lg">
                  Get Started Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;