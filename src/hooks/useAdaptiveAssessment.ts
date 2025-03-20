import { useState, useCallback, useEffect } from 'react';
import { adaptiveEngine } from '../services/adaptiveEngine';
import type { Question, UserResponse, SkillProfile, AssessmentResult } from '../types/assessment';

interface AdaptiveAssessmentState {
  currentQuestion: Question | null;
  difficulty: 'easy' | 'medium' | 'hard';
  performance: number;
  skillProfile: SkillProfile;
  results: AssessmentResult | null;
  isComplete: boolean;
}

export function useAdaptiveAssessment(
  questions: Question[],
  initialProfile: SkillProfile,
  onComplete?: (results: AssessmentResult) => void
) {
  const [state, setState] = useState<AdaptiveAssessmentState>({
    currentQuestion: null,
    difficulty: 'medium',
    performance: 0,
    skillProfile: initialProfile,
    results: null,
    isComplete: false
  });

  const [responses, setResponses] = useState<UserResponse[]>([]);
  const [startTime, setStartTime] = useState<number>(Date.now());

  const selectNextQuestion = useCallback(() => {
    const nextQuestion = adaptiveEngine.selectNextQuestion(
      questions,
      state.skillProfile,
      state.difficulty
    );

    if (nextQuestion) {
      setState(prev => ({
        ...prev,
        currentQuestion: nextQuestion
      }));
      setStartTime(Date.now());
    } else {
      completeAssessment();
    }
  }, [state.difficulty, state.skillProfile, questions]);

  const handleAnswer = useCallback(async (answer: string) => {
    if (!state.currentQuestion) return;

    const responseTime = Date.now() - startTime;
    let isCorrect = false;

    if (state.currentQuestion.type === 'descriptive') {
      const score = await adaptiveEngine.evaluateDescriptiveAnswer(
        answer,
        state.currentQuestion.correctAnswer || ''
      );
      isCorrect = score >= 0.7;
    } else {
      isCorrect = answer === state.currentQuestion.correctAnswer;
    }

    const response: UserResponse = {
      questionId: state.currentQuestion.id,
      answer,
      isCorrect,
      responseTime,
      skillArea: state.currentQuestion.skillArea
    };

    setResponses(prev => [...prev, response]);

    const updatedProfile = adaptiveEngine.updateSkillProfile(
      state.skillProfile,
      response,
      state.difficulty
    );

    const nextDifficulty = adaptiveEngine.calculateNextDifficulty(
      state.difficulty,
      isCorrect ? 1 : 0,
      responseTime,
      responses.filter(r => r.isCorrect).length
    );

    setState(prev => ({
      ...prev,
      difficulty: nextDifficulty,
      skillProfile: updatedProfile,
      performance: calculatePerformance([...responses, response])
    }));

    selectNextQuestion();
  }, [state.currentQuestion, state.difficulty, state.skillProfile, startTime]);

  const calculatePerformance = (responses: UserResponse[]): number => {
    if (responses.length === 0) return 0;
    const correct = responses.filter(r => r.isCorrect).length;
    return (correct / responses.length) * 100;
  };

  const completeAssessment = useCallback(() => {
    const results: AssessmentResult = {
      userId: state.skillProfile.userId,
      assessmentId: Date.now().toString(),
      score: state.performance,
      skillBreakdown: state.skillProfile.skills,
      timeSpent: responses.reduce((total, r) => total + r.responseTime, 0),
      questionResponses: responses,
      recommendedAreas: Object.entries(state.skillProfile.skills)
        .filter(([, score]) => score < 70)
        .map(([area]) => area),
      nextDifficulty: state.difficulty
    };

    setState(prev => ({
      ...prev,
      results,
      isComplete: true
    }));

    onComplete?.(results);
  }, [state.performance, state.skillProfile, state.difficulty, responses]);

  useEffect(() => {
    selectNextQuestion();
  }, []);

  return {
    currentQuestion: state.currentQuestion,
    difficulty: state.difficulty,
    performance: state.performance,
    skillProfile: state.skillProfile,
    results: state.results,
    isComplete: state.isComplete,
    handleAnswer,
    completeAssessment
  };
}