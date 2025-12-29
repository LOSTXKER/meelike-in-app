'use client';

import { useState, useEffect } from 'react';
import {
  getLeaderboardData,
  getMonthEndCountdown,
  formatCurrency,
  getRankEmoji,
  type LeaderboardData
} from '../utils/localStorage';

// Trophy Icon
const TrophyIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" d="M5.166 2.621v.858c-1.035.148-2.059.33-3.071.543a.75.75 0 00-.584.859 6.753 6.753 0 006.138 5.6 6.73 6.73 0 002.743 1.346A6.707 6.707 0 019.279 15H8.54c-1.036 0-1.875.84-1.875 1.875V19.5h-.75a.75.75 0 000 1.5h12.17a.75.75 0 000-1.5h-.75v-2.625c0-1.036-.84-1.875-1.875-1.875h-.739a6.707 6.707 0 01-1.112-3.173 6.73 6.73 0 002.743-1.347 6.753 6.753 0 006.139-5.6.75.75 0 00-.585-.858 47.077 47.077 0 00-3.07-.543V2.62a.75.75 0 00-.658-.744 49.22 49.22 0 00-6.093-.377c-2.063 0-4.096.128-6.093.377a.75.75 0 00-.657.744zm0 2.629c0 1.196.312 2.32.857 3.294A5.266 5.266 0 013.16 5.337a45.6 45.6 0 012.006-.343v.256zm13.5 0v-.256c.674.1 1.343.214 2.006.343a5.265 5.265 0 01-2.863 3.207 6.72 6.72 0 00.857-3.294z" clipRule="evenodd" />
  </svg>
);

// Arrow Right Icon
const ArrowRightIcon = ({ className = "w-3 h-3" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
  </svg>
);

export default function SidebarLeaderboard() {
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Delay to ensure mock data is initialized
    const loadTimer = setTimeout(() => {
      const leaderboardData = getLeaderboardData();
      setData(leaderboardData);
    }, 100);

    // Update countdown every second
    const countdownTimer = setInterval(() => {
      setCountdown(getMonthEndCountdown());
    }, 1000);

    return () => {
      clearTimeout(loadTimer);
      clearInterval(countdownTimer);
    };
  }, []);

  // Always render same static skeleton on server and initial client render
  if (!mounted || !data) {
    return (
      <a href="/" className="mx-4 mb-4 block">
        <div className="p-3 bg-brand-bg dark:bg-dark-bg rounded-xl border border-brand-border dark:border-dark-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrophyIcon className="w-4 h-4 text-amber-600 dark:text-amber-500" />
              <span className="text-xs font-medium text-brand-text-dark dark:text-dark-text-light">Leaderboard</span>
            </div>
            <ArrowRightIcon className="w-3 h-3 text-brand-text-light" />
          </div>
        </div>
      </a>
    );
  }

  const { currentUser } = data;

  return (
    <a 
      href="/"
      className="mx-4 mb-4 block"
    >
      <div className="relative overflow-hidden bg-brand-secondary/10 dark:bg-dark-primary/10 rounded-xl border border-brand-secondary/20 dark:border-dark-primary/20 p-3 hover:border-brand-secondary/40 dark:hover:border-dark-primary/40 transition-all group">
        {/* Header Row */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <TrophyIcon className="w-4 h-4 text-amber-600 dark:text-amber-500" />
            <span className="text-[10px] font-bold text-brand-text-dark dark:text-dark-text-light uppercase tracking-wide">
              Leaderboard
            </span>
          </div>
          <span className="text-[9px] text-brand-text-light dark:text-dark-text-light">
            {countdown.days}d {countdown.hours}h
          </span>
        </div>

        {/* User Rank Row */}
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-brand-secondary dark:bg-dark-primary p-0.5">
              <img 
                src={currentUser.avatar || `https://placehold.co/100x100/FCD77F/473B30?text=${currentUser.username.charAt(0)}`}
                alt="Avatar"
                className="w-full h-full rounded-full object-cover bg-white dark:bg-dark-card"
              />
            </div>
            {/* Rank Badge */}
            <div className="absolute -bottom-0.5 -right-0.5 bg-white dark:bg-dark-card rounded-full w-4 h-4 flex items-center justify-center shadow-sm border border-brand-border dark:border-dark-border">
              <span className="text-[8px]">{getRankEmoji(currentUser.rankLevel)}</span>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-extrabold text-amber-700 dark:text-amber-400">
                #{currentUser.monthlyRank}
              </span>
              <span className="text-[10px] text-brand-text-light dark:text-dark-text-light">
                เดือนนี้
              </span>
            </div>
            <p className="text-[10px] text-brand-text-light dark:text-dark-text-light truncate">
              {formatCurrency(currentUser.monthlySpending)} ยอดใช้จ่าย
            </p>
          </div>

          {/* Arrow */}
          <ArrowRightIcon className="w-4 h-4 text-brand-text-light group-hover:text-brand-secondary dark:group-hover:text-dark-primary group-hover:translate-x-0.5 transition-all flex-shrink-0" />
        </div>
      </div>
    </a>
  );
}
