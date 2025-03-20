import React, { useState, useEffect, useCallback } from 'react';
import { Brain, Target, TrendingUp, AlertCircle, HelpCircle, BarChart2 } from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';

interface Question {
  id: string;
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'mcq' | 'practical' | 'descriptive';
  content: string;
  options?: string[];
  correctAnswer?: string;
  skillArea: string;
  timeSpent?: number;
}

interface AdaptiveAssessmentProps {
  onQuestionAnswered: (response: any) => void;
  onComplete: (results: any) => void;
  accessibilityFeatures: string[];
}

export default function AdaptiveAssessment({
  onQuestionAnswered,
  onComplete,
  accessibilityFeatures,
}: AdaptiveAssessmentProps) {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [performance, setPerformance] = useState<number>(0);
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [consecutiveIncorrect, setConsecutiveIncorrect] = useState(0);
  const [skillLevels, setSkillLevels] = useState<Record<string, number>>({});
  const [startTime, setStartTime] = useState<number>(0);
  const [showHint, setShowHint] = useState(false);
  const { isScreenReaderEnabled } = useAccessibility();

  const questionPool: Question[] = [
    {
      id: '1',
      difficulty: 'easy',
      type: 'mcq',
      content: 'What is the primary purpose of useState in React?',
      options: [
        'To manage component state',
        'To create routes',
        'To handle HTTP requests',
        'To style components'
      ],
      correctAnswer: 'To manage component state',
      skillArea: 'React Fundamentals'
    },
    {
      id: '2',
      difficulty: 'medium',
      type: 'mcq',
      content: 'Which hook should be used for side effects in React?',
      options: [
        'useEffect',
        'useState',
        'useContext',
        'useReducer'
      ],
      correctAnswer: 'useEffect',
      skillArea: 'React Hooks'
    },
    {
      id: '3',
      difficulty: 'hard',
      type: 'practical',
      content: 'Implement a custom hook that manages form state and validation',
      skillArea: 'Advanced React'
    }
  ];

  const getNextQuestion = useCallback(() => {
    const filteredQuestions = questionPool.filter(q => q.difficulty === difficulty);
    const weakestSkill = Object.entries(skillLevels)
      .sort(([, a], [, b]) => a - b)[0]?.[0];
    
    return filteredQuestions.find(q => q.skillArea === weakestSkill) ||
           filteredQuestions[Math.floor(Math.random() * filteredQuestions.length)];
  }, [difficulty, skillLevels]);

  useEffect(() => {
    const nextQuestion = getNextQuestion();
    if (nextQuestion) {
      setCurrentQuestion(nextQuestion);
      setStartTime(Date.now());
    }
  }, [difficulty, getNextQuestion]);

  const adjustDifficulty = (isCorrect: boolean, timeSpent: number) => {
    if (isCorrect) {
      setConsecutiveCorrect(prev => prev + 1);
      setConsecutiveIncorrect(0);
      
      if (consecutiveCorrect >= 2 && timeSpent < 30000) { // Less than 30 seconds
        setDifficulty(prev => prev === 'easy' ? 'medium' : 'hard');
      }
    } else {
      setConsecutiveIncorrect(prev => prev + 1);
      setConsecutiveCorrect(0);
      
      if (consecutiveIncorrect >= 2 || timeSpent > 90000) { // More than 90 seconds
        setDifficulty(prev => prev === 'hard' ? 'medium' : 'easy');
      }
    }
  };

  const updateSkillLevel = (skillArea: string, isCorrect: boolean, timeSpent: number) => {
    setSkillLevels(prev => {
      const currentLevel = prev[skillArea] || 50;
      const timeBonus = timeSpent < 30000 ? 5 : 0;
      const change = isCorrect ? 10 + timeBonus : -5;
      
      return {
        ...prev,
        [skillArea]: Math.min(100, Math.max(0, currentLevel + change))
      };
    });
  };

  const handleAnswer = (answer: string) => {
    if (!currentQuestion) return;

    const timeSpent = Date.now() - startTime;
    const isCorrect = answer === currentQuestion.correctAnswer;

    adjustDifficulty(isCorrect, timeSpent);
    updateSkillLevel(currentQuestion.skillArea, isCorrect, timeSpent);
    
    setPerformance(prev => {
      const timeBonus = timeSpent < 30000 ? 5 : 0;
      const change = isCorrect ? 10 + timeBonus : -5;
      return Math.min(100, Math.max(0, prev + change));
    });

    onQuestionAnswered({
      question: currentQuestion,
      answer,
      isCorrect,
      timeSpent,
      difficulty,
      skillArea: currentQuestion.skillArea
    });
  };

  const getHint = () => {
    if (!currentQuestion) return '';
    
    switch (currentQuestion.difficulty) {
      case 'easy':
        return 'Think about the basic concepts and common use cases.';
      case 'medium':
        return 'Consider the relationships between different concepts.';
      case 'hard':
        return 'Focus on edge cases and advanced implementation details.';
      default:
        return '';
    }
  };

  if (!currentQuestion) return null;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="mb-6 space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-indigo-600" />
              <h2 className="text-xl font-bold text-gray-900">
                Adaptive Assessment
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">
                  Level: {difficulty}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">
                  Performance: {performance}%
                </span>
              </div>
            </div>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${performance}%` }}
            />
          </div>
        </div>

        {isScreenReaderEnabled && (
          <div className="mb-4 p-3 bg-indigo-50 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-indigo-600" />
              <p className="text-sm text-indigo-700">
                Screen reader mode is active. Use arrow keys to navigate options.
              </p>
            </div>
          </div>
        )}

        <div className="space-y-6">
          <div className="prose max-w-none">
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                {currentQuestion.content}
              </h3>
              <button
                onClick={() => setShowHint(!showHint)}
                className="ml-2 text-indigo-600 hover:text-indigo-700"
                aria-label="Toggle hint"
              >
                <HelpCircle className="h-5 w-5" />
              </button>
            </div>
            
            {showHint && (
              <div className="mt-2 p-3 bg-indigo-50 rounded-lg">
                <p className="text-sm text-indigo-700">{getHint()}</p>
              </div>
            )}
          </div>

          {currentQuestion.type === 'mcq' && currentQuestion.options && (
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  className="w-full p-4 text-left rounded-lg border border-gray-200 hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                  aria-label={`Option ${index + 1}: ${option}`}
                >
                  <span className="font-medium text-gray-900">
                    {String.fromCharCode(65 + index)}.
                  </span>{' '}
                  {option}
                </button>
              ))}
            </div>
          )}

          {currentQuestion.type === 'practical' && (
            <div className="space-y-4">
              <textarea
                className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                rows={6}
                placeholder="Enter your solution here..."
                aria-label="Solution input field"
              />
              <div className="flex justify-end">
                <button
                  onClick={() => handleAnswer('submitted')}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Submit Solution
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <BarChart2 className="h-5 w-5 text-gray-500" />
              <span className="text-sm text-gray-600">
                Skill Area: {currentQuestion.skillArea}
              </span>
            </div>
            <span className="text-sm text-gray-600">
              Difficulty adjusts based on your performance
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}