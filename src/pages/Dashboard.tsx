import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import AssessmentManagement from '../components/admin/AssessmentManagement';
import StudentProgressTable from '../components/admin/StudentProgressTable';
import StudentDashboard from '../components/student/StudentDashboard';
import { Assessment, StudentProgress } from '../types';

export default function Dashboard() {
  const { user } = useAuth();
  const [assessments, setAssessments] = useState<Assessment[]>([
    {
      id: 1,
      title: 'JavaScript Fundamentals',
      date: '2024-03-25',
      duration: '60 mins',
      type: 'MCQ',
      status: 'Upcoming',
      skillLevel: 'Intermediate',
      accessibilityFeatures: ['screen-reader', 'extended-time'],
      totalStudents: 45,
      averageScore: 85,
      submissions: [
        { studentId: '1', studentName: 'John Doe', score: 85, date: '2024-03-20', timeSpent: '55m', status: 'Completed' },
        { studentId: '2', studentName: 'Jane Smith', score: 92, date: '2024-03-21', timeSpent: '48m', status: 'Completed' }
      ]
    },
    {
      id: 2,
      title: 'Python Programming',
      date: '2024-03-27',
      duration: '90 mins',
      type: 'Practical',
      status: 'In Progress',
      skillLevel: 'Advanced',
      accessibilityFeatures: ['voice-commands', 'high-contrast'],
      totalStudents: 38,
      averageScore: 78,
      submissions: [
        { studentId: '3', studentName: 'Alice Johnson', score: 88, date: '2024-03-22', timeSpent: '82m', status: 'Completed' }
      ]
    }
  ]);

  const [students] = useState<StudentProgress[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      completedAssessments: 8,
      averageScore: 85,
      certificates: [
        { id: '1', name: 'JavaScript Advanced', date: '2024-03-15', score: 92, status: 'Issued' },
        { id: '2', name: 'React Expert', date: '2024-02-28', score: 88, status: 'Issued' }
      ],
      badges: [
        { id: '1', name: 'Quick Learner', icon: 'star', earnedDate: '2024-03-15' },
        { id: '2', name: 'Perfect Score', icon: 'award', earnedDate: '2024-02-28' }
      ],
      recentActivity: [],
      progress: 85
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      completedAssessments: 12,
      averageScore: 92,
      certificates: [
        { id: '3', name: 'Python Developer', date: '2024-03-10', score: 95, status: 'Issued' },
        { id: '4', name: 'Data Structures', date: '2024-02-20', score: 90, status: 'Issued' }
      ],
      badges: [
        { id: '3', name: 'Assessment Master', icon: 'book', earnedDate: '2024-03-10' },
        { id: '4', name: 'Consistency King', icon: 'star', earnedDate: '2024-02-20' }
      ],
      recentActivity: [],
      progress: 92
    }
  ]);

  const handleCreateAssessment = (newAssessment: Assessment) => {
    setAssessments([...assessments, { ...newAssessment, id: Date.now() }]);
  };

  if (user?.role === 'admin') {
    return (
      <div className="p-6 space-y-6">
        <AssessmentManagement
          assessments={assessments}
          onCreateAssessment={handleCreateAssessment}
        />
        <StudentProgressTable students={students} />
      </div>
    );
  }

  return <StudentDashboard assessments={assessments} />;
}