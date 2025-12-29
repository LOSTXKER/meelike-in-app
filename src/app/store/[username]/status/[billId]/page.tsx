// src/app/store/[username]/status/[billId]/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getBillById } from '@/app/utils/storage';
import { Bill, BillStatus } from '@/app/types/bill';
import Link from 'next/link';

// Icons
const BackIcon = () => <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" /></svg>;
const ClockIcon = () => <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" /></svg>;
const CheckCircleIcon = () => <svg className="w-8 h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>;
const XCircleIcon = () => <svg className="w-8 h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" /></svg>;

const getStatusInfo = (status: BillStatus) => {
  const info = {
    pending: {
      label: 'รอชำระเงิน',
      color: 'text-warning',
      bgColor: 'bg-warning-subtle',
      icon: <ClockIcon />,
      message: 'กรุณาโอนเงินและแจ้งหลักฐานการโอน',
    },
    confirmed: {
      label: 'รอดำเนินการ',
      color: 'text-info',
      bgColor: 'bg-info-subtle',
      icon: <ClockIcon />,
      message: 'เราได้รับชำระเงินแล้ว รอดำเนินการ',
    },
    processing: {
      label: 'กำลังดำเนินการ',
      color: 'text-primary',
      bgColor: 'bg-brand-primary/10',
      icon: <ClockIcon />,
      message: 'กำลังดำเนินการตามที่คุณสั่ง',
    },
    completed: {
      label: 'เสร็จสมบูรณ์',
      color: 'text-success',
      bgColor: 'bg-success-subtle',
      icon: <CheckCircleIcon />,
      message: 'คำสั่งซื้อเสร็จสมบูรณ์แล้ว',
    },
    cancelled: {
      label: 'ยกเลิก',
      color: 'text-error',
      bgColor: 'bg-error-subtle',
      icon: <XCircleIcon />,
      message: 'คำสั่งซื้อถูกยกเลิก',
    },
  };
  
  return info[status];
};

const getProgressPercentage = (status: BillStatus): number => {
  const progress = {
    pending: 25,
    confirmed: 50,
    processing: 75,
    completed: 100,
    cancelled: 0,
  };
  return progress[status];
};

