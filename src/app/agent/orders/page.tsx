"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { AgentHeader, BillStatusBadge } from '../components';
import type { Bill, BillStatus } from '@/app/types/bill';

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

const FilterIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);

// Status tabs
const statusTabs: { key: BillStatus | 'all'; label: string; color: string }[] = [
  { key: 'all', label: 'ทั้งหมด', color: '' },
  { key: 'pending', label: 'รอชำระ', color: 'bg-warning' },
  { key: 'confirmed', label: 'รอดำเนินการ', color: 'bg-info' },
  { key: 'processing', label: 'กำลังทำ', color: 'bg-purple-500' },
  { key: 'completed', label: 'สำเร็จ', color: 'bg-success' },
  { key: 'cancelled', label: 'ยกเลิก', color: 'bg-error' },
];

// Mock bills data
const mockBills: Bill[] = [
  {
    id: 'BILL-12345',
    agentId: 'agent_1',
    agentUsername: 'demo',
    clientId: 'client_1',
    clientName: 'ร้านกาแฟ A',
    clientContact: '081-234-5678',
    items: [{
      id: 'item_1',
      serviceId: 1,
      serviceName: 'เพิ่มไลค์โพสต์ Facebook (คนไทย)',
      category: 'Facebook',
      link: 'https://facebook.com/post/123',
      quantity: 1000,
      unitCost: 0.08,
      baseCost: 80,
      agentDiscount: 0,
      actualCost: 80,
      salePrice: 150,
      profit: 70,
      profitMargin: 46.67,
    }],
    subtotal: 150,
    totalCost: 80,
    totalProfit: 70,
    totalAmount: 150,
    status: 'pending',
    source: 'store',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'BILL-12344',
    agentId: 'agent_1',
    agentUsername: 'demo',
    clientName: 'คุณ B',
    clientContact: '092-345-6789',
    items: [{
      id: 'item_2',
      serviceId: 2,
      serviceName: 'เพิ่มผู้ติดตาม Instagram',
      category: 'Instagram',
      link: 'https://instagram.com/user_b',
      quantity: 500,
      unitCost: 0.15,
      baseCost: 75,
      agentDiscount: 0,
      actualCost: 75,
      salePrice: 150,
      profit: 75,
      profitMargin: 50,
    }],
    subtotal: 150,
    totalCost: 75,
    totalProfit: 75,
    totalAmount: 150,
    status: 'processing',
    source: 'manual',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    confirmedAt: new Date(Date.now() - 3000000).toISOString(),
    startedAt: new Date(Date.now() - 2400000).toISOString(),
  },
  {
    id: 'BILL-12343',
    agentId: 'agent_1',
    agentUsername: 'demo',
    clientId: 'client_2',
    clientName: 'ร้านเสื้อผ้า C',
    clientContact: '083-456-7890',
    items: [{
      id: 'item_3',
      serviceId: 3,
      serviceName: 'เพิ่มวิว TikTok',
      category: 'TikTok',
      link: 'https://tiktok.com/@shop_c/video/123',
      quantity: 10000,
      unitCost: 0.02,
      baseCost: 200,
      agentDiscount: 0,
      actualCost: 200,
      salePrice: 450,
      profit: 250,
      profitMargin: 55.56,
    }],
    subtotal: 450,
    totalCost: 200,
    totalProfit: 250,
    totalAmount: 450,
    status: 'completed',
    source: 'store',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    confirmedAt: new Date(Date.now() - 82800000).toISOString(),
    startedAt: new Date(Date.now() - 79200000).toISOString(),
    completedAt: new Date(Date.now() - 43200000).toISOString(),
  },
  {
    id: 'BILL-12342',
    agentId: 'agent_1',
    agentUsername: 'demo',
    clientName: 'คุณ D',
    clientContact: 'line_id_d',
    items: [{
      id: 'item_4',
      serviceId: 1,
      serviceName: 'เพิ่มไลค์โพสต์ Facebook (คนไทย)',
      category: 'Facebook',
      link: 'https://facebook.com/post/456',
      quantity: 500,
      unitCost: 0.08,
      baseCost: 40,
      agentDiscount: 0,
      actualCost: 40,
      salePrice: 80,
      profit: 40,
      profitMargin: 50,
    }],
    subtotal: 80,
    totalCost: 40,
    totalProfit: 40,
    totalAmount: 80,
    status: 'confirmed',
    source: 'manual',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    confirmedAt: new Date(Date.now() - 169200000).toISOString(),
  },
  {
    id: 'BILL-12341',
    agentId: 'agent_1',
    agentUsername: 'demo',
    clientName: 'ร้านขนม E',
    clientContact: '084-567-8901',
    items: [{
      id: 'item_5',
      serviceId: 4,
      serviceName: 'เพิ่มสมาชิก YouTube',
      category: 'YouTube',
      link: 'https://youtube.com/channel/123',
      quantity: 100,
      unitCost: 3,
      baseCost: 300,
      agentDiscount: 0,
      actualCost: 300,
      salePrice: 500,
      profit: 200,
      profitMargin: 40,
    }],
    subtotal: 500,
    totalCost: 300,
    totalProfit: 200,
    totalAmount: 500,
    status: 'cancelled',
    source: 'store',
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    cancelledAt: new Date(Date.now() - 172800000).toISOString(),
    cancellationReason: 'ลูกค้าขอยกเลิก',
  },
];

export default function OrdersPage() {
  const searchParams = useSearchParams();
  const initialStatus = (searchParams.get('status') as BillStatus | 'all') || 'all';
  
  const [activeStatus, setActiveStatus] = useState<BillStatus | 'all'>(initialStatus);
  const [searchQuery, setSearchQuery] = useState('');
  const [bills] = useState<Bill[]>(mockBills);

  // Filter bills
  const filteredBills = useMemo(() => {
    return bills.filter(bill => {
      // Status filter
      if (activeStatus !== 'all' && bill.status !== activeStatus) {
        return false;
      }
      
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          bill.id.toLowerCase().includes(query) ||
          bill.clientName.toLowerCase().includes(query) ||
          bill.clientContact.toLowerCase().includes(query) ||
          bill.items.some(item => item.serviceName.toLowerCase().includes(query))
        );
      }
      
      return true;
    });
  }, [bills, activeStatus, searchQuery]);

  // Get status counts
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: bills.length };
    bills.forEach(bill => {
      counts[bill.status] = (counts[bill.status] || 0) + 1;
    });
    return counts;
  }, [bills]);

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
            {filteredBills.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-hover flex items-center justify-center">
                  <svg className="w-8 h-8 text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-secondary font-medium">ไม่พบบิล</p>
                <p className="text-tertiary text-sm mt-1">ลองเปลี่ยนตัวกรองหรือค้นหาใหม่</p>
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
                    {filteredBills.map((bill) => (
                      <tr key={bill.id} className="hover:bg-hover transition-colors">
                        <td className="px-4 py-4">
                          <Link href={`/agent/orders/${bill.id}`} className="group">
                            <p className="font-mono text-sm font-semibold text-brand-primary group-hover:underline">
                              {bill.id}
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
                          <p className={`font-semibold ${bill.status === 'cancelled' ? 'text-tertiary' : 'text-success'}`}>
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
        </div>
      </div>
    </>
  );
}

