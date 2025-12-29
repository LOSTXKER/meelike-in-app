// src/app/agent/clients/page.tsx
"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import type { Client, ClientSegment, LoyaltyTier, ClientFilter, ClientSort } from '@/app/types/client';
import { getSegmentLabel, getSegmentColor, getLoyaltyTierLabel, getLoyaltyTierColor } from '@/app/types/client';
import {
  getClients,
  createClient,
  deleteClient,
  getClientSummary,
  getAllClientTags,
  queryClients,
} from '@/app/utils/storage/clients';

// ==============================================
// ICONS
// ==============================================
const UserPlusIcon = () => (
  <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path d="M11 5a3 3 0 11-6 0 3 3 0 016 0zM2.615 16.428a1.224 1.224 0 01-.569-1.175 6.002 6.002 0 0111.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 018 18a9.953 9.953 0 01-5.385-1.572zM16.25 5.75a.75.75 0 00-1.5 0v2h-2a.75.75 0 000 1.5h2v2a.75.75 0 001.5 0v-2h2a.75.75 0 000-1.5h-2v-2z" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
  </svg>
);

const EyeIcon = () => (
  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
    <path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
  </svg>
);

const PencilIcon = () => (
  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.58.22-2.365.468a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4.5a.75.75 0 01.75.75v8.5a.75.75 0 01-1.5 0v-8.5A.75.75 0 0110 4.5z" clipRule="evenodd" />
  </svg>
);

const CrownIcon = () => (
  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 1a.75.75 0 01.65.375l2.003 3.428 3.927.571a.75.75 0 01.416 1.279l-2.842 2.772.67 3.915a.75.75 0 01-1.088.791L10 12.347l-3.735 1.964a.75.75 0 01-1.088-.79l.67-3.916-2.842-2.772a.75.75 0 01.416-1.28l3.927-.57L10.35 1.375A.75.75 0 0110 1z" clipRule="evenodd" />
  </svg>
);

const StarIcon = () => (
  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" />
  </svg>
);

const SparklesIcon = () => (
  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path d="M10 1a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 1zM5.05 3.05a.75.75 0 011.06 0l1.062 1.06A.75.75 0 016.11 5.173L5.05 4.11a.75.75 0 010-1.06zM13.828 4.11a.75.75 0 00-1.06 1.06l1.06 1.06a.75.75 0 001.06-1.06l-1.06-1.06zM10 7a3 3 0 100 6 3 3 0 000-6zM1 10a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5A.75.75 0 011 10zM16.75 9.25a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5h-1.5z" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
  </svg>
);

const UsersIcon = () => (
  <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path d="M7 8a3 3 0 100-6 3 3 0 000 6zM14.5 9a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM1.615 16.428a1.224 1.224 0 01-.569-1.175 6.002 6.002 0 0111.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 017 18a9.953 9.953 0 01-5.385-1.572zM14.5 16h-.106c.07-.297.088-.611.048-.933a7.47 7.47 0 00-1.588-3.755 4.502 4.502 0 015.874 2.636.818.818 0 01-.36.98A7.465 7.465 0 0114.5 16z" />
  </svg>
);

const TagIcon = () => (
  <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M5.5 3A2.5 2.5 0 003 5.5v2.879a2.5 2.5 0 00.732 1.767l6.5 6.5a2.5 2.5 0 003.536 0l2.878-2.878a2.5 2.5 0 000-3.536l-6.5-6.5A2.5 2.5 0 008.38 3H5.5zM6 7a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
  </svg>
);

const XMarkIcon = () => (
  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
  </svg>
);

// ==============================================
// SEGMENT ICON
// ==============================================
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
// BADGE COMPONENTS
// ==============================================
function SegmentBadge({ segment }: { segment: ClientSegment }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full ${getSegmentColor(segment)}`}>
      <SegmentIcon segment={segment} />
      {getSegmentLabel(segment)}
    </span>
  );
}

function LoyaltyBadge({ tier }: { tier: LoyaltyTier }) {
  if (tier === 'none') return null;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full ${getLoyaltyTierColor(tier)}`}>
      {getLoyaltyTierLabel(tier)}
    </span>
  );
}

