'use client';

import { useState, useEffect } from 'react';

const XIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const GiftIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M9.375 3a1.875 1.875 0 000 3.75h1.875v4.5H3.375A1.875 1.875 0 011.5 9.375v-.75c0-1.036.84-1.875 1.875-1.875h3.193A3.375 3.375 0 0112 2.753a3.375 3.375 0 015.432 3.997h3.193c1.035 0 1.875.84 1.875 1.875v.75c0 1.036-.84 1.875-1.875 1.875H12.75v-4.5h1.875a1.875 1.875 0 10-1.875-1.875V6.75h-1.5V4.875C11.25 3.839 10.41 3 9.375 3zM11.25 12.75H3v6.75a2.25 2.25 0 002.25 2.25h6v-9zM12.75 12.75v9h6a2.25 2.25 0 002.25-2.25v-6.75h-8.25z" />
  </svg>
);

const FireIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" d="M12.963 2.286a.75.75 0 00-1.071-.136 9.742 9.742 0 00-3.539 6.177A7.547 7.547 0 016.648 6.61a.75.75 0 00-1.152-.082A9 9 0 1015.68 4.534a7.46 7.46 0 01-2.717-2.248zM15.75 14.25a3.75 3.75 0 11-7.313-1.172c.628.465 1.35.81 2.133 1a5.99 5.99 0 011.925-3.545 3.75 3.75 0 013.255 3.717z" clipRule="evenodd" />
  </svg>
);

const CoinIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 20 20" fill="currentColor">
    <circle cx="10" cy="10" r="9" />
  </svg>
);

