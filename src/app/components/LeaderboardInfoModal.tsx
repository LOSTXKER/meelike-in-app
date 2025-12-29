'use client';

import { useState, useEffect } from 'react';

const XIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const TrophyIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" d="M5.166 2.621v.858c-1.035.148-2.059.33-3.071.543a.75.75 0 00-.584.859 6.753 6.753 0 006.138 5.6 6.73 6.73 0 002.743 1.346A6.707 6.707 0 019.279 15H8.54c-1.036 0-1.875.84-1.875 1.875V19.5h-.75a.75.75 0 000 1.5h12.17a.75.75 0 000-1.5h-.75v-2.625c0-1.036-.84-1.875-1.875-1.875h-.739a6.707 6.707 0 01-1.112-3.173 6.73 6.73 0 002.743-1.347 6.753 6.753 0 006.139-5.6.75.75 0 00-.585-.858 47.077 47.077 0 00-3.07-.543V2.62a.75.75 0 00-.658-.744 49.22 49.22 0 00-6.093-.377c-2.063 0-4.096.128-6.093.377a.75.75 0 00-.657.744zm0 2.629c0 1.196.312 2.32.857 3.294A5.266 5.266 0 013.16 5.337a45.6 45.6 0 012.006-.343v.256zm13.5 0v-.256c.674.1 1.343.214 2.006.343a5.265 5.265 0 01-2.863 3.207 6.72 6.72 0 00.857-3.294z" clipRule="evenodd" />
  </svg>
);

export default function LeaderboardInfoModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('openLeaderboardInfo', handleOpen);
    return () => window.removeEventListener('openLeaderboardInfo', handleOpen);
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
      <div className="relative w-full max-w-lg bg-white dark:bg-dark-surface rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Close button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all z-10"
        >
          <XIcon />
        </button>

        {/* Header */}
        <div className="bg-brand-secondary/10 dark:bg-dark-primary/10 px-6 pt-8 pb-6">
          <div className="flex items-center justify-center mb-3">
            <div className="p-3 bg-brand-secondary rounded-2xl">
              <TrophyIcon className="w-8 h-8 text-brand-text-dark" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center text-brand-text-dark dark:text-dark-text-dark">
            🏆 Leaderboard
          </h2>
          <p className="text-center text-sm text-brand-text-light dark:text-dark-text-light mt-2">
            จัดอันดับนักช้อปสูงสุดประจำเดือน
          </p>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-5">
          {/* Monthly Leaderboard */}
          <div className="bg-brand-secondary/5 dark:bg-dark-primary/5 p-4 rounded-xl border border-brand-secondary/20 dark:border-dark-primary/20">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">📅</span>
              <h3 className="text-lg font-bold text-brand-text-dark dark:text-dark-text-dark">เดือนนี้</h3>
            </div>
            <ul className="space-y-2 text-sm text-brand-text-dark dark:text-dark-text-light">
              <li className="flex items-start gap-2">
                <span className="text-brand-secondary dark:text-dark-primary">•</span>
                <span>แข่งขันกันใช้จ่ายในแต่ละเดือน</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-secondary dark:text-dark-primary">•</span>
                <span><strong>Top 100</strong> รับเครดิตฟรีทุกสิ้นเดือน</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-secondary dark:text-dark-primary">•</span>
                <span>อันดับ 1 รับสูงสุด <strong className="text-brand-success">1,500 เครดิต</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-secondary dark:text-dark-primary">•</span>
                <span>รีเซ็ตทุกต้นเดือน</span>
              </li>
            </ul>
          </div>

          {/* All-Time Leaderboard */}
          <div className="bg-brand-bg dark:bg-dark-bg p-4 rounded-xl border border-brand-border dark:border-dark-border">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">⭐</span>
              <h3 className="text-lg font-bold text-brand-text-dark dark:text-dark-text-dark">ตลอดกาล</h3>
            </div>
            <ul className="space-y-2 text-sm text-brand-text-dark dark:text-dark-text-light">
              <li className="flex items-start gap-2">
                <span className="text-brand-primary dark:text-dark-primary">•</span>
                <span>Hall of Fame - ยอดสะสมตั้งแต่เริ่มใช้งาน</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-primary dark:text-dark-primary">•</span>
                <span>ไม่มีรางวัล แต่ได้ความภูมิใจ!</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-primary dark:text-dark-primary">•</span>
                <span>แสดงผู้ใช้ที่ใช้จ่ายมากที่สุด</span>
              </li>
            </ul>
          </div>

          {/* Reward Table */}
          <div className="bg-white dark:bg-dark-surface border border-brand-border dark:border-dark-border rounded-xl overflow-hidden">
            <div className="px-4 py-3 bg-brand-secondary/10 dark:bg-dark-primary/10 border-b border-brand-border dark:border-dark-border">
              <h3 className="text-sm font-bold text-brand-text-dark dark:text-dark-text-dark">🎁 ตารางรางวัล Top 100</h3>
            </div>
            <div className="p-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center py-1.5">
                  <span className="text-brand-text-light dark:text-dark-text-light">🥇 อันดับ 1</span>
                  <span className="font-bold text-brand-success">1,500 เครดิต</span>
                </div>
                <div className="flex justify-between items-center py-1.5">
                  <span className="text-brand-text-light dark:text-dark-text-light">🥈 อันดับ 2</span>
                  <span className="font-bold text-brand-success">1,000 เครดิต</span>
                </div>
                <div className="flex justify-between items-center py-1.5">
                  <span className="text-brand-text-light dark:text-dark-text-light">🥉 อันดับ 3</span>
                  <span className="font-bold text-brand-success">700 เครดิต</span>
                </div>
                <div className="flex justify-between items-center py-1.5">
                  <span className="text-brand-text-light dark:text-dark-text-light">📍 อันดับ 4-10</span>
                  <span className="font-bold text-brand-success">400 เครดิต</span>
                </div>
                <div className="flex justify-between items-center py-1.5">
                  <span className="text-brand-text-light dark:text-dark-text-light">📍 อันดับ 11-50</span>
                  <span className="font-bold text-brand-success">250 เครดิต</span>
                </div>
                <div className="flex justify-between items-center py-1.5">
                  <span className="text-brand-text-light dark:text-dark-text-light">📍 อันดับ 51-100</span>
                  <span className="font-bold text-brand-success">20 เครดิต</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-brand-secondary/5 dark:bg-dark-primary/5 p-4 rounded-xl">
            <p className="text-xs text-brand-text-light dark:text-dark-text-light text-center">
              💡 <strong>เคล็ดลับ:</strong> ใช้จ่ายมากขึ้นเพื่อขึ้นอันดับและรับเครดิตฟรีทุกเดือน!
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

