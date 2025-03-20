export interface Question {
  id: string;
  type: 'mcq' | 'practical' | 'descriptive';
  difficulty: 'easy' | 'medium' | 'hard';
  content: string;
  options?: string[];
  correctAnswer?: string;
  skillArea: string;
  hints?: string[];
  explanation?: string;
  timeLimit?: number;
}

export interface UserResponse {
  questionId: string;
  answer: string;
  isCorrect: boolean;
  responseTime: number;
  skillArea: string;
}

export interface SkillProfile {
  userId: string;
  skills: Record<string, number>;
  answeredQuestions: string[];
  averageResponseTime: number;
  preferredQuestionTypes: Record<string, number>;
  lastAssessmentDate?: Date;
  totalAssessments: number;
}

export interface AssessmentResult {
  userId: string;
  assessmentId: string;
  score: number;
  skillBreakdown: Record<string, number>;
  timeSpent: number;
  questionResponses: UserResponse[];
  recommendedAreas: string[];
  nextDifficulty: string;
}