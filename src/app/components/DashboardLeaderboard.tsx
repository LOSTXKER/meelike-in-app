'use client';

import { useState, useEffect } from 'react';
import {
  getLeaderboardData,
  getMonthEndCountdown,
  formatCurrency,
  getRankEmoji,
  getRankColor,
  getTop100Reward,
  type LeaderboardData,
  type LeaderboardUser
} from '../utils/localStorage';

// Trophy Icon - Bigger and bolder
const TrophyIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" d="M5.166 2.621v.858c-1.035.148-2.059.33-3.071.543a.75.75 0 00-.584.859 6.753 6.753 0 006.138 5.6 6.73 6.73 0 002.743 1.346A6.707 6.707 0 019.279 15H8.54c-1.036 0-1.875.84-1.875 1.875V19.5h-.75a.75.75 0 000 1.5h12.17a.75.75 0 000-1.5h-.75v-2.625c0-1.036-.84-1.875-1.875-1.875h-.739a6.707 6.707 0 01-1.112-3.173 6.73 6.73 0 002.743-1.347 6.753 6.753 0 006.139-5.6.75.75 0 00-.585-.858 47.077 47.077 0 00-3.07-.543V2.62a.75.75 0 00-.658-.744 49.22 49.22 0 00-6.093-.377c-2.063 0-4.096.128-6.093.377a.75.75 0 00-.657.744zm0 2.629c0 1.196.312 2.32.857 3.294A5.266 5.266 0 013.16 5.337a45.6 45.6 0 012.006-.343v.256zm13.5 0v-.256c.674.1 1.343.214 2.006.343a5.265 5.265 0 01-2.863 3.207 6.72 6.72 0 00.857-3.294z" clipRule="evenodd" />
  </svg>
);

// Clock Icon
const ClockIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// Calendar Icon (for Monthly)
const CalendarIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
  </svg>
);

// Star Icon (for All-Time)
const StarIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
  </svg>
);

// Enhanced Medal styles - using brand colors
const getMedalStyle = (rank: number) => {
  switch (rank) {
    case 1:
      // Gold - brand secondary
      return 'bg-brand-secondary text-brand-text-dark border-2 border-brand-secondary shadow-md';
    case 2:
      // Silver
      return 'bg-gray-300 text-gray-700 border-2 border-gray-200 shadow-md';
    case 3:
      // Bronze
      return 'bg-brand-primary text-white border-2 border-brand-primary-light shadow-md';
    default:
      return 'bg-brand-bg dark:bg-dark-bg text-brand-text-light dark:text-dark-text-light font-bold border border-brand-border dark:border-dark-border';
  }
};

// Rank Badge styles - brand colors
const getRankBadgeStyle = (rankLevel: string) => {
  switch (rankLevel) {
    case 'เทพหมี':
      return 'bg-brand-secondary/20 text-brand-text-dark border border-brand-secondary/30 dark:bg-dark-primary/20 dark:text-dark-text-dark dark:border-dark-primary/30';
    case 'พ่อหมี':
      return 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20 dark:bg-dark-secondary/20 dark:text-dark-text-light dark:border-dark-secondary/30';
    case 'พี่หมี':
      return 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20 dark:bg-dark-secondary/20 dark:text-dark-text-light dark:border-dark-secondary/30';
    case 'น้องหมี':
      return 'bg-brand-success/10 text-brand-success border border-brand-success/20 dark:bg-brand-success/10 dark:text-brand-success dark:border-brand-success/20';
    default:
      return 'bg-brand-bg text-brand-text-light border border-brand-border dark:bg-dark-bg dark:text-dark-text-light dark:border-dark-border';
  }
};


