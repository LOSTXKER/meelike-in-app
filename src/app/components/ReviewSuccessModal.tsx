'use client';

interface ReviewSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  creditEarned: number;
  newBalance: number;
}

export default function ReviewSuccessModal({ 
  isOpen, 
  onClose, 
  creditEarned,
  newBalance 
}: ReviewSuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-dark-card rounded-2xl p-8 max-w-md w-full text-center">
        {/* Success Icon */}
        <div className="text-6xl mb-4">🎉</div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-brand-text-dark dark:text-dark-text-light mb-4">
          ขอบคุณสำหรับรีวิว!
        </h2>

        {/* Credit Earned */}
        <div className="bg-[#FFF0E1] dark:bg-[#FFF0E1]/10 border border-[#FFDBC9] rounded-lg p-4 mb-4">
          <p className="text-sm text-brand-text-light dark:text-dark-text-light mb-2">
            ได้รับ
          </p>
          <p className="text-3xl font-bold text-[#FFB800]">
            +{creditEarned.toFixed(2)} เครดิต
          </p>
        </div>

        {/* New Balance */}
        <p className="text-sm text-brand-text-light dark:text-dark-text-light mb-6">
          ยอดเครดิตปัจจุบัน: <span className="font-semibold text-brand-text-dark dark:text-dark-text-light">฿{newBalance.toFixed(2)}</span>
        </p>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-3 bg-[#EE4D2D] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
        >
          ปิด
        </button>
      </div>
    </div>
  );
}


