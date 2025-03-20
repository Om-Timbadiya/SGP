import React from 'react';
import { Award, BookOpen, Star } from 'lucide-react';

interface StudentProgressProps {}

export default function StudentProgress({}: StudentProgressProps) {
  const students = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      completedCourses: 8,
      certificates: [
        { name: 'JavaScript Advanced', date: '2024-03-15' },
        { name: 'React Expert', date: '2024-02-28' }
      ],
      badges: [
        { name: 'Quick Learner', icon: Star },
        { name: 'Perfect Score', icon: Award }
      ],
      progress: 85
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      completedCourses: 12,
      certificates: [
        { name: 'Python Developer', date: '2024-03-10' },
        { name: 'Data Structures', date: '2024-02-20' }
      ],
      badges: [
        { name: 'Assessment Master', icon: BookOpen },
        { name: 'Consistency King', icon: Star }
      ],
      progress: 92
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Student Progress</h2>
        <div className="space-y-6">
          {students.map((student) => (
            <div key={student.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{student.name}</h3>
                  <p className="text-sm text-gray-500">{student.email}</p>
                </div>
                <div className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                  {student.progress}% Complete
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="h-5 w-5 text-indigo-600" />
                    <h4 className="font-medium text-gray-900">Completed Courses</h4>
                  </div>
                  <p className="text-2xl font-bold text-indigo-600">{student.completedCourses}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="h-5 w-5 text-indigo-600" />
                    <h4 className="font-medium text-gray-900">Certificates</h4>
                  </div>
                  <div className="space-y-1">
                    {student.certificates.map((cert, index) => (
                      <div key={index} className="text-sm">
                        <span className="font-medium">{cert.name}</span>
                        <span className="text-gray-500 ml-2">{cert.date}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-5 w-5 text-indigo-600" />
                    <h4 className="font-medium text-gray-900">Badges</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {student.badges.map((badge, index) => {
                      const Icon = badge.icon;
                      return (
                        <div
                          key={index}
                          className="flex items-center gap-1 bg-white px-2 py-1 rounded-full border text-sm"
                        >
                          <Icon className="h-4 w-4 text-indigo-600" />
                          <span>{badge.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full"
                  style={{ width: `${student.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}