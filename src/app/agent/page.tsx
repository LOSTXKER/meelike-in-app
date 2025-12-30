"use client";

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { AgentHeader, StatCard, BillStatusBadge } from './components';
import type { AgentDashboardStats, Bill } from '@/app/types';
import { getBillSummary, getRecentBills, getRevenueByPeriod, getBillCountByPeriod } from '@/app/utils/storage/bills';
import { getClientSummary } from '@/app/utils/storage/clients';

// Icons
const BillIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const RevenueIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ProfitIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const ClientsIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const AGENT_ID = 'demo_agent'; // TODO: Get from auth

export default function AgentDashboardPage() {
  const [stats, setStats] = useState<AgentDashboardStats | null>(null);
  const [recentBills, setRecentBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(() => {
    setLoading(true);
    try {
      // Get bill summary
      const billSummary = getBillSummary(AGENT_ID);
      
      // Get client summary
      const clientSummary = getClientSummary(AGENT_ID);
      
      // Get revenue by period
      const todayRevenue = getRevenueByPeriod(AGENT_ID, 'today');
      const monthRevenue = getRevenueByPeriod(AGENT_ID, 'month');
      const allTimeRevenue = getRevenueByPeriod(AGENT_ID, 'all');
      
      // Get bill counts
      const todayBills = getBillCountByPeriod(AGENT_ID, 'today');
      const monthBills = getBillCountByPeriod(AGENT_ID, 'month');
      
      // Get recent bills
      const recent = getRecentBills(AGENT_ID, 5);
      setRecentBills(recent);
      
      // Build stats
      const dashboardStats: AgentDashboardStats = {
        today: {
          bills: todayBills,
          revenue: todayRevenue.revenue,
          profit: todayRevenue.profit,
          newClients: 0, // TODO: Track new clients by day
        },
        thisMonth: {
          bills: monthBills,
          revenue: monthRevenue.revenue,
          profit: monthRevenue.profit,
          newClients: clientSummary.new,
          avgOrderValue: monthBills > 0 ? Math.round(monthRevenue.revenue / monthBills) : 0,
        },
        allTime: {
          bills: billSummary.total,
          revenue: allTimeRevenue.revenue,
          profit: allTimeRevenue.profit,
          totalClients: clientSummary.total,
        },
        pending: {
          pendingBills: billSummary.pending,
          processingBills: billSummary.processing,
          unreadNotifications: 0,
          unrepliedReviews: 0,
        },
        recentBills: recent.map(bill => ({
          id: bill.billNumber || bill.id,
          clientName: bill.clientName,
          amount: bill.totalAmount,
          status: bill.status,
          createdAt: bill.createdAt,
        })),
      };
      
      setStats(dashboardStats);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Format time ago
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'เมื่อสักครู่';
    if (minutes < 60) return `${minutes} นาทีที่แล้ว`;
    if (hours < 24) return `${hours} ชั่วโมงที่แล้ว`;
    return `${days} วันที่แล้ว`;
  };

  if (loading || !stats) {
    return (
      <>
        <AgentHeader
          title="Dashboard"
          subtitle="ภาพรวมการดำเนินงานของคุณ"
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <AgentHeader
        title="Dashboard"
        subtitle="ภาพรวมการดำเนินงานของคุณ"
      />

      <div className="flex-1 overflow-y-auto p-4 lg:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Pending Actions Alert */}
          {(stats.pending.pendingBills > 0 || stats.pending.unrepliedReviews > 0) && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-800/50 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-yellow-600 dark:text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-yellow-800 dark:text-yellow-200">รอดำเนินการ</p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-0.5">
                    คุณมี {stats.pending.pendingBills} บิลรอชำระเงิน
                    {stats.pending.processingBills > 0 && ` และ ${stats.pending.processingBills} บิลกำลังดำเนินการ`}
                  </p>
                </div>
                <Link
                  href="/agent/orders?status=pending"
                  className="text-sm font-medium text-brand-primary hover:underline"
                >
                  ดูทั้งหมด
                </Link>
              </div>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="รายได้วันนี้"
              value={formatCurrency(stats.today.revenue)}
              subtitle={`${stats.today.bills} ออเดอร์`}
              icon={<RevenueIcon />}
              variant="default"
            />
            <StatCard
              title="กำไรวันนี้"
              value={formatCurrency(stats.today.profit)}
              icon={<ProfitIcon />}
              variant="success"
            />
            <StatCard
              title="รายได้เดือนนี้"
              value={formatCurrency(stats.thisMonth.revenue)}
              subtitle={`${stats.thisMonth.bills} ออเดอร์`}
              icon={<BillIcon />}
            />
            <StatCard
              title="ลูกค้าทั้งหมด"
              value={stats.allTime.totalClients}
              subtitle={`+${stats.thisMonth.newClients} ใหม่`}
              icon={<ClientsIcon />}
              variant="info"
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Bills */}
            <div className="lg:col-span-2 bg-surface dark:bg-dark-surface rounded-xl border border-default">
              <div className="flex items-center justify-between px-5 py-4 border-b border-default">
                <h2 className="font-semibold text-primary">บิลล่าสุด</h2>
                <Link
                  href="/agent/orders"
                  className="flex items-center gap-1 text-sm font-medium text-brand-primary hover:underline"
                >
                  ดูทั้งหมด
                  <ArrowRightIcon />
                </Link>
              </div>
              {stats.recentBills.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-secondary">ยังไม่มีบิล</p>
                  <Link
                    href="/agent/orders/new"
                    className="inline-block mt-2 text-sm font-medium text-brand-primary hover:underline"
                  >
                    สร้างบิลใหม่
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-default">
                  {stats.recentBills.map((bill) => (
                    <Link
                      key={bill.id}
                      href={`/agent/orders/${bill.id}`}
                      className="flex items-center justify-between px-5 py-3 hover:bg-hover transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-semibold">
                          {bill.clientName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-primary">{bill.clientName}</p>
                          <p className="text-xs text-tertiary">{bill.id} • {formatTimeAgo(bill.createdAt)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-primary">{formatCurrency(bill.amount)}</p>
                        <BillStatusBadge status={bill.status as Bill['status']} size="sm" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Stats / Pending */}
            <div className="space-y-4">
              {/* Pending Bills */}
              <div className="bg-surface dark:bg-dark-surface rounded-xl border border-default p-5">
                <h3 className="font-semibold text-primary mb-4">สถานะบิล</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                      <span className="text-sm text-secondary">รอชำระเงิน</span>
                    </div>
                    <span className="font-semibold text-primary">{stats.pending.pendingBills}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                      <span className="text-sm text-secondary">กำลังดำเนินการ</span>
                    </div>
                    <span className="font-semibold text-primary">{stats.pending.processingBills}</span>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-gradient-to-br from-brand-primary to-brand-primary/80 rounded-xl p-5 text-white">
                <h3 className="font-semibold mb-4">สรุปทั้งหมด</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-white/80">รายได้รวม</span>
                    <span className="font-bold">{formatCurrency(stats.allTime.revenue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/80">กำไรรวม</span>
                    <span className="font-bold">{formatCurrency(stats.allTime.profit)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/80">บิลทั้งหมด</span>
                    <span className="font-bold">{stats.allTime.bills}</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-surface dark:bg-dark-surface rounded-xl border border-default p-5">
                <h3 className="font-semibold text-primary mb-4">ทางลัด</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/agent/orders/new"
                    className="flex flex-col items-center gap-2 p-3 rounded-lg bg-hover hover:bg-brand-primary/10 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-full bg-brand-primary/10 group-hover:bg-brand-primary/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <span className="text-xs font-medium text-secondary group-hover:text-primary">สร้างบิล</span>
                  </Link>
                  <Link
                    href="/agent/clients"
                    className="flex flex-col items-center gap-2 p-3 rounded-lg bg-hover hover:bg-brand-primary/10 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-full bg-brand-primary/10 group-hover:bg-brand-primary/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>
                    </div>
                    <span className="text-xs font-medium text-secondary group-hover:text-primary">จัดการลูกค้า</span>
                  </Link>
                  <Link
                    href="/agent/store"
                    className="flex flex-col items-center gap-2 p-3 rounded-lg bg-hover hover:bg-brand-primary/10 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-full bg-brand-primary/10 group-hover:bg-brand-primary/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <span className="text-xs font-medium text-secondary group-hover:text-primary">จัดการร้าน</span>
                  </Link>
                  <Link
                    href="/agent/analytics"
                    className="flex flex-col items-center gap-2 p-3 rounded-lg bg-hover hover:bg-brand-primary/10 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-full bg-brand-primary/10 group-hover:bg-brand-primary/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <span className="text-xs font-medium text-secondary group-hover:text-primary">ดูสถิติ</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
