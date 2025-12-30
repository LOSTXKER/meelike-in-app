"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { AgentHeader, BillStatusBadge } from '../components';
import type { Bill, BillStatus, BillSummary } from '@/app/types/bill';
import { queryBills, getBillSummary } from '@/app/utils/storage/bills';

// Icons
const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const EmptyIcon = () => (
  <svg className="w-8 h-8 text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

// Status tabs
const statusTabs: { key: BillStatus | 'all'; label: string; color: string }[] = [
  { key: 'all', label: 'ทั้งหมด', color: '' },
  { key: 'pending', label: 'รอชำระ', color: 'bg-yellow-500' },
  { key: 'confirmed', label: 'รอดำเนินการ', color: 'bg-blue-500' },
  { key: 'processing', label: 'กำลังทำ', color: 'bg-purple-500' },
  { key: 'completed', label: 'สำเร็จ', color: 'bg-green-500' },
  { key: 'cancelled', label: 'ยกเลิก', color: 'bg-red-500' },
];

const AGENT_ID = 'demo_agent'; // TODO: Get from auth

export default function OrdersPage() {
  const searchParams = useSearchParams();
  const initialStatus = (searchParams.get('status') as BillStatus | 'all') || 'all';
  const clientFilter = searchParams.get('client') || undefined;
  
  const [activeStatus, setActiveStatus] = useState<BillStatus | 'all'>(initialStatus);
  const [searchQuery, setSearchQuery] = useState('');
  const [bills, setBills] = useState<Bill[]>([]);
  const [summary, setSummary] = useState<BillSummary>({
    total: 0,
    pending: 0,
    confirmed: 0,
    processing: 0,
    completed: 0,
    cancelled: 0,
    totalRevenue: 0,
    totalProfit: 0,
    totalCost: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load data
  useEffect(() => {
    loadData();
  }, [activeStatus, searchQuery, clientFilter]);

  const loadData = useCallback(() => {
    setIsLoading(true);
    try {
      const filter = {
        status: activeStatus !== 'all' ? activeStatus : undefined,
        search: searchQuery || undefined,
        clientId: clientFilter,
      };
      const allBills = queryBills(AGENT_ID, filter);
      const billSummary = getBillSummary(AGENT_ID);
      
      setBills(allBills);
      setSummary(billSummary);
    } finally {
      setIsLoading(false);
    }
  }, [activeStatus, searchQuery, clientFilter]);

  // Get status counts
  const statusCounts = useMemo(() => {
    return {
      all: summary.total,
      pending: summary.pending,
      confirmed: summary.confirmed,
      processing: summary.processing,
      completed: summary.completed,
      cancelled: summary.cancelled,
    };
  }, [summary]);

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      <AgentHeader
        title="บิล/ออเดอร์"
        subtitle="จัดการบิลและออเดอร์ของลูกค้า"
      />

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 lg:p-6">
          {/* Actions Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="flex-1 relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-tertiary">
                <SearchIcon />
              </span>
              <input
                type="text"
                placeholder="ค้นหาบิล, ลูกค้า, บริการ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-surface dark:bg-dark-surface border border-default rounded-lg text-sm focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary outline-none transition-colors"
              />
            </div>
            
            {/* Create Button */}
            <Link
              href="/agent/orders/new"
              className="flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-primary/90 text-white font-medium py-2.5 px-5 rounded-lg transition-colors"
            >
              <PlusIcon />
              <span>สร้างบิลใหม่</span>
            </Link>
          </div>

          {/* Status Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide">
            {statusTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveStatus(tab.key)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors
                  ${activeStatus === tab.key
                    ? 'bg-brand-primary text-white'
                    : 'bg-surface dark:bg-dark-surface border border-default text-secondary hover:bg-hover'
                  }
                `}
              >
                {tab.color && (
                  <span className={`w-2 h-2 rounded-full ${tab.color}`}></span>
                )}
                <span>{tab.label}</span>
                <span className={`
                  px-1.5 py-0.5 rounded text-xs
                  ${activeStatus === tab.key
                    ? 'bg-white/20 text-white'
                    : 'bg-hover text-tertiary'
                  }
                `}>
                  {statusCounts[tab.key] || 0}
                </span>
              </button>
            ))}
          </div>

          {/* Bills Table */}
          <div className="bg-surface dark:bg-dark-surface rounded-xl border border-default overflow-hidden">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
              </div>
            ) : bills.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-hover flex items-center justify-center">
                  <EmptyIcon />
                </div>
                <p className="text-secondary font-medium">ไม่พบบิล</p>
                <p className="text-tertiary text-sm mt-1">
                  {searchQuery || activeStatus !== 'all'
                    ? 'ลองเปลี่ยนตัวกรองหรือค้นหาใหม่'
                    : 'กด "สร้างบิลใหม่" เพื่อเริ่มต้น'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-hover">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-secondary uppercase tracking-wider">
                        บิล
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-secondary uppercase tracking-wider">
                        ลูกค้า
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-secondary uppercase tracking-wider">
                        บริการ
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-secondary uppercase tracking-wider">
                        สถานะ
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-secondary uppercase tracking-wider">
                        ยอดเงิน
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-secondary uppercase tracking-wider">
                        กำไร
                      </th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-default">
                    {bills.map((bill) => (
                      <tr key={bill.id} className="hover:bg-hover transition-colors">
                        <td className="px-4 py-4">
                          <Link href={`/agent/orders/${bill.id}`} className="group">
                            <p className="font-mono text-sm font-semibold text-brand-primary group-hover:underline">
                              {bill.billNumber || bill.id}
                            </p>
                            <p className="text-xs text-tertiary mt-0.5">
                              {formatDate(bill.createdAt)}
                            </p>
                          </Link>
                        </td>
                        <td className="px-4 py-4">
                          <p className="font-medium text-primary">{bill.clientName}</p>
                          <p className="text-xs text-tertiary">{bill.clientContact}</p>
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-sm text-primary truncate max-w-xs">
                            {bill.items[0]?.serviceName}
                          </p>
                          {bill.items.length > 1 && (
                            <p className="text-xs text-tertiary">
                              +{bill.items.length - 1} รายการ
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <BillStatusBadge status={bill.status} />
                        </td>
                        <td className="px-4 py-4 text-right">
                          <p className="font-semibold text-primary">
                            {formatCurrency(bill.totalAmount)}
                          </p>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <p className={`font-semibold ${bill.status === 'cancelled' ? 'text-tertiary' : 'text-green-600 dark:text-green-400'}`}>
                            {bill.status === 'cancelled' ? '-' : formatCurrency(bill.totalProfit)}
                          </p>
                        </td>
                        <td className="px-4 py-4">
                          <Link
                            href={`/agent/orders/${bill.id}`}
                            className="text-brand-primary hover:underline text-sm font-medium"
                          >
                            ดู
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Summary Footer */}
          {bills.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-secondary">
              <span>รวม {bills.length} รายการ</span>
              <span>|</span>
              <span>รายได้รวม: <span className="font-semibold text-primary">{formatCurrency(summary.totalRevenue)}</span></span>
              <span>|</span>
              <span>กำไรรวม: <span className="font-semibold text-green-600 dark:text-green-400">{formatCurrency(summary.totalProfit)}</span></span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
