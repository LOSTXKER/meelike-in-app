// src/app/agent/clients/[id]/page.tsx
"use client";

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Client } from '@/app/types/client';
import type { Bill } from '@/app/types/bill';
import { getSegmentLabel, getSegmentColor, getLoyaltyTierLabel, getLoyaltyTierColor, getOrdersForNextTier } from '@/app/types/client';
import { getBillStatusLabel, getBillStatusColor } from '@/app/types/bill';
import { getClientById, deleteClient, addClientTag, removeClientTag } from '@/app/utils/storage/clients';
import { getBillsByClient } from '@/app/utils/storage/bills';

// ==============================================
// ICONS
// ==============================================
const ArrowLeftIcon = () => (
  <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
  </svg>
);

const PencilIcon = () => (
  <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.58.22-2.365.468a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4.5a.75.75 0 01.75.75v8.5a.75.75 0 01-1.5 0v-8.5A.75.75 0 0110 4.5z" clipRule="evenodd" />
  </svg>
);

const PlusIcon = () => (
  <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
  </svg>
);

const CrownIcon = () => (
  <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 1a.75.75 0 01.65.375l2.003 3.428 3.927.571a.75.75 0 01.416 1.279l-2.842 2.772.67 3.915a.75.75 0 01-1.088.791L10 12.347l-3.735 1.964a.75.75 0 01-1.088-.79l.67-3.916-2.842-2.772a.75.75 0 01.416-1.28l3.927-.57L10.35 1.375A.75.75 0 0110 1z" clipRule="evenodd" />
  </svg>
);

const StarIcon = () => (
  <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" />
  </svg>
);

const SparklesIcon = () => (
  <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path d="M10 1a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 1zM5.05 3.05a.75.75 0 011.06 0l1.062 1.06A.75.75 0 016.11 5.173L5.05 4.11a.75.75 0 010-1.06zM13.828 4.11a.75.75 0 00-1.06 1.06l1.06 1.06a.75.75 0 001.06-1.06l-1.06-1.06zM10 7a3 3 0 100 6 3 3 0 000-6zM1 10a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5A.75.75 0 011 10zM16.75 9.25a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5h-1.5z" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
  </svg>
);

const TagIcon = () => (
  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M5.5 3A2.5 2.5 0 003 5.5v2.879a2.5 2.5 0 00.732 1.767l6.5 6.5a2.5 2.5 0 003.536 0l2.878-2.878a2.5 2.5 0 000-3.536l-6.5-6.5A2.5 2.5 0 008.38 3H5.5zM6 7a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
  </svg>
);

const XMarkIcon = () => (
  <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
  </svg>
);

const PhoneIcon = () => (
  <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M2 3.5A1.5 1.5 0 013.5 2h1.148a1.5 1.5 0 011.465 1.175l.716 3.223a1.5 1.5 0 01-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 006.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 011.767-1.052l3.223.716A1.5 1.5 0 0118 15.352V16.5a1.5 1.5 0 01-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 012.43 8.326 13.019 13.019 0 012 5V3.5z" clipRule="evenodd" />
  </svg>
);

const EnvelopeIcon = () => (
  <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
    <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
  </svg>
);

const DocumentTextIcon = () => (
  <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M4.5 2A1.5 1.5 0 003 3.5v13A1.5 1.5 0 004.5 18h11a1.5 1.5 0 001.5-1.5V7.621a1.5 1.5 0 00-.44-1.06l-4.12-4.122A1.5 1.5 0 0011.378 2H4.5zm2.25 8.5a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5zm0 3a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5z" clipRule="evenodd" />
  </svg>
);

// ==============================================
// HELPER FUNCTIONS
// ==============================================
type ClientSegment = 'vip' | 'regular' | 'new' | 'inactive';

function SegmentIcon({ segment }: { segment: ClientSegment }) {
  switch (segment) {
    case 'vip':
      return <CrownIcon />;
    case 'regular':
      return <StarIcon />;
    case 'new':
      return <SparklesIcon />;
    case 'inactive':
      return <ClockIcon />;
  }
}

// ==============================================
// MAIN PAGE
// ==============================================
const AGENT_ID = 'demo_agent'; // TODO: Get from auth

