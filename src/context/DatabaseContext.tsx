import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import type { Assessment, StudentProgress } from '../types';

interface DatabaseContextType {
  assessments: Assessment[];
  studentProgress: StudentProgress[];
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  createAssessment: (data: Partial<Assessment>) => Promise<Assessment>;
  updateAssessment: (id: number, data: Partial<Assessment>) => Promise<Assessment>;
  deleteAssessment: (id: number) => Promise<void>;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

// Mock data
const mockAssessments: Assessment[] = [
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
];

const mockStudentProgress: StudentProgress[] = [
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
];

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [assessments, setAssessments] = useState<Assessment[]>(mockAssessments);
  const [studentProgress, setStudentProgress] = useState<StudentProgress[]>(mockStudentProgress);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      // Data is already loaded from mock data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const createAssessment = async (data: Partial<Assessment>): Promise<Assessment> => {
    const newAssessment: Assessment = {
      id: Date.now(),
      ...data,
      status: 'Upcoming',
      submissions: [],
      totalStudents: 0,
      averageScore: 0,
    } as Assessment;

    setAssessments(prev => [...prev, newAssessment]);
    return newAssessment;
  };

  const updateAssessment = async (id: number, data: Partial<Assessment>): Promise<Assessment> => {
    const updatedAssessments = assessments.map(assessment =>
      assessment.id === id ? { ...assessment, ...data } : assessment
    );
    setAssessments(updatedAssessments);
    return updatedAssessments.find(a => a.id === id) as Assessment;
  };

  const deleteAssessment = async (id: number) => {
    setAssessments(prev => prev.filter(assessment => assessment.id !== id));
  };

  return (
    <DatabaseContext.Provider
      value={{
        assessments,
        studentProgress,
        loading,
        error,
        refreshData: loadData,
        createAssessment,
        updateAssessment,
        deleteAssessment,
      }}
    >
      {children}
    </DatabaseContext.Provider>
  );
}

export function useDatabase() {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
}