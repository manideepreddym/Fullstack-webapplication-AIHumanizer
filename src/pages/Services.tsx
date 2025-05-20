import React from 'react';
import { Link } from 'react-router-dom';
import { Code, Palette, BarChart, Globe } from 'lucide-react';
import Button from '../components/Button';

const Services: React.FC = () => {
  return (
    <div className="animate-fadeIn">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Services</h1>
            <p className="text-xl text-blue-100">
              Comprehensive solutions to help your business thrive in the digital world.
            </p>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {[
              {
                icon: <Code className="h-10 w-10 text-blue-600" />,
                title: 'Web Development',
                description:
                  'We create modern, responsive websites and web applications using the latest technologies like React, Vue, and Node.js.',
                features: [
                  'Custom web applications',
                  'E-commerce solutions',
                  'CMS integration',
                  'Progressive Web Apps',
                ],
              },
              {
                icon: <Palette className="h-10 w-10 text-blue-600" />,
                title: 'UI/UX Design',
                description:
                  'Our design team creates intuitive, engaging user experiences that delight users and achieve business goals.',
                features: [
                  'User research and testing',
                  'Wireframing and prototyping',
                  'Visual design',
                  'Interaction design',
                ],
              },
              {
                icon: <BarChart className="h-10 w-10 text-blue-600" />,
                title: 'Digital Marketing',
                description:
                  'We help you grow your online presence and reach your target audience with data-driven marketing strategies.',
                features: [
                  'SEO optimization',
                  'Content marketing',
                  'Social media campaigns',
                  'Analytics and reporting',
                ],
              },
              {
                icon: <Globe className="h-10 w-10 text-blue-600" />,
                title: 'Consulting',
                description:
                  'Our experts provide guidance on technology strategy, digital transformation, and product development.',
                features: [
                  'Technology assessment',
                  'Digital strategy',
                  'Product roadmapping',
                  'Team training',
                ],
              },
            ].map((service, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-8 hover:shadow-lg transition-shadow duration-300">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-6">{service.description}</p>
                <ul className="space-y-2 mb-8">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <svg
                        className="h-5 w-5 text-blue-500 mt-0.5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/contact">
                  <Button variant="primary">Learn More</Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Process</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              How we work with you to bring your vision to life.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {[
              {
                number: '01',
                title: 'Discovery',
                description:
                  'We start by understanding your business, goals, and challenges to define the project scope.',
              },
              {
                number: '02',
                title: 'Strategy',
                description:
                  'Based on our research, we develop a comprehensive strategy to address your specific needs.',
              },
              {
                number: '03',
                title: 'Design & Development',
                description:
                  'Our team brings your project to life with meticulous attention to design and code quality.',
              },
              {
                number: '04',
                title: 'Testing & Launch',
                description:
                  'We thoroughly test everything before launch to ensure a smooth, successful deployment.',
              },
              {
                number: '05',
                title: 'Ongoing Support',
                description:
                  'Our relationship doesn\'t end at launch. We provide continued support and improvements.',
              },
            ].map((step, index) => (
              <div key={index} className="relative mb-12 last:mb-0">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                      {step.number}
                    </div>
                    {index < 4 && (
                      <div className="absolute top-12 bottom-0 left-6 w-0.5 bg-blue-200"></div>
                    )}
                  </div>
                  <div className="ml-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to get started?</h2>
            <p className="text-xl text-blue-100 mb-8">
              Contact us today to discuss your project and how we can help bring your vision to life.
            </p>
            <Link to="/contact">
              <Button
                variant="outline"
                size="lg"
                className="bg-transparent border-white text-white hover:bg-white/10"
              >
                Get in Touch
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;