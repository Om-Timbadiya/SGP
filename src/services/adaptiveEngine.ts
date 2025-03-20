import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Question, UserResponse, SkillProfile } from '../types/assessment';

export class AdaptiveEngine {
  private difficultyLevels = ['easy', 'medium', 'hard'] as const;
  private questionTypes = ['mcq', 'practical', 'descriptive'] as const;
  private learningRate = 0.1;
  private performanceThreshold = 0.75;
  private genAI: GoogleGenerativeAI;

  constructor() {
    this.genAI = new GoogleGenerativeAI('AIzaSyD6nGc1kZIJZOmQVrKMEV-K8nQCWsUQF3w');
  }

  calculateNextDifficulty(
    currentDifficulty: typeof this.difficultyLevels[number],
    recentPerformance: number,
    responseTime: number,
    consecutiveCorrect: number
  ): typeof this.difficultyLevels[number] {
    const timeWeight = this.calculateTimeWeight(responseTime);
    const performanceScore = recentPerformance * timeWeight;

    if (performanceScore > this.performanceThreshold && consecutiveCorrect >= 2) {
      const currentIndex = this.difficultyLevels.indexOf(currentDifficulty);
      return this.difficultyLevels[Math.min(currentIndex + 1, this.difficultyLevels.length - 1)];
    }

    if (performanceScore < 0.4) {
      const currentIndex = this.difficultyLevels.indexOf(currentDifficulty);
      return this.difficultyLevels[Math.max(currentIndex - 1, 0)];
    }

    return currentDifficulty;
  }

  private calculateTimeWeight(responseTime: number): number {
    const optimalTime = 30000; // 30 seconds
    const maxTime = 90000; // 90 seconds
    
    if (responseTime <= optimalTime) return 1;
    if (responseTime >= maxTime) return 0.6;
    
    return 1 - ((responseTime - optimalTime) / (maxTime - optimalTime)) * 0.4;
  }

  updateSkillProfile(
    profile: SkillProfile,
    response: UserResponse,
    questionDifficulty: typeof this.difficultyLevels[number]
  ): SkillProfile {
    const { skillArea, isCorrect, responseTime } = response;
    const timeWeight = this.calculateTimeWeight(responseTime);
    const difficultyWeight = this.getDifficultyWeight(questionDifficulty);
    const performanceImpact = (isCorrect ? 1 : -0.5) * timeWeight * difficultyWeight;

    return {
      ...profile,
      skills: {
        ...profile.skills,
        [skillArea]: Math.min(
          100,
          Math.max(0, (profile.skills[skillArea] || 50) + performanceImpact * this.learningRate * 100)
        )
      }
    };
  }

  private getDifficultyWeight(difficulty: typeof this.difficultyLevels[number]): number {
    switch (difficulty) {
      case 'easy': return 0.7;
      case 'medium': return 1.0;
      case 'hard': return 1.3;
      default: return 1.0;
    }
  }

  selectNextQuestion(
    questions: Question[],
    profile: SkillProfile,
    currentDifficulty: typeof this.difficultyLevels[number]
  ): Question {
    const eligibleQuestions = questions.filter(q => 
      q.difficulty === currentDifficulty && 
      !profile.answeredQuestions.includes(q.id)
    );

    if (eligibleQuestions.length === 0) return questions[0];

    const weakestSkill = Object.entries(profile.skills)
      .sort(([, a], [, b]) => a - b)[0]?.[0];

    const targetQuestions = eligibleQuestions.filter(q => q.skillArea === weakestSkill);
    return targetQuestions.length > 0
      ? targetQuestions[Math.floor(Math.random() * targetQuestions.length)]
      : eligibleQuestions[Math.floor(Math.random() * eligibleQuestions.length)];
  }

  async evaluateDescriptiveAnswer(answer: string, correctAnswer: string): Promise<number> {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
      
      const prompt = `You are an assessment evaluator. Rate the similarity and correctness of the answer compared to the reference answer on a scale of 0 to 1.

Reference answer: ${correctAnswer}
Student answer: ${answer}
Provide only a numeric score between 0 and 1, with no additional text.`;

      const result = await model.generateContent(prompt);
      const response = result.response;
      const score = parseFloat(response.text() || "0");
      return Math.min(1, Math.max(0, score));
    } catch (error) {
      console.error('Error evaluating descriptive answer:', error);
      return 0.5;
    }
  }
}

export const adaptiveEngine = new AdaptiveEngine();