export default function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [client, setClient] = useState<Client | null>(null);
  const [bills, setBills] = useState<Bill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newTag, setNewTag] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    loadData();
  }, [resolvedParams.id]);

  const loadData = () => {
    setIsLoading(true);
    try {
      const clientData = getClientById(AGENT_ID, resolvedParams.id);
      if (clientData) {
        setClient(clientData);
        const clientBills = getBillsByClient(AGENT_ID, clientData.id);
        setBills(clientBills);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTag = () => {
    if (!newTag.trim() || !client) return;
    const updated = addClientTag(AGENT_ID, client.id, newTag.trim());
    if (updated) {
      setClient(updated);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    if (!client) return;
    const updated = removeClientTag(AGENT_ID, client.id, tag);
    if (updated) {
      setClient(updated);
    }
  };

  const handleDelete = () => {
    if (!client) return;
    deleteClient(AGENT_ID, client.id);
    router.push('/agent/clients');
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return `฿${amount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="text-center py-12">
        <p className="text-secondary dark:text-dark-text-light mb-4">ไม่พบข้อมูลลูกค้า</p>
        <Link href="/agent/clients" className="text-brand-primary hover:underline">
          กลับไปหน้ารายชื่อลูกค้า
        </Link>
      </div>
    );
  }

  const ordersForNextTier = getOrdersForNextTier(client.loyaltyTier, client.totalOrders);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/agent/clients"
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeftIcon />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-primary dark:text-dark-text-dark">{client.name}</h1>
            <p className="text-secondary dark:text-dark-text-light">รายละเอียดลูกค้า</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/agent/clients/${client.id}/edit`}
            className="inline-flex items-center gap-2 px-4 py-2 border border-default dark:border-dark-border rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <PencilIcon />
            แก้ไข
          </Link>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
          >
            <TrashIcon />
            ลบ
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Client Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info Card */}
          <div className="bg-surface dark:bg-dark-surface rounded-xl p-6 border border-default dark:border-dark-border">
            <h2 className="text-lg font-bold mb-4 text-primary dark:text-dark-text-dark">ข้อมูลลูกค้า</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                  <PhoneIcon />
                </div>
                <div>
                  <p className="text-sm text-secondary dark:text-dark-text-light">ข้อมูลติดต่อ</p>
                  <p className="font-medium text-primary dark:text-dark-text-dark">{client.contact}</p>
                </div>
              </div>
              {client.email && (
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400">
                    <EnvelopeIcon />
                  </div>
                  <div>
                    <p className="text-sm text-secondary dark:text-dark-text-light">Email</p>
                    <p className="font-medium text-primary dark:text-dark-text-dark">{client.email}</p>
                  </div>
                </div>
              )}
            </div>
            {client.note && (
              <div className="mt-4 p-4 bg-main dark:bg-dark-bg rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <DocumentTextIcon />
                  <p className="text-sm font-medium text-primary dark:text-dark-text-dark">หมายเหตุ</p>
                </div>
                <p className="text-secondary dark:text-dark-text-light">{client.note}</p>
              </div>
            )}
          </div>

          {/* Tags Card */}
          <div className="bg-surface dark:bg-dark-surface rounded-xl p-6 border border-default dark:border-dark-border">
            <h2 className="text-lg font-bold mb-4 text-primary dark:text-dark-text-dark flex items-center gap-2">
              <TagIcon />
              Tags
            </h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {client.tags.length === 0 ? (
                <p className="text-sm text-secondary dark:text-dark-text-light">ยังไม่มี tags</p>
              ) : (
                client.tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-full bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                  >
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-red-500 transition-colors ml-1"
                    >
                      <XMarkIcon />
                    </button>
                  </span>
                ))
              )}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="เพิ่ม tag ใหม่..."
                className="flex-1 bg-main dark:bg-dark-bg border border-default dark:border-dark-border rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <button
                onClick={handleAddTag}
                className="inline-flex items-center gap-1 px-4 py-2 bg-brand-primary text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
              >
                <PlusIcon />
                เพิ่ม
              </button>
            </div>
          </div>

          {/* Order History */}
          <div className="bg-surface dark:bg-dark-surface rounded-xl p-6 border border-default dark:border-dark-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-primary dark:text-dark-text-dark">ประวัติออเดอร์</h2>
              <Link
                href={`/agent/orders/new?client=${client.id}`}
                className="text-sm text-brand-primary hover:underline"
              >
                + สร้างบิลใหม่
              </Link>
            </div>
            {bills.length === 0 ? (
              <p className="text-center py-8 text-secondary dark:text-dark-text-light">
                ยังไม่มีประวัติออเดอร์
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-default dark:divide-dark-border">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-bold uppercase">หมายเลขบิล</th>
                      <th className="px-4 py-2 text-left text-xs font-bold uppercase">วันที่</th>
                      <th className="px-4 py-2 text-right text-xs font-bold uppercase">ยอดรวม</th>
                      <th className="px-4 py-2 text-center text-xs font-bold uppercase">สถานะ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-default dark:divide-dark-border">
                    {bills.slice(0, 5).map(bill => (
                      <tr key={bill.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="px-4 py-3">
                          <Link
                            href={`/agent/orders/${bill.id}`}
                            className="font-medium text-brand-primary hover:underline"
                          >
                            {bill.billNumber}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-sm text-secondary dark:text-dark-text-light">
                          {formatDate(bill.createdAt)}
                        </td>
                        <td className="px-4 py-3 text-right font-medium">
                          {formatCurrency(bill.totalAmount)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${getBillStatusColor(bill.status)}`}>
                            {getBillStatusLabel(bill.status)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {bills.length > 5 && (
              <div className="mt-4 text-center">
                <Link
                  href={`/agent/orders?client=${client.id}`}
                  className="text-sm text-brand-primary hover:underline"
                >
                  ดูทั้งหมด ({bills.length} รายการ)
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Stats */}
        <div className="space-y-6">
          {/* Segment & Loyalty Card */}
          <div className="bg-surface dark:bg-dark-surface rounded-xl p-6 border border-default dark:border-dark-border">
            <h2 className="text-lg font-bold mb-4 text-primary dark:text-dark-text-dark">สถานะลูกค้า</h2>
            
            {/* Segment */}
            <div className="mb-4">
              <p className="text-sm text-secondary dark:text-dark-text-light mb-2">กลุ่มลูกค้า</p>
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${getSegmentColor(client.segment)}`}>
                <SegmentIcon segment={client.segment} />
                <span className="font-medium">{getSegmentLabel(client.segment)}</span>
              </div>
            </div>
            
            {/* Loyalty Tier */}
            <div className="mb-4">
              <p className="text-sm text-secondary dark:text-dark-text-light mb-2">ระดับ Loyalty</p>
              {client.loyaltyTier !== 'none' ? (
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${getLoyaltyTierColor(client.loyaltyTier)}`}>
                  <span className="font-medium">{getLoyaltyTierLabel(client.loyaltyTier)}</span>
                  {client.loyaltyDiscount > 0 && (
                    <span className="text-sm">({client.loyaltyDiscount}% off)</span>
                  )}
                </div>
              ) : (
                <p className="text-sm text-secondary dark:text-dark-text-light">ยังไม่มีระดับ</p>
              )}
            </div>
            
            {/* Progress to next tier */}
            {ordersForNextTier !== null && (
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  อีก {ordersForNextTier} ออเดอร์ เพื่ออัพเกรดระดับ
                </p>
              </div>
            )}
          </div>

          {/* Stats Card */}
          <div className="bg-surface dark:bg-dark-surface rounded-xl p-6 border border-default dark:border-dark-border">
            <h2 className="text-lg font-bold mb-4 text-primary dark:text-dark-text-dark">สถิติ</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-secondary dark:text-dark-text-light">จำนวนออเดอร์</span>
                <span className="font-bold text-lg">{client.totalOrders}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-secondary dark:text-dark-text-light">ยอดซื้อรวม</span>
                <span className="font-bold text-lg text-green-600 dark:text-green-400">
                  {formatCurrency(client.totalSpent)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-secondary dark:text-dark-text-light">ค่าเฉลี่ย/ออเดอร์</span>
                <span className="font-medium">
                  {client.totalOrders > 0
                    ? formatCurrency(client.totalSpent / client.totalOrders)
                    : '-'}
                </span>
              </div>
              <hr className="border-default dark:border-dark-border" />
              <div className="flex justify-between items-center">
                <span className="text-secondary dark:text-dark-text-light">ซื้อล่าสุด</span>
                <span className="text-sm">{formatDate(client.lastOrderDate)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-secondary dark:text-dark-text-light">เป็นลูกค้าตั้งแต่</span>
                <span className="text-sm">{formatDate(client.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-surface dark:bg-dark-surface rounded-xl p-6 border border-default dark:border-dark-border">
            <h2 className="text-lg font-bold mb-4 text-primary dark:text-dark-text-dark">การกระทำด่วน</h2>
            <div className="space-y-2">
              <Link
                href={`/agent/orders/new?client=${client.id}`}
                className="block w-full py-2.5 text-center bg-brand-primary text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                สร้างบิลใหม่
              </Link>
              <Link
                href={`/agent/orders?client=${client.id}`}
                className="block w-full py-2.5 text-center border border-default dark:border-dark-border rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                ดูประวัติออเดอร์ทั้งหมด
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowDeleteModal(false)} />
          <div className="relative bg-surface dark:bg-dark-surface rounded-xl p-6 w-full max-w-sm mx-4 shadow-xl border border-default dark:border-dark-border">
            <h3 className="text-lg font-bold mb-2 text-primary dark:text-dark-text-dark">ยืนยันการลบ</h3>
            <p className="text-secondary dark:text-dark-text-light mb-4">
              คุณต้องการลบ <span className="font-semibold">{client.name}</span> ใช่หรือไม่?
              <br />
              <span className="text-sm text-red-500">การกระทำนี้ไม่สามารถย้อนกลับได้</span>
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2.5 rounded-lg font-semibold border border-default dark:border-dark-border hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2.5 rounded-lg font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                ลบ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

