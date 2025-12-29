'use client';

import { useState, useEffect } from 'react';
import { GiftIcon, FireIcon, CheckIcon, CheckCircleIcon, StarIcon, XIcon, CreditCoinIcon } from './icons';
import {
  getDailyLoginData,
  canClaimToday,
  claimDailyReward,
  getNextStreakMilestone,
  isStreakValid,
} from '../utils/storage';
import { DAILY_LOGIN_REWARD } from '../constants';
import type { DailyLoginData, DailyLoginBadge } from '../types';

interface DailyLoginModalProps {
  forceOpen?: boolean;
  onClose?: () => void;
}

export default function DailyLoginModal({ forceOpen = false, onClose }: DailyLoginModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<DailyLoginData | null>(null);
  const [canClaim, setCanClaim] = useState(false);
  const [streakValid, setStreakValid] = useState(true);
  const [claimResult, setClaimResult] = useState<{
    success: boolean;
    reward: number;
    bonus: number;
    newStreak: number;
    newBadge?: DailyLoginBadge;
    streakReset: boolean;
  } | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Load data and check if modal should open
  useEffect(() => {
    const loginData = getDailyLoginData();
    setData(loginData);
    
    const canClaimNow = canClaimToday();
    setCanClaim(canClaimNow);
    setStreakValid(isStreakValid());

    // Don't auto-open here - wait for news popup to close first
  }, [forceOpen]);

  // Listen for news popup closed event to auto-open
  useEffect(() => {
    const handleNewsPopupClosed = () => {
      // Check if can claim and auto-open after news popup closes
      if (canClaimToday() && !forceOpen) {
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 300);
        return () => clearTimeout(timer);
      }
    };

    window.addEventListener('newsPopupClosed', handleNewsPopupClosed);
    return () => window.removeEventListener('newsPopupClosed', handleNewsPopupClosed);
  }, [forceOpen]);

  // Handle force open
  useEffect(() => {
    if (forceOpen) {
      setIsOpen(true);
    }
  }, [forceOpen]);

  // Listen for custom event to open modal
  useEffect(() => {
    const handleOpenModal = () => {
      setIsOpen(true);
      setData(getDailyLoginData());
      setCanClaim(canClaimToday());
      setStreakValid(isStreakValid());
    };

    window.addEventListener('openDailyLoginModal', handleOpenModal);
    return () => window.removeEventListener('openDailyLoginModal', handleOpenModal);
  }, []);

  const handleClaim = () => {
    const result = claimDailyReward();
    setClaimResult(result);
    
    if (result.success) {
      setShowSuccess(true);
      setCanClaim(false);
      setData(getDailyLoginData());
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setShowSuccess(false);
    setClaimResult(null);
    onClose?.();
  };

  // Calculate display streak
  const displayStreak = canClaim 
    ? (streakValid ? (data?.currentStreak || 0) + 1 : 1)
    : (data?.currentStreak || 0);

  // Get next milestone
  const nextMilestone = getNextStreakMilestone(displayStreak - 1);
  const daysToMilestone = nextMilestone ? nextMilestone.streak - displayStreak + 1 : 0;

  // Generate streak dots (show 7 days)
  const streakDots = Array.from({ length: 7 }, (_, i) => {
    const day = i + 1;
    const streakDay = displayStreak % 7 || 7;
    const isClaimed = day < streakDay || (day === streakDay && !canClaim);
    const isToday = day === streakDay && canClaim;
    const isBonus = day === 7;
    return { day, isClaimed, isToday, isBonus };
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-sm bg-white dark:bg-dark-surface rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all z-10"
        >
          <XIcon className="w-5 h-5" />
        </button>

        {/* Success View */}
        {showSuccess && claimResult ? (
          <div className="text-center">
            {/* Header */}
            <div className="pt-8 pb-4 px-6">
              <div className="mx-auto w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-4 shadow-inner">
                <CheckCircleIcon className="w-12 h-12 text-emerald-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                🎉 สำเร็จ!
              </h2>
            </div>

            {/* Content */}
            <div className="px-6 pb-6">
              {/* Reward */}
              <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl p-5 mb-5 border border-emerald-100 dark:border-emerald-800/30">
                <p className="text-sm text-emerald-600/80 dark:text-emerald-400/80 mb-1 font-medium">ได้รับ</p>
                <div className="text-4xl font-black text-emerald-600 dark:text-emerald-400">
                  +{claimResult.reward + claimResult.bonus}
                  <span className="text-lg ml-1">เครดิต</span>
                </div>
                {claimResult.bonus > 0 && (
                  <div className="mt-2 text-sm text-emerald-700/70 dark:text-emerald-300/70">
                    รายวัน +{claimResult.reward} + Streak Bonus <span className="font-bold">+{claimResult.bonus}</span>
                  </div>
                )}
              </div>

              {/* Streak */}
              <div className="flex items-center justify-center gap-2 mb-5 bg-orange-50 dark:bg-orange-900/20 py-2.5 px-4 rounded-full">
                <FireIcon className="w-5 h-5 text-orange-500" />
                <span className="font-bold text-orange-600 dark:text-orange-400">
                  Streak: {claimResult.newStreak} วัน
                </span>
              </div>

              {/* New Badge */}
              {claimResult.newBadge && (
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 mb-5 border border-purple-100 dark:border-purple-800/30">
                  <div className="flex items-center justify-center gap-2 text-purple-600 dark:text-purple-400">
                    <StarIcon className="w-5 h-5" />
                    <span className="font-bold">Badge ใหม่: {claimResult.newBadge.name}</span>
                  </div>
                </div>
              )}

              {/* Button */}
              <button
                onClick={handleClose}
                className="w-full py-3.5 bg-brand-secondary hover:bg-brand-secondary/90 text-gray-800 font-bold rounded-2xl transition-all shadow-lg hover:shadow-xl"
              >
                ตกลง
              </button>
            </div>
          </div>
        ) : (
          /* Claim View */
          <div className="text-center">
            {/* Header */}
            <div className="pt-8 pb-4 px-6">
              <div className="mx-auto w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-amber-200 dark:border-amber-800/30">
                <GiftIcon className="w-9 h-9 text-amber-600 dark:text-amber-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center justify-center gap-2">
                🎁 รางวัลประจำวัน
              </h2>
            </div>

            {/* Reward Box */}
            <div className="mx-6 bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-5 mb-5 border border-amber-200 dark:border-amber-800/30">
              <div className="text-4xl font-black text-amber-600 dark:text-amber-400">
                +{DAILY_LOGIN_REWARD}
                <span className="text-lg ml-1">เครดิต</span>
              </div>
            </div>

            {/* Streak Status */}
            <div className="mx-6 flex items-center justify-center gap-2 mb-2 py-2">
              <FireIcon className={`w-5 h-5 ${streakValid && displayStreak > 0 ? 'text-orange-500' : 'text-gray-400'}`} />
              <span className={`font-bold ${streakValid && displayStreak > 0 ? 'text-orange-500' : 'text-gray-500'}`}>
                {canClaim ? (
                  streakValid ? `Streak: ${displayStreak} วัน` : 'เริ่มต้น Streak ใหม่!'
                ) : (
                  `Streak: ${displayStreak} วัน`
                )}
              </span>
            </div>

            {/* Streak Reset Warning */}
            {canClaim && !streakValid && data && data.currentStreak > 0 && (
              <div className="mx-6 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium p-3 rounded-xl mb-4 flex items-center justify-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                ขาดการ Login - Streak จะรีเซ็ต
              </div>
            )}

            {/* Streak Progress */}
            <div className="mx-6 mb-5">
              <div className="relative">
                {/* Line */}
                <div className="absolute top-6 left-5 right-5 h-0.5 bg-gray-200 dark:bg-gray-700 -z-10" />
                <div 
                  className="absolute top-6 left-5 h-0.5 bg-brand-secondary/50 -z-10 transition-all"
                  style={{ width: `calc(${Math.max(0, (displayStreak % 7 || 7) - 1) * (100 / 6)}% - 10px)` }}
                />
                
                {/* Dots */}
                <div className="flex justify-between">
                  {streakDots.map(({ day, isClaimed, isToday, isBonus }) => (
                    <div key={day} className="flex flex-col items-center">
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center text-base font-bold transition-all shadow-sm ${
                          isClaimed
                            ? 'bg-emerald-500 text-white'
                            : isToday
                            ? 'bg-brand-secondary text-gray-800 ring-4 ring-brand-secondary/20 scale-110'
                            : isBonus
                            ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border-2 border-purple-300 dark:border-purple-600'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        {isClaimed ? (
                          <CheckIcon className="w-5 h-5" />
                        ) : isBonus ? (
                          '🎁'
                        ) : (
                          day
                        )}
                      </div>
                      <span className={`text-xs font-semibold mt-2 flex items-center gap-0.5 ${isToday ? 'text-amber-600 dark:text-amber-400 font-bold' : isBonus ? 'text-purple-500' : 'text-amber-600 dark:text-amber-400'}`}>
                        <CreditCoinIcon className={`w-3.5 h-3.5 ${isBonus ? 'text-purple-500' : ''}`} />
                        {isBonus ? '+3' : '0.5'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> รับแล้ว</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-gray-300 dark:bg-gray-600" /> รอรับ</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-400" /> Bonus</span>
              </div>
            </div>

            {/* Next Milestone */}
            {nextMilestone && (
              <p className="mx-6 text-base text-gray-600 dark:text-gray-300 mb-4">
                อีก <span className="font-bold text-gray-800 dark:text-white">{daysToMilestone} วัน</span> รับ Streak Bonus{' '}
                <span className="text-emerald-600 dark:text-emerald-400 font-bold inline-flex items-center gap-0.5">
                  <CreditCoinIcon className="w-4 h-4" />+{nextMilestone.bonus}
                </span>
              </p>
            )}

            {/* Claim Button */}
            <div className="px-6 mb-6">
              {canClaim ? (
                <button
                  onClick={handleClaim}
                  className="w-full py-4 bg-brand-secondary hover:bg-brand-secondary/90 text-gray-800 font-bold text-lg rounded-2xl transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
                >
                  🎁 รับรางวัลวันนี้
                </button>
              ) : (
                <div className="w-full py-4 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-bold text-lg rounded-2xl flex items-center justify-center gap-2">
                  <CheckCircleIcon className="w-5 h-5" />
                  รับรางวัลวันนี้แล้ว
                </div>
              )}
            </div>

            {/* Stats Footer */}
            <div className="border-t border-gray-100 dark:border-gray-800 py-5 px-6 bg-gray-50/50 dark:bg-gray-900/30 grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-xl font-bold text-gray-800 dark:text-white">{data?.totalDaysClaimed || 0}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">วันที่เข้า</p>
              </div>
              <div>
                <p className="text-xl font-bold text-gray-800 dark:text-white">{data?.longestStreak || 0}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Streak สูงสุด</p>
              </div>
              <div>
                <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{data?.totalCreditsEarned?.toFixed(1) || 0}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">เครดิตสะสม</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
