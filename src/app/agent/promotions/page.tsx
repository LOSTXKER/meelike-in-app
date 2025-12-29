"use client";

import React, { useState, useEffect } from 'react';
import { AgentHeader } from '../components';
import {
  getCoupons,
  getFlashSales,
  deleteCoupon,
  deleteFlashSale,
  toggleCouponActive,
  toggleFlashSaleActive,
  getPromotionSummary,
} from '@/app/utils/storage/promotions';
import type { Coupon, FlashSale, PromotionSummary } from '@/app/types/promotion';
import {
  calculateCouponStatus,
  getCouponStatusLabel,
  getCouponStatusColor,
  formatCouponDisplay,
  isFlashSaleActive,
  getFlashSaleTimeRemaining,
} from '@/app/types/promotion';

// Icons
const TagIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
  </svg>
);

const FlashIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const EditIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const CopyIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const StarIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const ChartIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

type TabType = 'coupons' | 'flashsales' | 'loyalty';

const MOCK_AGENT_ID = 'demo_agent';

export default function AgentPromotionsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('coupons');
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [flashSales, setFlashSales] = useState<FlashSale[]>([]);
  const [summary, setSummary] = useState<PromotionSummary | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [showFlashSaleModal, setShowFlashSaleModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [editingFlashSale, setEditingFlashSale] = useState<FlashSale | null>(null);

  // Load data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setCoupons(getCoupons(MOCK_AGENT_ID));
    setFlashSales(getFlashSales(MOCK_AGENT_ID));
    setSummary(getPromotionSummary(MOCK_AGENT_ID));
  };

  // Copy coupon code
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Toggle coupon active
  const handleToggleCoupon = (couponId: string) => {
    toggleCouponActive(MOCK_AGENT_ID, couponId);
    loadData();
  };

  // Delete coupon
  const handleDeleteCoupon = (couponId: string) => {
    if (confirm('ต้องการลบคูปองนี้หรือไม่?')) {
      deleteCoupon(MOCK_AGENT_ID, couponId);
      loadData();
    }
  };

  // Toggle flash sale active
  const handleToggleFlashSale = (flashSaleId: string) => {
    toggleFlashSaleActive(MOCK_AGENT_ID, flashSaleId);
    loadData();
  };

  // Delete flash sale
  const handleDeleteFlashSale = (flashSaleId: string) => {
    if (confirm('ต้องการลบ Flash Sale นี้หรือไม่?')) {
      deleteFlashSale(MOCK_AGENT_ID, flashSaleId);
      loadData();
    }
  };

  // Format remaining time
  const formatTimeRemaining = (flashSale: FlashSale) => {
    const { hours, minutes, expired } = getFlashSaleTimeRemaining(flashSale);
    if (expired) return 'หมดเวลา';
    if (hours > 24) return `${Math.floor(hours / 24)} วัน`;
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
  };

  // Tabs
  const tabs = [
    { id: 'coupons' as TabType, label: 'คูปอง', icon: <TagIcon />, count: coupons.length },
    { id: 'flashsales' as TabType, label: 'Flash Sale', icon: <FlashIcon />, count: flashSales.length },
    { id: 'loyalty' as TabType, label: 'Loyalty', icon: <StarIcon />, count: 0 },
  ];

  return (
    <>
      <AgentHeader
        title="โปรโมชั่น"
        subtitle="จัดการคูปอง Flash Sale และโปรแกรมความภักดี"
      />

      <div className="flex-1 overflow-y-auto p-4 lg:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <SummaryCard
              icon={<TagIcon />}
              label="คูปองใช้งานได้"
              value={summary?.activeCoupons || 0}
              color="bg-brand-primary/10 text-brand-primary"
            />
            <SummaryCard
              icon={<ChartIcon />}
              label="ใช้คูปองทั้งหมด"
              value={summary?.totalCouponUsage || 0}
              suffix="ครั้ง"
              color="bg-success/10 text-success"
            />
            <SummaryCard
              icon={<FlashIcon />}
              label="Flash Sale กำลังเปิด"
              value={summary?.activeFlashSales || 0}
              color="bg-warning/10 text-warning"
            />
            <SummaryCard
              icon={<StarIcon />}
              label="ส่วนลดจากคูปอง"
              value={summary?.totalCouponDiscount || 0}
              prefix="฿"
              color="bg-error/10 text-error"
            />
          </div>

          {/* Tabs */}
          <div className="bg-surface rounded-xl border border-default shadow-sm overflow-hidden">
            <div className="border-b border-default">
              <div className="flex">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 lg:px-6 py-3 lg:py-4 font-medium transition-colors relative ${
                      activeTab === tab.id
                        ? 'text-brand-primary bg-brand-primary/5'
                        : 'text-secondary hover:text-primary hover:bg-hover'
                    }`}
                  >
                    {tab.icon}
                    <span className="hidden sm:inline">{tab.label}</span>
                    {tab.count > 0 && (
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        activeTab === tab.id
                          ? 'bg-brand-primary text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-secondary'
                      }`}>
                        {tab.count}
                      </span>
                    )}
                    {activeTab === tab.id && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-4 lg:p-6">
              {activeTab === 'coupons' && (
                <CouponsTab
                  coupons={coupons}
                  onCopyCode={handleCopyCode}
                  copiedCode={copiedCode}
                  onToggle={handleToggleCoupon}
                  onEdit={(coupon) => {
                    setEditingCoupon(coupon);
                    setShowCouponModal(true);
                  }}
                  onDelete={handleDeleteCoupon}
                  onAdd={() => {
                    setEditingCoupon(null);
                    setShowCouponModal(true);
                  }}
                />
              )}

              {activeTab === 'flashsales' && (
                <FlashSalesTab
                  flashSales={flashSales}
                  formatTimeRemaining={formatTimeRemaining}
                  onToggle={handleToggleFlashSale}
                  onEdit={(flashSale) => {
                    setEditingFlashSale(flashSale);
                    setShowFlashSaleModal(true);
                  }}
                  onDelete={handleDeleteFlashSale}
                  onAdd={() => {
                    setEditingFlashSale(null);
                    setShowFlashSaleModal(true);
                  }}
                />
              )}

              {activeTab === 'loyalty' && (
                <LoyaltyTab />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Coupon Modal */}
      {showCouponModal && (
        <CouponModal
          coupon={editingCoupon}
          onClose={() => {
            setShowCouponModal(false);
            setEditingCoupon(null);
          }}
          onSave={() => {
            setShowCouponModal(false);
            setEditingCoupon(null);
            loadData();
          }}
        />
      )}

      {/* Flash Sale Modal */}
      {showFlashSaleModal && (
        <FlashSaleModal
          flashSale={editingFlashSale}
          onClose={() => {
            setShowFlashSaleModal(false);
            setEditingFlashSale(null);
          }}
          onSave={() => {
            setShowFlashSaleModal(false);
            setEditingFlashSale(null);
            loadData();
          }}
        />
      )}
    </>
  );
}

