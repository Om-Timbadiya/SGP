import React from 'react';
import { Clock, Users, Award, BarChart2, ExternalLink } from 'lucide-react';
import { Assessment } from '../../types';

interface AdminAssessmentCardProps {
  assessment: Assessment;
}

export default function AdminAssessmentCard({ assessment }: AdminAssessmentCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Upcoming':
        return 'bg-yellow-100 text-yellow-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:border-indigo-500 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-medium text-gray-900">{assessment.title}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(assessment.status)}`}>
          {assessment.status}
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="h-4 w-4" />
          <span>{assessment.duration}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Users className="h-4 w-4" />
          <span>{assessment.totalStudents || 0} Students Enrolled</span>
        </div>

        {assessment.averageScore && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Award className="h-4 w-4" />
            <span>Average Score: {assessment.averageScore}%</span>
          </div>
        )}
      </div>

      {assessment.submissions && assessment.submissions.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Recent Submissions</h4>
          <div className="space-y-2">
            {assessment.submissions.slice(0, 3).map((submission, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <span className="text-gray-600">{submission.studentName}</span>
                <span className="font-medium text-indigo-600">{submission.score}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between">
        <button className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700">
          <BarChart2 className="h-4 w-4" />
          View Analytics
        </button>
        <button className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700">
          <ExternalLink className="h-4 w-4" />
          View Details
        </button>
      </div>
    </div>
  );
}