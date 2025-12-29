'use client';

import { useState, useEffect } from 'react';
import { GiftIcon, FireIcon, CheckIcon, CreditCoinIcon } from './icons';
import {
  getDailyLoginData,
  canClaimToday,
  claimDailyReward,
  getNextStreakMilestone,
  isStreakValid,
} from '../utils/storage';
import { DAILY_LOGIN_REWARD } from '../constants';
import type { DailyLoginData } from '../types';

export default function DailyLoginWidget() {
  const [data, setData] = useState<DailyLoginData | null>(null);
  const [canClaim, setCanClaim] = useState(false);
  const [streakValid, setStreakValid] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    setMounted(true);
    const loginData = getDailyLoginData();
    setData(loginData);
    setCanClaim(canClaimToday());
    setStreakValid(isStreakValid());
  }, []);

  const handleClaim = () => {
    const result = claimDailyReward();
    if (result.success) {
      setShowSuccess(true);
      setCanClaim(false);
      setData(getDailyLoginData());
      window.dispatchEvent(new CustomEvent('dailyLoginClaimed'));
      setTimeout(() => setShowSuccess(false), 2000);
    }
  };

  if (!mounted) {
    return (
      <div className="bg-white dark:bg-dark-surface rounded-xl border border-brand-border dark:border-dark-border p-4 animate-pulse">
        <div className="h-40" />
      </div>
    );
  }

  // Calculate display streak
  const displayStreak = canClaim 
    ? (streakValid ? (data?.currentStreak || 0) + 1 : 1)
    : (data?.currentStreak || 0);

  // Next milestone
  const nextMilestone = getNextStreakMilestone(displayStreak - 1);
  const daysToMilestone = nextMilestone ? nextMilestone.streak - displayStreak + 1 : 0;

  // Streak dots (7 days)
  const streakDots = Array.from({ length: 7 }, (_, i) => {
    const day = i + 1;
    const streakDay = displayStreak % 7 || 7;
    const isClaimed = day < streakDay || (day === streakDay && !canClaim);
    const isToday = day === streakDay && canClaim;
    const isBonus = day === 7;
    return { day, isClaimed, isToday, isBonus };
  });

  return (
    <div className="bg-white dark:bg-dark-surface rounded-xl border border-brand-border dark:border-dark-border overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-brand-border dark:border-dark-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GiftIcon className="w-5 h-5 text-brand-primary dark:text-dark-primary" />
            <h3 className="text-base font-bold text-brand-text-dark dark:text-dark-text-dark">
              Daily Login
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {displayStreak > 0 && (
              <div className="flex items-center gap-1 bg-brand-secondary/20 dark:bg-dark-primary/20 px-2.5 py-1 rounded-full">
                <FireIcon className="w-4 h-4 text-brand-primary dark:text-dark-primary" />
                <span className="text-sm font-bold text-brand-primary dark:text-dark-primary">{displayStreak}</span>
              </div>
            )}
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('openDailyLoginInfo'))}
              className="p-1.5 text-brand-text-light hover:text-brand-text-dark dark:text-dark-text-light dark:hover:text-dark-text-dark hover:bg-brand-bg dark:hover:bg-dark-bg rounded-lg transition-colors"
              title="ดูรายละเอียด"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Success Message */}
        {showSuccess && (
          <div className="bg-brand-success/10 text-brand-success text-sm font-medium p-2.5 rounded-lg mb-3 flex items-center justify-center gap-2 animate-in fade-in">
            <CheckIcon className="w-4 h-4" />
            รับรางวัลสำเร็จ!
          </div>
        )}

        {/* Streak Progress */}
        <div className="flex justify-between gap-2 mb-4">
          {streakDots.map(({ day, isClaimed, isToday, isBonus }) => (
            <div key={day} className="flex flex-col items-center flex-1">
              <div
                className={`w-full aspect-square max-w-[36px] rounded-lg flex items-center justify-center text-sm font-bold transition-all ${
                  isClaimed
                    ? 'bg-brand-success text-white'
                    : isToday
                    ? 'bg-brand-secondary text-brand-text-dark ring-2 ring-brand-secondary/30'
                    : isBonus
                    ? 'bg-brand-secondary/20 dark:bg-dark-primary/20 text-brand-primary dark:text-dark-primary border border-brand-secondary dark:border-dark-primary'
                    : 'bg-brand-bg dark:bg-dark-bg text-brand-text-light dark:text-dark-text-light border border-brand-border dark:border-dark-border'
                }`}
              >
                {isClaimed ? <CheckIcon className="w-4 h-4" /> : isBonus ? '🎁' : day}
              </div>
              <span className={`text-[10px] font-semibold mt-1.5 flex items-center gap-0.5 text-brand-primary dark:text-dark-primary`}>
                <CreditCoinIcon className="w-3 h-3" />
                {isBonus ? '+3' : '0.5'}
              </span>
            </div>
          ))}
        </div>

        {/* Claim Button or Status */}
        {canClaim ? (
          <button
            onClick={handleClaim}
            className="w-full py-3 bg-brand-secondary hover:bg-brand-secondary/90 text-brand-text-dark font-bold text-base rounded-xl transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
          >
            🎁 รับ +{DAILY_LOGIN_REWARD} เครดิต
          </button>
        ) : (
          <div className="w-full py-3 bg-brand-bg dark:bg-dark-bg text-brand-text-light dark:text-dark-text-light font-semibold text-base rounded-xl text-center flex items-center justify-center gap-2">
            <CheckIcon className="w-5 h-5" />
            รับรางวัลวันนี้แล้ว
          </div>
        )}

        {/* Next Milestone */}
        {nextMilestone && (
          <p className="text-sm text-center text-brand-text-light dark:text-dark-text-light mt-3">
            อีก <span className="font-bold text-brand-text-dark dark:text-dark-text-dark">{daysToMilestone}</span> วัน → Bonus{' '}
            <span className="text-brand-success font-bold inline-flex items-center gap-0.5">
              <CreditCoinIcon className="w-3.5 h-3.5" />+{nextMilestone.bonus}
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
