import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Award, Users, BookOpen } from 'lucide-react';

function Home() {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Assessments',
      description: 'Adaptive testing that adjusts to your skill level',
    },
    {
      icon: Award,
      title: 'Instant Feedback',
      description: 'Get detailed analysis and improvement suggestions',
    },
    {
      icon: Users,
      title: 'Inclusive Learning',
      description: 'Accessibility features for all types of learners',
    },
    {
      icon: BookOpen,
      title: 'Comprehensive Testing',
      description: 'Multiple assessment formats for complete evaluation',
    },
  ];

  return (
    <div className="bg-white">
      <header className="bg-indigo-600">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
          <div className="w-full py-6 flex items-center justify-between">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-white" />
              <span className="ml-2 text-xl font-bold text-white">AI-Chintu</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-white hover:bg-indigo-500 px-4 py-2 rounded-md"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-white text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-md"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero section */}
        <div className="relative">
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="relative px-4 py-16 sm:px-6 sm:py-24 lg:py-32 lg:px-8">
              <h1 className="text-center text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                <span className="block text-gray-900">Transform Your</span>
                <span className="block text-indigo-600">Assessment Experience</span>
              </h1>
              <p className="mt-6 max-w-lg mx-auto text-center text-xl text-gray-500 sm:max-w-3xl">
                AI-powered assessment platform designed for inclusive and comprehensive evaluation
                across all skill levels.
              </p>
              <div className="mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center">
                <div className="space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5">
                  <Link
                    to="/register"
                    className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 sm:px-8"
                  >
                    Get started
                  </Link>
                  <Link
                    to="/about"
                    className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-indigo-600 bg-white hover:bg-gray-50 sm:px-8"
                  >
                    Learn more
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features section */}
        <div className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center">
              <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">
                Features
              </h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                A better way to assess skills
              </p>
            </div>

            <div className="mt-10">
              <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
                {features.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <div key={feature.title} className="relative">
                      <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                        <Icon className="h-6 w-6" aria-hidden="true" />
                      </div>
                      <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                        {feature.title}
                      </p>
                      <p className="mt-2 ml-16 text-base text-gray-500">
                        {feature.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;