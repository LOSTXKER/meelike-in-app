'use client';

import { useState, useEffect } from 'react';
import { hasSurvey } from '../utils/localStorage';

interface SurveyPromoCardProps {
  onOpenSurvey: () => void;
}

export default function SurveyPromoCard({ onOpenSurvey }: SurveyPromoCardProps) {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    // Check if survey is already completed
    if (hasSurvey()) {
      setIsVisible(false);
      return;
    }

    // Get or set the countdown start time (24 hours from first visit)
    const PROMO_KEY = 'meelike_survey_promo_start';
    const PROMO_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    let startTime = localStorage.getItem(PROMO_KEY);
    if (!startTime) {
      startTime = Date.now().toString();
      localStorage.setItem(PROMO_KEY, startTime);
    }

    const endTime = parseInt(startTime) + PROMO_DURATION;

    const updateTimer = () => {
      const now = Date.now();
      const remaining = endTime - now;

      if (remaining <= 0) {
        setIsExpired(true);
        setIsVisible(false);
        return;
      }

      const hours = Math.floor(remaining / (1000 * 60 * 60));
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
      setIsVisible(true);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, []);

  // Listen for survey completion event to hide the promo card
  useEffect(() => {
    const handleSurveyCompleted = () => {
      setIsVisible(false);
    };

    window.addEventListener('surveyCompleted', handleSurveyCompleted);
    return () => window.removeEventListener('surveyCompleted', handleSurveyCompleted);
  }, []);

  if (!isVisible || isExpired || !timeLeft) {
    return null;
  }

  const formatTime = (num: number) => num.toString().padStart(2, '0');

  return (
    <button
      onClick={onOpenSurvey}
      className="group relative flex items-center gap-3 bg-brand-secondary hover:bg-brand-secondary-light dark:bg-dark-primary dark:hover:bg-dark-primary/80 text-brand-text-dark rounded-full pl-4 pr-3 py-2 shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse hover:animate-none"
    >
      {/* Gift Icon */}
      <div className="flex items-center gap-2">
        <span className="text-xl">🎁</span>
        <div className="text-left">
          <p className="text-xs font-bold leading-tight">ตอบแบบสำรวจ</p>
          <p className="text-xs font-semibold leading-tight">รับ <span className="text-brand-error dark:text-dark-accent">10 เครดิตฟรี!</span></p>
        </div>
      </div>

      {/* Countdown Timer */}
      <div className="flex items-center gap-1 bg-black/20 rounded-full px-2 py-1">
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
        <span className="text-xs font-mono font-bold">
          {formatTime(timeLeft.hours)}:{formatTime(timeLeft.minutes)}:{formatTime(timeLeft.seconds)}
        </span>
      </div>

      {/* Sparkle effect */}
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-ping opacity-75"></div>
    </button>
  );
}

