"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AgentHeader } from '../components';
import type { StoreSettings } from '@/app/types/store';
import { getStoreSettings, createStoreSettings, updateStoreSettings } from '@/app/utils/storage/stores';

// Icons
const StoreIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const LinkIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
  </svg>
);

const CopyIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const EyeIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const SettingsIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const AGENT_ID = 'demo_agent';

export default function StoreManagementPage() {
  const [store, setStore] = useState<StoreSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form state
  const [storeName, setStoreName] = useState('');
  const [storeDescription, setStoreDescription] = useState('');
  const [storeSlug, setStoreSlug] = useState('');
  const [contactLine, setContactLine] = useState('');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    loadStore();
  }, []);

  const loadStore = () => {
    setIsLoading(true);
    try {
      let storeData = getStoreSettings(AGENT_ID);
      
      // Create default store if not exists
      if (!storeData) {
        const slug = `store-${Date.now()}`;
        storeData = createStoreSettings(AGENT_ID, slug, 'starter');
        storeData = updateStoreSettings(AGENT_ID, {
          storeName: 'ร้านค้าของฉัน',
          storeDescription: 'ร้านค้าให้บริการเพิ่ม Followers, Likes และอื่นๆ',
        }) || storeData;
      }
      
      setStore(storeData);
      setStoreName(storeData.storeName);
      setStoreDescription(storeData.storeDescription || '');
      setStoreSlug(storeData.username);
      setContactLine(storeData.contactLine || '');
      setIsActive(storeData.isActive);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    if (!store) return;
    
    const updated = updateStoreSettings(AGENT_ID, {
      storeName,
      storeDescription: storeDescription || undefined,
      contactLine: contactLine || undefined,
      isActive,
    });
    
    if (updated) {
      setStore(updated);
      setIsEditing(false);
    }
  };

  const copyStoreLink = () => {
    if (!store) return;
    const link = `${window.location.origin}/s/${store.username}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const storeUrl = store ? `${typeof window !== 'undefined' ? window.location.origin : ''}/s/${store.username}` : '';

  if (isLoading) {
    return (
      <>
        <AgentHeader title="จัดการร้าน" subtitle="ตั้งค่าร้านค้าออนไลน์ของคุณ" />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <AgentHeader title="จัดการร้าน" subtitle="ตั้งค่าร้านค้าออนไลน์ของคุณ" />

      <div className="flex-1 overflow-y-auto p-4 lg:p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Store Status Card */}
          <div className="bg-surface dark:bg-dark-surface rounded-xl border border-default overflow-hidden">
            <div className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                    <StoreIcon />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-primary">{store?.storeName}</h2>
                    <p className="text-secondary mt-1">{store?.storeDescription || 'ยังไม่มีคำอธิบาย'}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full ${
                        store?.isActive 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${store?.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                        {store?.isActive ? 'เปิดให้บริการ' : 'ปิดให้บริการ'}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="p-2 hover:bg-hover rounded-lg transition-colors"
                >
                  <SettingsIcon />
                </button>
              </div>
            </div>
            
            {/* Store Link */}
            <div className="px-5 py-3 bg-hover border-t border-default">
              <div className="flex items-center gap-3">
                <LinkIcon />
                <span className="text-sm text-secondary flex-1 truncate">{storeUrl}</span>
                <button
                  onClick={copyStoreLink}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium bg-brand-primary/10 text-brand-primary rounded-lg hover:bg-brand-primary/20 transition-colors"
                >
                  {copied ? <CheckIcon /> : <CopyIcon />}
                  {copied ? 'คัดลอกแล้ว' : 'คัดลอก'}
                </button>
                <Link
                  href={`/s/${store?.username}`}
                  target="_blank"
                  className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium bg-surface border border-default rounded-lg hover:bg-hover transition-colors"
                >
                  <EyeIcon />
                  ดูร้าน
                </Link>
              </div>
            </div>
          </div>

          {/* Edit Form */}
          {isEditing && (
            <div className="bg-surface dark:bg-dark-surface rounded-xl border border-default p-5">
              <h3 className="font-semibold text-primary mb-4">แก้ไขข้อมูลร้าน</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">
                    ชื่อร้าน <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-main border border-default rounded-lg text-sm focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">
                    Slug (ลิงก์ร้าน)
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-tertiary">/s/</span>
                    <input
                      type="text"
                      value={storeSlug}
                      onChange={(e) => setStoreSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                      className="flex-1 px-4 py-2.5 bg-main border border-default rounded-lg text-sm focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary outline-none"
                    />
                  </div>
                  <p className="text-xs text-tertiary mt-1">ใช้ได้เฉพาะตัวอักษรภาษาอังกฤษตัวเล็ก ตัวเลข และ -</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">
                    คำอธิบายร้าน
                  </label>
                  <textarea
                    value={storeDescription}
                    onChange={(e) => setStoreDescription(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2.5 bg-main border border-default rounded-lg text-sm focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary outline-none resize-none"
                    placeholder="อธิบายบริการของร้านคุณ..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">
                    ข้อมูลติดต่อ (LINE)
                  </label>
                  <input
                    type="text"
                    value={contactLine}
                    onChange={(e) => setContactLine(e.target.value)}
                    className="w-full px-4 py-2.5 bg-main border border-default rounded-lg text-sm focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary outline-none"
                    placeholder="@line_id หรือ LINE ID"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:ring-2 peer-focus:ring-brand-primary/50 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
                  </label>
                  <span className="text-sm font-medium text-primary">เปิดให้บริการ</span>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex-1 py-2.5 text-center font-medium border border-default rounded-lg hover:bg-hover transition-colors"
                  >
                    ยกเลิก
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex-1 py-2.5 text-center font-medium bg-brand-primary text-white rounded-lg hover:opacity-90 transition-opacity"
                  >
                    บันทึก
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-surface dark:bg-dark-surface rounded-xl border border-default p-5">
              <p className="text-sm text-secondary">ผู้เข้าชมทั้งหมด</p>
              <p className="text-2xl font-bold text-primary mt-1">{store?.totalViews || 0}</p>
            </div>
            <div className="bg-surface dark:bg-dark-surface rounded-xl border border-default p-5">
              <p className="text-sm text-secondary">ออเดอร์จากร้าน</p>
              <p className="text-2xl font-bold text-primary mt-1">{store?.totalOrders || 0}</p>
            </div>
            <div className="bg-surface dark:bg-dark-surface rounded-xl border border-default p-5">
              <p className="text-sm text-secondary">คะแนนร้าน</p>
              <p className="text-2xl font-bold text-primary mt-1">
                {store?.averageRating ? `${store.averageRating.toFixed(1)} / 5` : '-'}
              </p>
            </div>
          </div>

          {/* Services Management Link */}
          <div className="bg-surface dark:bg-dark-surface rounded-xl border border-default p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-primary">จัดการบริการในร้าน</h3>
                <p className="text-sm text-secondary mt-1">เลือกบริการที่จะแสดงในร้าน และตั้งราคาขาย</p>
              </div>
              <Link
                href="/agent/store/services"
                className="px-4 py-2 bg-brand-primary text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                จัดการบริการ
              </Link>
            </div>
          </div>

          {/* Promotions Link */}
          <div className="bg-surface dark:bg-dark-surface rounded-xl border border-default p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-primary">โปรโมชั่น</h3>
                <p className="text-sm text-secondary mt-1">สร้างคูปองส่วนลด และ Flash Sale</p>
              </div>
              <Link
                href="/agent/store/promotions"
                className="px-4 py-2 border border-default rounded-lg font-medium hover:bg-hover transition-colors"
              >
                จัดการโปรโมชั่น
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

