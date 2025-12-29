"use client";

import React, { useState, useEffect } from 'react';
import { AgentHeader } from '../components';
import {
  getAgentReviews,
  getStoreRatingSummary,
  getUnrepliedReviewCount,
  replyToReview,
  toggleReviewVisibility,
  queryReviews,
} from '@/app/utils/storage/agentReviews';
import type { AgentStoreReview, StoreRatingSummary, AgentReviewFilter } from '@/app/types/agentReview';
import {
  getRatingLabel,
  getRatingColor,
  formatReviewTimeAgo,
  canReplyToReview,
} from '@/app/types/agentReview';

// Icons
const StarIcon = ({ filled }: { filled: boolean }) => (
  <svg
    className={`w-5 h-5 ${filled ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'}`}
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={filled ? 0 : 2}
    fill={filled ? 'currentColor' : 'none'}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const StarIconSmall = ({ filled }: { filled: boolean }) => (
  <svg
    className={`w-4 h-4 ${filled ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'}`}
    viewBox="0 0 24 24"
    fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor"
    strokeWidth={filled ? 0 : 2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const ReplyIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
  </svg>
);

const EyeIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeOffIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);

const FilterIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);

const InboxIcon = () => (
  <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
  </svg>
);

const MOCK_AGENT_ID = 'demo_agent';

