import React from 'react';
import { Shield, Star, Zap, Trophy, Target, Book } from 'lucide-react';

function Badges() {
  const badges = [
    {
      id: 1,
      title: 'Quick Learner',
      icon: Zap,
      description: 'Complete 5 assessments in a week',
      progress: 3,
      total: 5,
      earned: false,
    },
    {
      id: 2,
      title: 'Perfect Score',
      icon: Star,
      description: 'Score 100% in any assessment',
      earned: true,
      earnedDate: '2024-03-10',
    },
    {
      id: 3,
      title: 'Assessment Master',
      icon: Trophy,
      description: 'Complete 50 assessments',
      progress: 42,
      total: 50,
      earned: false,
    },
    {
      id: 4,
      title: 'Consistency King',
      icon: Target,
      description: 'Login for 30 consecutive days',
      progress: 25,
      total: 30,
      earned: false,
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Achievement Badges</h1>
        <p className="mt-1 text-gray-600">
          Collect badges by completing various challenges and assessments.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {badges.map((badge) => {
          const Icon = badge.icon;
          return (
            <div
              key={badge.id}
              className={`bg-white rounded-lg shadow-sm border p-6 ${
                badge.earned ? 'border-indigo-200' : 'border-gray-200'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div
                  className={`p-3 rounded-lg ${
                    badge.earned ? 'bg-indigo-100' : 'bg-gray-100'
                  }`}
                >
                  <Icon
                    className={`h-6 w-6 ${
                      badge.earned ? 'text-indigo-600' : 'text-gray-600'
                    }`}
                  />
                </div>
                {badge.earned && (
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                    Earned
                  </span>
                )}
              </div>

              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {badge.title}
              </h3>
              <p className="text-sm text-gray-600 mb-4">{badge.description}</p>

              {badge.earned ? (
                <p className="text-sm text-gray-500">
                  Earned on: {badge.earnedDate}
                </p>
              ) : (
                badge.progress !== undefined &&
                badge.total !== undefined && ( // ✅ Check for progress and total before rendering
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Progress</span>
                      <span>
                        {badge.progress}/{badge.total}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full"
                        style={{
                          width: `${(badge.progress / badge.total) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                )
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Badges;
