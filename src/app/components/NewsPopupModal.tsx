'use client';

import { useState, useEffect } from 'react';
import { XIcon } from './icons';

// News data interface
interface NewsItem {
  id: string;
  title: string;
  content: string;
  date: string;
  type: 'promo' | 'update' | 'maintenance' | 'event';
  image?: string;
}

// Example news data - in production, this would come from an API
const currentNews: NewsItem[] = [
  {
    id: 'news-2024-12-29-01',
    title: '🎉 โปรโมชั่นส่งท้ายปี 2024',
    content: 'เติมเงินวันนี้รับโบนัสเพิ่ม 15% ทันที! โปรโมชั่นพิเศษต้อนรับปีใหม่ ถึง 31 ธ.ค. 2024 นี้เท่านั้น',
    date: '29 ธ.ค. 2024',
    type: 'promo',
  },
  {
    id: 'news-2024-12-28-01',
    title: '🚀 อัปเดตระบบใหม่',
    content: 'เพิ่มบริการเพิ่มผู้ติดตาม TikTok คุณภาพสูง และปรับปรุงความเร็วในการทำงาน',
    date: '28 ธ.ค. 2024',
    type: 'update',
  },
];

interface NewsPopupModalProps {
  onClose?: () => void;
}

export default function NewsPopupModal({ onClose }: NewsPopupModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Always show news popup on page load if there are news items
    if (currentNews.length > 0) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      // If no news to show, dispatch event to allow daily login to open
      window.dispatchEvent(new CustomEvent('newsPopupClosed'));
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
    // Dispatch event to notify daily login modal it can open
    window.dispatchEvent(new CustomEvent('newsPopupClosed'));
  };

  const handleNext = () => {
    if (currentIndex < currentNews.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (!isOpen || currentNews.length === 0) return null;

  const news = currentNews[currentIndex];
  
  // Get type styling
  const getTypeStyle = (type: NewsItem['type']) => {
    switch (type) {
      case 'promo':
        return {
          bg: 'bg-gradient-to-br from-amber-400 via-orange-400 to-red-400',
          badge: 'bg-red-500 text-white',
          badgeText: 'โปรโมชั่น'
        };
      case 'update':
        return {
          bg: 'bg-gradient-to-br from-blue-400 via-cyan-400 to-teal-400',
          badge: 'bg-blue-500 text-white',
          badgeText: 'อัปเดต'
        };
      case 'maintenance':
        return {
          bg: 'bg-gradient-to-br from-yellow-400 via-amber-400 to-orange-400',
          badge: 'bg-yellow-500 text-gray-800',
          badgeText: 'แจ้งเตือน'
        };
      case 'event':
        return {
          bg: 'bg-gradient-to-br from-purple-400 via-pink-400 to-rose-400',
          badge: 'bg-purple-500 text-white',
          badgeText: 'กิจกรรม'
        };
      default:
        return {
          bg: 'bg-gradient-to-br from-gray-400 to-gray-500',
          badge: 'bg-gray-500 text-white',
          badgeText: 'ข่าวสาร'
        };
    }
  };

  const typeStyle = getTypeStyle(news.type);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white dark:bg-dark-surface rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-all z-10"
        >
          <XIcon className="w-5 h-5" />
        </button>

        {/* Header with gradient */}
        <div className={`${typeStyle.bg} p-8 pb-12 relative overflow-hidden`}>
          {/* Decorative circles */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full" />
          <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-white/10 rounded-full" />
          
          {/* Badge */}
          <div className="flex justify-between items-start mb-4 relative z-10">
            <span className={`${typeStyle.badge} px-3 py-1 rounded-full text-xs font-bold shadow-md`}>
              {typeStyle.badgeText}
            </span>
            <span className="text-white/80 text-xs font-medium bg-white/20 px-2 py-1 rounded-full">
              {news.date}
            </span>
          </div>
          
          {/* Title */}
          <h2 className="text-2xl font-bold text-white leading-tight relative z-10 drop-shadow-md">
            {news.title}
          </h2>
        </div>

        {/* Content */}
        <div className="p-6 -mt-6 relative">
          <div className="bg-white dark:bg-dark-surface rounded-2xl p-5 shadow-lg border border-gray-100 dark:border-gray-800">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {news.content}
            </p>
          </div>
        </div>

        {/* Pagination Dots */}
        {currentNews.length > 1 && (
          <div className="flex justify-center gap-2 pb-4">
            {currentNews.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  index === currentIndex 
                    ? 'bg-brand-primary w-6' 
                    : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="px-6 pb-6 flex gap-3">
          {currentNews.length > 1 && currentIndex > 0 && (
            <button
              onClick={handlePrev}
              className="flex-1 py-3.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold rounded-2xl transition-all hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              ← ก่อนหน้า
            </button>
          )}
          <button
            onClick={handleNext}
            className={`flex-1 py-3.5 bg-brand-primary hover:bg-brand-primary/90 text-white font-bold rounded-2xl transition-all shadow-lg hover:shadow-xl ${
              currentIndex === 0 && currentNews.length > 1 ? '' : ''
            }`}
          >
            {currentIndex < currentNews.length - 1 ? 'ถัดไป →' : '✓ รับทราบ'}
          </button>
        </div>
      </div>
    </div>
  );
}

