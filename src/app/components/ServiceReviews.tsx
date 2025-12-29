'use client';

import { useState, useEffect } from 'react';
import { getDisplayReviews, getServiceReviewStats, type ReviewData } from '../utils/localStorage';

// Star Icon Component
const StarIcon = ({ filled = true, className = "w-4 h-4" }: { filled?: boolean; className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={filled ? 0 : 2} d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
  </svg>
);

// Check Icon for Verified Badge
const CheckIcon = () => (
  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
  </svg>
);

interface ServiceReviewsProps {
  serviceId: string;
  serviceName: string;
  compact?: boolean; // New prop for controlling layout mode
}

export default function ServiceReviews({ serviceId, serviceName, compact = true }: ServiceReviewsProps) {
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [displayCount, setDisplayCount] = useState(compact ? 50 : 5); // Show limited items in full mode initially

  useEffect(() => {
    const loadReviews = () => {
      // Get all reviews for stats
      const displayReviews = getDisplayReviews(serviceId, 50); 
      const reviewStats = getServiceReviewStats(serviceId);
      
      setReviews(displayReviews);
      setStats(reviewStats);
    };

    loadReviews();
  }, [serviceId]);

  if (!stats || reviews.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center text-center bg-brand-bg dark:bg-dark-bg rounded-xl border border-brand-border dark:border-dark-border ${compact ? 'py-8' : 'py-12'}`}>
        <div className={`${compact ? 'w-12 h-12 mb-3' : 'w-16 h-16 mb-4'} bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center`}>
          <StarIcon filled={false} className={`${compact ? 'w-6 h-6' : 'w-8 h-8'} text-gray-400`} />
        </div>
        <h3 className={`${compact ? 'text-md' : 'text-lg'} font-semibold text-brand-text-dark dark:text-dark-text-dark mb-1`}>ยังไม่มีรีวิว</h3>
        <p className="text-brand-text-light dark:text-dark-text-light text-xs">เป็นคนแรกที่จะรีวิวบริการนี้!</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const renderStars = (rating: number, size = "w-4 h-4") => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon 
            key={star} 
            filled={star <= Math.round(rating)}
            className={`${size} ${star <= Math.round(rating) ? 'text-brand-secondary dark:text-dark-primary' : 'text-gray-300 dark:text-gray-700'}`}
          />
        ))}
      </div>
    );
  };

  const displayedReviews = compact ? reviews : reviews.slice(0, displayCount);

  return (
    <div className="flex flex-col gap-4">
      {/* Summary Header */}
      <div className="bg-brand-bg dark:bg-dark-bg p-4 rounded-xl border border-brand-border dark:border-dark-border">
        <div className={`flex items-center gap-4 ${!compact ? 'flex-col sm:flex-row sm:gap-8' : ''}`}>
          {/* Rating Score */}
          <div className={`flex flex-col items-center justify-center text-center ${compact ? 'min-w-[80px]' : 'min-w-[120px]'}`}>
            <div className={`${compact ? 'text-4xl' : 'text-5xl'} font-extrabold text-brand-text-dark dark:text-dark-text-dark mb-1`}>
              {stats.avgOverall}
            </div>
            <div className="mb-1">{renderStars(stats.avgOverall, compact ? "w-3 h-3" : "w-5 h-5")}</div>
            <p className="text-xs text-brand-text-light dark:text-dark-text-light text-nowrap">{stats.count} รีวิว</p>
          </div>

          {/* Vertical Divider (Only in compact or desktop view) */}
          <div className={`hidden sm:block w-px bg-brand-border dark:border-dark-border ${compact ? 'h-16 mx-2' : 'h-24 mx-4'}`}></div>
          <div className={`block sm:hidden w-full h-px bg-brand-border dark:border-dark-border my-2 ${compact ? 'hidden' : ''}`}></div>

          {/* Breakdown Bars */}
          <div className="flex-1 w-full space-y-2">
            {[
              { label: 'คุณภาพ', score: stats.avgQuality },
              { label: 'ความเร็ว', score: stats.avgSpeed },
              { label: 'คุ้มค่า', score: stats.avgValue }
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <span className={`font-medium text-brand-text-dark dark:text-dark-text-dark truncate ${compact ? 'text-xs w-16' : 'text-sm w-24'}`}>{item.label}</span>
                <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-brand-secondary dark:bg-dark-primary rounded-full transition-all duration-500"
                    style={{ width: `${(item.score / 5) * 100}%` }}
                  ></div>
                </div>
                <span className={`font-bold text-brand-text-dark dark:text-dark-text-dark text-right ${compact ? 'text-xs w-6' : 'text-sm w-8'}`}>{item.score}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className={`space-y-3 ${compact ? 'max-h-[400px] overflow-y-auto pr-1 custom-scrollbar' : ''}`}>
        {displayedReviews.map((review) => {
          const avgRating = (review.qualityRating + review.speedRating + review.valueRating) / 3;
          const displayName = review.isAnonymous ? 'Anonymous' : `User***${review.userId.slice(-3)}`;
          
          return (
            <div 
              key={review.id}
              className="bg-brand-surface dark:bg-dark-surface p-4 rounded-xl border border-brand-border dark:border-dark-border hover:shadow-sm transition-shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2.5">
                  <div className={`rounded-full bg-brand-secondary/20 dark:bg-dark-primary/20 flex items-center justify-center text-brand-secondary-dark dark:text-dark-primary font-bold ${compact ? 'w-8 h-8 text-xs' : 'w-10 h-10 text-sm'}`}>
                    {displayName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className={`font-semibold text-brand-text-dark dark:text-dark-text-dark ${compact ? 'text-sm' : 'text-base'}`}>{displayName}</p>
                      {review.creditGiven > 0 && (
                        <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800">
                          <CheckIcon /> Verified
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      {renderStars(avgRating, compact ? "w-2.5 h-2.5" : "w-3 h-3")}
                      <span className="text-[10px] text-brand-text-light dark:text-dark-text-light text-nowrap">{formatDate(review.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <p className={`text-brand-text-dark dark:text-dark-text-light leading-relaxed ${compact ? 'text-sm pl-[42px]' : 'text-base pl-[50px]'}`}>
                {review.reviewText}
              </p>
            </div>
          );
        })}
      </div>

      {/* Show More Button (Only for non-compact mode) */}
      {!compact && reviews.length > displayCount && (
        <div className="text-center pt-2">
          <button
            onClick={() => setDisplayCount(prev => prev + 5)}
            className="px-6 py-2.5 bg-brand-bg dark:bg-dark-bg border border-brand-border dark:border-dark-border rounded-lg text-sm font-medium text-brand-text-dark dark:text-dark-text-light hover:bg-brand-border dark:hover:bg-dark-border transition-colors"
          >
            ดูรีวิวเพิ่มเติม ({reviews.length - displayCount})
          </button>
        </div>
      )}
      
      {/* Scrollbar Styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.5);
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(156, 163, 175, 0.8);
        }
      `}</style>
    </div>
  );
}

