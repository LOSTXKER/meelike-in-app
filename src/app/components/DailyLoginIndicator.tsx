'use client';

import { useState, useEffect } from 'react';
import { GiftIcon, FireIcon } from './icons';
import { getDailyLoginData, canClaimToday } from '../utils/storage';

interface DailyLoginIndicatorProps {
  onClick?: () => void;
}

export default function DailyLoginIndicator({ onClick }: DailyLoginIndicatorProps) {
  const [streak, setStreak] = useState(0);
  const [canClaim, setCanClaim] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const data = getDailyLoginData();
    setStreak(data.currentStreak);
    setCanClaim(canClaimToday());
  }, []);

  // Listen for claim events to update
  useEffect(() => {
    const handleClaimUpdate = () => {
      const data = getDailyLoginData();
      setStreak(data.currentStreak);
      setCanClaim(canClaimToday());
    };

    window.addEventListener('dailyLoginClaimed', handleClaimUpdate);
    return () => window.removeEventListener('dailyLoginClaimed', handleClaimUpdate);
  }, []);

  if (!mounted) {
    return (
      <div className="w-11 h-10 rounded-xl bg-gray-100 dark:bg-dark-bg animate-pulse" />
    );
  }

  return (
    <button
      onClick={onClick}
      className={`relative flex items-center gap-1.5 px-2.5 py-2 rounded-xl transition-all ${
        canClaim
          ? 'bg-brand-secondary/25 dark:bg-brand-secondary/20 hover:bg-brand-secondary/35 dark:hover:bg-brand-secondary/30 shadow-sm'
          : 'bg-gray-100 dark:bg-dark-bg hover:bg-gray-200 dark:hover:bg-dark-border/50'
      }`}
      title={canClaim ? 'รับรางวัลประจำวัน!' : `Streak: ${streak} วัน`}
    >
      <GiftIcon className={`w-5 h-5 ${canClaim ? 'text-amber-700 dark:text-amber-500' : 'text-gray-500 dark:text-gray-400'}`} />
      
      {streak > 0 && (
        <span className="flex items-center gap-0.5 text-sm font-bold text-orange-500">
          <FireIcon className="w-3.5 h-3.5" />
          {streak}
        </span>
      )}

      {/* Notification Dot */}
      {canClaim && (
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-white dark:border-dark-surface"></span>
        </span>
      )}
    </button>
  );
}
