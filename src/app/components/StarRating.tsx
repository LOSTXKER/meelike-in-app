'use client';

import { useState } from 'react';

// Star Icon SVG Component to ensure consistency
const StarIcon = ({ filled = true, className = "w-6 h-6" }: { filled?: boolean; className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={filled ? 0 : 2} d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
  </svg>
);

interface StarRatingProps {
  value?: number;
  onChange?: (rating: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  labelLeft?: string;
  labelRight?: string;
}

export default function StarRating({ 
  value = 0, 
  onChange, 
  readonly = false,
  size = 'md',
  label,
  labelLeft,
  labelRight
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const handleClick = (rating: number) => {
    if (!readonly && onChange) {
      onChange(rating);
    }
  };

  const handleMouseEnter = (rating: number) => {
    if (!readonly) {
      setHoverRating(rating);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverRating(0);
    }
  };

  const displayRating = hoverRating || value;

  return (
    <div className="flex flex-col gap-2 items-center w-full">
      {label && (
        <label className="text-sm font-medium text-brand-text-dark dark:text-dark-text-light mb-1">
          {label}
        </label>
      )}
      
      <div className="flex items-center justify-between w-full max-w-xs gap-4">
        {labelLeft && (
          <span className="text-xs font-medium text-brand-text-light dark:text-dark-text-light min-w-[50px] text-right">
            {labelLeft}
          </span>
        )}
        
        <div className="flex gap-2 justify-center">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              type="button"
              onClick={() => handleClick(rating)}
              onMouseEnter={() => handleMouseEnter(rating)}
              onMouseLeave={handleMouseLeave}
              disabled={readonly}
              className={`
                transition-all duration-200 transform
                ${!readonly ? 'cursor-pointer hover:scale-110 active:scale-95' : 'cursor-default'}
                ${rating <= displayRating ? 'text-brand-secondary dark:text-dark-primary drop-shadow-sm' : 'text-gray-300 dark:text-gray-600'}
              `}
            >
              <StarIcon 
                filled={rating <= displayRating} 
                className={sizeClasses[size]} 
              />
            </button>
          ))}
        </div>
        
        {labelRight && (
          <span className="text-xs font-medium text-brand-text-light dark:text-dark-text-light min-w-[50px] text-left">
            {labelRight}
          </span>
        )}
      </div>
    </div>
  );
}
