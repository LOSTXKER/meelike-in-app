// src/app/agent/store/services/page.tsx
// Store Services Management - จัดการบริการในร้าน
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AgentHeader } from '../../components';
import type { StoreSettings, StoreService, CreateStoreServiceInput } from '@/app/types/store';
import { 
  getStoreSettings, 
  createStoreSettings,
  addStoreService, 
  updateStoreService, 
  removeStoreService,
  reorderStoreServices 
} from '@/app/utils/storage/stores';
import { calculateServiceProfitMargin, generateStoreServiceId } from '@/app/types/store';

// Icons
const ArrowLeftIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const EditIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const XIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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

const EyeOffIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);

const AGENT_ID = 'demo_agent';

// Available services from MeeLike catalog
const MEELIKE_SERVICES = [
  // Facebook
  { serviceId: 1, serviceName: 'Facebook ถูกใจโพสต์', category: 'Facebook', baseCost: 0.15, minQuantity: 50, maxQuantity: 10000 },
  { serviceId: 2, serviceName: 'Facebook ผู้ติดตามเพจ', category: 'Facebook', baseCost: 0.25, minQuantity: 100, maxQuantity: 50000 },
  { serviceId: 3, serviceName: 'Facebook คอมเมนต์โพสต์', category: 'Facebook', baseCost: 2.50, minQuantity: 10, maxQuantity: 1000 },
  { serviceId: 4, serviceName: 'Facebook แชร์โพสต์', category: 'Facebook', baseCost: 0.50, minQuantity: 50, maxQuantity: 5000 },
  { serviceId: 5, serviceName: 'Facebook ยอดวิวไลฟ์', category: 'Facebook', baseCost: 0.30, minQuantity: 100, maxQuantity: 10000 },
  
  // Instagram
  { serviceId: 11, serviceName: 'Instagram ผู้ติดตาม (คนไทย)', category: 'Instagram', baseCost: 0.35, minQuantity: 100, maxQuantity: 50000 },
  { serviceId: 12, serviceName: 'Instagram ถูกใจโพสต์', category: 'Instagram', baseCost: 0.10, minQuantity: 50, maxQuantity: 20000 },
  { serviceId: 13, serviceName: 'Instagram วิว Reels', category: 'Instagram', baseCost: 0.05, minQuantity: 100, maxQuantity: 100000 },
  { serviceId: 14, serviceName: 'Instagram คอมเมนต์', category: 'Instagram', baseCost: 3.00, minQuantity: 10, maxQuantity: 500 },
  { serviceId: 15, serviceName: 'Instagram วิว Story', category: 'Instagram', baseCost: 0.03, minQuantity: 100, maxQuantity: 50000 },
  
  // TikTok
  { serviceId: 21, serviceName: 'TikTok ผู้ติดตาม', category: 'TikTok', baseCost: 0.40, minQuantity: 100, maxQuantity: 100000 },
  { serviceId: 22, serviceName: 'TikTok ถูกใจวิดีโอ', category: 'TikTok', baseCost: 0.08, minQuantity: 100, maxQuantity: 50000 },
  { serviceId: 23, serviceName: 'TikTok วิววิดีโอ', category: 'TikTok', baseCost: 0.02, minQuantity: 500, maxQuantity: 1000000 },
  { serviceId: 24, serviceName: 'TikTok แชร์วิดีโอ', category: 'TikTok', baseCost: 0.20, minQuantity: 100, maxQuantity: 10000 },
  { serviceId: 25, serviceName: 'TikTok บันทึกวิดีโอ', category: 'TikTok', baseCost: 0.15, minQuantity: 100, maxQuantity: 10000 },
  
  // YouTube
  { serviceId: 31, serviceName: 'YouTube ผู้ติดตาม', category: 'YouTube', baseCost: 1.00, minQuantity: 50, maxQuantity: 10000 },
  { serviceId: 32, serviceName: 'YouTube วิววิดีโอ', category: 'YouTube', baseCost: 0.10, minQuantity: 100, maxQuantity: 100000 },
  { serviceId: 33, serviceName: 'YouTube ถูกใจวิดีโอ', category: 'YouTube', baseCost: 0.50, minQuantity: 50, maxQuantity: 5000 },
  { serviceId: 34, serviceName: 'YouTube คอมเมนต์', category: 'YouTube', baseCost: 5.00, minQuantity: 5, maxQuantity: 500 },
  { serviceId: 35, serviceName: 'YouTube ชั่วโมงรับชม', category: 'YouTube', baseCost: 15.00, minQuantity: 10, maxQuantity: 4000 },
  
  // Twitter/X
  { serviceId: 41, serviceName: 'X ผู้ติดตาม', category: 'Twitter', baseCost: 0.50, minQuantity: 100, maxQuantity: 50000 },
  { serviceId: 42, serviceName: 'X ถูกใจทวีต', category: 'Twitter', baseCost: 0.15, minQuantity: 50, maxQuantity: 10000 },
  { serviceId: 43, serviceName: 'X รีทวีต', category: 'Twitter', baseCost: 0.30, minQuantity: 50, maxQuantity: 10000 },
  { serviceId: 44, serviceName: 'X วิววิดีโอ', category: 'Twitter', baseCost: 0.05, minQuantity: 100, maxQuantity: 100000 },
];

