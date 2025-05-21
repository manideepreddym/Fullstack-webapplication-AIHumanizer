import React from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import Button from '../components/Button';

const Pricing: React.FC = () => {
  const plans = [
    {
      name: 'Basic',
      price: '$9',
      description: 'Perfect for individuals and small projects',
      features: [
        '5,000 words per month',
        'Basic text humanization',
        'Standard support',
        'Web-based editor',
      ],
    },
    {
      name: 'Pro',
      price: '$29',
      description: 'Ideal for professionals and growing businesses',
      features: [
        '50,000 words per month',
        'Advanced humanization features',
        'Priority support',
        'API access',
        'Custom tone settings',
        'Plagiarism checker',
      ],
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For large organizations with specific needs',
      features: [
        'Unlimited words',
        'Custom AI model training',
        'Dedicated support',
        'API access',
        'Custom integrations',
        'Team collaboration',
        'Advanced analytics',
      ],
    },
  ];

  return (
    <div className="animate-fadeIn">
      <section className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Simple, Transparent Pricing</h1>
            <p className="text-xl text-purple-100">
              Choose the perfect plan for your content needs. No hidden fees.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch"> {/* Added items-stretch */}
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`rounded-lg p-8 flex flex-col ${ /* Added flex flex-col */
                  index === 1
                    ? 'bg-gradient-to-b from-purple-600 to-indigo-600 text-white shadow-xl transform md:scale-105' // md:scale-105 for responsiveness
                    : 'bg-white shadow-md'
                } mb-8 md:mb-0`} // Added mb-8 md:mb-0 for mobile spacing
              >
                <h3
                  className={`text-2xl font-bold mb-2 ${
                    index === 1 ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {plan.name}
                </h3>
                <div className="mb-4">
                  <span
                    className={`text-4xl font-bold ${
                      index === 1 ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {plan.price}
                  </span>
                  {plan.price !== 'Custom' && (
                    <span className={index === 1 ? 'text-purple-100' : 'text-gray-500'}>
                      /month
                    </span>
                  )}
                </div>
                <p
                  className={`mb-6 ${
                    index === 1 ? 'text-purple-100' : 'text-gray-600'
                  }`}
                >
                  {plan.description}
                </p>
                <ul className="space-y-4 mb-8 flex-grow"> {/* Added flex-grow to push button down */}
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check
                        className={`h-5 w-5 mr-2 flex-shrink-0 ${
                          index === 1 ? 'text-purple-200' : 'text-purple-600'
                        }`}
                      />
                      <span
                        className={
                          index === 1 ? 'text-white' : 'text-gray-700'
                        }
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link to="/contact" className="mt-auto"> {/* Added mt-auto to button wrapper */}
                  <Button
                    variant={index === 1 ? 'secondary' : 'primary'}
                    className={`w-full ${
                      index === 1
                        ? 'bg-purple-200 text-purple-800 hover:bg-purple-100 z-10'  // Pro plan hover changed
                        : 'bg-purple-600 text-white hover:bg-purple-700 z-10'
                    }`}
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-16 text-center"> {/* Increased mb-12 to mb-16 */}
              Frequently Asked Questions
            </h2>
            <div className="space-y-8">
              {[
                {
                  question: 'Can I change plans at any time?',
                  answer:
                    'Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.',
                },
                {
                  question: 'Is there a free trial?',
                  answer:
                    'We offer a 7-day free trial on all plans. No credit card required.',
                },
                {
                  question: 'What payment methods do you accept?',
                  answer:
                    'We accept all major credit cards, PayPal, and wire transfers for Enterprise plans.',
                },
                {
                  question: 'Do unused words roll over?',
                  answer:
                    'Yes, unused words roll over for one month on Pro and Enterprise plans.',
                },
              ].map((faq, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors duration-200"
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;