// src/app/s/[slug]/status/page.tsx
// Public Store Order Status Page - ลูกค้าตรวจสอบสถานะ
"use client";

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import type { StoreSettings } from '@/app/types/store';
import type { Bill } from '@/app/types/bill';
import { getBillStatusLabel, getBillStatusColor } from '@/app/types/bill';
import { getStoreByUsername } from '@/app/utils/storage/stores';
import { getBills } from '@/app/utils/storage/bills';

// Icons
const ArrowLeftIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const XCircleIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// Status steps
const statusSteps = ['pending', 'confirmed', 'processing', 'completed'] as const;
const statusLabels: Record<string, string> = {
  pending: 'รอชำระเงิน',
  confirmed: 'ยืนยันแล้ว',
  processing: 'กำลังดำเนินการ',
  completed: 'สำเร็จ',
  cancelled: 'ยกเลิก',
};

function getStatusStepIndex(status: string): number {
  return statusSteps.indexOf(status as typeof statusSteps[number]);
}

export default function OrderStatusPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const searchParams = useSearchParams();
  const billNumber = searchParams.get('bill') || '';
  
  const [store, setStore] = useState<StoreSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(billNumber);
  const [searchedBill, setSearchedBill] = useState<Bill | null>(null);
  const [searchError, setSearchError] = useState('');

  useEffect(() => {
    loadStore();
  }, [resolvedParams.slug]);

  useEffect(() => {
    if (billNumber && store) {
      searchBill(billNumber);
    }
  }, [billNumber, store]);

  const loadStore = () => {
    setIsLoading(true);
    try {
      const storeData = getStoreByUsername(resolvedParams.slug);
      setStore(storeData);
    } finally {
      setIsLoading(false);
    }
  };

  const searchBill = (query: string) => {
    if (!store || !query.trim()) {
      setSearchError('');
      setSearchedBill(null);
      return;
    }
    
    const bills = getBills(store.agentId);
    const bill = bills.find(b => 
      b.billNumber?.toLowerCase() === query.toLowerCase() ||
      b.id.toLowerCase() === query.toLowerCase()
    );
    
    if (bill) {
      setSearchedBill(bill);
      setSearchError('');
    } else {
      setSearchedBill(null);
      setSearchError('ไม่พบออเดอร์นี้ กรุณาตรวจสอบหมายเลขบิลอีกครั้ง');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchBill(searchQuery);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-main dark:bg-dark-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen bg-main dark:bg-dark-bg flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary mb-2">ไม่พบร้านค้า</h1>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg font-medium"
          >
            <ArrowLeftIcon />
            กลับหน้าหลัก
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-main dark:bg-dark-bg">
      {/* Header */}
      <header className="bg-surface dark:bg-dark-surface border-b border-default sticky top-0 z-40">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              href={`/s/${resolvedParams.slug}`}
              className="p-2 -ml-2 hover:bg-hover rounded-lg transition-colors"
            >
              <ArrowLeftIcon />
            </Link>
            <div>
              <h1 className="font-bold text-lg text-primary">ตรวจสอบสถานะ</h1>
              <p className="text-sm text-secondary">{store.storeName}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-lg mx-auto px-4 py-6">
        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative">
            <span className="absolute inset-y-0 left-4 flex items-center text-tertiary">
              <SearchIcon />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="กรอกหมายเลขบิล เช่น INV-202501-1234"
              className="w-full pl-12 pr-4 py-3 bg-surface dark:bg-dark-surface border border-default rounded-lg text-sm focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full mt-3 py-2.5 bg-brand-primary text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            ค้นหา
          </button>
        </form>

        {/* Error */}
        {searchError && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-center">
            <p className="text-red-600 dark:text-red-400">{searchError}</p>
          </div>
        )}

        {/* Bill Details */}
        {searchedBill && (
          <div className="space-y-4">
            {/* Status Card */}
            <div className="bg-surface dark:bg-dark-surface rounded-xl border border-default p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-secondary">หมายเลขบิล</p>
                  <p className="font-mono font-bold text-lg text-brand-primary">
                    {searchedBill.billNumber || searchedBill.id}
                  </p>
                </div>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getBillStatusColor(searchedBill.status)}`}>
                  {getBillStatusLabel(searchedBill.status)}
                </span>
              </div>

              {/* Status Progress */}
              {searchedBill.status !== 'cancelled' && (
                <div className="relative mt-6 mb-2">
                  {/* Progress Line */}
                  <div className="absolute top-3 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 rounded">
                    <div
                      className="h-full bg-brand-primary rounded transition-all"
                      style={{
                        width: `${((getStatusStepIndex(searchedBill.status) + 1) / statusSteps.length) * 100}%`,
                      }}
                    />
                  </div>
                  
                  {/* Steps */}
                  <div className="relative flex justify-between">
                    {statusSteps.map((step, index) => {
                      const currentIndex = getStatusStepIndex(searchedBill.status);
                      const isCompleted = index <= currentIndex;
                      const isCurrent = index === currentIndex;
                      
                      return (
                        <div key={step} className="flex flex-col items-center">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center ${
                              isCompleted
                                ? 'bg-brand-primary text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-tertiary'
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircleIcon />
                            ) : (
                              <span className="text-xs">{index + 1}</span>
                            )}
                          </div>
                          <span className={`text-xs mt-2 ${isCurrent ? 'font-semibold text-brand-primary' : 'text-tertiary'}`}>
                            {statusLabels[step]}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Cancelled Status */}
              {searchedBill.status === 'cancelled' && (
                <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg mt-4">
                  <XCircleIcon />
                  <div>
                    <p className="font-medium text-red-700 dark:text-red-300">ออเดอร์ถูกยกเลิก</p>
                    {searchedBill.cancellationReason && (
                      <p className="text-sm text-red-600 dark:text-red-400">
                        เหตุผล: {searchedBill.cancellationReason}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Order Details */}
            <div className="bg-surface dark:bg-dark-surface rounded-xl border border-default p-5">
              <h3 className="font-semibold text-primary mb-4">รายละเอียดออเดอร์</h3>
              
              {searchedBill.items.map((item) => (
                <div key={item.id} className="border-b border-default pb-4 mb-4 last:border-0 last:pb-0 last:mb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-primary">{item.serviceName}</p>
                      <p className="text-sm text-secondary">จำนวน: {item.quantity.toLocaleString()}</p>
                      <p className="text-xs text-tertiary mt-1 break-all">{item.link}</p>
                    </div>
                    <p className="font-semibold text-primary">{formatCurrency(item.totalSell)}</p>
                  </div>
                  
                  {/* Item Progress */}
                  {item.progress > 0 && item.progress < 100 && (
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-secondary mb-1">
                        <span>ความคืบหน้า</span>
                        <span>{item.progress}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-brand-primary transition-all"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-tertiary mt-1">
                        {item.currentCount?.toLocaleString()} / {item.quantity.toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              ))}
              
              <div className="flex justify-between items-center pt-4 border-t border-default">
                <span className="font-medium text-primary">ยอดรวม</span>
                <span className="text-lg font-bold text-brand-primary">{formatCurrency(searchedBill.totalAmount)}</span>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-surface dark:bg-dark-surface rounded-xl border border-default p-5">
              <h3 className="font-semibold text-primary mb-4">ประวัติ</h3>
              
              <div className="space-y-4">
                {searchedBill.completedAt && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600">
                      <CheckCircleIcon />
                    </div>
                    <div>
                      <p className="font-medium text-primary">สำเร็จ</p>
                      <p className="text-sm text-secondary">{formatDate(searchedBill.completedAt)}</p>
                    </div>
                  </div>
                )}
                {searchedBill.startedAt && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600">
                      <ClockIcon />
                    </div>
                    <div>
                      <p className="font-medium text-primary">เริ่มดำเนินการ</p>
                      <p className="text-sm text-secondary">{formatDate(searchedBill.startedAt)}</p>
                    </div>
                  </div>
                )}
                {searchedBill.confirmedAt && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                      <CheckCircleIcon />
                    </div>
                    <div>
                      <p className="font-medium text-primary">ยืนยันแล้ว</p>
                      <p className="text-sm text-secondary">{formatDate(searchedBill.confirmedAt)}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600">
                    <ClockIcon />
                  </div>
                  <div>
                    <p className="font-medium text-primary">สร้างออเดอร์</p>
                    <p className="text-sm text-secondary">{formatDate(searchedBill.createdAt)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact */}
            {store.contactLine && (
              <div className="bg-surface dark:bg-dark-surface rounded-xl border border-default p-5 text-center">
                <p className="text-secondary mb-3">มีคำถาม? ติดต่อร้านค้าได้เลย</p>
                <a
                  href={`https://line.me/ti/p/~${store.contactLine.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
                >
                  ติดต่อทาง LINE
                </a>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!searchedBill && !searchError && !billNumber && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-hover flex items-center justify-center">
              <SearchIcon />
            </div>
            <p className="text-secondary">กรอกหมายเลขบิลเพื่อตรวจสอบสถานะออเดอร์</p>
          </div>
        )}
      </main>
    </div>
  );
}

