'use client';

import { useState, useEffect } from 'react';
import { hasSurvey } from '../utils/localStorage';

interface DashboardSurveyBannerProps {
  onOpenSurvey: () => void;
}

export default function DashboardSurveyBanner({ onOpenSurvey }: DashboardSurveyBannerProps) {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if survey is already completed
    if (hasSurvey()) {
      setIsVisible(false);
      return;
    }

    // Check if user dismissed the banner
    const dismissed = localStorage.getItem('survey_banner_dismissed');
    if (dismissed === 'true') {
      setIsDismissed(true);
      setIsVisible(false);
      return;
    }

    // Get or set the countdown start time
    const PROMO_KEY = 'meelike_survey_promo_start';
    const PROMO_DURATION = 24 * 60 * 60 * 1000; // 24 hours

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

  // Listen for survey completion
  useEffect(() => {
    const handleSurveyCompleted = () => {
      setIsVisible(false);
    };

    window.addEventListener('surveyCompleted', handleSurveyCompleted);
    return () => window.removeEventListener('surveyCompleted', handleSurveyCompleted);
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('survey_banner_dismissed', 'true');
    setIsDismissed(true);
    setIsVisible(false);
  };

  if (!isVisible || isExpired || isDismissed || !timeLeft) {
    return null;
  }

  const formatTime = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className="relative overflow-hidden bg-brand-secondary/20 dark:bg-dark-primary/15 border-2 border-brand-secondary dark:border-dark-primary rounded-2xl p-6 mb-6 shadow-lg">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-secondary/20 rounded-full blur-3xl -z-0"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-secondary/30 rounded-full blur-3xl -z-0"></div>

      {/* Close button */}
      <button
        onClick={handleDismiss}
        className="absolute top-4 right-4 text-brand-text-light hover:text-brand-text-dark dark:text-dark-text-light dark:hover:text-dark-text-dark transition-colors z-10"
        aria-label="ปิด"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Left side: Content */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-5xl animate-bounce">🎁</span>
              <div>
                <h3 className="text-2xl font-bold text-brand-text-dark dark:text-dark-text-dark mb-1">
                  ตอบแบบสำรวจสั้นๆ รับเครดิตฟรี!
                </h3>
                <p className="text-brand-text-light dark:text-dark-text-light">
                  ช่วยเราทำความรู้จักคุณมากขึ้น แล้วรับ <span className="font-bold text-brand-error dark:text-dark-accent">10 เครดิต</span> ทันที
                </p>
              </div>
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-4 mt-4 mb-6">
              <div className="flex items-center gap-2 text-sm text-brand-text-dark dark:text-dark-text-light">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                ใช้เวลาแค่ 2-3 นาที
              </div>
              <div className="flex items-center gap-2 text-sm text-brand-text-dark dark:text-dark-text-light">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                ได้เครดิตทันที
              </div>
              <div className="flex items-center gap-2 text-sm text-brand-text-dark dark:text-dark-text-light">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                ทำได้เพียงครั้งเดียว
              </div>
            </div>

            {/* Countdown Timer */}
            <div className="flex items-center gap-2 text-brand-text-light dark:text-dark-text-light">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">
                เหลือเวลาอีก{' '}
                <span className="font-mono font-bold text-brand-error dark:text-dark-accent">
                  {formatTime(timeLeft.hours)}:{formatTime(timeLeft.minutes)}:{formatTime(timeLeft.seconds)}
                </span>
              </span>
            </div>
          </div>

          {/* Right side: Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              onClick={handleDismiss}
              className="px-6 py-3 border-2 border-brand-secondary dark:border-dark-primary text-brand-text-dark dark:text-dark-text-dark rounded-xl font-semibold hover:bg-brand-secondary/10 dark:hover:bg-dark-primary/10 transition-colors"
            >
              ข้ามไปก่อน
            </button>
            <button
              onClick={onOpenSurvey}
              className="px-8 py-3 bg-brand-secondary hover:bg-brand-secondary-light dark:bg-dark-primary dark:hover:bg-dark-primary/80 text-brand-text-dark rounded-xl font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              ตอบแบบสำรวจเลย
            </button>
          </div>
        </div>
      </div>

      {/* Animated sparkles */}
      <div className="absolute top-8 right-20 w-2 h-2 bg-brand-secondary dark:bg-dark-primary rounded-full animate-ping"></div>
      <div className="absolute top-16 right-32 w-1.5 h-1.5 bg-brand-secondary dark:bg-dark-primary rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
      <div className="absolute bottom-12 right-24 w-2 h-2 bg-brand-secondary dark:bg-dark-primary rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
    </div>
  );
}

