import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Award, 
  BookOpen, 
  Clock, 
  TrendingUp,
  CheckCircle,
  AlertCircle 
} from 'lucide-react';

function Profile() {
  const { user } = useAuth();

  const assessmentHistory = [
    {
      id: 1,
      title: 'JavaScript Fundamentals',
      score: 92,
      date: '2024-03-15',
      status: 'Completed',
      badge: 'Excellence',
    },
    {
      id: 2,
      title: 'Python Programming',
      score: 88,
      date: '2024-03-10',
      status: 'Completed',
      badge: 'Advanced',
    },
    {
      id: 3,
      title: 'Web Development',
      score: null,
      date: '2024-03-25',
      status: 'Upcoming',
      badge: null,
    },
  ];

  const skills = [
    { name: 'JavaScript', level: 85 },
    { name: 'Python', level: 75 },
    { name: 'Web Development', level: 80 },
    { name: 'Data Structures', level: 70 },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <div className="h-20 w-20 rounded-full bg-indigo-100 flex items-center justify-center">
            <span className="text-2xl font-bold text-indigo-600">
              {user?.name.charAt(0)}
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Assessment History
            </h2>
            <div className="space-y-4">
              {assessmentHistory.map((assessment) => (
                <div
                  key={assessment.id}
                  className="border rounded-lg p-4 hover:border-indigo-500 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {assessment.title}
                      </h3>
                      <p className="text-sm text-gray-500">{assessment.date}</p>
                    </div>
                    <div className="flex items-center">
                      {assessment.status === 'Completed' ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <Clock className="h-5 w-5 text-yellow-500" />
                      )}
                      <span className="ml-2 text-sm text-gray-500">
                        {assessment.status}
                      </span>
                    </div>
                  </div>
                  {assessment.score && (
                    <div className="mt-2 flex items-center gap-2">
                      <Award className="h-5 w-5 text-indigo-500" />
                      <span className="text-sm font-medium text-gray-900">
                        Score: {assessment.score}%
                      </span>
                      {assessment.badge && (
                        <span className="ml-2 px-2 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800">
                          {assessment.badge}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Skill Progress
            </h2>
            <div className="space-y-4">
              {skills.map((skill) => (
                <div key={skill.name}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      {skill.name}
                    </span>
                    <span className="text-sm text-gray-500">{skill.level}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Accessibility Settings
            </h2>
            <div className="space-y-4">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-indigo-600"
                />
                <span className="text-sm text-gray-700">Screen Reader</span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-indigo-600"
                />
                <span className="text-sm text-gray-700">High Contrast</span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-indigo-600"
                />
                <span className="text-sm text-gray-700">Text-to-Speech</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;