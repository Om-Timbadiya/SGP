export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'student';
}

export interface Assessment {
  id: number;
  title: string;
  date: string;
  duration: string;
  type: string;
  status: 'Upcoming' | 'Completed' | 'In Progress';
  score?: number;
  skillLevel: string;
  accessibilityFeatures: string[];
  description?: string;
  totalStudents?: number;
  averageScore?: number;
  submissions?: StudentSubmission[];
}

export interface StudentSubmission {
  studentId: string;
  studentName: string;
  score: number;
  date: string;
  timeSpent: string;
  status: 'Completed' | 'In Progress';
}

export interface StudentProgress {
  id: string;
  name: string;
  email: string;
  completedAssessments: number;
  averageScore: number;
  certificates: Certificate[];
  badges: Badge[];
  recentActivity: Activity[];
  progress: number;
}

export interface Certificate {
  id: string;
  name: string;
  date: string;
  score: number;
  status: 'Issued' | 'Pending';
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  earnedDate: string;
}

export interface Activity {
  id: string;
  type: 'assessment' | 'certificate' | 'badge';
  description: string;
  date: string;
}