export default function DashboardLeaderboard() {
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [activeTab, setActiveTab] = useState<'monthly' | 'allTime'>('monthly');
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

  if (!mounted || !data) {
    return (
      <div className="bg-brand-surface dark:bg-dark-surface rounded-xl border border-brand-border dark:border-dark-border p-6 animate-pulse">
        <div className="h-64"></div>
      </div>
    );
  }

  const { monthlyLeaderboard, allTimeLeaderboard, currentUser } = data;
  const displayLeaderboard = activeTab === 'monthly' ? monthlyLeaderboard : allTimeLeaderboard;
  const top100 = displayLeaderboard.slice(0, 100);

  // Calculate user's gap to Top 100
  const userRank = activeTab === 'monthly' ? currentUser.monthlyRank : currentUser.allTimeRank;
  const userSpending = activeTab === 'monthly' ? currentUser.monthlySpending : currentUser.allTimeSpending;
  const top100Threshold = displayLeaderboard[99]?.monthlySpending || displayLeaderboard[99]?.allTimeSpending || 0;
  const gapToTop100 = userRank && userRank > 100 ? Math.max(0, top100Threshold - userSpending) : 0;
  
  // Check if user is in Top 100 (eligible for rewards)
  const isInTop100 = userRank && userRank <= 100;
  const userReward = userRank ? getTop100Reward(userRank) : 0;

  const renderUserRow = (user: LeaderboardUser, index: number, isCurrentUser = false, showReward = true) => {
    const rank = activeTab === 'monthly' ? user.monthlyRank! : user.allTimeRank!;
    const spending = activeTab === 'monthly' ? user.monthlySpending : user.allTimeSpending;
    const reward = activeTab === 'monthly' && showReward ? getTop100Reward(rank) : 0; // Only show rewards for monthly

    return (
      <div 
        key={user.id}
        className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
          isCurrentUser 
            ? 'bg-brand-secondary/10 dark:bg-dark-primary/10 border border-brand-secondary/30 dark:border-dark-primary/30' 
            : 'hover:bg-brand-bg dark:hover:bg-dark-bg border border-transparent'
        }`}
      >
        {/* Rank Badge - Fixed width container */}
        <div className="w-8 flex justify-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
            isCurrentUser && rank > 3 
              ? 'bg-brand-secondary text-yellow-950 shadow-md ring-2 ring-brand-secondary/20' // Highlight user's rank with darker text
              : getMedalStyle(rank)
          }`}>
            {rank <= 3 ? (
              // Using emojis but container is styled nicely
              <span className="drop-shadow-sm">{rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉'}</span>
            ) : (
              <span>{rank}</span>
            )}
          </div>
        </div>

        {/* Avatar */}
        <div className="relative">
          <img 
            src={user.avatar || `https://placehold.co/40x40/FCD77F/473B30?text=${user.username.charAt(0).toUpperCase()}`}
            alt={user.username}
            className={`w-10 h-10 rounded-full object-cover ${
              rank === 1 ? 'border-2 border-brand-secondary' : 
              rank === 2 ? 'border-2 border-gray-300' :
              rank === 3 ? 'border-2 border-brand-primary' :
              'border border-brand-border dark:border-dark-border'
            }`}
          />
          {isCurrentUser && (
            <div className="absolute -top-1 -right-1 bg-brand-secondary text-brand-text-dark text-[8px] font-bold px-1.5 py-0.5 rounded-full border border-white dark:border-dark-surface">
              คุณ
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-0.5">
            <p className={`font-bold text-sm truncate ${isCurrentUser ? 'text-brand-text-dark dark:text-dark-text-dark' : 'text-brand-text-dark dark:text-dark-text-light'}`}>
              {isCurrentUser ? currentUser.username : user.username}
            </p>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${getRankBadgeStyle(user.rankLevel)}`}>
              {getRankEmoji(user.rankLevel)} {user.rankLevel}
            </span>
          </div>
          <p className="text-xs font-medium text-brand-text-light dark:text-dark-text-light">
            {activeTab === 'monthly' ? 'ยอดเดือนนี้' : 'ยอดสะสม'}: <span className="text-brand-text-dark dark:text-dark-text-dark font-bold">{formatCurrency(spending)}</span>
          </p>
        </div>

        {/* Reward - Only show for MONTHLY tab */}
        {reward > 0 && (
          <div className="text-right flex flex-col items-end">
            <div className="bg-brand-success/10 px-2.5 py-1 rounded-lg border border-brand-success/20">
              <span className="text-sm font-bold text-brand-success flex items-center gap-1">
                +{reward} <span className="text-[10px] font-medium opacity-80">เครดิต</span>
              </span>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-brand-surface dark:bg-dark-surface rounded-xl border border-brand-border dark:border-dark-border overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Header */}
      <div className="px-4 py-4 border-b border-brand-border dark:border-dark-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-secondary rounded-xl">
                <TrophyIcon className="w-5 h-5 text-brand-text-dark" />
            </div>
            <div>
                <h2 className="text-base font-bold text-brand-text-dark dark:text-dark-text-dark leading-tight">
                Leaderboard
                </h2>
                <p className="text-xs text-brand-text-light dark:text-dark-text-light">
                    จัดอันดับนักช้อปสูงสุด
                </p>
            </div>
          </div>
          
          {/* Countdown */}
          <div className="flex items-center gap-1.5 bg-brand-bg dark:bg-dark-bg rounded-full px-3 py-1.5 border border-brand-border dark:border-dark-border">
            <ClockIcon className="w-3.5 h-3.5 text-brand-primary dark:text-dark-primary" />
            <span className="text-xs font-bold text-brand-text-dark dark:text-dark-text-light tabular-nums">
              {countdown.days}d {countdown.hours}h {countdown.minutes}m
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-brand-bg dark:bg-dark-bg p-1 rounded-xl border border-brand-border dark:border-dark-border">
          <button
            onClick={() => setActiveTab('monthly')}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-bold transition-all flex flex-col items-center gap-0.5 ${
              activeTab === 'monthly'
                ? 'bg-white dark:bg-dark-surface text-brand-text-dark dark:text-dark-text-dark shadow-sm'
                : 'text-brand-text-light dark:text-dark-text-light hover:text-brand-text-dark dark:hover:text-dark-text-dark'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <CalendarIcon className={`w-4 h-4 ${activeTab === 'monthly' ? 'text-brand-primary dark:text-dark-primary' : ''}`} />
              เดือนนี้
            </span>
            <span className="text-[10px] font-medium text-brand-success">มีรางวัล</span>
          </button>
          <button
            onClick={() => setActiveTab('allTime')}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-bold transition-all flex flex-col items-center gap-0.5 ${
              activeTab === 'allTime'
                ? 'bg-white dark:bg-dark-surface text-brand-text-dark dark:text-dark-text-dark shadow-sm'
                : 'text-brand-text-light dark:text-dark-text-light hover:text-brand-text-dark dark:hover:text-dark-text-dark'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <StarIcon className={`w-4 h-4 ${activeTab === 'allTime' ? 'text-brand-primary dark:text-dark-primary' : ''}`} />
              ตลอดกาล
            </span>
            <span className="text-[10px] font-medium text-brand-text-light dark:text-dark-text-light">ยอดสะสม</span>
          </button>
        </div>
      </div>

      {/* Monthly: Top 100 Rewards Banner */}
      {activeTab === 'monthly' && (
        <div className="bg-brand-secondary/10 dark:bg-dark-primary/10 px-4 py-2.5 border-b border-brand-border dark:border-dark-border flex items-center justify-center gap-2">
            <span className="text-base">🎁</span>
            <p className="text-xs text-center text-brand-text-dark dark:text-dark-text-light font-medium">
                <span className="font-bold">Top 100</span> รับเครดิตทุกสิ้นเดือน!
                <span className="bg-brand-secondary/20 dark:bg-dark-primary/20 text-brand-text-dark dark:text-dark-text-dark px-2 py-0.5 rounded-full text-[10px] font-bold ml-2">
                🥇 อันดับ 1 รับ 1,500 เครดิต
                </span>
            </p>
        </div>
      )}

      {/* All-Time: Info Banner */}
      {activeTab === 'allTime' && (
        <div className="bg-brand-bg dark:bg-dark-bg px-4 py-2.5 border-b border-brand-border dark:border-dark-border flex items-center justify-center gap-2">
            <span className="text-base">🏆</span>
            <p className="text-xs text-center text-brand-text-light dark:text-dark-text-light font-medium">
                Hall of Fame - ยอดใช้จ่ายสะสมตั้งแต่เริ่มใช้งาน
            </p>
        </div>
      )}

      {/* Leaderboard List - Full Height */}
      <div className="p-2 space-y-1 h-[500px] overflow-y-auto custom-scrollbar bg-white/50 dark:bg-dark-bg/20">
        {top100.map((user, index) => renderUserRow(user, index, user.id === 'current-user', activeTab === 'monthly'))}
        
        {/* Current User - Always show at bottom if rank > 20 */}
        {userRank && userRank > 20 && userRank <= 100 && (
          <div className="mt-2 sticky bottom-0 bg-brand-surface dark:bg-dark-surface pt-2 border-t border-brand-border dark:border-dark-border">
            <div className="flex items-center justify-center mb-1">
                <span className="text-xs text-brand-text-light dark:text-dark-text-light font-bold">
                  ตำแหน่งของคุณ #{userRank} 
                  {activeTab === 'monthly' && userReward > 0 && <span className="text-brand-success ml-1">(รับ +{userReward}฿)</span>}
                </span>
            </div>
            {renderUserRow(currentUser, userRank - 1, true, activeTab === 'monthly')}
          </div>
        )}
        
        {/* Current User (if NOT in top 100) */}
        {userRank && userRank > 100 && (
          <div className="mt-2 sticky bottom-0 bg-brand-surface dark:bg-dark-surface pt-2 border-t border-brand-border dark:border-dark-border">
            <div className="flex items-center justify-center mb-1">
                <span className="text-xs text-brand-text-light dark:text-dark-text-light font-bold">
                  ตำแหน่งของคุณ #{userRank}
                  {activeTab === 'monthly' && <span className="text-brand-text-light ml-1">(นอก Top 100)</span>}
                </span>
            </div>
            {renderUserRow(currentUser, userRank - 1, true, false)}
          </div>
        )}
      </div>

      {/* Progress to Top 100 - Show only for MONTHLY and if NOT in top 100 */}
      {activeTab === 'monthly' && userRank && userRank > 100 && (
        <div className="p-3 bg-brand-bg dark:bg-dark-bg border-t border-brand-border dark:border-dark-border">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-brand-text-dark dark:text-dark-text-dark flex items-center gap-1.5">
              🔥 ก้าวสู่ Top 100
            </span>
            <span className="text-xs font-bold text-brand-primary dark:text-dark-primary bg-brand-primary/10 dark:bg-dark-primary/10 px-2 py-0.5 rounded-lg">
              ขาดอีก {formatCurrency(gapToTop100)}
            </span>
          </div>
          <div className="h-2 bg-brand-border dark:bg-dark-border rounded-full overflow-hidden">
            <div 
              className="h-full bg-brand-secondary dark:bg-dark-primary rounded-full transition-all duration-700 ease-out"
              style={{ width: `${Math.min(100, (userSpending / top100Threshold) * 100)}%` }}
            />
          </div>
          <p className="text-xs text-brand-text-light dark:text-dark-text-light mt-1.5 text-center">
            💡 ใช้จ่ายเพิ่มเพื่อติด Top 100 และรับเครดิตฟรี!
          </p>
        </div>
      )}

      {/* Monthly: Info about user's current reward */}
      {activeTab === 'monthly' && isInTop100 && userReward > 0 && (
        <div className="p-3 bg-brand-success/10 border-t border-brand-success/20">
          <div className="flex items-center justify-center gap-2">
            <span className="text-base">🎉</span>
            <p className="text-xs text-center text-brand-text-dark dark:text-dark-text-light font-medium">
                คุณอยู่อันดับ <span className="font-bold">#{userRank}</span> - จะได้รับ{' '}
                <span className="font-bold text-brand-success">+{userReward} เครดิต</span> สิ้นเดือนนี้!
            </p>
          </div>
        </div>
      )}

      {/* All-Time: User's position info */}
      {activeTab === 'allTime' && userRank && userRank <= 100 && (
        <div className="p-3 bg-brand-bg dark:bg-dark-bg border-t border-brand-border dark:border-dark-border">
          <div className="flex items-center justify-center gap-2">
            <span className="text-base">⭐</span>
            <p className="text-xs text-center text-brand-text-light dark:text-dark-text-light font-medium">
                คุณอยู่อันดับ <span className="font-bold">#{userRank}</span> ในตาราง Hall of Fame
            </p>
          </div>
        </div>
      )}

      {/* Scrollbar Styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(200, 200, 200, 0.3);
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(200, 200, 200, 0.5);
        }
      `}</style>
    </div>
  );
}
