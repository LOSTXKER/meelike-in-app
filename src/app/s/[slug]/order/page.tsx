// src/app/s/[slug]/order/page.tsx
// Public Store Order Page - ลูกค้าสั่งซื้อ
"use client";

import React, { useState, useEffect, use, useMemo } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import type { StoreSettings, StoreService } from '@/app/types/store';
import type { Bill, BillItem } from '@/app/types/bill';
import { generateBillId, generateBillNumber } from '@/app/types/bill';
import { getStoreByUsername, getStoreServiceById, updateStoreOrderStats, updateServiceSoldCount } from '@/app/utils/storage/stores';
import { saveBill } from '@/app/utils/storage/bills';
import { getOrCreateClient, updateClientOrderStats } from '@/app/utils/storage/clients';

// Icons
const ArrowLeftIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg className="w-16 h-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default function StoreOrderPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceId = searchParams.get('service');
  
  const [store, setStore] = useState<StoreSettings | null>(null);
  const [service, setService] = useState<StoreService | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [createdBill, setCreatedBill] = useState<Bill | null>(null);
  
  // Form state
  const [quantity, setQuantity] = useState('');
  const [link, setLink] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerContact, setCustomerContact] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    loadData();
  }, [resolvedParams.slug, serviceId]);

  const loadData = () => {
    setIsLoading(true);
    try {
      const storeData = getStoreByUsername(resolvedParams.slug);
      if (storeData && serviceId) {
        setStore(storeData);
        const serviceData = getStoreServiceById(storeData.agentId, serviceId);
        if (serviceData && serviceData.isActive) {
          setService(serviceData);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 2,
    }).format(value);
  };

  // Calculations
  const calculations = useMemo(() => {
    if (!service || !quantity) {
      return { total: 0, valid: false };
    }
    
    const qty = parseInt(quantity) || 0;
    const total = service.salePrice * qty;
    const valid = qty >= service.minQuantity && qty <= service.maxQuantity;
    
    return { total, qty, valid };
  }, [service, quantity]);

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!store || !service || !calculations.valid || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const qty = calculations.qty || 0;
      const total = calculations.total;
      
      // Create or get client
      const client = getOrCreateClient(store.agentId, customerName, customerContact);
      
      // Create bill item
      const billItem: BillItem = {
        id: `item_${Date.now()}`,
        serviceId: service.serviceId.toString(),
        serviceName: service.displayName || service.serviceName,
        quantity: qty,
        unitPrice: service.baseCost,
        sellPrice: service.salePrice,
        totalCost: service.baseCost * qty,
        totalSell: total,
        profit: total - (service.baseCost * qty),
        link,
        status: 'pending',
        progress: 0,
        currentCount: 0,
      };
      
      // Create bill
      const bill: Bill = {
        id: generateBillId(),
        billNumber: generateBillNumber(),
        agentId: store.agentId,
        clientId: client.id,
        clientName: customerName,
        clientContact: customerContact,
        items: [billItem],
        totalCost: billItem.totalCost,
        sellPrice: total,
        totalAmount: total,
        totalProfit: billItem.profit,
        status: 'pending',
        source: 'store',
        note: note || undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      saveBill(bill);
      
      // Update store stats
      updateStoreOrderStats(store.agentId, total);
      updateServiceSoldCount(store.agentId, service.id, qty);
      
      setCreatedBill(bill);
      setOrderSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-main dark:bg-dark-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  if (!store || !service) {
    return (
      <div className="min-h-screen bg-main dark:bg-dark-bg flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary mb-2">ไม่พบบริการ</h1>
          <p className="text-secondary mb-4">บริการนี้อาจถูกปิดหรือไม่มีอยู่</p>
          <Link
            href={`/s/${resolvedParams.slug}`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            <ArrowLeftIcon />
            กลับหน้าร้าน
          </Link>
        </div>
      </div>
    );
  }

  // Success page
  if (orderSuccess && createdBill) {
    return (
      <div className="min-h-screen bg-main dark:bg-dark-bg flex flex-col items-center justify-center p-4">
        <div className="bg-surface dark:bg-dark-surface rounded-xl p-8 max-w-md w-full text-center shadow-lg border border-default">
          <CheckCircleIcon />
          <h1 className="text-2xl font-bold text-primary mt-4">สั่งซื้อสำเร็จ!</h1>
          <p className="text-secondary mt-2">ออเดอร์ของคุณถูกสร้างเรียบร้อยแล้ว</p>
          
          <div className="mt-6 p-4 bg-hover rounded-lg text-left">
            <div className="flex justify-between mb-2">
              <span className="text-secondary">หมายเลขบิล</span>
              <span className="font-mono font-semibold text-brand-primary">{createdBill.billNumber}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-secondary">บริการ</span>
              <span className="font-medium">{service.displayName || service.serviceName}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-secondary">จำนวน</span>
              <span className="font-medium">{calculations.qty?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-default">
              <span className="text-secondary">ยอดชำระ</span>
              <span className="font-bold text-lg text-brand-primary">{formatCurrency(createdBill.totalAmount)}</span>
            </div>
          </div>
          
          {/* Payment Info */}
          {store.paymentInfo.length > 0 && (
            <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-left">
              <p className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">ช่องทางชำระเงิน</p>
              {store.paymentInfo.filter(m => m.isActive).map(method => (
                <div key={method.id} className="text-sm text-yellow-700 dark:text-yellow-300">
                  {method.type === 'bank' && (
                    <p>{method.bankName}: {method.accountNumber} ({method.accountName})</p>
                  )}
                  {method.type === 'promptpay' && (
                    <p>พร้อมเพย์: {method.phoneNumber}</p>
                  )}
                </div>
              ))}
              <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2">
                โอนแล้วแจ้งสลิปมาทาง LINE ได้เลยค่ะ
              </p>
            </div>
          )}
          
          <p className="text-sm text-tertiary mt-4">
            สามารถติดตามสถานะออเดอร์ได้ที่หน้าตรวจสอบออเดอร์
          </p>
          
          <div className="mt-6 space-y-2">
            <Link
              href={`/s/${resolvedParams.slug}/status?bill=${createdBill.billNumber}`}
              className="block w-full py-2.5 bg-brand-primary text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              ตรวจสอบสถานะ
            </Link>
            <Link
              href={`/s/${resolvedParams.slug}`}
              className="block w-full py-2.5 border border-default rounded-lg font-medium hover:bg-hover transition-colors"
            >
              กลับหน้าร้าน
            </Link>
          </div>
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
              <h1 className="font-bold text-lg text-primary">สั่งซื้อบริการ</h1>
              <p className="text-sm text-secondary">{store.storeName}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-lg mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Service Info */}
          <div className="bg-surface dark:bg-dark-surface rounded-xl border border-default p-4">
            <h2 className="font-semibold text-primary">{service.displayName || service.serviceName}</h2>
            {service.description && (
              <p className="text-sm text-secondary mt-1">{service.description}</p>
            )}
            <div className="flex items-center justify-between mt-3">
              <span className="text-sm text-tertiary">
                Min: {service.minQuantity.toLocaleString()} • Max: {service.maxQuantity.toLocaleString()}
              </span>
              <span className="font-bold text-brand-primary">{formatCurrency(service.salePrice)}/หน่วย</span>
            </div>
          </div>

          {/* Order Details */}
          <div className="bg-surface dark:bg-dark-surface rounded-xl border border-default p-5">
            <h3 className="font-semibold text-primary mb-4">รายละเอียดออเดอร์</h3>
            
            {/* Link */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-secondary mb-2">
                ลิงก์ <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://..."
                required
                className="w-full px-4 py-2.5 bg-main border border-default rounded-lg text-sm focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary outline-none"
              />
            </div>
            
            {/* Quantity */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-secondary mb-2">
                จำนวน <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder={`${service.minQuantity.toLocaleString()} - ${service.maxQuantity.toLocaleString()}`}
                min={service.minQuantity}
                max={service.maxQuantity}
                required
                className="w-full px-4 py-2.5 bg-main border border-default rounded-lg text-sm focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary outline-none"
              />
              {quantity && !calculations.valid && (
                <p className="text-xs text-red-500 mt-1">
                  จำนวนต้องอยู่ระหว่าง {service.minQuantity.toLocaleString()} - {service.maxQuantity.toLocaleString()}
                </p>
              )}
            </div>
            
            {/* Total */}
            {calculations.valid && (
              <div className="p-3 bg-brand-primary/10 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-primary">ยอดรวม</span>
                  <span className="text-xl font-bold text-brand-primary">{formatCurrency(calculations.total)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Customer Info */}
          <div className="bg-surface dark:bg-dark-surface rounded-xl border border-default p-5">
            <h3 className="font-semibold text-primary mb-4">ข้อมูลผู้สั่ง</h3>
            
            {/* Name */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-secondary mb-2">
                ชื่อ-นามสกุล / ชื่อร้าน <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="ชื่อของคุณ"
                required
                className="w-full px-4 py-2.5 bg-main border border-default rounded-lg text-sm focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary outline-none"
              />
            </div>
            
            {/* Contact */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-secondary mb-2">
                ช่องทางติดต่อ (เบอร์โทร/LINE) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={customerContact}
                onChange={(e) => setCustomerContact(e.target.value)}
                placeholder="081-xxx-xxxx หรือ @line_id"
                required
                className="w-full px-4 py-2.5 bg-main border border-default rounded-lg text-sm focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary outline-none"
              />
            </div>
            
            {/* Note */}
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">
                หมายเหตุ (ไม่บังคับ)
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
                placeholder="หมายเหตุเพิ่มเติม..."
                className="w-full px-4 py-2.5 bg-main border border-default rounded-lg text-sm focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary outline-none resize-none"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!calculations.valid || !link || !customerName || !customerContact || isSubmitting}
            className="w-full py-3 bg-brand-primary text-white rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'กำลังสั่งซื้อ...' : `สั่งซื้อ ${calculations.valid ? formatCurrency(calculations.total) : ''}`}
          </button>
        </form>
      </main>
    </div>
  );
}

