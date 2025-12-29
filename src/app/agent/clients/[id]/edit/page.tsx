// src/app/agent/clients/[id]/edit/page.tsx
"use client";

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Client, UpdateClientInput } from '@/app/types/client';
import { getClientById, updateClient, getAllClientTags, contactExists } from '@/app/utils/storage/clients';

// ==============================================
// ICONS
// ==============================================
const ArrowLeftIcon = () => (
  <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
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

// ==============================================
// MAIN PAGE
// ==============================================
const AGENT_ID = 'demo_agent'; // TODO: Get from auth

export default function EditClientPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  
  // Original client for comparison
  const [originalClient, setOriginalClient] = useState<Client | null>(null);
  const [existingTags, setExistingTags] = useState<string[]>([]);

  useEffect(() => {
    loadData();
  }, [resolvedParams.id]);

  const loadData = () => {
    setIsLoading(true);
    try {
      const clientData = getClientById(AGENT_ID, resolvedParams.id);
      if (clientData) {
        setOriginalClient(clientData);
        setName(clientData.name);
        setContact(clientData.contact);
        setEmail(clientData.email || '');
        setNote(clientData.note || '');
        setTags(clientData.tags);
      }
      const allTags = getAllClientTags(AGENT_ID);
      setExistingTags(allTags);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!originalClient) return;
    
    // Validate
    if (!name.trim()) {
      setError('กรุณากรอกชื่อลูกค้า');
      return;
    }
    if (!contact.trim()) {
      setError('กรุณากรอกข้อมูลติดต่อ');
      return;
    }
    
    // Check if contact changed and already exists
    if (contact.trim() !== originalClient.contact) {
      if (contactExists(AGENT_ID, contact.trim(), originalClient.id)) {
        setError('ข้อมูลติดต่อนี้ถูกใช้งานแล้ว');
        return;
      }
    }
    
    setIsSaving(true);
    try {
      const updates: UpdateClientInput = {
        name: name.trim(),
        contact: contact.trim(),
        email: email.trim() || undefined,
        note: note.trim() || undefined,
        tags,
      };
      
      const updated = updateClient(AGENT_ID, originalClient.id, updates);
      if (updated) {
        router.push(`/agent/clients/${originalClient.id}`);
      } else {
        setError('เกิดข้อผิดพลาดในการบันทึก');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const addNewTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const toggleExistingTag = (tag: string) => {
    if (tags.includes(tag)) {
      setTags(tags.filter(t => t !== tag));
    } else {
      setTags([...tags, tag]);
    }
  };

  const hasChanges = () => {
    if (!originalClient) return false;
    return (
      name !== originalClient.name ||
      contact !== originalClient.contact ||
      email !== (originalClient.email || '') ||
      note !== (originalClient.note || '') ||
      JSON.stringify(tags.sort()) !== JSON.stringify([...originalClient.tags].sort())
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  if (!originalClient) {
    return (
      <div className="text-center py-12">
        <p className="text-secondary dark:text-dark-text-light mb-4">ไม่พบข้อมูลลูกค้า</p>
        <Link href="/agent/clients" className="text-brand-primary hover:underline">
          กลับไปหน้ารายชื่อลูกค้า
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href={`/agent/clients/${originalClient.id}`}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ArrowLeftIcon />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-primary dark:text-dark-text-dark">แก้ไขข้อมูลลูกค้า</h1>
          <p className="text-secondary dark:text-dark-text-light">{originalClient.name}</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Basic Info */}
        <div className="bg-surface dark:bg-dark-surface rounded-xl p-6 border border-default dark:border-dark-border">
          <h2 className="text-lg font-bold mb-4 text-primary dark:text-dark-text-dark">ข้อมูลพื้นฐาน</h2>
          <div className="space-y-4">
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
          </div>
        </div>

        {/* Tags */}
        <div className="bg-surface dark:bg-dark-surface rounded-xl p-6 border border-default dark:border-dark-border">
          <h2 className="text-lg font-bold mb-4 text-primary dark:text-dark-text-dark flex items-center gap-2">
            <TagIcon />
            Tags
          </h2>
          
          {/* Selected tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-full bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-red-500 transition-colors ml-1"
                  >
                    <XMarkIcon />
                  </button>
                </span>
              ))}
            </div>
          )}
          
          {/* Existing tags (not selected) */}
          {existingTags.filter(t => !tags.includes(t)).length > 0 && (
            <div className="mb-4">
              <p className="text-xs text-secondary dark:text-dark-text-light mb-2">เลือก tag ที่มีอยู่:</p>
              <div className="flex flex-wrap gap-1">
                {existingTags.filter(t => !tags.includes(t)).map(tag => (
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
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              เพิ่ม
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Link
            href={`/agent/clients/${originalClient.id}`}
            className="flex-1 py-3 text-center rounded-lg font-semibold border border-default dark:border-dark-border hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            ยกเลิก
          </Link>
          <button
            type="submit"
            disabled={isSaving || !hasChanges()}
            className="flex-1 py-3 rounded-lg font-semibold bg-brand-primary text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข'}
          </button>
        </div>
      </form>
    </div>
  );
}

