import React, { useState, useEffect, useRef } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

interface AssessmentTimerProps {
  duration: number; // in minutes
  extendedTime: boolean;
  onTimeUp: () => void;
  onTimeWarning: () => void;
  isAssessmentComplete: boolean;
}

export default function AssessmentTimer({
  duration,
  extendedTime,
  onTimeUp,
  onTimeWarning,
  isAssessmentComplete
}: AssessmentTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [isWarning, setIsWarning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isAssessmentComplete) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
          onTimeUp();
          return 0;
        }
        
        // Warning when 5 minutes remaining
        if (prev === 300 && !isWarning) {
          setIsWarning(true);
          onTimeWarning();
        }
        
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [onTimeUp, onTimeWarning, isAssessmentComplete]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`fixed top-4 right-4 z-50 ${
      isWarning ? 'animate-pulse' : ''
    }`}>
      <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
        isWarning ? 'bg-red-100' : 'bg-white'
      } shadow-lg border ${
        isWarning ? 'border-red-200' : 'border-gray-200'
      }`}>
        {isWarning ? (
          <AlertTriangle className="h-5 w-5 text-red-500" />
        ) : (
          <Clock className="h-5 w-5 text-gray-500" />
        )}
        <span className={`font-medium ${
          isWarning ? 'text-red-700' : 'text-gray-900'
        }`}>
          {formatTime(timeLeft)}
        </span>
        {extendedTime && (
          <span className="text-xs text-indigo-600 font-medium">
            Extended Time
          </span>
        )}
      </div>
    </div>
  );
}