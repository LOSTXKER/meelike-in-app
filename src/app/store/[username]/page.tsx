// src/app/store/[username]/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getStoreByUsername } from '@/app/utils/storage';
import { AgentStore, StoreService } from '@/app/types/store';
import Link from 'next/link';

// Icons
const StoreIcon = () => <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M1 2.75A.75.75 0 011.75 2h16.5a.75.75 0 010 1.5H18v8.75A2.75 2.75 0 0115.25 15h-1.072l.798 3.06a.75.75 0 01-1.452.38L13.41 18H6.59l-.114.44a.75.75 0 01-1.452-.38L5.823 15H4.75A2.75 2.75 0 012 12.25V3.5h-.25A.75.75 0 011 2.75z" clipRule="evenodd" /></svg>;
const StarIcon = () => <svg className="w-5 h-5 text-yellow-400 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>;
const PhoneIcon = () => <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>;
const FacebookIcon = () => <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>;
const CartIcon = () => <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" /></svg>;

export default function StorePage() {
  const params = useParams();
  const username = params.username as string;
  
  const [store, setStore] = useState<AgentStore | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  useEffect(() => {
    const storeData = getStoreByUsername(username);
    setStore(storeData);
    setLoading(false);
  }, [username]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-main">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto mb-4"></div>
          <p className="text-secondary">กำลังโหลด...</p>
        </div>
      </div>
    );
  }
  
  if (!store || !store.isActive) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-main px-4">
        <div className="text-center max-w-md">
          <StoreIcon />
          <h1 className="text-2xl font-bold text-primary mb-2 mt-4">ไม่พบร้านค้า</h1>
          <p className="text-secondary">ร้านค้านี้อาจถูกปิดหรือยังไม่ได้เปิดใช้งาน</p>
          <Link href="/" className="btn-primary mt-6 inline-block">
            กลับหน้าหลัก
          </Link>
        </div>
      </div>
    );
  }
  
  // Get categories from services
  const categories = ['all', ...new Set(store.services.map(s => s.category))];
  const filteredServices = selectedCategory === 'all' 
    ? store.services.filter(s => s.isActive)
    : store.services.filter(s => s.isActive && s.category === selectedCategory);
  
  return (
    <div className="min-h-screen bg-main">
      {/* Header */}
      <div 
        className="bg-gradient-to-r from-brand-primary to-brand-primary/80 text-white py-12 px-4"
        style={store.coverImage ? { 
          backgroundImage: `url(${store.coverImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        } : {}}
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-6">
            {store.logo ? (
              <img 
                src={store.logo} 
                alt={store.name}
                className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-white flex items-center justify-center">
                <StoreIcon />
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold mb-2">{store.name}</h1>
              <p className="text-brand-text-light/90 mb-3">@{store.username}</p>
              {store.rating && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    <StarIcon />
                    <span className="ml-1 font-semibold">{store.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-brand-text-light/80 text-sm">
                    ({store.reviewCount} รีวิว)
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Store Info */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* About */}
          <div className="md:col-span-2 card">
            <h2 className="text-lg font-bold text-primary mb-3">เกี่ยวกับร้าน</h2>
            <p className="text-secondary">
              {store.description || 'ร้านค้าของเรามีบริการโซเชียลมีเดียคุณภาพสูง'}
            </p>
          </div>
          
          {/* Contact */}
          <div className="card">
            <h2 className="text-lg font-bold text-primary mb-3">ติดต่อเรา</h2>
            <div className="space-y-2">
              {store.contactPhone && (
                <div className="flex items-center gap-2 text-sm text-secondary">
                  <PhoneIcon />
                  <span>{store.contactPhone}</span>
                </div>
              )}
              {store.contactFacebook && (
                <div className="flex items-center gap-2 text-sm text-secondary">
                  <FacebookIcon />
                  <a 
                    href={store.contactFacebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-brand-primary"
                  >
                    Facebook
                  </a>
                </div>
              )}
              {store.contactLine && (
                <div className="flex items-center gap-2 text-sm text-secondary">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.105.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/></svg>
                  <span>@{store.contactLine}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Category Filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-brand-primary text-white'
                  : 'bg-surface text-secondary hover:bg-brand-primary/10'
              }`}
            >
              {cat === 'all' ? 'ทั้งหมด' : cat}
            </button>
          ))}
        </div>
        
        {/* Services Grid */}
        {filteredServices.length === 0 ? (
          <div className="text-center py-12 card">
            <p className="text-secondary">ไม่มีบริการในหมวดนี้</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map(service => (
              <Link
                key={service.id}
                href={`/store/${username}/order?service=${service.serviceId}`}
                className="card hover:shadow-lg transition-shadow cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-bold text-primary group-hover:text-brand-primary transition-colors">
                    {service.serviceName}
                  </h3>
                  <CartIcon />
                </div>
                
                {service.description && (
                  <p className="text-sm text-secondary mb-3 line-clamp-2">
                    {service.description}
                  </p>
                )}
                
                <div className="flex items-center justify-between pt-3 border-t border-default">
                  <div>
                    {service.originalPrice !== service.salePrice && (
                      <p className="text-xs text-tertiary line-through">
                        ฿{service.originalPrice.toLocaleString()}
                      </p>
                    )}
                    <p className="text-xl font-bold text-brand-primary">
                      ฿{service.salePrice.toLocaleString()}
                    </p>
                  </div>
                  <button className="btn-primary btn-sm">
                    สั่งซื้อ
                  </button>
                </div>
                
                {service.orderCount > 0 && (
                  <p className="text-xs text-tertiary mt-2">
                    ขายแล้ว {service.orderCount} ครั้ง
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
      
      {/* Footer */}
      {!store.hideMeeLikeBranding && (
        <div className="bg-surface py-6 mt-12 border-t border-default">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <p className="text-sm text-tertiary">
              Powered by <Link href="/" className="text-brand-primary font-semibold hover:underline">MeeLike</Link>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

