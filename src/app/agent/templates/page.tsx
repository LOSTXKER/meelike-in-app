"use client";

import React, { useState, useEffect } from 'react';
import { AgentHeader } from '../components';
import {
  getQuickReplies,
  createQuickReply,
  updateQuickReply,
  deleteQuickReply,
  getTemplateSummary,
  initializeDefaultQuickReplies,
} from '@/app/utils/storage/templates';
import type { QuickReplyTemplate, QuickReplyCategory, CreateQuickReplyInput } from '@/app/types/template';
import {
  getQuickReplyCategoryLabel,
  getQuickReplyCategoryColor,
  QUICK_REPLY_VARIABLES,
  validateShortcut,
} from '@/app/types/template';

// Icons
const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const EditIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const CopyIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
  </svg>
);

const MessageIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const MOCK_AGENT_ID = 'demo_agent';

const CATEGORIES: QuickReplyCategory[] = [
  'greeting',
  'payment',
  'confirmation',
  'progress',
  'completion',
  'issue',
  'other',
];

export default function AgentTemplatesPage() {
  const [templates, setTemplates] = useState<QuickReplyTemplate[]>([]);
  const [activeCategory, setActiveCategory] = useState<QuickReplyCategory | 'all'>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<QuickReplyTemplate | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    // Initialize default templates if none exist
    initializeDefaultQuickReplies(MOCK_AGENT_ID);
    loadTemplates();
  }, []);

  const loadTemplates = () => {
    const data = getQuickReplies(MOCK_AGENT_ID);
    setTemplates(data);
  };

  const filteredTemplates = templates.filter(t => {
    if (activeCategory === 'all') return true;
    return t.category === activeCategory;
  });

  const handleCopy = (message: string, id: string) => {
    navigator.clipboard.writeText(message);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (templateId: string) => {
    if (confirm('ต้องการลบข้อความนี้หรือไม่?')) {
      deleteQuickReply(MOCK_AGENT_ID, templateId);
      loadTemplates();
    }
  };

  const handleEdit = (template: QuickReplyTemplate) => {
    setEditingTemplate(template);
    setShowModal(true);
  };

  const handleCreate = () => {
    setEditingTemplate(null);
    setShowModal(true);
  };

  const summary = getTemplateSummary(MOCK_AGENT_ID);

  return (
    <>
      <AgentHeader
        title="ข้อความตอบกลับด่วน"
        subtitle="จัดการเทมเพลตข้อความสำหรับตอบลูกค้าอย่างรวดเร็ว"
      />

      <div className="flex-1 overflow-y-auto p-4 lg:p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-surface rounded-xl border border-default p-4">
              <p className="text-2xl font-bold text-primary">{summary.quickReplies}</p>
              <p className="text-sm text-secondary">ข้อความทั้งหมด</p>
            </div>
            <div className="bg-surface rounded-xl border border-default p-4">
              <p className="text-2xl font-bold text-primary">{summary.quickReplyUsage}</p>
              <p className="text-sm text-secondary">ใช้งานแล้ว</p>
            </div>
            <div className="bg-surface rounded-xl border border-default p-4">
              <p className="text-2xl font-bold text-primary">{templates.filter(t => t.isActive).length}</p>
              <p className="text-sm text-secondary">เปิดใช้งาน</p>
            </div>
            <div className="bg-surface rounded-xl border border-default p-4">
              <p className="text-2xl font-bold text-primary">{templates.filter(t => t.shortcut).length}</p>
              <p className="text-sm text-secondary">มี Shortcut</p>
            </div>
          </div>

          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                  activeCategory === 'all'
                    ? 'bg-brand-primary text-white border-brand-primary'
                    : 'bg-surface border-default text-secondary hover:bg-hover'
                }`}
              >
                ทั้งหมด
              </button>
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                    activeCategory === cat
                      ? 'bg-brand-primary text-white border-brand-primary'
                      : 'bg-surface border-default text-secondary hover:bg-hover'
                  }`}
                >
                  {getQuickReplyCategoryLabel(cat)}
                </button>
              ))}
            </div>

            {/* Add Button */}
            <button
              onClick={handleCreate}
              className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors"
            >
              <PlusIcon />
              <span>เพิ่มข้อความ</span>
            </button>
          </div>

          {/* Templates List */}
          <div className="grid gap-4">
            {filteredTemplates.length === 0 ? (
              <div className="bg-surface rounded-xl border border-default p-12 text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 mb-4">
                  <MessageIcon />
                </div>
                <h3 className="font-medium text-primary mb-2">ไม่มีข้อความ</h3>
                <p className="text-sm text-secondary mb-4">
                  {activeCategory === 'all' 
                    ? 'ยังไม่มีข้อความตอบกลับด่วน'
                    : `ไม่มีข้อความในหมวด "${getQuickReplyCategoryLabel(activeCategory)}"`}
                </p>
                <button
                  onClick={handleCreate}
                  className="text-brand-primary font-medium hover:underline"
                >
                  สร้างข้อความแรก
                </button>
              </div>
            ) : (
              filteredTemplates.map(template => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onCopy={() => handleCopy(template.message, template.id)}
                  onEdit={() => handleEdit(template)}
                  onDelete={() => handleDelete(template.id)}
                  copied={copiedId === template.id}
                />
              ))
            )}
          </div>

          {/* Variables Reference */}
          <div className="bg-surface rounded-xl border border-default p-4">
            <h3 className="font-medium text-primary mb-3">ตัวแปรที่ใช้ได้</h3>
            <div className="flex flex-wrap gap-2">
              {QUICK_REPLY_VARIABLES.map(v => (
                <div
                  key={v.name}
                  className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm"
                  title={v.description}
                >
                  <span className="font-mono text-brand-primary">{v.placeholder}</span>
                  <span className="text-secondary ml-2">{v.description}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <TemplateModal
          template={editingTemplate}
          onClose={() => {
            setShowModal(false);
            setEditingTemplate(null);
          }}
          onSave={() => {
            loadTemplates();
            setShowModal(false);
            setEditingTemplate(null);
          }}
        />
      )}
    </>
  );
}

