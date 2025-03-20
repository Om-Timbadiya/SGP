import React, { useState } from 'react';
import { Search, HelpCircle, Book, Video, FileText } from 'lucide-react';
import FAQ from '../components/FAQ';

function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState('');

  const resources = [
    {
      title: 'Getting Started Guide',
      icon: Book,
      description: 'Learn the basics of using the assessment platform',
      link: 'https://chatgpt.com/',
    },
    {
      title: 'Video Tutorials',
      icon: Video,
      description: 'Watch step-by-step guides for all features',
      link: 'https://www.youtube.com/@ApnaCollegeOfficial',
    },
    {
      title: 'Documentation',
      icon: FileText,
      description: 'Detailed platform documentation and API references',
      link: 'https://github.com/',
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900">Help Center</h1>
        <p className="mt-2 text-gray-600">
          Find answers to your questions and learn how to use the platform
        </p>
        <div className="mt-6 max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for help..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {resources.map((resource) => {
          const Icon = resource.icon;
          return (
            <a
              key={resource.title}
              href={resource.link}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
            >
              <Icon className="h-8 w-8 text-indigo-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {resource.title}
              </h3>
              <p className="text-gray-600">{resource.description}</p>
            </a>
          );
        })}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          Frequently Asked Questions
        </h2>
        <FAQ />
      </div>
    </div>
  );
}

export default HelpCenter;