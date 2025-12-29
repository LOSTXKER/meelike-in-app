'use client';

import { useState } from 'react';
import StarRating from './StarRating';
import ReviewConditionsModal from './ReviewConditionsModal';

// Star Icon Component
const StarIcon = ({ filled = true, className = "w-6 h-6" }: { filled?: boolean; className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={filled ? 0 : 2} d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
  </svg>
);

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: {
    id: string;
    serviceName: string;
    quantity: number;
  };
  onSubmit: (review: {
    qualityRating: number;
    speedRating: number;
    valueRating: number;
    reviewText: string;
    isAnonymous: boolean;
  }) => void;
}

export default function ReviewModal({ isOpen, onClose, order, onSubmit }: ReviewModalProps) {
  const [qualityRating, setQualityRating] = useState(0);
  const [speedRating, setSpeedRating] = useState(0);
  const [valueRating, setValueRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [showConditions, setShowConditions] = useState(false);

  if (!isOpen) return null;

  const isValid = qualityRating > 0 && speedRating > 0 && valueRating > 0 && reviewText.length >= 20;
  const charCount = reviewText.length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      onSubmit({
        qualityRating,
        speedRating,
        valueRating,
        reviewText: reviewText.trim(),
        isAnonymous
      });
    }
  };

  const renderStarInput = (rating: number, setRating: (r: number) => void, labelLeft: string, labelRight: string) => (
    <div className="flex flex-col items-center gap-2">
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className={`transition-transform hover:scale-110 focus:outline-none ${
              star <= rating ? 'text-brand-secondary dark:text-dark-primary' : 'text-gray-300 dark:text-gray-600'
            }`}
          >
            <StarIcon filled={star <= rating} className="w-8 h-8" />
          </button>
        ))}
      </div>
      <div className="flex justify-between w-full max-w-[200px] text-xs text-brand-text-light dark:text-dark-text-light px-1">
        <span>{labelLeft}</span>
        <span>{labelRight}</span>
      </div>
    </div>
  );

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
        <div className="bg-white dark:bg-dark-card rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
          {/* Header */}
          <div className="sticky top-0 bg-white/95 dark:bg-dark-card/95 backdrop-blur-sm border-b border-brand-border dark:border-dark-border p-4 flex items-center justify-between z-10">
            <h2 className="text-lg font-bold text-brand-text-dark dark:text-dark-text-light">
              ให้คะแนนบริการ
            </h2>
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
            {/* Banner */}
            <button
              onClick={() => setShowConditions(true)}
              className="w-full bg-brand-secondary/10 border border-brand-secondary/30 rounded-xl p-3 flex items-center justify-between hover:bg-brand-secondary/20 transition-all group"
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">💰</span>
                <span className="text-sm font-semibold text-brand-text-dark dark:text-dark-text-light">
                  รีวิวครบเงื่อนไขรับ <span className="text-brand-error dark:text-dark-accent">0.25 เครดิต</span>
                </span>
              </div>
              <svg className="w-5 h-5 text-brand-text-light dark:text-dark-text-light group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Order Info */}
            <div className="bg-brand-bg dark:bg-dark-bg rounded-xl p-4 border border-brand-border dark:border-dark-border">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-brand-primary/10 rounded-lg">
                  <svg className="w-6 h-6 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-brand-text-dark dark:text-dark-text-light text-sm">
                    {order.serviceName}
                  </p>
                  <p className="text-xs text-brand-text-light dark:text-dark-text-light mt-1 font-medium">
                    Order #{order.id} • {order.quantity.toLocaleString()} รายการ
                  </p>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-6">
                {/* Quality Rating */}
                <div className="space-y-3 text-center">
                  <div>
                    <label className="text-sm font-bold text-brand-text-dark dark:text-dark-text-light block">
                      คุณภาพบริการเป็นอย่างไร? <span className="text-brand-error">*</span>
                    </label>
                    <span className="text-[10px] text-brand-text-light dark:text-dark-text-light">(ยอดครบ, ไม่ลด)</span>
                  </div>
                  {renderStarInput(qualityRating, setQualityRating, "แย่มาก", "ดีมาก")}
                </div>

                <div className="h-px bg-brand-border dark:border-dark-border w-1/2 mx-auto"></div>

                {/* Speed Rating */}
                <div className="space-y-3 text-center">
                  <label className="text-sm font-bold text-brand-text-dark dark:text-dark-text-light block">
                    ความเร็วในการส่งเป็นอย่างไร? <span className="text-brand-error">*</span>
                  </label>
                  {renderStarInput(speedRating, setSpeedRating, "ช้ามาก", "เร็วมาก")}
                </div>

                <div className="h-px bg-brand-border dark:border-dark-border w-1/2 mx-auto"></div>

                {/* Value Rating */}
                <div className="space-y-3 text-center">
                  <label className="text-sm font-bold text-brand-text-dark dark:text-dark-text-light block">
                    ราคาคุ้มค่าหรือไม่? <span className="text-brand-error">*</span>
                  </label>
                  {renderStarInput(valueRating, setValueRating, "ไม่คุ้ม", "คุ้มมาก")}
                </div>
              </div>

              {/* Review Text */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-brand-text-dark dark:text-dark-text-light block">
                  เขียนรีวิว <span className="text-brand-error">*</span>
                </label>
                <div className="relative">
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="เล่าประสบการณ์การใช้บริการของคุณ..."
                    rows={4}
                    className="w-full p-4 border border-brand-border dark:border-dark-border rounded-xl bg-brand-bg dark:bg-dark-bg text-brand-text-dark dark:text-dark-text-light text-sm focus:ring-2 focus:ring-brand-secondary focus:border-transparent outline-none resize-none transition-all placeholder:text-gray-400"
                  />
                  <div className="absolute bottom-3 right-3 text-[10px]">
                    <span className={charCount >= 20 ? 'text-green-500 font-medium' : 'text-brand-text-light'}>
                      {charCount} / 20
                    </span>
                  </div>
                </div>
              </div>

              {/* Anonymous Option */}
              <label className="flex items-center gap-3 p-3 rounded-lg border border-brand-border dark:border-dark-border cursor-pointer hover:bg-brand-bg dark:hover:bg-dark-bg transition-colors">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-gray-300 shadow-sm checked:border-brand-secondary checked:bg-brand-secondary focus:ring-brand-secondary/20"
                  />
                  <svg className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100" width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="text-sm text-brand-text-dark dark:text-dark-text-light font-medium">
                  แสดงชื่อแบบไม่ระบุตัวตน (Anonymous)
                </span>
              </label>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={!isValid}
                  className={`w-full py-3.5 rounded-xl font-bold text-sm shadow-md transition-all transform active:scale-[0.98] ${
                    isValid
                      ? 'bg-brand-secondary text-brand-text-dark hover:bg-brand-secondary-light hover:shadow-lg'
                      : 'bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed shadow-none'
                  }`}
                >
                  ยืนยันการให้คะแนน
                </button>
                {!isValid && (
                  <p className="text-xs text-center text-brand-error mt-3 font-medium animate-pulse">
                    {qualityRating === 0 || speedRating === 0 || valueRating === 0
                      ? 'กรุณาให้คะแนนครบทุกหมวด'
                      : charCount < 20
                      ? `อีก ${20 - charCount} ตัวอักษรเพื่อรับรางวัล`
                      : ''}
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      <ReviewConditionsModal
        isOpen={showConditions}
        onClose={() => setShowConditions(false)}
      />
    </>
  );
}