// Template Card Component
function TemplateCard({
  template,
  onCopy,
  onEdit,
  onDelete,
  copied,
}: {
  template: QuickReplyTemplate;
  onCopy: () => void;
  onEdit: () => void;
  onDelete: () => void;
  copied: boolean;
}) {
  return (
    <div className="bg-surface rounded-xl border border-default p-4 hover:shadow-md transition-all">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-medium text-primary">{template.name}</h4>
            <span className={`px-2 py-0.5 text-xs rounded-full ${getQuickReplyCategoryColor(template.category)}`}>
              {getQuickReplyCategoryLabel(template.category)}
            </span>
            {template.shortcut && (
              <span className="px-2 py-0.5 text-xs font-mono bg-gray-100 dark:bg-gray-800 rounded text-secondary">
                {template.shortcut}
              </span>
            )}
          </div>

          {/* Message Preview */}
          <p className="text-sm text-secondary whitespace-pre-wrap line-clamp-3">
            {template.message}
          </p>

          {/* Variables */}
          {template.variables.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {template.variables.map(v => (
                <span key={v} className="text-xs font-mono text-brand-primary bg-brand-primary/10 px-1.5 py-0.5 rounded">
                  {`{${v}}`}
                </span>
              ))}
            </div>
          )}

          {/* Stats */}
          <p className="text-xs text-gray-400 mt-2">
            ใช้งาน {template.usageCount} ครั้ง
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={onCopy}
            className={`p-2 rounded-lg transition-colors ${
              copied 
                ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' 
                : 'hover:bg-hover text-secondary hover:text-primary'
            }`}
            title="คัดลอก"
          >
            {copied ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <CopyIcon />
            )}
          </button>
          <button
            onClick={onEdit}
            className="p-2 rounded-lg hover:bg-hover text-secondary hover:text-primary transition-colors"
            title="แก้ไข"
          >
            <EditIcon />
          </button>
          <button
            onClick={onDelete}
            className="p-2 rounded-lg hover:bg-error/10 text-secondary hover:text-error transition-colors"
            title="ลบ"
          >
            <TrashIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

