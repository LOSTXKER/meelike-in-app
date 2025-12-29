'use client';

// Star Icon Component
const StarIcon = ({ filled = true, className = "w-5 h-5" }: { filled?: boolean; className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={filled ? 0 : 2} d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
  </svg>
);

interface ReviewButtonProps {
  orderId: string;
  status: string;
  hasReview: boolean;
  completedDate?: string;
  orderAmount?: number; // เพิ่ม: มูลค่า order
  onClick: () => void;
}

export default function ReviewButton({ 
  orderId, 
  status, 
  hasReview,
  completedDate,
  orderAmount = 0, // Default to 0
  onClick 
}: ReviewButtonProps) {
  // Don't show button for cancelled/failed orders
  if (['Canceled', 'Fail', 'Error'].includes(status)) {
    return null;
  }

  // Show review already submitted
  if (hasReview) {
    return (
      <button
        onClick={onClick}
        className="group inline-flex items-center justify-center gap-0.5 px-2 py-1 rounded-lg hover:bg-brand-bg dark:hover:bg-dark-surface transition-colors"
        title="ดูรีวิวของคุณ"
      >
        {[1, 2, 3, 4, 5].map((i) => (
          <StarIcon 
            key={i} 
            filled 
            className="w-4 h-4 text-brand-secondary dark:text-dark-primary drop-shadow-sm group-hover:scale-110 transition-transform" 
          />
        ))}
      </button>
    );
  }

  // Check if order amount is less than 10 baht
  const isBelowMinimum = orderAmount < 10;

  // Check if review window expired (7 days)
  if (completedDate && status === 'Completed') {
    const completedTime = new Date(completedDate).getTime();
    const now = new Date().getTime();
    const daysPassed = (now - completedTime) / (1000 * 60 * 60 * 24);
    
    if (daysPassed > 7) {
      return (
        <div className="px-4 py-2 text-sm text-gray-400 dark:text-gray-600 cursor-not-allowed">
          หมดเวลารีวิว
        </div>
      );
    }
  }

  // Enabled button for completed orders with minimum amount
  const isEnabled = (status === 'Completed' || status === 'Partially Completed') && !isBelowMinimum;
  
  // Determine tooltip message
  let tooltipMessage = '';
  if (!isEnabled) {
    if (isBelowMinimum) {
      tooltipMessage = 'Order ต้องมีมูลค่า 10 บาทขึ้นไป';
    } else {
      tooltipMessage = 'รอให้ order เสร็จก่อนถึงจะรีวิวได้';
    }
  }

  return (
    <button
      onClick={isEnabled ? onClick : undefined}
      disabled={!isEnabled}
      className={`
        inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap
        ${isEnabled 
          ? 'bg-brand-secondary hover:bg-brand-secondary-light text-brand-text-dark shadow-sm hover:shadow-md dark:bg-dark-primary dark:hover:bg-dark-primary/80' 
          : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
        }
      `}
      title={tooltipMessage || undefined}
    >
      <StarIcon filled className="w-3.5 h-3.5" />
      <span>รีวิว รับ 0.25</span>
    </button>
  );
}