export default function DailyLoginInfoModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('openDailyLoginInfo', handleOpen);
    return () => window.removeEventListener('openDailyLoginInfo', handleOpen);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40"
        onClick={() => setIsOpen(false)}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white dark:bg-dark-surface rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all z-10"
        >
          <XIcon />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 px-6 pt-8 pb-6">
          <div className="flex items-center justify-center mb-3">
            <div className="p-3 bg-violet-500 rounded-2xl">
              <GiftIcon className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center text-brand-text-dark dark:text-dark-text-dark">
            🎁 Daily Login
          </h2>
          <p className="text-center text-sm text-brand-text-light dark:text-dark-text-light mt-2">
            เข้าสู่ระบบทุกวัน รับเครดิตฟรี!
          </p>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-5">
          {/* How it works */}
          <div className="bg-brand-secondary/10 dark:bg-dark-primary/10 p-4 rounded-xl border border-brand-secondary/20 dark:border-dark-primary/20">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">📋</span>
              <h3 className="text-lg font-bold text-brand-text-dark dark:text-dark-text-dark">วิธีการทำงาน</h3>
            </div>
            <ul className="space-y-2 text-sm text-brand-text-dark dark:text-dark-text-light">
              <li className="flex items-start gap-2">
                <span className="text-brand-secondary dark:text-dark-primary">•</span>
                <span>เข้าสู่ระบบทุกวันเพื่อรับ <strong className="text-brand-success">0.5 เครดิต</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-secondary dark:text-dark-primary">•</span>
                <span>กดปุ่ม "รับรางวัล" เพื่อ claim เครดิต</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-secondary dark:text-dark-primary">•</span>
                <span>รางวัลจะรีเซ็ตทุกวันเที่ยงคืน</span>
              </li>
            </ul>
          </div>

          {/* Streak System */}
          <div className="bg-orange-50 dark:bg-orange-900/10 p-4 rounded-xl border border-orange-200 dark:border-orange-800/30">
            <div className="flex items-center gap-2 mb-3">
              <FireIcon className="w-6 h-6 text-orange-500" />
              <h3 className="text-lg font-bold text-brand-text-dark dark:text-dark-text-dark">ระบบ Streak</h3>
            </div>
            <ul className="space-y-2 text-sm text-brand-text-dark dark:text-dark-text-light">
              <li className="flex items-start gap-2">
                <span className="text-orange-500">•</span>
                <span>Login <strong>ติดต่อกันทุกวัน</strong> เพื่อสะสม Streak</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500">•</span>
                <span>ถ้าขาด Login 1 วัน Streak จะ <strong className="text-brand-error">รีเซ็ตเป็น 0</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500">•</span>
                <span>ยิ่ง Streak สูง ยิ่งได้ Bonus มาก!</span>
              </li>
            </ul>
          </div>

          {/* Weekly Bonus */}
          <div className="bg-purple-50 dark:bg-purple-900/10 p-4 rounded-xl border border-purple-200 dark:border-purple-800/30">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🎁</span>
              <h3 className="text-lg font-bold text-brand-text-dark dark:text-dark-text-dark">Weekly Bonus</h3>
            </div>
            <p className="text-sm text-brand-text-dark dark:text-dark-text-light mb-3">
              Login ครบ 7 วันติดต่อกัน รับ Bonus พิเศษ!
            </p>
            <div className="bg-white dark:bg-dark-surface p-3 rounded-lg border border-purple-200 dark:border-purple-700/30">
              <div className="flex items-center justify-between">
                <span className="text-sm text-brand-text-light dark:text-dark-text-light">วันที่ 7</span>
                <span className="font-bold text-purple-600 dark:text-purple-400">+3 เครดิต Bonus</span>
              </div>
            </div>
          </div>

          {/* Streak Milestone Bonuses */}
          <div className="bg-white dark:bg-dark-surface border border-brand-border dark:border-dark-border rounded-xl overflow-hidden">
            <div className="px-4 py-3 bg-brand-secondary/10 dark:bg-dark-primary/10 border-b border-brand-border dark:border-dark-border">
              <h3 className="text-sm font-bold text-brand-text-dark dark:text-dark-text-dark">🏆 Streak Milestone Bonuses</h3>
            </div>
            <div className="p-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center py-1.5 border-b border-brand-border/50 dark:border-dark-border/50">
                  <span className="text-brand-text-light dark:text-dark-text-light">🔥 7 วันติดต่อกัน</span>
                  <span className="font-bold text-brand-success">+3 เครดิต</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-brand-border/50 dark:border-dark-border/50">
                  <span className="text-brand-text-light dark:text-dark-text-light">🔥 14 วันติดต่อกัน</span>
                  <span className="font-bold text-brand-success">+5 เครดิต</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-brand-border/50 dark:border-dark-border/50">
                  <span className="text-brand-text-light dark:text-dark-text-light">🔥 30 วันติดต่อกัน</span>
                  <span className="font-bold text-brand-success">+10 เครดิต</span>
                </div>
                <div className="flex justify-between items-center py-1.5">
                  <span className="text-brand-text-light dark:text-dark-text-light">🔥 60 วันติดต่อกัน</span>
                  <span className="font-bold text-brand-success">+20 เครดิต</span>
                </div>
              </div>
            </div>
          </div>

          {/* Calculation Example */}
          <div className="bg-emerald-50 dark:bg-emerald-900/10 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800/30">
            <div className="flex items-center gap-2 mb-3">
              <CoinIcon className="w-5 h-5 text-emerald-500" />
              <h3 className="text-base font-bold text-brand-text-dark dark:text-dark-text-dark">ตัวอย่างการคำนวณ</h3>
            </div>
            <div className="bg-white dark:bg-dark-surface p-3 rounded-lg text-sm">
              <p className="text-brand-text-light dark:text-dark-text-light mb-2">
                ถ้า Login ครบ 7 วันติดต่อกัน:
              </p>
              <div className="space-y-1 text-brand-text-dark dark:text-dark-text-light">
                <div className="flex justify-between">
                  <span>รายวัน (0.5 × 7)</span>
                  <span>= 3.5 เครดิต</span>
                </div>
                <div className="flex justify-between">
                  <span>Weekly Bonus</span>
                  <span>= 3 เครดิต</span>
                </div>
                <div className="flex justify-between font-bold text-brand-success border-t border-brand-border dark:border-dark-border pt-1 mt-1">
                  <span>รวม</span>
                  <span>= 6.5 เครดิต/สัปดาห์</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-brand-secondary/5 dark:bg-dark-primary/5 p-4 rounded-xl">
            <p className="text-xs text-brand-text-light dark:text-dark-text-light text-center">
              💡 <strong>เคล็ดลับ:</strong> อย่าลืม Login ทุกวันเพื่อไม่ให้ Streak รีเซ็ต!
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <button
            onClick={() => setIsOpen(false)}
            className="w-full py-3 bg-brand-secondary hover:bg-brand-secondary/90 text-brand-text-dark font-bold rounded-xl transition-all"
          >
            เข้าใจแล้ว
          </button>
        </div>
      </div>
    </div>
  );
}

