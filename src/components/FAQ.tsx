import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQ() {
  const [openItem, setOpenItem] = useState<number | null>(null);

  const faqItems: FAQItem[] = [
    {
      question: 'What accessibility features are available for PWD candidates?',
      answer: 'Our platform offers various accessibility features including screen readers, voice commands, high contrast mode, text-to-speech, extended time options, and gesture-based inputs. These can be customized based on individual needs.',
    },
    {
      question: 'How does the AI-powered assessment system work?',
      answer: 'The AI system adapts to each candidate\'s performance in real-time, adjusting question difficulty and format. It also provides personalized feedback and learning recommendations based on performance patterns.',
    },
    {
      question: 'Can I take assessments offline?',
      answer: 'Yes, our platform supports offline assessments. You can download the required materials beforehand, complete the assessment without internet connection, and sync results when you\'re back online.',
    },
    {
      question: 'How are my assessment results secured?',
      answer: 'We use blockchain technology to secure assessment results and certificates, making them tamper-proof. All personal data is encrypted and handled in compliance with GDPR regulations.',
    },
    {
      question: 'What types of assessments are available?',
      answer: 'We offer multiple assessment types including MCQs, practical exams, descriptive tests, and viva voce. Each type can be customized with various accessibility features and difficulty levels.',
    },
    {
      question: 'How can I track my progress?',
      answer: 'The dashboard provides detailed analytics of your performance, including progress graphs, skill maps, and comparison with global standards. You can also view detailed feedback for each assessment.',
    },
    {
      question: 'What support is available during assessments?',
      answer: 'We provide 24/7 AI chat support, live technical assistance, and accessibility support. For PWD candidates, additional support options are available based on specific needs.',
    },
    {
      question: 'How are practical skills assessed?',
      answer: 'Practical assessments use a combination of virtual simulations, real-world projects, and AI-monitored practical tasks. For certain skills, VR/AR technology is used to create immersive assessment environments.',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto py-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>
      <div className="space-y-4">
        {faqItems.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow overflow-hidden"
          >
            <button
              onClick={() => setOpenItem(openItem === index ? null : index)}
              className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50"
            >
              <span className="text-lg font-medium text-gray-900">
                {item.question}
              </span>
              {openItem === index ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </button>
            {openItem === index && (
              <div className="px-6 py-4 bg-gray-50">
                <p className="text-gray-700">{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}