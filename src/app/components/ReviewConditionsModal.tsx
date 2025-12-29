'use client';

// Icons
const FireIcon = () => (
  <svg className="w-5 h-5 text-brand-error dark:text-dark-accent" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 23C7.589 23 4 19.411 4 15c0-3.162 1.847-6.054 4.5-8.5.5 3 2 5.5 5.5 6.5-1-4 1-7 3-9-.5 2.5 1 4 2.5 5.5 1.5 1.5 2.5 3.5 2.5 6.5 0 4.411-3.589 8-8 8zm0-2c3.309 0 6-2.691 6-6 0-2-1-3.5-2-4.5-.5 1.5-2 2.5-4 2.5 2-2 2-5 0-7-1.5 3.5-4 5-5 8-.5 1.5-1 3 0 4.5 1 1.5 2.5 2.5 5 2.5z"/>
  </svg>
);

const StarIcon = () => (
  <svg className="w-6 h-6 text-brand-secondary dark:text-dark-primary" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
  </svg>
);

const PencilIcon = () => (
  <svg className="w-6 h-6 text-brand-primary dark:text-dark-secondary" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.71 7.04c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.37-.39-1.02-.39-1.41 0l-1.84 1.83 3.75 3.75M3 17.25V21h3.75L17.81 9.93l-3.75-3.75L3 17.25z"/>
  </svg>
);

interface ReviewConditionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReviewConditionsModal({ isOpen, onClose }: ReviewConditionsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-dark-card rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="border-b border-brand-border dark:border-dark-border p-6">
          <h2 className="text-lg font-bold text-brand-text-dark dark:text-dark-text-light text-center">
            เงื่อนไขการรับรางวัลจากรีวิว
          </h2>
        </div>

        <div className="p-6 space-y-6">
          {/* Reward Amount */}
          <div className="bg-brand-secondary-light dark:bg-dark-primary/10 border border-brand-secondary dark:border-dark-primary rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-brand-text-dark dark:text-dark-text-light">
                รางวัล
              </span>
              <div className="flex items-center gap-1.5">
                <FireIcon />
                <span className="text-brand-error dark:text-dark-accent font-bold text-xl">0.25</span>
              </div>
            </div>
            <p className="text-sm text-brand-text-light dark:text-dark-text-light mt-1">
              ทำครบทุกเงื่อนไขเพื่อรับรางวัล
            </p>
          </div>

          {/* Requirements */}
          <div>
            <h3 className="font-semibold text-brand-text-dark dark:text-dark-text-light mb-3">
              ต้องทำครบทั้ง 2 ข้อ:
            </h3>

            <div className="space-y-4">
              {/* Requirement 1: Ratings */}
              <div className="flex gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <StarIcon />
                </div>
                <div>
                  <p className="font-medium text-brand-text-dark dark:text-dark-text-light">
                    ให้คะแนนบริการครบ 3 หมวด
                  </p>
                  <ul className="text-sm text-brand-text-light dark:text-dark-text-light mt-1 space-y-1 ml-4">
                    <li>- คุณภาพบริการเป็นอย่างไร? (ยอดครบ, ไม่ลด)</li>
                    <li>- ความเร็วในการส่ง (1-5 ดาว)</li>
                    <li>- ความคุ้มค่า (1-5 ดาว)</li>
                  </ul>
                </div>
              </div>

              {/* Requirement 2: Text */}
              <div className="flex gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <PencilIcon />
                </div>
                <div>
                  <p className="font-medium text-brand-text-dark dark:text-dark-text-light">
                    เขียนรีวิวอย่างน้อย 20 ตัวอักษร
                  </p>
                  <p className="text-sm text-brand-text-light dark:text-dark-text-light mt-1">
                    อธิบายประสบการณ์การใช้บริการ
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Rules */}
          <div className="border-t border-brand-border dark:border-dark-border pt-4">
            <ul className="text-xs text-brand-text-light dark:text-dark-text-light space-y-2">
              <li>• <strong className="text-brand-text-dark dark:text-dark-text-dark">Order ต้องมีมูลค่า 10 บาทขึ้นไป</strong></li>
              <li>• ต้องทำครบทั้ง 2 เงื่อนไขถึงจะได้รับเครดิต</li>
              <li>• ผู้ใช้จะได้รับเครดิตหลังจากส่งรีวิวเรียบร้อยแล้ว</li>
              <li>• 1 order สามารถรีวิวได้ 1 ครั้ง ไม่สามารถแก้ไขได้</li>
              <li>• หาก Meelike ตรวจพบการรีวิว spam จะหักเครดิตคืน</li>
              <li>• สามารถรีวิวได้ภายใน 7 วันหลัง order สำเร็จ</li>
              <li>• รีวิวที่ซ้ำกัน/copy จะไม่ได้รับรางวัล</li>
            </ul>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full py-3 bg-brand-secondary hover:bg-brand-secondary-light dark:bg-dark-primary dark:hover:bg-dark-primary/80 text-brand-text-dark rounded-lg font-semibold shadow-md hover:shadow-lg transition-all"
          >
            ตกลง
          </button>
        </div>
      </div>
    </div>
  );
}

