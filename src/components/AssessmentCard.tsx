import React from 'react';
import { Clock, Award, BookOpen, Users } from 'lucide-react';
import type { Assessment } from '../types';

interface AssessmentCardProps {
  assessment: Assessment;
  onStart?: () => void;
  isAdmin: boolean;
}

export default function AssessmentCard({ assessment, onStart, isAdmin }: AssessmentCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Upcoming':
        return 'bg-yellow-100 text-yellow-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:border-indigo-500 transition-colors">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{assessment.title}</h3>
          <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            <span>{assessment.duration}</span>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(assessment.status)}`}>
          {assessment.status}
        </span>
      </div>

      <div className="mt-4 flex items-center gap-4">
        <div className="flex items-center gap-1">
          <BookOpen className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">{assessment.type}</span>
        </div>
        {assessment.score && (
          <div className="flex items-center gap-1">
            <Award className="h-4 w-4 text-indigo-500" />
            <span className="text-sm font-medium text-indigo-600">{assessment.score}%</span>
          </div>
        )}
      </div>

      {isAdmin && assessment.submissions && (
        <div className="mt-4 border-t pt-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Recent Submissions</h4>
          <div className="space-y-2">
            {assessment.submissions.map((submission, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">{submission.studentName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-indigo-600 font-medium">{submission.score}%</span>
                  <span className="text-gray-400">{submission.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!isAdmin && onStart && assessment.status === 'Upcoming' && (
        <button
          onClick={onStart}
          className="mt-4 w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Start Assessment
        </button>
      )}
    </div>
  );
}