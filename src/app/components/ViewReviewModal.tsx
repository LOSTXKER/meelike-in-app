'use client';

import { type ReviewData } from '../utils/localStorage';

// Star Icon Component
const StarIcon = ({ filled = true, className = "w-5 h-5" }: { filled?: boolean; className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={filled ? 0 : 2} d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
  </svg>
);

// Fire Icon
const FireIcon = () => (
  <svg className="w-5 h-5 text-brand-error dark:text-dark-accent" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 23C7.589 23 4 19.411 4 15c0-3.162 1.847-6.054 4.5-8.5.5 3 2 5.5 5.5 6.5-1-4 1-7 3-9-.5 2.5 1 4 2.5 5.5 1.5 1.5 2.5 3.5 2.5 6.5 0 4.411-3.589 8-8 8zm0-2c3.309 0 6-2.691 6-6 0-2-1-3.5-2-4.5-.5 1.5-2 2.5-4 2.5 2-2 2-5 0-7-1.5 3.5-4 5-5 8-.5 1.5-1 3 0 4.5 1 1.5 2.5 2.5 5 2.5z"/>
  </svg>
);

interface ViewReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  review: ReviewData | null;
}

export default function ViewReviewModal({ isOpen, onClose, review }: ViewReviewModalProps) {
  if (!isOpen || !review) return null;

  const avgRating = ((review.qualityRating + review.speedRating + review.valueRating) / 3).toFixed(1);

  const renderStars = (rating: number, size = "w-5 h-5") => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon 
            key={star} 
            filled={star <= rating}
            className={`${size} ${star <= rating ? 'text-brand-secondary dark:text-dark-primary' : 'text-gray-300 dark:text-gray-600'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-dark-card rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 dark:bg-dark-card/95 backdrop-blur-sm border-b border-brand-border dark:border-dark-border p-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-lg font-bold text-brand-text-dark dark:text-dark-text-light">
              รีวิวของคุณ
            </h2>
            <p className="text-xs text-brand-text-light dark:text-dark-text-light truncate max-w-[250px]">
              {review.serviceName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-brand-text-light hover:text-brand-text-dark dark:hover:text-dark-text-light transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Overall Rating */}
          <div className="flex flex-col items-center justify-center py-4 bg-brand-bg/50 dark:bg-dark-bg/50 rounded-xl border border-brand-border dark:border-dark-border">
            <div className="text-6xl font-extrabold text-brand-text-dark dark:text-dark-text-light mb-2">
              {avgRating}
            </div>
            <div className="mb-2">
              {renderStars(Math.round(parseFloat(avgRating)), "w-6 h-6")}
            </div>
            <p className="text-xs font-medium text-brand-text-light dark:text-dark-text-light uppercase tracking-wider">
              คะแนนรวม
            </p>
          </div>

          {/* Individual Ratings */}
          <div className="space-y-3">
            {[
              { label: 'คุณภาพบริการ', score: review.qualityRating },
              { label: 'ความเร็ว', score: review.speedRating },
              { label: 'ความคุ้มค่า', score: review.valueRating },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between p-3 bg-brand-surface dark:bg-dark-surface rounded-lg hover:bg-brand-bg dark:hover:bg-dark-bg transition-colors">
                <span className="text-sm font-medium text-brand-text-dark dark:text-dark-text-light">
                  {item.label}
                </span>
                <div className="flex items-center gap-3">
                  {renderStars(item.score, "w-4 h-4")}
                  <span className="text-sm font-bold text-brand-text-dark dark:text-dark-text-light w-4 text-right">
                    {item.score}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Review Text */}
          <div>
            <h3 className="text-sm font-bold text-brand-text-dark dark:text-dark-text-light mb-2">
              ความคิดเห็น
            </h3>
            <div className="bg-brand-bg dark:bg-dark-bg p-4 rounded-xl border border-brand-border dark:border-dark-border">
              <p className="text-brand-text-dark dark:text-dark-text-light text-sm leading-relaxed italic">
                "{review.reviewText}"
              </p>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center gap-1.5 px-2 py-1 bg-brand-bg dark:bg-dark-bg rounded text-[10px] text-brand-text-light dark:text-dark-text-light">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                {review.reviewLength} ตัวอักษร
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1 bg-brand-bg dark:bg-dark-bg rounded text-[10px] text-brand-text-light dark:text-dark-text-light">
                {review.isAnonymous ? (
                  <>
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    ไม่ระบุตัวตน
                  </>
                ) : (
                  <>
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    แสดงชื่อ
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Reward Info */}
          <div className="bg-brand-secondary/10 border border-brand-secondary/30 rounded-xl p-4 flex items-center justify-between">
            <span className="text-sm font-medium text-brand-text-dark dark:text-dark-text-light">
              รางวัลที่ได้รับ
            </span>
            <div className="flex items-center gap-1.5">
              <FireIcon />
              <span className="text-lg font-bold text-brand-error dark:text-dark-accent">
                {review.creditGiven.toFixed(2)} เครดิต
              </span>
            </div>
          </div>

          {/* Date */}
          <div className="text-center">
            <p className="text-xs text-brand-text-light dark:text-dark-text-light">
              รีวิวเมื่อ {new Date(review.createdAt).toLocaleDateString('th-TH', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}