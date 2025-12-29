'use client';

import { useState, useEffect } from 'react';
import { getServiceReviewStats } from '../utils/localStorage';

// Star Icon Component
const StarIcon = ({ filled = true, className = "w-4 h-4" }: { filled?: boolean; className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={filled ? 0 : 2} d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
  </svg>
);

interface ServiceRatingBadgeProps {
  serviceId: string;
}

export default function ServiceRatingBadge({ serviceId }: ServiceRatingBadgeProps) {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    // Load stats from localStorage
    const reviewStats = getServiceReviewStats(serviceId);
    setStats(reviewStats);
  }, [serviceId]);

  if (!stats || stats.count === 0) {
    return (
      <span className="text-xs text-brand-text-light dark:text-dark-text-light opacity-50">
        -
      </span>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-1 bg-brand-secondary/10 dark:bg-dark-primary/10 px-2 py-0.5 rounded-md border border-brand-secondary/20 dark:border-dark-primary/20">
        <StarIcon className="w-3.5 h-3.5 text-brand-secondary dark:text-dark-primary" />
        <span className="text-xs font-bold text-brand-text-dark dark:text-dark-text-dark">
          {stats.avgOverall}
        </span>
      </div>
      <span className="text-[10px] text-brand-text-light dark:text-dark-text-light">
        ({stats.count})
      </span>
    </div>
  );
}