function TagBadge({ tag, onRemove }: { tag: string; onRemove?: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
      <TagIcon />
      {tag}
      {onRemove && (
        <button onClick={onRemove} className="hover:text-red-500 transition-colors">
          <XMarkIcon />
        </button>
      )}
    </span>
  );
}

// ==============================================
// STATS CARD
// ==============================================
function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="bg-surface dark:bg-dark-surface rounded-xl p-4 border border-default dark:border-dark-border">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${color}`}>
          {icon}
        </div>
        <div>
          <p className="text-2xl font-bold text-primary dark:text-dark-text-dark">{value}</p>
          <p className="text-sm text-secondary dark:text-dark-text-light">{title}</p>
        </div>
      </div>
    </div>
  );
}

// ==============================================
// ADD CLIENT MODAL
// ==============================================
function AddClientModal({
  isOpen,
  onClose,
  onAdd,
  existingTags,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (client: { name: string; contact: string; email?: string; note?: string; tags?: string[] }) => void;
  existingTags: string[];
}) {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contact.trim()) return;
    
    onAdd({
      name: name.trim(),
      contact: contact.trim(),
      email: email.trim() || undefined,
      note: note.trim() || undefined,
      tags: selectedTags,
    });
    
    // Reset form
    setName('');
    setContact('');
    setEmail('');
    setNote('');
    setSelectedTags([]);
    setNewTag('');
    onClose();
  };

  const addNewTag = () => {
    if (newTag.trim() && !selectedTags.includes(newTag.trim())) {
      setSelectedTags([...selectedTags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tag));
  };

  const toggleExistingTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-surface dark:bg-dark-surface rounded-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto shadow-xl border border-default dark:border-dark-border">
        <h3 className="text-lg font-bold mb-4 text-primary dark:text-dark-text-dark">เพิ่มลูกค้าใหม่</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-semibold mb-1 block text-primary dark:text-dark-text-dark">
              ชื่อลูกค้า / ร้านค้า <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="เช่น ร้านกาแฟ B"
              required
              className="w-full bg-main dark:bg-dark-bg border border-default dark:border-dark-border rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>
          <div>
            <label className="text-sm font-semibold mb-1 block text-primary dark:text-dark-text-dark">
              ข้อมูลติดต่อ (เบอร์โทร/LINE ID) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="เช่น 081-xxx-xxxx หรือ @line_id"
              required
              className="w-full bg-main dark:bg-dark-bg border border-default dark:border-dark-border rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>
          <div>
            <label className="text-sm font-semibold mb-1 block text-primary dark:text-dark-text-dark">
              Email (ถ้ามี)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              className="w-full bg-main dark:bg-dark-bg border border-default dark:border-dark-border rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>
          <div>
            <label className="text-sm font-semibold mb-1 block text-primary dark:text-dark-text-dark">
              หมายเหตุ (ถ้ามี)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="ข้อมูลเพิ่มเติม..."
              className="w-full bg-main dark:bg-dark-bg border border-default dark:border-dark-border rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>
          
          {/* Tags */}
          <div>
            <label className="text-sm font-semibold mb-1 block text-primary dark:text-dark-text-dark">
              Tags
            </label>
            
            {/* Selected tags */}
            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {selectedTags.map(tag => (
                  <TagBadge key={tag} tag={tag} onRemove={() => removeTag(tag)} />
                ))}
              </div>
            )}
            
            {/* Existing tags */}
            {existingTags.length > 0 && (
              <div className="mb-2">
                <p className="text-xs text-secondary dark:text-dark-text-light mb-1">เลือก tag ที่มีอยู่:</p>
                <div className="flex flex-wrap gap-1">
                  {existingTags.filter(t => !selectedTags.includes(t)).map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleExistingTag(tag)}
                      className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                      + {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Add new tag */}
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
                    addNewTag();
                  }
                }}
              />
              <button
                type="button"
                onClick={addNewTag}
                className="px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                เพิ่ม
              </button>
            </div>
          </div>
          
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg font-semibold border border-default dark:border-dark-border hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-lg font-semibold bg-brand-primary text-white hover:opacity-90 transition-opacity"
            >
              บันทึก
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==============================================
// DELETE CONFIRM MODAL
// ==============================================
function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  clientName,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  clientName: string;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-surface dark:bg-dark-surface rounded-xl p-6 w-full max-w-sm mx-4 shadow-xl border border-default dark:border-dark-border">
        <h3 className="text-lg font-bold mb-2 text-primary dark:text-dark-text-dark">ยืนยันการลบ</h3>
        <p className="text-secondary dark:text-dark-text-light mb-4">
          คุณต้องการลบ <span className="font-semibold">{clientName}</span> ใช่หรือไม่?
          <br />
          <span className="text-sm text-red-500">การกระทำนี้ไม่สามารถย้อนกลับได้</span>
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg font-semibold border border-default dark:border-dark-border hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            ยกเลิก
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-lg font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors"
          >
            ลบ
          </button>
        </div>
      </div>
    </div>
  );
}

// ==============================================
// MAIN PAGE
// ==============================================
const AGENT_ID = 'demo_agent'; // TODO: Get from auth

export default function AgentClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [summary, setSummary] = useState({
    total: 0,
    vip: 0,
    regular: 0,
    new: 0,
    inactive: 0,
    totalRevenue: 0,
    avgOrderValue: 0,
  });
  const [existingTags, setExistingTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [segmentFilter, setSegmentFilter] = useState<ClientSegment | 'all'>('all');
  const [tagFilter, setTagFilter] = useState<string>('');
  const [sortField, setSortField] = useState<'name' | 'totalOrders' | 'totalSpent' | 'createdAt'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; client: Client | null }>({
    isOpen: false,
    client: null,
  });

  // Load data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = useCallback(() => {
    setIsLoading(true);
    try {
      const allClients = getClients(AGENT_ID);
      const clientSummary = getClientSummary(AGENT_ID);
      const tags = getAllClientTags(AGENT_ID);
      
      setClients(allClients);
      setSummary(clientSummary);
      setExistingTags(tags);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Filtered and sorted clients
  const filteredClients = useMemo(() => {
    const filter: ClientFilter = {
      search: searchQuery || undefined,
      segment: segmentFilter !== 'all' ? segmentFilter : undefined,
      tag: tagFilter || undefined,
    };
    const sort: ClientSort = {
      field: sortField,
      order: sortOrder,
    };
    return queryClients(AGENT_ID, filter, sort);
  }, [searchQuery, segmentFilter, tagFilter, sortField, sortOrder]);

  // Handlers
  const handleAddClient = (input: { name: string; contact: string; email?: string; note?: string; tags?: string[] }) => {
    createClient(AGENT_ID, input);
    loadData();
  };

  const handleDeleteClient = () => {
    if (deleteModal.client) {
      deleteClient(AGENT_ID, deleteModal.client.id);
      loadData();
      setDeleteModal({ isOpen: false, client: null });
    }
  };

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary dark:text-dark-text-dark">จัดการลูกค้า</h1>
          <p className="text-secondary dark:text-dark-text-light">จัดการข้อมูลลูกค้าและติดตามยอดซื้อ</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-primary text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
        >
          <UserPlusIcon />
          เพิ่มลูกค้าใหม่
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="ลูกค้าทั้งหมด"
          value={summary.total}
          icon={<UsersIcon />}
          color="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
        />
        <StatCard
          title="VIP"
          value={summary.vip}
          icon={<CrownIcon />}
          color="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
        />
        <StatCard
          title="ประจำ"
          value={summary.regular}
          icon={<StarIcon />}
          color="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
        />
        <StatCard
          title="รายได้รวม"
          value={formatCurrency(summary.totalRevenue)}
          icon={<span className="text-lg">฿</span>}
          color="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
        />
      </div>

      {/* Filters */}
      <div className="bg-surface dark:bg-dark-surface rounded-xl p-4 border border-default dark:border-dark-border">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
              <SearchIcon />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาชื่อ, เบอร์โทร, email..."
              className="w-full pl-10 pr-4 py-2 bg-main dark:bg-dark-bg border border-default dark:border-dark-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>
          
          {/* Segment Filter */}
          <select
            value={segmentFilter}
            onChange={(e) => setSegmentFilter(e.target.value as ClientSegment | 'all')}
            className="px-4 py-2 bg-main dark:bg-dark-bg border border-default dark:border-dark-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
          >
            <option value="all">ทุกกลุ่ม</option>
            <option value="vip">VIP</option>
            <option value="regular">ประจำ</option>
            <option value="new">ใหม่</option>
            <option value="inactive">ไม่แอคทีฟ</option>
          </select>
          
          {/* Tag Filter */}
          {existingTags.length > 0 && (
            <select
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
              className="px-4 py-2 bg-main dark:bg-dark-bg border border-default dark:border-dark-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
            >
              <option value="">ทุก Tag</option>
              {existingTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Client Table */}
      <div className="bg-surface dark:bg-dark-surface rounded-xl border border-default dark:border-dark-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-default dark:divide-dark-border">
            <thead className="bg-main dark:bg-dark-bg">
              <tr>
                <th
                  onClick={() => toggleSort('name')}
                  className="px-6 py-3 text-left text-xs font-bold uppercase cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  ลูกค้า {sortField === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase">กลุ่ม</th>
                <th
                  onClick={() => toggleSort('totalOrders')}
                  className="px-6 py-3 text-center text-xs font-bold uppercase cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  ออเดอร์ {sortField === 'totalOrders' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  onClick={() => toggleSort('totalSpent')}
                  className="px-6 py-3 text-right text-xs font-bold uppercase cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  ยอดซื้อรวม {sortField === 'totalSpent' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-3 text-center text-xs font-bold uppercase">ซื้อล่าสุด</th>
                <th className="px-6 py-3 text-center text-xs font-bold uppercase">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-default dark:divide-dark-border">
              {filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-secondary dark:text-dark-text-light">
                    {searchQuery || segmentFilter !== 'all' || tagFilter
                      ? 'ไม่พบลูกค้าที่ตรงกับเงื่อนไข'
                      : 'ยังไม่มีลูกค้า กดปุ่ม "เพิ่มลูกค้าใหม่" เพื่อเริ่มต้น'}
                  </td>
                </tr>
              ) : (
                filteredClients.map(client => (
                  <tr key={client.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-primary dark:text-dark-text-dark">{client.name}</p>
                        <p className="text-sm text-secondary dark:text-dark-text-light">{client.contact}</p>
                        {client.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {client.tags.slice(0, 3).map(tag => (
                              <TagBadge key={tag} tag={tag} />
                            ))}
                            {client.tags.length > 3 && (
                              <span className="text-xs text-secondary dark:text-dark-text-light">
                                +{client.tags.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <SegmentBadge segment={client.segment} />
                        <LoyaltyBadge tier={client.loyaltyTier} />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center font-medium">{client.totalOrders}</td>
                    <td className="px-6 py-4 text-right font-medium">{formatCurrency(client.totalSpent)}</td>
                    <td className="px-6 py-4 text-center text-sm text-secondary dark:text-dark-text-light">
                      {formatDate(client.lastOrderDate)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center items-center gap-2">
                        <Link
                          href={`/agent/clients/${client.id}`}
                          className="p-1.5 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                          title="ดูรายละเอียด"
                        >
                          <EyeIcon />
                        </Link>
                        <Link
                          href={`/agent/clients/${client.id}/edit`}
                          className="p-1.5 text-amber-500 hover:bg-amber-100 dark:hover:bg-amber-900/30 rounded-lg transition-colors"
                          title="แก้ไข"
                        >
                          <PencilIcon />
                        </Link>
                        <button
                          onClick={() => setDeleteModal({ isOpen: true, client })}
                          className="p-1.5 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                          title="ลบ"
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Footer */}
        {filteredClients.length > 0 && (
          <div className="px-6 py-3 border-t border-default dark:border-dark-border bg-main dark:bg-dark-bg">
            <p className="text-sm text-secondary dark:text-dark-text-light">
              แสดง {filteredClients.length} จาก {clients.length} รายการ
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      <AddClientModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddClient}
        existingTags={existingTags}
      />
      
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, client: null })}
        onConfirm={handleDeleteClient}
        clientName={deleteModal.client?.name || ''}
      />
    </div>
  );
}