// Summary Card Component
function SummaryCard({
  icon,
  label,
  value,
  prefix,
  suffix,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  color: string;
}) {
  return (
    <div className="bg-surface rounded-xl border border-default p-4">
      <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <p className="text-sm text-secondary mb-1">{label}</p>
      <p className="text-xl lg:text-2xl font-bold text-primary">
        {prefix}{value.toLocaleString()}{suffix}
      </p>
    </div>
  );
}

// Coupons Tab
function CouponsTab({
  coupons,
  onCopyCode,
  copiedCode,
  onToggle,
  onEdit,
  onDelete,
  onAdd,
}: {
  coupons: Coupon[];
  onCopyCode: (code: string) => void;
  copiedCode: string | null;
  onToggle: (id: string) => void;
  onEdit: (coupon: Coupon) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-primary">คูปองทั้งหมด</h3>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors"
        >
          <PlusIcon />
          <span>สร้างคูปอง</span>
        </button>
      </div>

      {/* Coupons List */}
      {coupons.length === 0 ? (
        <EmptyState
          icon={<TagIcon />}
          title="ยังไม่มีคูปอง"
          description="สร้างคูปองเพื่อดึงดูดลูกค้าใหม่และเพิ่มยอดขาย"
          action={
            <button
              onClick={onAdd}
              className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors"
            >
              <PlusIcon />
              <span>สร้างคูปองแรก</span>
            </button>
          }
        />
      ) : (
        <div className="grid gap-4">
          {coupons.map((coupon) => {
            const status = calculateCouponStatus(coupon);
            return (
              <div
                key={coupon.id}
                className="bg-surface border border-default rounded-xl p-4 lg:p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Coupon Code & Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className="flex items-center gap-2 px-3 py-1.5 bg-brand-primary/10 rounded-lg cursor-pointer hover:bg-brand-primary/20 transition-colors"
                        onClick={() => onCopyCode(coupon.code)}
                      >
                        <code className="font-mono font-bold text-brand-primary">
                          {coupon.code}
                        </code>
                        <CopyIcon />
                        {copiedCode === coupon.code && (
                          <span className="text-xs text-success">คัดลอกแล้ว!</span>
                        )}
                      </div>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getCouponStatusColor(status)}`}>
                        {getCouponStatusLabel(status)}
                      </span>
                    </div>
                    
                    <p className="text-primary font-medium mb-1">
                      {formatCouponDisplay(coupon)}
                    </p>
                    {coupon.description && (
                      <p className="text-sm text-secondary">{coupon.description}</p>
                    )}
                    
                    <div className="flex flex-wrap gap-3 mt-3 text-xs text-secondary">
                      {coupon.minPurchase && (
                        <span>ขั้นต่ำ ฿{coupon.minPurchase.toLocaleString()}</span>
                      )}
                      <span>
                        ใช้แล้ว {coupon.usageCount}
                        {coupon.usageLimit ? `/${coupon.usageLimit}` : ''} ครั้ง
                      </span>
                      <span>
                        หมดอายุ {new Date(coupon.validUntil).toLocaleDateString('th-TH')}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={coupon.isActive}
                        onChange={() => onToggle(coupon.id)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-primary"></div>
                    </label>
                    <button
                      onClick={() => onEdit(coupon)}
                      className="p-2 text-secondary hover:text-primary hover:bg-hover rounded-lg transition-colors"
                    >
                      <EditIcon />
                    </button>
                    <button
                      onClick={() => onDelete(coupon.id)}
                      className="p-2 text-secondary hover:text-error hover:bg-error/10 rounded-lg transition-colors"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Flash Sales Tab
function FlashSalesTab({
  flashSales,
  formatTimeRemaining,
  onToggle,
  onEdit,
  onDelete,
  onAdd,
}: {
  flashSales: FlashSale[];
  formatTimeRemaining: (f: FlashSale) => string;
  onToggle: (id: string) => void;
  onEdit: (flashSale: FlashSale) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-primary">Flash Sale</h3>
          <p className="text-sm text-secondary">สร้างโปรโมชั่นจำกัดเวลาเพื่อกระตุ้นยอดขาย</p>
        </div>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:opacity-90 transition-opacity"
        >
          <FlashIcon />
          <span>สร้าง Flash Sale</span>
        </button>
      </div>

      {/* Flash Sales List */}
      {flashSales.length === 0 ? (
        <EmptyState
          icon={<FlashIcon />}
          title="ยังไม่มี Flash Sale"
          description="สร้างโปรโมชั่นจำกัดเวลาเพื่อดึงดูดลูกค้า"
          action={
            <button
              onClick={onAdd}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              <FlashIcon />
              <span>สร้าง Flash Sale แรก</span>
            </button>
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {flashSales.map((flashSale) => {
            const isActive = isFlashSaleActive(flashSale);
            const progress = (flashSale.soldQuantity / flashSale.totalQuantity) * 100;
            
            return (
              <div
                key={flashSale.id}
                className={`relative overflow-hidden rounded-xl border ${
                  isActive
                    ? 'bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-orange-200 dark:border-orange-800'
                    : 'bg-surface border-default opacity-60'
                }`}
              >
                {/* Flash Badge */}
                {isActive && (
                  <div className="absolute top-0 right-0">
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-3 py-1 rounded-bl-lg font-medium flex items-center gap-1">
                      <ClockIcon />
                      <span>{formatTimeRemaining(flashSale)}</span>
                    </div>
                  </div>
                )}

                <div className="p-4 lg:p-5">
                  {/* Service Name */}
                  <h4 className="font-semibold text-primary mb-2 pr-20">
                    {flashSale.serviceName}
                  </h4>

                  {/* Prices */}
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-2xl font-bold text-red-500">
                      ฿{flashSale.salePrice.toLocaleString()}
                    </span>
                    <span className="text-sm text-secondary line-through">
                      ฿{flashSale.originalPrice.toLocaleString()}
                    </span>
                    <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded">
                      -{flashSale.discountPercent}%
                    </span>
                  </div>

                  {/* Progress */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-secondary mb-1">
                      <span>ขายแล้ว {flashSale.soldQuantity}/{flashSale.totalQuantity}</span>
                      <span>เหลือ {flashSale.remainingQuantity}</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Time */}
                  <p className="text-xs text-secondary mb-4">
                    {new Date(flashSale.startAt).toLocaleDateString('th-TH')} - {new Date(flashSale.endAt).toLocaleDateString('th-TH')}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-default">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={flashSale.isActive}
                        onChange={() => onToggle(flashSale.id)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-500"></div>
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => onEdit(flashSale)}
                        className="p-2 text-secondary hover:text-primary hover:bg-hover rounded-lg transition-colors"
                      >
                        <EditIcon />
                      </button>
                      <button
                        onClick={() => onDelete(flashSale.id)}
                        className="p-2 text-secondary hover:text-error hover:bg-error/10 rounded-lg transition-colors"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Loyalty Tab
function LoyaltyTab() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="font-semibold text-primary">โปรแกรม Loyalty</h3>
        <p className="text-sm text-secondary">ตั้งค่าระดับลูกค้า VIP และสิทธิประโยชน์</p>
      </div>

      {/* Tiers */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Silver */}
        <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-xl p-5 border border-gray-300 dark:border-gray-600">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gray-400 flex items-center justify-center">
              <StarIcon />
            </div>
            <div>
              <h4 className="font-bold text-primary">VIP Silver</h4>
              <p className="text-sm text-secondary">ออเดอร์ 5+ ครั้ง</p>
            </div>
          </div>
          <div className="text-2xl font-bold text-primary mb-2">
            5% <span className="text-sm font-normal text-secondary">ส่วนลด</span>
          </div>
          <p className="text-sm text-secondary">ลูกค้า 0 คน</p>
        </div>

        {/* Gold */}
        <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900/30 dark:to-yellow-800/30 rounded-xl p-5 border border-yellow-300 dark:border-yellow-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center text-white">
              <StarIcon />
            </div>
            <div>
              <h4 className="font-bold text-primary">VIP Gold</h4>
              <p className="text-sm text-secondary">ออเดอร์ 10+ ครั้ง</p>
            </div>
          </div>
          <div className="text-2xl font-bold text-primary mb-2">
            10% <span className="text-sm font-normal text-secondary">ส่วนลด</span>
          </div>
          <p className="text-sm text-secondary">ลูกค้า 0 คน</p>
        </div>

        {/* Platinum */}
        <div className="bg-gradient-to-br from-cyan-100 to-cyan-200 dark:from-cyan-900/30 dark:to-cyan-800/30 rounded-xl p-5 border border-cyan-300 dark:border-cyan-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-cyan-500 flex items-center justify-center text-white">
              <StarIcon />
            </div>
            <div>
              <h4 className="font-bold text-primary">VIP Platinum</h4>
              <p className="text-sm text-secondary">ออเดอร์ 20+ ครั้ง</p>
            </div>
          </div>
          <div className="text-2xl font-bold text-primary mb-2">
            15% <span className="text-sm font-normal text-secondary">ส่วนลด</span>
          </div>
          <p className="text-sm text-secondary">ลูกค้า 0 คน</p>
        </div>
      </div>

      {/* Coming Soon */}
      <div className="bg-brand-primary/5 border border-brand-primary/20 rounded-xl p-6 text-center">
        <p className="text-brand-primary font-medium mb-2">
          กำลังพัฒนาระบบ Loyalty แบบปรับแต่งได้
        </p>
        <p className="text-sm text-secondary">
          เร็วๆ นี้คุณจะสามารถตั้งค่าระดับลูกค้า เงื่อนไข และสิทธิประโยชน์ได้เอง
        </p>
      </div>
    </div>
  );
}

// Empty State
function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-secondary mb-4">
        {icon}
      </div>
      <h3 className="font-medium text-primary mb-2">{title}</h3>
      <p className="text-sm text-secondary mb-6 max-w-md mx-auto">{description}</p>
      {action}
    </div>
  );
}

// Coupon Modal
function CouponModal({
  coupon,
  onClose,
  onSave,
}: {
  coupon: Coupon | null;
  onClose: () => void;
  onSave: () => void;
}) {
  const [form, setForm] = useState({
    code: coupon?.code || '',
    description: coupon?.description || '',
    type: coupon?.type || 'percentage' as 'percentage' | 'fixed',
    value: coupon?.value || 10,
    maxDiscount: coupon?.maxDiscount || undefined,
    minPurchase: coupon?.minPurchase || undefined,
    usageLimit: coupon?.usageLimit || undefined,
    usageLimitPerUser: coupon?.usageLimitPerUser || undefined,
    validFrom: coupon?.validFrom ? coupon.validFrom.split('T')[0] : new Date().toISOString().split('T')[0],
    validUntil: coupon?.validUntil ? coupon.validUntil.split('T')[0] : '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { createCoupon, updateCoupon } = await import('@/app/utils/storage/promotions');
      
      const input = {
        code: form.code,
        description: form.description || undefined,
        type: form.type,
        value: form.value,
        maxDiscount: form.maxDiscount,
        minPurchase: form.minPurchase,
        usageLimit: form.usageLimit,
        usageLimitPerUser: form.usageLimitPerUser,
        validFrom: new Date(form.validFrom).toISOString(),
        validUntil: form.validUntil ? new Date(form.validUntil).toISOString() : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      };

      if (coupon) {
        updateCoupon(MOCK_AGENT_ID, coupon.id, input);
      } else {
        createCoupon(MOCK_AGENT_ID, input);
      }

      onSave();
    } catch (error) {
      console.error('Error saving coupon:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-default">
          <h2 className="text-xl font-bold text-primary">
            {coupon ? 'แก้ไขคูปอง' : 'สร้างคูปองใหม่'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Code */}
          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              รหัสคูปอง *
            </label>
            <input
              type="text"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
              placeholder="เช่น NEWYEAR2025"
              className="w-full px-4 py-2 rounded-lg border border-default bg-surface text-primary focus:ring-2 focus:ring-brand-primary focus:border-transparent"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              คำอธิบาย
            </label>
            <input
              type="text"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="เช่น ส่วนลดปีใหม่"
              className="w-full px-4 py-2 rounded-lg border border-default bg-surface text-primary focus:ring-2 focus:ring-brand-primary focus:border-transparent"
            />
          </div>

          {/* Type & Value */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                ประเภท *
              </label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as 'percentage' | 'fixed' })}
                className="w-full px-4 py-2 rounded-lg border border-default bg-surface text-primary focus:ring-2 focus:ring-brand-primary focus:border-transparent"
              >
                <option value="percentage">เปอร์เซ็นต์ (%)</option>
                <option value="fixed">จำนวนเงิน (฿)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                มูลค่า *
              </label>
              <input
                type="number"
                value={form.value}
                onChange={(e) => setForm({ ...form, value: Number(e.target.value) })}
                placeholder={form.type === 'percentage' ? '10' : '100'}
                min={1}
                max={form.type === 'percentage' ? 100 : undefined}
                className="w-full px-4 py-2 rounded-lg border border-default bg-surface text-primary focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Max Discount & Min Purchase */}
          <div className="grid grid-cols-2 gap-4">
            {form.type === 'percentage' && (
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  ส่วนลดสูงสุด (฿)
                </label>
                <input
                  type="number"
                  value={form.maxDiscount || ''}
                  onChange={(e) => setForm({ ...form, maxDiscount: e.target.value ? Number(e.target.value) : undefined })}
                  placeholder="ไม่จำกัด"
                  className="w-full px-4 py-2 rounded-lg border border-default bg-surface text-primary focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                />
              </div>
            )}
            <div className={form.type === 'percentage' ? '' : 'col-span-2'}>
              <label className="block text-sm font-medium text-primary mb-2">
                ยอดซื้อขั้นต่ำ (฿)
              </label>
              <input
                type="number"
                value={form.minPurchase || ''}
                onChange={(e) => setForm({ ...form, minPurchase: e.target.value ? Number(e.target.value) : undefined })}
                placeholder="ไม่มีขั้นต่ำ"
                className="w-full px-4 py-2 rounded-lg border border-default bg-surface text-primary focus:ring-2 focus:ring-brand-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Usage Limits */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                จำนวนครั้งทั้งหมด
              </label>
              <input
                type="number"
                value={form.usageLimit || ''}
                onChange={(e) => setForm({ ...form, usageLimit: e.target.value ? Number(e.target.value) : undefined })}
                placeholder="ไม่จำกัด"
                className="w-full px-4 py-2 rounded-lg border border-default bg-surface text-primary focus:ring-2 focus:ring-brand-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                ครั้ง/คน
              </label>
              <input
                type="number"
                value={form.usageLimitPerUser || ''}
                onChange={(e) => setForm({ ...form, usageLimitPerUser: e.target.value ? Number(e.target.value) : undefined })}
                placeholder="ไม่จำกัด"
                className="w-full px-4 py-2 rounded-lg border border-default bg-surface text-primary focus:ring-2 focus:ring-brand-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Validity Period */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                เริ่มใช้งาน *
              </label>
              <input
                type="date"
                value={form.validFrom}
                onChange={(e) => setForm({ ...form, validFrom: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-default bg-surface text-primary focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                หมดอายุ *
              </label>
              <input
                type="date"
                value={form.validUntil}
                onChange={(e) => setForm({ ...form, validUntil: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-default bg-surface text-primary focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                required
              />
            </div>
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
              disabled={loading}
              className="px-6 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors disabled:opacity-50"
            >
              {loading ? 'กำลังบันทึก...' : coupon ? 'บันทึก' : 'สร้างคูปอง'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Flash Sale Modal
function FlashSaleModal({
  flashSale,
  onClose,
  onSave,
}: {
  flashSale: FlashSale | null;
  onClose: () => void;
  onSave: () => void;
}) {
  const [form, setForm] = useState({
    serviceName: flashSale?.serviceName || '',
    serviceId: flashSale?.serviceId || 1,
    originalPrice: flashSale?.originalPrice || 100,
    salePrice: flashSale?.salePrice || 80,
    totalQuantity: flashSale?.totalQuantity || 10,
    startAt: flashSale?.startAt ? flashSale.startAt.split('T')[0] : new Date().toISOString().split('T')[0],
    endAt: flashSale?.endAt ? flashSale.endAt.split('T')[0] : '',
  });
  const [loading, setLoading] = useState(false);

  const discountPercent = Math.round(((form.originalPrice - form.salePrice) / form.originalPrice) * 100);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { createFlashSale } = await import('@/app/utils/storage/promotions');
      
      createFlashSale(MOCK_AGENT_ID, {
        serviceId: form.serviceId,
        serviceName: form.serviceName,
        originalPrice: form.originalPrice,
        salePrice: form.salePrice,
        totalQuantity: form.totalQuantity,
        startAt: new Date(form.startAt).toISOString(),
        endAt: form.endAt ? new Date(form.endAt).toISOString() : new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      });

      onSave();
    } catch (error) {
      console.error('Error saving flash sale:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-default bg-gradient-to-r from-orange-500 to-red-500 rounded-t-xl">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FlashIcon />
            {flashSale ? 'แก้ไข Flash Sale' : 'สร้าง Flash Sale'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Service Name */}
          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              ชื่อบริการ *
            </label>
            <input
              type="text"
              value={form.serviceName}
              onChange={(e) => setForm({ ...form, serviceName: e.target.value })}
              placeholder="เช่น Instagram Followers"
              className="w-full px-4 py-2 rounded-lg border border-default bg-surface text-primary focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>

          {/* Prices */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                ราคาปกติ (฿) *
              </label>
              <input
                type="number"
                value={form.originalPrice}
                onChange={(e) => setForm({ ...form, originalPrice: Number(e.target.value) })}
                min={1}
                className="w-full px-4 py-2 rounded-lg border border-default bg-surface text-primary focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                ราคา Flash Sale (฿) *
              </label>
              <input
                type="number"
                value={form.salePrice}
                onChange={(e) => setForm({ ...form, salePrice: Number(e.target.value) })}
                min={1}
                max={form.originalPrice - 1}
                className="w-full px-4 py-2 rounded-lg border border-default bg-surface text-primary focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Discount Preview */}
          <div className="bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg p-4 text-center">
            <p className="text-sm text-secondary mb-1">ส่วนลด</p>
            <p className="text-3xl font-bold text-red-500">-{discountPercent}%</p>
            <p className="text-sm text-secondary">
              ประหยัด ฿{(form.originalPrice - form.salePrice).toLocaleString()}
            </p>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              จำนวนจำกัด *
            </label>
            <input
              type="number"
              value={form.totalQuantity}
              onChange={(e) => setForm({ ...form, totalQuantity: Number(e.target.value) })}
              min={1}
              className="w-full px-4 py-2 rounded-lg border border-default bg-surface text-primary focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>

          {/* Time Period */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                เริ่ม *
              </label>
              <input
                type="date"
                value={form.startAt}
                onChange={(e) => setForm({ ...form, startAt: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-default bg-surface text-primary focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                สิ้นสุด *
              </label>
              <input
                type="date"
                value={form.endAt}
                onChange={(e) => setForm({ ...form, endAt: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-default bg-surface text-primary focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>
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
              disabled={loading || discountPercent <= 0}
              className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? 'กำลังบันทึก...' : flashSale ? 'บันทึก' : 'สร้าง Flash Sale'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