// Create/Edit Modal
function TemplateModal({
  template,
  onClose,
  onSave,
}: {
  template: QuickReplyTemplate | null;
  onClose: () => void;
  onSave: () => void;
}) {
  const [name, setName] = useState(template?.name || '');
  const [category, setCategory] = useState<QuickReplyCategory>(template?.category || 'greeting');
  const [message, setMessage] = useState(template?.message || '');
  const [shortcut, setShortcut] = useState(template?.shortcut || '');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('กรุณากรอกชื่อข้อความ');
      return;
    }

    if (!message.trim()) {
      setError('กรุณากรอกข้อความ');
      return;
    }

    if (shortcut) {
      const validation = validateShortcut(shortcut);
      if (!validation.valid) {
        setError(validation.error || 'Shortcut ไม่ถูกต้อง');
        return;
      }
    }

    if (template) {
      // Update
      updateQuickReply(MOCK_AGENT_ID, template.id, {
        name: name.trim(),
        category,
        message: message.trim(),
        shortcut: shortcut.trim() || undefined,
      });
    } else {
      // Create
      createQuickReply(MOCK_AGENT_ID, {
        name: name.trim(),
        category,
        message: message.trim(),
        shortcut: shortcut.trim() || undefined,
      });
    }

    onSave();
  };

  const insertVariable = (placeholder: string) => {
    setMessage(prev => prev + placeholder);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-default">
          <h3 className="text-lg font-bold text-primary">
            {template ? 'แก้ไขข้อความ' : 'เพิ่มข้อความใหม่'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-hover transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {error && (
            <div className="p-3 bg-error/10 border border-error/30 rounded-lg text-sm text-error">
              {error}
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-primary mb-1">
              ชื่อข้อความ *
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="เช่น ทักทายลูกค้า, แจ้งยอดชำระ"
              className="w-full px-3 py-2 rounded-lg border border-default bg-main text-primary focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-primary mb-1">
              หมวดหมู่
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as QuickReplyCategory)}
              className="w-full px-3 py-2 rounded-lg border border-default bg-main text-primary focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>
                  {getQuickReplyCategoryLabel(cat)}
                </option>
              ))}
            </select>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-primary mb-1">
              ข้อความ *
            </label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={5}
              placeholder="พิมพ์ข้อความที่ต้องการ..."
              className="w-full px-3 py-2 rounded-lg border border-default bg-main text-primary focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary resize-none"
            />
            {/* Variable Buttons */}
            <div className="flex flex-wrap gap-1 mt-2">
              {QUICK_REPLY_VARIABLES.map(v => (
                <button
                  key={v.name}
                  type="button"
                  onClick={() => insertVariable(v.placeholder)}
                  className="px-2 py-1 text-xs font-mono bg-gray-100 dark:bg-gray-800 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  title={v.description}
                >
                  {v.placeholder}
                </button>
              ))}
            </div>
          </div>

          {/* Shortcut */}
          <div>
            <label className="block text-sm font-medium text-primary mb-1">
              Shortcut (ไม่บังคับ)
            </label>
            <input
              type="text"
              value={shortcut}
              onChange={e => setShortcut(e.target.value.toLowerCase())}
              placeholder="เช่น /hi, /pay, /done"
              className="w-full px-3 py-2 rounded-lg border border-default bg-main text-primary font-mono focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary"
            />
            <p className="text-xs text-secondary mt-1">
              ใช้สำหรับเรียกข้อความด่วน (ต้องเริ่มด้วย /)
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-default rounded-lg text-secondary hover:bg-hover transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors"
            >
              {template ? 'บันทึก' : 'สร้าง'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