export default function BillStatusPage() {
  const params = useParams();
  const billId = params.billId as string;
  const username = params.username as string;
  
  const [bill, setBill] = useState<Bill | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const billData = getBillById(billId);
    setBill(billData);
    setLoading(false);
  }, [billId]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-main">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
      </div>
    );
  }
  
  if (!bill) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-main px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary mb-2">ไม่พบบิล</h1>
          <p className="text-secondary mb-4">ไม่พบบิลหมายเลข {billId}</p>
          <Link href={`/store/${username}`} className="btn-primary">
            กลับไปหน้าร้าน
          </Link>
        </div>
      </div>
    );
  }
  
  const statusInfo = getStatusInfo(bill.status);
  const progress = getProgressPercentage(bill.status);
  
  return (
    <div className="min-h-screen bg-main py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link 
            href={`/store/${username}`}
            className="btn-secondary w-10 h-10 p-0 flex items-center justify-center"
          >
            <BackIcon />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-primary">ติดตามสถานะ</h1>
            <p className="text-sm text-secondary">บิลหมายเลข: {bill.id}</p>
          </div>
        </div>
        
        {/* Status Card */}
        <div className={`card ${statusInfo.bgColor} mb-6`}>
          <div className="flex items-center gap-4">
            <div className={statusInfo.color}>
              {statusInfo.icon}
            </div>
            <div className="flex-1">
              <h2 className={`text-xl font-bold ${statusInfo.color}`}>
                {statusInfo.label}
              </h2>
              <p className="text-sm text-secondary mt-1">
                {statusInfo.message}
              </p>
            </div>
          </div>
          
          {/* Progress Bar */}
          {bill.status !== 'cancelled' && (
            <div className="mt-4">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    bill.status === 'completed' ? 'bg-success' : 'bg-brand-primary'
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
        
        {/* Timeline */}
        <div className="card mb-6">
          <h3 className="text-lg font-bold text-primary mb-4">ไทม์ไลน์</h3>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-success flex items-center justify-center text-white">
                  ✓
                </div>
                <div className="w-0.5 h-full bg-gray-300 dark:bg-gray-600 mt-2"></div>
              </div>
              <div className="flex-1 pb-4">
                <p className="font-semibold text-primary">สร้างคำสั่งซื้อ</p>
                <p className="text-sm text-secondary">
                  {new Date(bill.createdAt).toLocaleString('th-TH')}
                </p>
              </div>
            </div>
            
            {bill.confirmedAt && (
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-success flex items-center justify-center text-white">
                    ✓
                  </div>
                  <div className="w-0.5 h-full bg-gray-300 dark:bg-gray-600 mt-2"></div>
                </div>
                <div className="flex-1 pb-4">
                  <p className="font-semibold text-primary">ยืนยันการชำระเงิน</p>
                  <p className="text-sm text-secondary">
                    {new Date(bill.confirmedAt).toLocaleString('th-TH')}
                  </p>
                </div>
              </div>
            )}
            
            {bill.startedAt && (
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-success flex items-center justify-center text-white">
                    ✓
                  </div>
                  {!bill.completedAt && !bill.cancelledAt && (
                    <div className="w-0.5 h-full bg-gray-300 dark:bg-gray-600 mt-2"></div>
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <p className="font-semibold text-primary">เริ่มดำเนินการ</p>
                  <p className="text-sm text-secondary">
                    {new Date(bill.startedAt).toLocaleString('th-TH')}
                  </p>
                  {bill.progress !== undefined && (
                    <p className="text-xs text-tertiary mt-1">
                      ความคืบหน้า: {bill.progress}%
                    </p>
                  )}
                </div>
              </div>
            )}
            
            {bill.completedAt && (
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-success flex items-center justify-center text-white">
                    ✓
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-primary">เสร็จสมบูรณ์</p>
                  <p className="text-sm text-secondary">
                    {new Date(bill.completedAt).toLocaleString('th-TH')}
                  </p>
                </div>
              </div>
            )}
            
            {bill.cancelledAt && (
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-error flex items-center justify-center text-white">
                    ×
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-primary">ยกเลิก</p>
                  <p className="text-sm text-secondary">
                    {new Date(bill.cancelledAt).toLocaleString('th-TH')}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Order Details */}
        <div className="card mb-6">
          <h3 className="text-lg font-bold text-primary mb-4">รายละเอียดคำสั่งซื้อ</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-secondary">บริการ</span>
              <span className="text-sm font-medium text-primary">{bill.serviceName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-secondary">ลิงก์</span>
              <a 
                href={bill.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-brand-primary hover:underline truncate max-w-[200px]"
              >
                {bill.link}
              </a>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-secondary">จำนวน</span>
              <span className="text-sm font-medium text-primary">{bill.quantity}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-secondary">ยอดชำระ</span>
              <span className="text-lg font-bold text-brand-primary">
                ฿{bill.displayPrice.toLocaleString()}
              </span>
            </div>
            {bill.customerNote && (
              <div className="pt-3 border-t border-default">
                <p className="text-sm text-secondary mb-1">หมายเหตุ</p>
                <p className="text-sm text-primary">{bill.customerNote}</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Contact */}
        <div className="card bg-info-subtle">
          <h3 className="text-lg font-bold text-primary mb-2">ต้องการความช่วยเหลือ?</h3>
          <p className="text-sm text-secondary mb-3">
            ติดต่อร้านค้าเพื่อสอบถามเพิ่มเติม
          </p>
          <Link 
            href={`/store/${username}`}
            className="btn-primary inline-block"
          >
            ติดต่อร้าน
          </Link>
        </div>
      </div>
    </div>
  );
}