export default function AgentReviewsPage() {
  const [reviews, setReviews] = useState<AgentStoreReview[]>([]);
  const [summary, setSummary] = useState<StoreRatingSummary | null>(null);
  const [unrepliedCount, setUnrepliedCount] = useState(0);
  const [filter, setFilter] = useState<AgentReviewFilter>({});
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState<AgentStoreReview | null>(null);

  useEffect(() => {
    loadData();
  }, [filter]);

  const loadData = () => {
    const reviewsList = queryReviews(MOCK_AGENT_ID, filter);
    setReviews(reviewsList);
    setSummary(getStoreRatingSummary(MOCK_AGENT_ID));
    setUnrepliedCount(getUnrepliedReviewCount(MOCK_AGENT_ID));
  };

  const handleReply = (review: AgentStoreReview) => {
    setSelectedReview(review);
    setShowReplyModal(true);
  };

  const handleToggleVisibility = (reviewId: string) => {
    toggleReviewVisibility(MOCK_AGENT_ID, reviewId);
    loadData();
  };

  const handleFilterChange = (newFilter: Partial<AgentReviewFilter>) => {
    setFilter(prev => ({
      ...prev,
      ...newFilter,
      // Reset to undefined if same value selected
      ...(newFilter.rating !== undefined && newFilter.rating === filter.rating ? { rating: undefined } : {}),
    }));
  };

  // Stars rendering
  const renderStars = (rating: number, size: 'sm' | 'md' = 'md') => {
    const StarComponent = size === 'sm' ? StarIconSmall : StarIcon;
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarComponent key={star} filled={star <= Math.round(rating)} />
        ))}
      </div>
    );
  };

  return (
    <>
      <AgentHeader
        title="รีวิวร้านค้า"
        subtitle="ดูและตอบรีวิวจากลูกค้า"
      />

      <div className="flex-1 overflow-y-auto p-4 lg:p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Rating Summary */}
          <div className="bg-surface rounded-xl border border-default shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Average Rating */}
                <div className="text-center md:text-left">
                  <div className="text-5xl font-bold text-primary">
                    {summary?.averageRating.toFixed(1) || '0.0'}
                  </div>
                  <div className="flex justify-center md:justify-start mt-2">
                    {renderStars(summary?.averageRating || 0)}
                  </div>
                  <p className="text-sm text-secondary mt-1">
                    {summary?.totalReviews || 0} รีวิว
                  </p>
                  {summary && summary.totalReviews > 0 && (
                    <p className={`text-sm font-medium mt-1 ${getRatingColor(summary.averageRating)}`}>
                      {getRatingLabel(summary.averageRating)}
                    </p>
                  )}
                </div>

                {/* Distribution */}
                <div className="flex-1">
                  {[5, 4, 3, 2, 1].map((rating) => {
                    const count = summary?.distribution[rating as 1|2|3|4|5] || 0;
                    const percent = summary?.totalReviews 
                      ? (count / summary.totalReviews) * 100 
                      : 0;
                    return (
                      <button
                        key={rating}
                        onClick={() => handleFilterChange({ rating: rating as 1|2|3|4|5 })}
                        className={`w-full flex items-center gap-2 py-1 px-2 rounded hover:bg-hover transition-colors ${
                          filter.rating === rating ? 'bg-brand-primary/10' : ''
                        }`}
                      >
                        <span className="text-sm font-medium text-secondary w-8">{rating}</span>
                        <StarIconSmall filled />
                        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-yellow-400 rounded-full transition-all duration-300"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <span className="text-sm text-secondary w-12 text-right">{count}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Stats */}
                <div className="flex flex-col gap-3">
                  <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {summary?.positiveReviewsPercent || 0}%
                    </p>
                    <p className="text-xs text-secondary">รีวิวเชิงบวก</p>
                  </div>
                  {unrepliedCount > 0 && (
                    <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                        {unrepliedCount}
                      </p>
                      <p className="text-xs text-secondary">รอตอบกลับ</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap gap-2 items-center">
            <div className="flex items-center gap-2 text-secondary">
              <FilterIcon />
              <span className="text-sm font-medium">กรอง:</span>
            </div>
            
            <button
              onClick={() => handleFilterChange({ hasReply: filter.hasReply === false ? undefined : false })}
              className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                filter.hasReply === false
                  ? 'bg-brand-primary text-white border-brand-primary'
                  : 'bg-surface border-default text-secondary hover:bg-hover'
              }`}
            >
              รอตอบกลับ
            </button>
            
            <button
              onClick={() => handleFilterChange({ isVisible: filter.isVisible === false ? undefined : false })}
              className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                filter.isVisible === false
                  ? 'bg-brand-primary text-white border-brand-primary'
                  : 'bg-surface border-default text-secondary hover:bg-hover'
              }`}
            >
              ถูกซ่อน
            </button>

            {(filter.rating || filter.hasReply !== undefined || filter.isVisible !== undefined) && (
              <button
                onClick={() => setFilter({})}
                className="px-3 py-1.5 text-sm text-brand-primary hover:underline"
              >
                ล้างตัวกรอง
              </button>
            )}
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <div className="bg-surface rounded-xl border border-default p-12 text-center">
                <div className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4">
                  <InboxIcon />
                </div>
                <h3 className="text-lg font-medium text-primary mb-2">
                  {filter.rating || filter.hasReply !== undefined || filter.isVisible !== undefined
                    ? 'ไม่พบรีวิวที่ตรงกับตัวกรอง'
                    : 'ยังไม่มีรีวิว'}
                </h3>
                <p className="text-secondary max-w-md mx-auto">
                  {filter.rating || filter.hasReply !== undefined || filter.isVisible !== undefined
                    ? 'ลองเปลี่ยนตัวกรองหรือล้างตัวกรองเพื่อดูรีวิวทั้งหมด'
                    : 'เมื่อลูกค้าเขียนรีวิวให้ร้านของคุณ จะแสดงที่นี่'}
                </p>
              </div>
            ) : (
              reviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  renderStars={renderStars}
                  onReply={() => handleReply(review)}
                  onToggleVisibility={() => handleToggleVisibility(review.id)}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Reply Modal */}
      {showReplyModal && selectedReview && (
        <ReplyModal
          review={selectedReview}
          renderStars={renderStars}
          onClose={() => {
            setShowReplyModal(false);
            setSelectedReview(null);
          }}
          onSave={(reply) => {
            replyToReview(MOCK_AGENT_ID, { reviewId: selectedReview.id, reply });
            setShowReplyModal(false);
            setSelectedReview(null);
            loadData();
          }}
        />
      )}
    </>
  );
}

// Review Card Component
function ReviewCard({
  review,
  renderStars,
  onReply,
  onToggleVisibility,
}: {
  review: AgentStoreReview;
  renderStars: (rating: number, size?: 'sm' | 'md') => React.ReactNode;
  onReply: () => void;
  onToggleVisibility: () => void;
}) {
  return (
    <div
      className={`bg-surface rounded-xl border border-default p-5 ${
        !review.isVisible ? 'opacity-60' : ''
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center">
            <span className="text-sm font-bold text-brand-primary">
              {review.clientName?.[0] || review.clientContact[0]?.toUpperCase() || 'ล'}
            </span>
          </div>
          <div>
            <p className="font-medium text-primary">
              {review.clientName || review.clientContact}
            </p>
            <p className="text-xs text-secondary">
              {formatReviewTimeAgo(review.createdAt)}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          {renderStars(review.rating, 'sm')}
          <span className={`ml-1 text-sm font-medium ${getRatingColor(review.rating)}`}>
            {review.rating.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Service */}
      <p className="text-xs text-secondary mb-2">
        บริการ: {review.serviceName}
      </p>

      {/* Comment */}
      {review.comment && (
        <p className="text-primary mb-4">{review.comment}</p>
      )}

      {/* Agent Reply */}
      {review.agentReply && (
        <div className="bg-brand-primary/5 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-brand-primary">ตอบกลับจากร้านค้า</span>
            {review.agentReplyAt && (
              <span className="text-xs text-secondary">
                {formatReviewTimeAgo(review.agentReplyAt)}
              </span>
            )}
          </div>
          <p className="text-sm text-primary">{review.agentReply}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 pt-3 border-t border-default">
        {canReplyToReview(review) && (
          <button
            onClick={onReply}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-brand-primary hover:bg-brand-primary/10 rounded-lg transition-colors"
          >
            <ReplyIcon />
            <span>ตอบกลับ</span>
          </button>
        )}
        
        <button
          onClick={onToggleVisibility}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
            review.isVisible
              ? 'text-secondary hover:bg-hover'
              : 'text-orange-600 bg-orange-50 dark:bg-orange-900/20'
          }`}
        >
          {review.isVisible ? <EyeOffIcon /> : <EyeIcon />}
          <span>{review.isVisible ? 'ซ่อน' : 'แสดง'}</span>
        </button>

        {!review.isVisible && (
          <span className="ml-auto text-xs text-orange-600">ถูกซ่อนจากหน้าร้าน</span>
        )}
      </div>
    </div>
  );
}

// Reply Modal
function ReplyModal({
  review,
  renderStars,
  onClose,
  onSave,
}: {
  review: AgentStoreReview;
  renderStars: (rating: number, size?: 'sm' | 'md') => React.ReactNode;
  onClose: () => void;
  onSave: (reply: string) => void;
}) {
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim()) return;
    
    setLoading(true);
    setTimeout(() => {
      onSave(reply.trim());
      setLoading(false);
    }, 300);
  };

  const quickReplies = [
    'ขอบคุณสำหรับรีวิวครับ/ค่ะ ยินดีให้บริการเสมอ',
    'ขอบคุณที่ใช้บริการครับ/ค่ะ หวังว่าจะได้รับใช้อีกครั้ง',
    'ขอบคุณสำหรับคำติชมครับ/ค่ะ จะนำไปปรับปรุงบริการต่อไป',
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-default">
          <h2 className="text-xl font-bold text-primary">ตอบกลับรีวิว</h2>
        </div>

        {/* Review Preview */}
        <div className="p-6 bg-gray-50 dark:bg-gray-800/50 border-b border-default">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center">
              <span className="text-sm font-bold text-brand-primary">
                {review.clientName?.[0] || review.clientContact[0]?.toUpperCase() || 'ล'}
              </span>
            </div>
            <div>
              <p className="font-medium text-primary">
                {review.clientName || review.clientContact}
              </p>
              <div className="flex items-center gap-1">
                {renderStars(review.rating, 'sm')}
              </div>
            </div>
          </div>
          {review.comment && (
            <p className="text-sm text-primary">{review.comment}</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Quick Replies */}
          <div>
            <label className="block text-sm font-medium text-secondary mb-2">
              ข้อความตอบกลับด่วน
            </label>
            <div className="flex flex-wrap gap-2">
              {quickReplies.map((text, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setReply(text)}
                  className="text-xs px-3 py-1.5 rounded-full bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20 transition-colors"
                >
                  {text.length > 30 ? text.slice(0, 30) + '...' : text}
                </button>
              ))}
            </div>
          </div>

          {/* Reply Input */}
          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              ข้อความตอบกลับ *
            </label>
            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="เขียนข้อความตอบกลับลูกค้า..."
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-default bg-surface text-primary focus:ring-2 focus:ring-brand-primary focus:border-transparent resize-none"
              required
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-secondary hover:text-primary hover:bg-hover rounded-lg transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={loading || !reply.trim()}
              className="px-6 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors disabled:opacity-50"
            >
              {loading ? 'กำลังส่ง...' : 'ส่งตอบกลับ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

