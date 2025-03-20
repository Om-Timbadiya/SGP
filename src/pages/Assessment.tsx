import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccessibility } from '../context/AccessibilityContext';

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
}

function AssessmentPage() {
  const navigate = useNavigate();
  const { 
    isKeyboardNavigationEnabled = false, 
    isExtendedTimeEnabled, 
    isScreenReaderEnabled, 
    textToSpeech 
  } = useAccessibility();

  const [stage, setStage] = useState<'instructions' | 'exam' | 'result'>('instructions');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>(new Array(2).fill(-1)); // Tracks user answers
  const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes

  const dummyQuestions: Question[] = [
    {
      id: 1,
      text: "What is the primary purpose of React's useEffect hook?",
      options: [
        "To handle side effects", 
        "To create new components", 
        "To style components", 
        "To handle routing"
      ],
      correctAnswer: 0
    },
    {
      id: 2,
      text: "Which hook is used for managing local state in React?",
      options: [
        "useLocal",
        "useState", 
        "useState()", 
        "useLocalState"
      ],
      correctAnswer: 1
    },
  ];

  useEffect(() => {
    if (isKeyboardNavigationEnabled) {
      const handleKeyNav = (e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          (document.activeElement as HTMLElement)?.click();
        }
      };
      document.addEventListener('keydown', handleKeyNav);
      return () => document.removeEventListener('keydown', handleKeyNav);
    }
  }, [isKeyboardNavigationEnabled]);

  useEffect(() => {
    if (stage === 'exam' && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
    if (timeLeft === 0) {
      setStage('result');
    }
  }, [stage, timeLeft]);

  const readQuestion = (text: string) => {
    if (isScreenReaderEnabled) {
      textToSpeech(text);
    }
  };

  const handleOptionSelect = (index: number) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestion] = index;
    setAnswers(updatedAnswers);

    if (currentQuestion < dummyQuestions.length - 1) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 500);
    } else {
      setStage('result');
    }
  };

  const calculateScore = () => {
    return (answers.filter((ans, i) => ans === dummyQuestions[i].correctAnswer).length / dummyQuestions.length) * 100;
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {stage === 'instructions' && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 
            className="text-2xl font-bold text-gray-900" 
            onClick={() => readQuestion("Assessment Instructions")}
          >
            Assessment Instructions
          </h2>
          <button 
            onClick={() => setStage('exam')} 
            className="w-full py-3 bg-indigo-600 text-white rounded-lg mt-4"
          >
            Start Assessment
          </button>
        </div>
      )}

      {stage === 'exam' && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p 
            className="text-lg font-semibold" 
            onClick={() => readQuestion(dummyQuestions[currentQuestion].text)}
          >
            {dummyQuestions[currentQuestion].text}
          </p>

          <div className="mt-4">
            {dummyQuestions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionSelect(index)}
                tabIndex={isKeyboardNavigationEnabled ? 0 : -1}
                className={`block w-full text-left p-3 my-2 border rounded-lg 
                  ${answers[currentQuestion] === index ? 'bg-blue-500 text-white' : 'bg-gray-100'}
                  hover:bg-blue-200 transition-all`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}

      {stage === 'result' && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900">Assessment Completed!</h2>
          <p className="text-2xl font-bold mt-2">{calculateScore()}%</p>
          <button 
            onClick={() => navigate('/dashboard')} 
            className="w-full py-3 bg-indigo-600 text-white rounded-lg mt-4"
          >
            Go to Dashboard
          </button>
        </div>
      )}
    </div>
  );
}

export default AssessmentPage;