const CATEGORIES = ['ทั้งหมด', 'Facebook', 'Instagram', 'TikTok', 'YouTube', 'Twitter'];

// Category colors
const categoryColors: Record<string, string> = {
  'Facebook': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'Instagram': 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
  'TikTok': 'bg-gray-800 text-white dark:bg-gray-700',
  'YouTube': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  'Twitter': 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400',
  'default': 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
};

interface EditingService {
  id: string;
  displayName: string;
  description: string;
  salePrice: number;
  minQuantity: number;
  maxQuantity: number;
}

export default function StoreServicesPage() {
  const [store, setStore] = useState<StoreSettings | null>(null);
  const [services, setServices] = useState<StoreService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingService, setEditingService] = useState<EditingService | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Add service form state
  const [selectedMeelikeService, setSelectedMeelikeService] = useState<typeof MEELIKE_SERVICES[0] | null>(null);
  const [newDisplayName, setNewDisplayName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newSalePrice, setNewSalePrice] = useState('');
  const [newMinQty, setNewMinQty] = useState('');
  const [newMaxQty, setNewMaxQty] = useState('');

  useEffect(() => {
    loadStore();
  }, []);

  const loadStore = () => {
    setIsLoading(true);
    try {
      let storeData = getStoreSettings(AGENT_ID);
      
      if (!storeData) {
        const slug = `mystore`;
        storeData = createStoreSettings(AGENT_ID, slug, 'pro');
      }
      
      setStore(storeData);
      setServices(storeData.services || []);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddService = () => {
    if (!selectedMeelikeService || !newSalePrice) return;

    const input: CreateStoreServiceInput = {
      serviceId: selectedMeelikeService.serviceId,
      serviceName: selectedMeelikeService.serviceName,
      category: selectedMeelikeService.category,
      baseCost: selectedMeelikeService.baseCost,
      displayName: newDisplayName || undefined,
      description: newDescription || undefined,
      salePrice: parseFloat(newSalePrice),
      minQuantity: newMinQty ? parseInt(newMinQty) : selectedMeelikeService.minQuantity,
      maxQuantity: newMaxQty ? parseInt(newMaxQty) : selectedMeelikeService.maxQuantity,
      isActive: true,
    };

    const newService = addStoreService(AGENT_ID, input);
    if (newService) {
      setServices([...services, newService]);
      resetAddForm();
      setShowAddModal(false);
    }
  };

  const resetAddForm = () => {
    setSelectedMeelikeService(null);
    setNewDisplayName('');
    setNewDescription('');
    setNewSalePrice('');
    setNewMinQty('');
    setNewMaxQty('');
  };

  const handleEditService = (service: StoreService) => {
    setEditingService({
      id: service.id,
      displayName: service.displayName || service.serviceName,
      description: service.description || '',
      salePrice: service.salePrice,
      minQuantity: service.minQuantity,
      maxQuantity: service.maxQuantity,
    });
  };

  const handleSaveEdit = () => {
    if (!editingService) return;

    const updated = updateStoreService(AGENT_ID, editingService.id, {
      displayName: editingService.displayName,
      description: editingService.description || undefined,
      salePrice: editingService.salePrice,
      minQuantity: editingService.minQuantity,
      maxQuantity: editingService.maxQuantity,
    });

    if (updated) {
      setServices(services.map(s => s.id === updated.id ? updated : s));
      setEditingService(null);
    }
  };

  const handleToggleActive = (serviceId: string, currentState: boolean) => {
    const updated = updateStoreService(AGENT_ID, serviceId, { isActive: !currentState });
    if (updated) {
      setServices(services.map(s => s.id === updated.id ? updated : s));
    }
  };

  const handleDeleteService = (serviceId: string) => {
    if (removeStoreService(AGENT_ID, serviceId)) {
      setServices(services.filter(s => s.id !== serviceId));
      setDeleteConfirm(null);
    }
  };

  // Filter services
  const filteredServices = services.filter(service => {
    const matchesSearch = service.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (service.displayName?.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'ทั้งหมด' || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Filter available services (not already added)
  const availableServices = MEELIKE_SERVICES.filter(
    ms => !services.some(s => s.serviceId === ms.serviceId)
  ).filter(ms => 
    selectedCategory === 'ทั้งหมด' || ms.category === selectedCategory
  );

  if (isLoading) {
    return (
      <>
        <AgentHeader title="จัดการบริการ" subtitle="เลือกบริการที่จะแสดงในร้าน" />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <AgentHeader 
        title="จัดการบริการ" 
        subtitle={`${services.length} บริการในร้าน (สูงสุด ${store?.maxServices === Infinity ? 'ไม่จำกัด' : store?.maxServices})`}
      />

      <div className="flex-1 overflow-y-auto p-4 lg:p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* Back & Actions */}
          <div className="flex items-center justify-between">
            <Link
              href="/agent/store"
              className="flex items-center gap-2 text-secondary hover:text-primary transition-colors"
            >
              <ArrowLeftIcon />
              <span>กลับไปหน้าจัดการร้าน</span>
            </Link>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              <PlusIcon />
              เพิ่มบริการ
            </button>
          </div>

          {/* Search & Filter */}
          <div className="bg-surface dark:bg-dark-surface rounded-xl border border-default p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <SearchIcon />
                <input
                  type="text"
                  placeholder="ค้นหาบริการ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-main border border-default rounded-lg text-sm focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary outline-none"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-tertiary">
                  <SearchIcon />
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-2 text-sm rounded-lg font-medium transition-colors ${
                      selectedCategory === cat
                        ? 'bg-brand-primary text-white'
                        : 'bg-hover text-secondary hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Services List */}
          {filteredServices.length === 0 ? (
            <div className="bg-surface dark:bg-dark-surface rounded-xl border border-default p-12 text-center">
              <p className="text-secondary">ยังไม่มีบริการในร้าน</p>
              <p className="text-sm text-tertiary mt-1">กดปุ่ม "เพิ่มบริการ" เพื่อเลือกบริการที่จะขาย</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredServices.map((service) => (
                <div
                  key={service.id}
                  className={`bg-surface dark:bg-dark-surface rounded-xl border border-default overflow-hidden ${
                    !service.isActive ? 'opacity-60' : ''
                  }`}
                >
                  {editingService?.id === service.id ? (
                    // Edit mode
                    <div className="p-4 space-y-3">
                      <input
                        type="text"
                        value={editingService.displayName}
                        onChange={(e) => setEditingService({ ...editingService, displayName: e.target.value })}
                        className="w-full px-3 py-2 bg-main border border-default rounded-lg text-sm focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary outline-none"
                        placeholder="ชื่อที่แสดง"
                      />
                      <textarea
                        value={editingService.description}
                        onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                        className="w-full px-3 py-2 bg-main border border-default rounded-lg text-sm focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary outline-none resize-none"
                        rows={2}
                        placeholder="คำอธิบาย (ไม่บังคับ)"
                      />
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="text-xs text-tertiary">ราคาขาย</label>
                          <input
                            type="number"
                            value={editingService.salePrice}
                            onChange={(e) => setEditingService({ ...editingService, salePrice: parseFloat(e.target.value) || 0 })}
                            className="w-full px-3 py-2 bg-main border border-default rounded-lg text-sm focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary outline-none"
                            step="0.01"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-tertiary">ขั้นต่ำ</label>
                          <input
                            type="number"
                            value={editingService.minQuantity}
                            onChange={(e) => setEditingService({ ...editingService, minQuantity: parseInt(e.target.value) || 0 })}
                            className="w-full px-3 py-2 bg-main border border-default rounded-lg text-sm focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-tertiary">สูงสุด</label>
                          <input
                            type="number"
                            value={editingService.maxQuantity}
                            onChange={(e) => setEditingService({ ...editingService, maxQuantity: parseInt(e.target.value) || 0 })}
                            className="w-full px-3 py-2 bg-main border border-default rounded-lg text-sm focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary outline-none"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingService(null)}
                          className="flex-1 py-2 text-center font-medium border border-default rounded-lg hover:bg-hover transition-colors"
                        >
                          ยกเลิก
                        </button>
                        <button
                          onClick={handleSaveEdit}
                          className="flex-1 py-2 text-center font-medium bg-brand-primary text-white rounded-lg hover:opacity-90 transition-opacity"
                        >
                          บันทึก
                        </button>
                      </div>
                    </div>
                  ) : (
                    // View mode
                    <>
                      <div className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`px-2 py-0.5 text-xs font-medium rounded ${categoryColors[service.category] || categoryColors.default}`}>
                                {service.category}
                              </span>
                              {!service.isActive && (
                                <span className="px-2 py-0.5 text-xs font-medium rounded bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                                  ซ่อนอยู่
                                </span>
                              )}
                            </div>
                            <h3 className="font-semibold text-primary">
                              {service.displayName || service.serviceName}
                            </h3>
                            {service.description && (
                              <p className="text-sm text-secondary mt-1 line-clamp-2">{service.description}</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="mt-3 grid grid-cols-3 gap-3 text-center">
                          <div className="bg-hover rounded-lg p-2">
                            <p className="text-xs text-tertiary">ต้นทุน</p>
                            <p className="font-semibold text-primary">฿{service.baseCost.toFixed(2)}</p>
                          </div>
                          <div className="bg-hover rounded-lg p-2">
                            <p className="text-xs text-tertiary">ราคาขาย</p>
                            <p className="font-semibold text-brand-primary">฿{service.salePrice.toFixed(2)}</p>
                          </div>
                          <div className="bg-hover rounded-lg p-2">
                            <p className="text-xs text-tertiary">กำไร</p>
                            <p className={`font-semibold ${service.salePrice > service.baseCost ? 'text-green-600' : 'text-red-500'}`}>
                              {calculateServiceProfitMargin(service.baseCost, service.salePrice).toFixed(1)}%
                            </p>
                          </div>
                        </div>
                        
                        <div className="mt-3 flex items-center justify-between text-sm text-tertiary">
                          <span>สั่งได้: {service.minQuantity.toLocaleString()} - {service.maxQuantity.toLocaleString()}</span>
                          <span>ขายไปแล้ว: {service.totalSold.toLocaleString()}</span>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="px-4 py-3 bg-hover border-t border-default flex items-center gap-2">
                        <button
                          onClick={() => handleToggleActive(service.id, service.isActive)}
                          className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg transition-colors ${
                            service.isActive
                              ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                              : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          }`}
                        >
                          {service.isActive ? <EyeOffIcon /> : <EyeIcon />}
                          {service.isActive ? 'ซ่อน' : 'แสดง'}
                        </button>
                        <button
                          onClick={() => handleEditService(service)}
                          className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-lg"
                        >
                          <EditIcon />
                          แก้ไข
                        </button>
                        {deleteConfirm === service.id ? (
                          <div className="flex items-center gap-1 ml-auto">
                            <span className="text-xs text-red-500">ยืนยัน?</span>
                            <button
                              onClick={() => handleDeleteService(service.id)}
                              className="px-2 py-1 text-xs bg-red-500 text-white rounded"
                            >
                              ลบ
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="px-2 py-1 text-xs bg-gray-300 dark:bg-gray-600 rounded"
                            >
                              ไม่
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(service.id)}
                            className="flex items-center gap-1 px-3 py-1.5 text-sm bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-lg ml-auto"
                          >
                            <TrashIcon />
                            ลบ
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Service Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-surface dark:bg-dark-surface rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-default flex items-center justify-between">
              <h2 className="text-lg font-bold text-primary">เพิ่มบริการใหม่</h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  resetAddForm();
                }}
                className="p-2 hover:bg-hover rounded-lg transition-colors"
              >
                <XIcon />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {!selectedMeelikeService ? (
                // Service Selection
                <div className="space-y-4">
                  <p className="text-sm text-secondary">เลือกบริการจาก MeeLike ที่ต้องการเพิ่มในร้าน:</p>
                  
                  {/* Category Filter */}
                  <div className="flex gap-2 flex-wrap">
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${
                          selectedCategory === cat
                            ? 'bg-brand-primary text-white'
                            : 'bg-hover text-secondary hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Available Services List */}
                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {availableServices.length === 0 ? (
                      <p className="text-center text-tertiary py-8">ไม่มีบริการที่สามารถเพิ่มได้</p>
                    ) : (
                      availableServices.map(ms => (
                        <button
                          key={ms.serviceId}
                          onClick={() => {
                            setSelectedMeelikeService(ms);
                            setNewSalePrice((ms.baseCost * 2).toFixed(2));
                            setNewMinQty(ms.minQuantity.toString());
                            setNewMaxQty(ms.maxQuantity.toString());
                          }}
                          className="w-full p-3 bg-main border border-default rounded-lg hover:border-brand-primary text-left transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <span className={`px-2 py-0.5 text-xs font-medium rounded ${categoryColors[ms.category] || categoryColors.default}`}>
                                {ms.category}
                              </span>
                              <p className="font-medium text-primary mt-1">{ms.serviceName}</p>
                              <p className="text-sm text-tertiary">
                                ขั้นต่ำ {ms.minQuantity.toLocaleString()} - สูงสุด {ms.maxQuantity.toLocaleString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-tertiary">ต้นทุน</p>
                              <p className="font-semibold text-primary">฿{ms.baseCost.toFixed(2)}</p>
                            </div>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              ) : (
                // Service Configuration
                <div className="space-y-4">
                  <button
                    onClick={() => setSelectedMeelikeService(null)}
                    className="flex items-center gap-2 text-sm text-secondary hover:text-primary"
                  >
                    <ArrowLeftIcon />
                    เลือกบริการอื่น
                  </button>

                  <div className="p-4 bg-brand-primary/5 rounded-xl border border-brand-primary/20">
                    <span className={`px-2 py-0.5 text-xs font-medium rounded ${categoryColors[selectedMeelikeService.category] || categoryColors.default}`}>
                      {selectedMeelikeService.category}
                    </span>
                    <h3 className="font-semibold text-primary mt-2">{selectedMeelikeService.serviceName}</h3>
                    <p className="text-sm text-secondary mt-1">ต้นทุน: ฿{selectedMeelikeService.baseCost.toFixed(2)} / หน่วย</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary mb-2">
                      ชื่อที่แสดงในร้าน (ไม่บังคับ)
                    </label>
                    <input
                      type="text"
                      value={newDisplayName}
                      onChange={(e) => setNewDisplayName(e.target.value)}
                      placeholder={selectedMeelikeService.serviceName}
                      className="w-full px-4 py-2.5 bg-main border border-default rounded-lg text-sm focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary mb-2">
                      คำอธิบาย (ไม่บังคับ)
                    </label>
                    <textarea
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      rows={2}
                      placeholder="อธิบายรายละเอียดบริการเพิ่มเติม..."
                      className="w-full px-4 py-2.5 bg-main border border-default rounded-lg text-sm focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary outline-none resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary mb-2">
                      ราคาขาย (บาท/หน่วย) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={newSalePrice}
                      onChange={(e) => setNewSalePrice(e.target.value)}
                      step="0.01"
                      min={selectedMeelikeService.baseCost}
                      className="w-full px-4 py-2.5 bg-main border border-default rounded-lg text-sm focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary outline-none"
                    />
                    {newSalePrice && (
                      <p className="text-sm mt-1">
                        <span className="text-tertiary">กำไร: </span>
                        <span className={parseFloat(newSalePrice) > selectedMeelikeService.baseCost ? 'text-green-600' : 'text-red-500'}>
                          {calculateServiceProfitMargin(selectedMeelikeService.baseCost, parseFloat(newSalePrice) || 0).toFixed(1)}%
                        </span>
                        <span className="text-tertiary"> (฿{((parseFloat(newSalePrice) || 0) - selectedMeelikeService.baseCost).toFixed(2)}/หน่วย)</span>
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary mb-2">
                        จำนวนขั้นต่ำ
                      </label>
                      <input
                        type="number"
                        value={newMinQty}
                        onChange={(e) => setNewMinQty(e.target.value)}
                        min={1}
                        className="w-full px-4 py-2.5 bg-main border border-default rounded-lg text-sm focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary mb-2">
                        จำนวนสูงสุด
                      </label>
                      <input
                        type="number"
                        value={newMaxQty}
                        onChange={(e) => setNewMaxQty(e.target.value)}
                        min={parseInt(newMinQty) || 1}
                        className="w-full px-4 py-2.5 bg-main border border-default rounded-lg text-sm focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            {selectedMeelikeService && (
              <div className="p-4 border-t border-default flex gap-3">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    resetAddForm();
                  }}
                  className="flex-1 py-2.5 text-center font-medium border border-default rounded-lg hover:bg-hover transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleAddService}
                  disabled={!newSalePrice || parseFloat(newSalePrice) <= 0}
                  className="flex-1 py-2.5 text-center font-medium bg-brand-primary text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  เพิ่มบริการ
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

