// src/app/store/[username]/order/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { getStoreByUsername, incrementStoreServiceOrder } from '@/app/utils/storage';
import { createBill } from '@/app/utils/storage';
import { AgentStore, StoreService } from '@/app/types/store';
import Link from 'next/link';

// Icons
const BackIcon = () => <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" /></svg>;
const CheckIcon = () => <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>;

export default function StoreOrderPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const username = params.username as string;
  const serviceId = parseInt(searchParams.get('service') || '0');
  
  const [store, setStore] = useState<AgentStore | null>(null);
  const [service, setService] = useState<StoreService | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [billId, setBillId] = useState('');
  
  // Form State
  const [customerName, setCustomerName] = useState('');
  const [customerContact, setCustomerContact] = useState('');
  const [link, setLink] = useState('');
  const [quantity, setQuantity] = useState(100);
  const [customerNote, setCustomerNote] = useState('');
  const [couponCode, setCouponCode] = useState('');
  
  useEffect(() => {
    const storeData = getStoreByUsername(username);
    if (storeData) {
      const serviceData = storeData.services.find(s => s.serviceId === serviceId);
      setStore(storeData);
      setService(serviceData || null);
    }
    setLoading(false);
  }, [username, serviceId]);
  
  const totalPrice = service ? service.salePrice * quantity : 0;
  const discount = couponCode ? 10 : 0; // Mock discount
  const finalPrice = totalPrice - discount;
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!store || !service) return;
    
    setSubmitting(true);
    
    try {
      // Create bill
      const newBill = createBill(store.agentId, username, {
        clientName: customerName,
        clientContact: customerContact,
        serviceId: service.serviceId,
        serviceName: service.serviceName,
        category: service.category,
        link,
        quantity,
        salePrice: finalPrice,
        couponCode: couponCode || undefined,
        customerNote: customerNote || undefined,
      });
      
      // Update store stats
      incrementStoreServiceOrder(username, service.serviceId, finalPrice);
      
      setBillId(newBill.id);
      setOrderSuccess(true);
    } catch (error) {
      alert('เกิดข้อผิดพลาด: ' + (error as Error).message);
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-main">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
      </div>
    );
  }
  
  if (!store || !service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-main px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary mb-2">ไม่พบบริการ</h1>
          <Link href={`/store/${username}`} className="btn-primary mt-4">
            กลับไปหน้าร้าน
          </Link>
        </div>
      </div>
    );
  }
  
  if (orderSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-main px-4">
        <div className="max-w-md w-full card text-center">
          <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckIcon />
          </div>
          <h1 className="text-2xl font-bold text-primary mb-2">สั่งซื้อสำเร็จ!</h1>
          <p className="text-secondary mb-1">เลขที่บิล</p>
          <p className="text-xl font-bold text-brand-primary mb-4">{billId}</p>
          
          <div className="bg-surface p-4 rounded-lg mb-6">
            <h3 className="font-semibold text-primary mb-2">ขั้นตอนต่อไป:</h3>
            <ol className="text-left text-sm text-secondary space-y-2">
              <li>1. โอนเงินตามยอดด้านล่าง</li>
              <li>2. แจ้งหลักฐานการโอนให้กับร้าน</li>
              <li>3. รอรับบริการภายใน 24-48 ชั่วโมง</li>
            </ol>
          </div>
          
          <div className="bg-warning-subtle p-4 rounded-lg mb-6">
            <p className="text-sm font-semibold text-warning-emphasis mb-1">ยอดชำระ</p>
            <p className="text-3xl font-bold text-warning-emphasis">฿{finalPrice.toLocaleString()}</p>
          </div>
          
          {store.paymentInfo.promptPayNumber && (
            <div className="bg-surface p-4 rounded-lg mb-6 text-left">
              <h3 className="font-semibold text-primary mb-2">ข้อมูลการชำระเงิน</h3>
              <div className="space-y-1 text-sm">
                {store.paymentInfo.promptPayNumber && (
                  <p className="text-secondary">
                    <span className="font-medium">PromptPay:</span> {store.paymentInfo.promptPayNumber}
                  </p>
                )}
                {store.paymentInfo.promptPayName && (
                  <p className="text-secondary">
                    <span className="font-medium">ชื่อบัญชี:</span> {store.paymentInfo.promptPayName}
                  </p>
                )}
                {store.paymentInfo.bankAccount && (
                  <>
                    <p className="text-secondary">
                      <span className="font-medium">ธนาคาร:</span> {store.paymentInfo.bankName}
                    </p>
                    <p className="text-secondary">
                      <span className="font-medium">เลขบัญชี:</span> {store.paymentInfo.bankAccount}
                    </p>
                  </>
                )}
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <Link 
              href={`/store/${username}/status/${billId}`}
              className="btn-primary w-full"
            >
              ติดตามสถานะ
            </Link>
            <Link 
              href={`/store/${username}`}
              className="btn-secondary w-full"
            >
              กลับไปหน้าร้าน
            </Link>
          </div>
          
          <p className="text-xs text-tertiary mt-4">
            หากต้องการความช่วยเหลือ กรุณาติดต่อร้านผ่านช่องทางด้านล่าง
          </p>
          {store.contactLine && (
            <p className="text-xs text-secondary mt-1">
              LINE: @{store.contactLine}
            </p>
          )}
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-main py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link 
            href={`/store/${username}`}
            className="btn-secondary w-10 h-10 p-0 flex items-center justify-center"
          >
            <BackIcon />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-primary">สั่งซื้อบริการ</h1>
            <p className="text-sm text-secondary">{store.name}</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Service Info */}
          <div className="card">
            <h2 className="text-lg font-bold text-primary mb-3">บริการ</h2>
            <div className="bg-surface p-4 rounded-lg">
              <h3 className="font-semibold text-primary">{service.serviceName}</h3>
              <p className="text-sm text-secondary mt-1">{service.category}</p>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-default">
                <span className="text-sm text-secondary">ราคา/หน่วย</span>
                <span className="text-lg font-bold text-brand-primary">
                  ฿{service.salePrice.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
          
          {/* Customer Info */}
          <div className="card">
            <h2 className="text-lg font-bold text-primary mb-4">ข้อมูลของคุณ</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-primary mb-1">
                  ชื่อของคุณ *
                </label>
                <input 
                  type="text"
                  className="input"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="ชื่อ-นามสกุล หรือชื่อร้าน"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-primary mb-1">
                  ช่องทางติดต่อ *
                </label>
                <input 
                  type="text"
                  className="input"
                  value={customerContact}
                  onChange={(e) => setCustomerContact(e.target.value)}
                  placeholder="เบอร์โทร หรือ LINE ID"
                  required
                />
              </div>
            </div>
          </div>
          
          {/* Order Details */}
          <div className="card">
            <h2 className="text-lg font-bold text-primary mb-4">รายละเอียดคำสั่งซื้อ</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-primary mb-1">
                  ลิงก์ *
                </label>
                <input 
                  type="url"
                  className="input"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="https://..."
                  required
                />
                <p className="text-xs text-tertiary mt-1">
                  ลิงก์โพสต์, เพจ, หรือโปรไฟล์ที่ต้องการเพิ่มบริการ
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-primary mb-1">
                  จำนวน *
                </label>
                <input 
                  type="number"
                  className="input"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  min="1"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-primary mb-1">
                  คูปองส่วนลด (ถ้ามี)
                </label>
                <input 
                  type="text"
                  className="input"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="SAVE10"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-primary mb-1">
                  หมายเหตุเพิ่มเติม
                </label>
                <textarea 
                  className="input min-h-[80px]"
                  value={customerNote}
                  onChange={(e) => setCustomerNote(e.target.value)}
                  placeholder="คำขอพิเศษหรือรายละเอียดเพิ่มเติม"
                />
              </div>
            </div>
          </div>
          
          {/* Price Summary */}
          <div className="card bg-surface">
            <h2 className="text-lg font-bold text-primary mb-4">สรุปยอดชำระ</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-secondary">ราคาต่อหน่วย</span>
                <span className="text-primary">฿{service.salePrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-secondary">จำนวน</span>
                <span className="text-primary">× {quantity}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-secondary">รวม</span>
                <span className="text-primary">฿{totalPrice.toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-success">ส่วนลด</span>
                  <span className="text-success">-฿{discount.toLocaleString()}</span>
                </div>
              )}
              <div className="border-t border-default pt-2 mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-base font-bold text-primary">ยอดชำระทั้งหมด</span>
                  <span className="text-2xl font-bold text-brand-primary">
                    ฿{finalPrice.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Submit */}
          <button 
            type="submit"
            disabled={submitting}
            className="btn-primary w-full"
          >
            {submitting ? 'กำลังสร้างคำสั่งซื้อ...' : 'ยืนยันสั่งซื้อ'}
          </button>
          
          <p className="text-xs text-tertiary text-center">
            เมื่อกดยืนยัน คุณจะได้รับเลขที่บิลสำหรับแจ้งชำระเงิน
          </p>
        </form>
      </div>
    </div>
  );
}

