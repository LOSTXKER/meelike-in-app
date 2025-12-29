"use client";

import React, { useState, useEffect } from 'react';
import { AgentHeader } from '../components';
import { getBills, getBillSummary } from '@/app/utils/storage/bills';
import { getClientSummary } from '@/app/utils/storage/clients';
import { getStoreRatingSummary } from '@/app/utils/storage/agentReviews';
import { getPromotionSummary } from '@/app/utils/storage/promotions';
import type { Bill, BillStatus, BillSummary } from '@/app/types/bill';
import type { StoreRatingSummary } from '@/app/types/agentReview';
import type { PromotionSummary } from '@/app/types/promotion';

// Icons
const TrendUpIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const TrendDownIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
  </svg>
);

const CurrencyIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CartIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const UsersIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const StarIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

type TimeRange = '7d' | '30d' | '90d' | 'all';

const MOCK_AGENT_ID = 'demo_agent';

export default function AgentAnalyticsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [bills, setBills] = useState<Bill[]>([]);
  const [billSummary, setBillSummary] = useState<BillSummary | null>(null);
  const [clientSummary, setClientSummary] = useState<{ total: number; active: number; new: number } | null>(null);
  const [ratingSummary, setRatingSummary] = useState<StoreRatingSummary | null>(null);
  const [promotionSummary, setPromotionSummary] = useState<PromotionSummary | null>(null);

  useEffect(() => {
    loadData();
  }, [timeRange]);

  const loadData = () => {
    const allBills = getBills(MOCK_AGENT_ID);
    
    // Filter by time range
    const now = new Date();
    let startDate = new Date(0);
    
    switch (timeRange) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
    }
    
    const filteredBills = allBills.filter(b => new Date(b.createdAt) >= startDate);
    setBills(filteredBills);
    setBillSummary(getBillSummary(MOCK_AGENT_ID));
    setClientSummary(getClientSummary(MOCK_AGENT_ID));
    setRatingSummary(getStoreRatingSummary(MOCK_AGENT_ID));
    setPromotionSummary(getPromotionSummary(MOCK_AGENT_ID));
  };

  // Calculate metrics
  const totalRevenue = bills.reduce((sum, b) => b.status === 'completed' ? sum + b.totalAmount : sum, 0);
  const totalProfit = bills.reduce((sum, b) => b.status === 'completed' ? sum + b.totalProfit : sum, 0);
  const completedOrders = bills.filter(b => b.status === 'completed').length;
  const avgOrderValue = completedOrders > 0 ? totalRevenue / completedOrders : 0;

  // Group bills by status
  const statusCounts: Record<BillStatus, number> = {
    pending: 0,
    confirmed: 0,
    processing: 0,
    completed: 0,
    cancelled: 0,
  };
  bills.forEach(b => { statusCounts[b.status]++; });

  // Group bills by date for chart
  const dailyRevenue = bills.reduce((acc, bill) => {
    if (bill.status === 'completed') {
      const date = new Date(bill.createdAt).toLocaleDateString('th-TH', { day: '2-digit', month: 'short' });
      acc[date] = (acc[date] || 0) + bill.totalAmount;
    }
    return acc;
  }, {} as Record<string, number>);

  // Top services
  const serviceRevenue: Record<string, { revenue: number; count: number }> = {};
  bills.forEach(bill => {
    if (bill.status === 'completed') {
      bill.items.forEach(item => {
        if (!serviceRevenue[item.serviceName]) {
          serviceRevenue[item.serviceName] = { revenue: 0, count: 0 };
        }
        serviceRevenue[item.serviceName].revenue += item.totalSell;
        serviceRevenue[item.serviceName].count++;
      });
    }
  });
  const topServices = Object.entries(serviceRevenue)
    .sort((a, b) => b[1].revenue - a[1].revenue)
    .slice(0, 5);

  return (
    <>
      <AgentHeader
        title="สถิติและรายงาน"
        subtitle="ดูภาพรวมผลประกอบการร้านค้าของคุณ"
      />

      <div className="flex-1 overflow-y-auto p-4 lg:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Time Range Selector */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-secondary">
              <CalendarIcon />
              <span className="text-sm font-medium">ช่วงเวลา:</span>
            </div>
            <div className="flex gap-2">
              {[
                { value: '7d', label: '7 วัน' },
                { value: '30d', label: '30 วัน' },
                { value: '90d', label: '90 วัน' },
                { value: 'all', label: 'ทั้งหมด' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setTimeRange(option.value as TimeRange)}
                  className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                    timeRange === option.value
                      ? 'bg-brand-primary text-white'
                      : 'bg-surface border border-default text-secondary hover:bg-hover'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <SummaryCard
              icon={<CurrencyIcon />}
              label="รายได้"
              value={totalRevenue}
              prefix="฿"
              color="bg-green-500/10 text-green-600 dark:text-green-400"
              trend={12}
            />
            <SummaryCard
              icon={<CurrencyIcon />}
              label="กำไร"
              value={totalProfit}
              prefix="฿"
              color="bg-brand-primary/10 text-brand-primary"
              trend={8}
            />
            <SummaryCard
              icon={<CartIcon />}
              label="ออเดอร์สำเร็จ"
              value={completedOrders}
              color="bg-blue-500/10 text-blue-600 dark:text-blue-400"
            />
            <SummaryCard
              icon={<UsersIcon />}
              label="ลูกค้าทั้งหมด"
              value={clientSummary?.total || 0}
              color="bg-purple-500/10 text-purple-600 dark:text-purple-400"
            />
          </div>

          {/* Charts Row */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Revenue Chart */}
            <div className="bg-surface rounded-xl border border-default p-5">
              <h3 className="font-semibold text-primary mb-4">รายได้รายวัน</h3>
              <div className="h-64 flex items-end gap-1">
                {Object.entries(dailyRevenue).length > 0 ? (
                  Object.entries(dailyRevenue).slice(-14).map(([date, revenue], index) => {
                    const maxRevenue = Math.max(...Object.values(dailyRevenue));
                    const height = maxRevenue > 0 ? (revenue / maxRevenue) * 100 : 0;
                    return (
                      <div key={date} className="flex-1 flex flex-col items-center gap-1">
                        <div
                          className="w-full bg-gradient-to-t from-brand-primary to-brand-primary/70 rounded-t transition-all hover:from-brand-primary/90"
                          style={{ height: `${Math.max(height, 5)}%` }}
                          title={`${date}: ฿${revenue.toLocaleString()}`}
                        />
                        <span className="text-[10px] text-secondary rotate-45 origin-left whitespace-nowrap">
                          {date}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex-1 flex items-center justify-center text-secondary">
                    ยังไม่มีข้อมูลในช่วงเวลานี้
                  </div>
                )}
              </div>
            </div>

            {/* Order Status */}
            <div className="bg-surface rounded-xl border border-default p-5">
              <h3 className="font-semibold text-primary mb-4">สถานะออเดอร์</h3>
              <div className="space-y-3">
                {[
                  { status: 'completed' as BillStatus, label: 'สำเร็จ', color: 'bg-green-500' },
                  { status: 'processing' as BillStatus, label: 'กำลังดำเนินการ', color: 'bg-blue-500' },
                  { status: 'confirmed' as BillStatus, label: 'ยืนยันแล้ว', color: 'bg-cyan-500' },
                  { status: 'pending' as BillStatus, label: 'รอชำระเงิน', color: 'bg-yellow-500' },
                  { status: 'cancelled' as BillStatus, label: 'ยกเลิก', color: 'bg-red-500' },
                ].map(({ status, label, color }) => {
                  const count = statusCounts[status];
                  const percent = bills.length > 0 ? (count / bills.length) * 100 : 0;
                  return (
                    <div key={status} className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${color}`} />
                      <span className="text-sm text-secondary w-28">{label}</span>
                      <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${color} rounded-full transition-all duration-500`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-primary w-12 text-right">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 pt-4 border-t border-default">
                <div className="flex justify-between text-sm">
                  <span className="text-secondary">ทั้งหมด</span>
                  <span className="font-semibold text-primary">{bills.length} ออเดอร์</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-secondary">อัตราสำเร็จ</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    {bills.length > 0 
                      ? Math.round((statusCounts.completed / bills.length) * 100) 
                      : 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Stats */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Top Services */}
            <div className="bg-surface rounded-xl border border-default p-5">
              <h3 className="font-semibold text-primary mb-4">บริการยอดนิยม</h3>
              {topServices.length > 0 ? (
                <div className="space-y-3">
                  {topServices.map(([name, data], index) => (
                    <div key={name} className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                        index === 0 ? 'bg-yellow-500' : 
                        index === 1 ? 'bg-gray-400' : 
                        index === 2 ? 'bg-amber-600' : 'bg-gray-300'
                      }`}>
                        {index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-primary truncate">{name}</p>
                        <p className="text-xs text-secondary">{data.count} ออเดอร์</p>
                      </div>
                      <span className="text-sm font-semibold text-primary">
                        ฿{data.revenue.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-secondary text-center py-8">
                  ยังไม่มีข้อมูล
                </p>
              )}
            </div>

            {/* Store Rating */}
            <div className="bg-surface rounded-xl border border-default p-5">
              <h3 className="font-semibold text-primary mb-4">คะแนนร้านค้า</h3>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-4xl font-bold text-primary">
                    {ratingSummary?.averageRating.toFixed(1) || '0.0'}
                  </span>
                  <StarIcon />
                </div>
                <p className="text-sm text-secondary mb-4">
                  จาก {ratingSummary?.totalReviews || 0} รีวิว
                </p>
                
                {/* Rating Distribution */}
                <div className="space-y-1.5">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = ratingSummary?.distribution[star as 1|2|3|4|5] || 0;
                    const percent = ratingSummary?.totalReviews 
                      ? (count / ratingSummary.totalReviews) * 100 
                      : 0;
                    return (
                      <div key={star} className="flex items-center gap-2 text-xs">
                        <span className="w-3 text-secondary">{star}</span>
                        <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-yellow-400 rounded-full"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <span className="w-8 text-secondary text-right">{count}</span>
                      </div>
                    );
                  })}
                </div>

                {ratingSummary && ratingSummary.totalReviews > 0 && (
                  <div className="mt-4 pt-4 border-t border-default">
                    <div className="text-center">
                      <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {ratingSummary.positiveReviewsPercent}%
                      </span>
                      <p className="text-xs text-secondary mt-1">รีวิวเชิงบวก (4-5 ดาว)</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-surface rounded-xl border border-default p-5">
              <h3 className="font-semibold text-primary mb-4">สรุปข้อมูล</h3>
              <div className="space-y-4">
                <StatItem
                  label="ยอดเฉลี่ยต่อออเดอร์"
                  value={`฿${Math.round(avgOrderValue).toLocaleString()}`}
                />
                <StatItem
                  label="อัตรากำไร"
                  value={`${totalRevenue > 0 ? Math.round((totalProfit / totalRevenue) * 100) : 0}%`}
                />
                <StatItem
                  label="ลูกค้าใหม่เดือนนี้"
                  value={`${clientSummary?.new || 0} คน`}
                />
                <StatItem
                  label="คูปองที่ใช้งานได้"
                  value={`${promotionSummary?.activeCoupons || 0} รายการ`}
                />
                <StatItem
                  label="Flash Sale กำลังเปิด"
                  value={`${promotionSummary?.activeFlashSales || 0} รายการ`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
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
  trend,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  color: string;
  trend?: number;
}) {
  return (
    <div className="bg-surface rounded-xl border border-default p-4 lg:p-5">
      <div className="flex items-start justify-between">
        <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center`}>
          {icon}
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-medium ${
            trend >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
          }`}>
            {trend >= 0 ? <TrendUpIcon /> : <TrendDownIcon />}
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <p className="text-sm text-secondary mt-3">{label}</p>
      <p className="text-2xl lg:text-3xl font-bold text-primary">
        {prefix}{value.toLocaleString()}{suffix}
      </p>
    </div>
  );
}

// Stat Item Component
function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-secondary">{label}</span>
      <span className="text-sm font-semibold text-primary">{value}</span>
    </div>
  );
}

