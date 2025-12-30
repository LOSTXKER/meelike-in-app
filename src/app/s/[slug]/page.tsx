// src/app/s/[slug]/page.tsx
// Public Store Page - ลูกค้าเข้ามาดูและสั่งซื้อ
"use client";

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { StoreSettings, StoreService } from '@/app/types/store';
import { getStoreByUsername, getActiveStoreServices, incrementStoreViews } from '@/app/utils/storage/stores';
import { getAgentReviews, getStoreRatingSummary } from '@/app/utils/storage/agentReviews';
import { getFlashSales } from '@/app/utils/storage/promotions';
import type { AgentStoreReview } from '@/app/types/agentReview';
import type { FlashSale } from '@/app/types/promotion';
import { isFlashSaleActive, getFlashSaleTimeRemaining } from '@/app/types/promotion';

// Icons
const ShoppingCartIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const StarIcon = ({ filled }: { filled: boolean }) => (
  <svg className={`w-4 h-4 ${filled ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const ChatIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const FireIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// Category grouping
function groupServicesByCategory(services: StoreService[]): Record<string, StoreService[]> {
  return services.reduce((acc, service) => {
    const category = service.category || 'อื่นๆ';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(service);
    return acc;
  }, {} as Record<string, StoreService[]>);
}

// Category colors
const categoryColors: Record<string, string> = {
  'Facebook': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'Instagram': 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
  'TikTok': 'bg-gray-800 text-white dark:bg-gray-700',
  'YouTube': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  'Twitter': 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400',
  'default': 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
};

export default function PublicStorePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [store, setStore] = useState<StoreSettings | null>(null);
  const [services, setServices] = useState<StoreService[]>([]);
  const [reviews, setReviews] = useState<AgentStoreReview[]>([]);
  const [flashSales, setFlashSales] = useState<FlashSale[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'services' | 'reviews'>('services');

  useEffect(() => {
    loadStore();
  }, [resolvedParams.slug]);

  const loadStore = () => {
    setIsLoading(true);
    try {
      const storeData = getStoreByUsername(resolvedParams.slug);
      if (storeData) {
        setStore(storeData);
        const activeServices = getActiveStoreServices(storeData.agentId);
        setServices(activeServices);
        
        // Load reviews
        const storeReviews = getAgentReviews(storeData.agentId)
          .filter(r => r.isVisible)
          .slice(0, 10);
        setReviews(storeReviews);
        
        // Load flash sales
        const activeFlashSales = getFlashSales(storeData.agentId)
          .filter(fs => fs.isActive && isFlashSaleActive(fs));
        setFlashSales(activeFlashSales);
        
        // Track view
        incrementStoreViews(storeData.agentId);
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

  // Group services
  const groupedServices = groupServicesByCategory(services);
  const categories = Object.keys(groupedServices);

  // Filter by category
  const displayedServices = selectedCategory === 'all'
    ? services
    : services.filter(s => s.category === selectedCategory);

  // Get flash sale for service
  const getFlashSaleForService = (serviceId: number): FlashSale | undefined => {
    return flashSales.find(fs => fs.serviceId === serviceId && isFlashSaleActive(fs) && (fs.remainingQuantity ?? fs.totalQuantity) > 0);
  };

  // Format time ago
  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'วันนี้';
    if (days === 1) return 'เมื่อวาน';
    if (days < 7) return `${days} วันที่แล้ว`;
    if (days < 30) return `${Math.floor(days / 7)} สัปดาห์ที่แล้ว`;
    return `${Math.floor(days / 30)} เดือนที่แล้ว`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-main dark:bg-dark-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen bg-main dark:bg-dark-bg flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary mb-2">ไม่พบร้านค้า</h1>
          <p className="text-secondary mb-4">ร้านค้านี้อาจถูกปิดหรือไม่มีอยู่</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            <ArrowLeftIcon />
            กลับหน้าหลัก
          </Link>
        </div>
      </div>
    );
  }

  if (!store.isActive) {
    return (
      <div className="min-h-screen bg-main dark:bg-dark-bg flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary mb-2">ร้านปิดให้บริการชั่วคราว</h1>
          <p className="text-secondary mb-4">กรุณากลับมาใหม่ภายหลัง</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-main dark:bg-dark-bg">
      {/* Header */}
      <header className="bg-surface dark:bg-dark-surface border-b border-default sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {store.logoUrl ? (
                <img
                  src={store.logoUrl}
                  alt={store.storeName}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold text-lg">
                  {store.storeName.charAt(0)}
                </div>
              )}
              <div>
                <h1 className="font-bold text-lg text-primary">{store.storeName}</h1>
                <div className="flex items-center gap-2 text-sm text-secondary">
                  {store.averageRating > 0 && (
                    <>
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map(i => (
                          <StarIcon key={i} filled={i <= Math.round(store.averageRating)} />
                        ))}
                      </div>
                      <span>({store.totalReviews})</span>
                      <span>•</span>
                    </>
                  )}
                  <span>{store.totalOrders} ออเดอร์</span>
                </div>
              </div>
            </div>
            {store.contactLine && (
              <a
                href={`https://line.me/ti/p/~${store.contactLine.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
              >
                <ChatIcon />
                <span className="hidden sm:inline">ติดต่อ</span>
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Announcement */}
      {store.storeAnnouncement && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800">
          <div className="max-w-4xl mx-auto px-4 py-2">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">{store.storeAnnouncement}</p>
          </div>
        </div>
      )}

      {/* Description */}
      {store.storeDescription && (
        <div className="bg-surface dark:bg-dark-surface border-b border-default">
          <div className="max-w-4xl mx-auto px-4 py-3">
            <p className="text-sm text-secondary">{store.storeDescription}</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Flash Sale Banner */}
        {flashSales.length > 0 && (
          <div className="mb-6 p-4 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl text-white">
            <div className="flex items-center gap-2 mb-3">
              <FireIcon />
              <span className="font-bold">Flash Sale</span>
              <span className="text-white/80 text-sm">จำกัดเวลา!</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {flashSales.slice(0, 2).map(fs => (
                <Link
                  key={fs.id}
                  href={`/s/${resolvedParams.slug}/order?service=${fs.serviceId}`}
                  className="bg-white/10 backdrop-blur rounded-lg p-3 hover:bg-white/20 transition-colors"
                >
                  <p className="font-medium text-sm truncate">{fs.serviceName}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-lg font-bold">{formatCurrency(fs.salePrice)}</span>
                    <span className="text-sm line-through opacity-70">{formatCurrency(fs.originalPrice)}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-2 text-xs opacity-80">
                    <ClockIcon />
                    <span>
                      {(() => {
                        const time = getFlashSaleTimeRemaining(fs);
                        return time.expired ? 'หมดเวลา' : `${time.hours}ชม. ${time.minutes}นาที`;
                      })()}
                    </span>
                    <span className="mx-1">•</span>
                    <span>เหลือ {fs.remainingQuantity ?? fs.totalQuantity} ชิ้น</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex gap-3 mb-6">
          <Link
            href={`/s/${resolvedParams.slug}/status`}
            className="flex items-center gap-2 px-4 py-2 bg-surface dark:bg-dark-surface border border-default rounded-lg text-sm font-medium text-secondary hover:text-primary hover:border-brand-primary transition-colors"
          >
            <SearchIcon />
            ตรวจสอบสถานะออเดอร์
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-default mb-6">
          <button
            onClick={() => setActiveTab('services')}
            className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'services'
                ? 'border-brand-primary text-brand-primary'
                : 'border-transparent text-secondary hover:text-primary'
            }`}
          >
            บริการ ({services.length})
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'reviews'
                ? 'border-brand-primary text-brand-primary'
                : 'border-transparent text-secondary hover:text-primary'
            }`}
          >
            รีวิว ({reviews.length})
          </button>
        </div>

        {activeTab === 'services' && (
          <>
            {/* Category Filter */}
            {categories.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-brand-primary text-white'
                      : 'bg-surface dark:bg-dark-surface border border-default text-secondary hover:bg-hover'
                  }`}
                >
                  ทั้งหมด ({services.length})
                </button>
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                      selectedCategory === category
                        ? 'bg-brand-primary text-white'
                        : 'bg-surface dark:bg-dark-surface border border-default text-secondary hover:bg-hover'
                    }`}
                  >
                    {category} ({groupedServices[category].length})
                  </button>
                ))}
              </div>
            )}

            {/* Services List */}
            {displayedServices.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-secondary">ยังไม่มีบริการในหมวดหมู่นี้</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {displayedServices.map(service => {
                  const flashSale = getFlashSaleForService(service.serviceId);
                  return (
                    <Link
                      key={service.id}
                      href={`/s/${resolvedParams.slug}/order?service=${service.id}`}
                      className="bg-surface dark:bg-dark-surface rounded-xl border border-default p-4 hover:border-brand-primary transition-colors group relative overflow-hidden"
                    >
                      {flashSale && (
                        <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-bl-lg flex items-center gap-1">
                          <FireIcon />
                          SALE
                        </div>
                      )}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`px-2 py-0.5 text-xs font-medium rounded ${categoryColors[service.category] || categoryColors.default}`}>
                              {service.category}
                            </span>
                          </div>
                          <h3 className="font-semibold text-primary group-hover:text-brand-primary transition-colors">
                            {service.displayName || service.serviceName}
                          </h3>
                          {service.description && (
                            <p className="text-sm text-secondary mt-1 line-clamp-2">{service.description}</p>
                          )}
                          <p className="text-xs text-tertiary mt-2">
                            Min: {service.minQuantity.toLocaleString()} • Max: {service.maxQuantity.toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          {flashSale ? (
                            <>
                              <p className="font-bold text-red-500">{formatCurrency(flashSale.salePrice)}</p>
                              <p className="text-xs text-tertiary line-through">{formatCurrency(flashSale.originalPrice)}</p>
                            </>
                          ) : (
                            <>
                              <p className="font-bold text-brand-primary">{formatCurrency(service.salePrice)}</p>
                              <p className="text-xs text-tertiary">ต่อหน่วย</p>
                            </>
                          )}
                        </div>
                      </div>
                      <button className="mt-3 w-full py-2 bg-brand-primary/10 text-brand-primary rounded-lg font-medium text-sm group-hover:bg-brand-primary group-hover:text-white transition-colors">
                        สั่งซื้อ
                      </button>
                    </Link>
                  );
                })}
              </div>
            )}
          </>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-4">
            {/* Rating Summary */}
            {store.averageRating > 0 && (
              <div className="bg-surface dark:bg-dark-surface rounded-xl border border-default p-6 mb-6">
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-primary">{store.averageRating.toFixed(1)}</p>
                    <div className="flex items-center gap-0.5 justify-center mt-1">
                      {[1, 2, 3, 4, 5].map(i => (
                        <StarIcon key={i} filled={i <= Math.round(store.averageRating)} />
                      ))}
                    </div>
                    <p className="text-sm text-secondary mt-1">{store.totalReviews} รีวิว</p>
                  </div>
                </div>
              </div>
            )}

            {/* Reviews List */}
            {reviews.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-secondary">ยังไม่มีรีวิว</p>
              </div>
            ) : (
              reviews.map(review => (
                <div key={review.id} className="bg-surface dark:bg-dark-surface rounded-xl border border-default p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-primary">{review.clientName || 'ลูกค้า'}</p>
                      <div className="flex items-center gap-0.5 mt-0.5">
                        {[1, 2, 3, 4, 5].map(i => (
                          <StarIcon key={i} filled={i <= review.rating} />
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-tertiary">{formatTimeAgo(review.createdAt)}</span>
                  </div>
                  {review.comment && (
                    <p className="text-sm text-secondary mb-2">{review.comment}</p>
                  )}
                  <p className="text-xs text-tertiary">บริการ: {review.serviceName}</p>
                  
                  {review.agentReply && (
                    <div className="mt-3 pl-4 border-l-2 border-brand-primary">
                      <p className="text-xs text-brand-primary font-medium mb-1">ตอบกลับจากร้าน</p>
                      <p className="text-sm text-secondary">{review.agentReply}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-surface dark:bg-dark-surface border-t border-default py-6 mt-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-sm text-tertiary">
            {!store.hideMeeLikeBranding && (
              <>
                Powered by <Link href="/" className="text-brand-primary hover:underline">MeeLike</Link>
              </>
            )}
          </p>
        </div>
      </footer>
    </div>
  );
}

