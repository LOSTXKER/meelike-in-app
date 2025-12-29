// ==============================================
// TEMPLATES STORAGE
// LocalStorage utilities for Bill Templates & Quick Replies
// ==============================================

import { getItem, setItem, removeItem } from './base';
import type {
  BillTemplate,
  QuickReplyTemplate,
  QuickReplyCategory,
  TemplateSummary,
  CreateBillTemplateInput,
  UpdateBillTemplateInput,
  CreateQuickReplyInput,
  UpdateQuickReplyInput,
} from '@/app/types/template';
import {
  generateBillTemplateId,
  generateQuickReplyId,
  parseMessageVariables,
  DEFAULT_QUICK_REPLIES,
} from '@/app/types/template';

const BILL_TEMPLATES_KEY = 'meelike_agent_bill_templates';
const QUICK_REPLIES_KEY = 'meelike_agent_quick_replies';

// ==============================================
// Bill Templates CRUD
// ==============================================

/**
 * Get all bill templates for an agent
 */
export function getBillTemplates(agentId: string): BillTemplate[] {
  const allTemplates = getItem<Record<string, BillTemplate[]>>(BILL_TEMPLATES_KEY, {});
  return allTemplates[agentId] || [];
}

/**
 * Get bill template by ID
 */
export function getBillTemplateById(agentId: string, templateId: string): BillTemplate | null {
  const templates = getBillTemplates(agentId);
  return templates.find(t => t.id === templateId) || null;
}

/**
 * Get active bill templates
 */
export function getActiveBillTemplates(agentId: string): BillTemplate[] {
  return getBillTemplates(agentId).filter(t => t.isActive);
}

/**
 * Create bill template
 */
export function createBillTemplate(agentId: string, input: CreateBillTemplateInput): BillTemplate {
  const allTemplates = getItem<Record<string, BillTemplate[]>>(BILL_TEMPLATES_KEY, {});
  
  if (!allTemplates[agentId]) {
    allTemplates[agentId] = [];
  }
  
  const now = new Date().toISOString();
  const template: BillTemplate = {
    id: generateBillTemplateId(),
    agentId,
    name: input.name,
    description: input.description,
    serviceId: input.serviceId,
    serviceName: input.serviceName,
    category: input.category,
    quantity: input.quantity,
    salePrice: input.salePrice,
    usageCount: 0,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  };
  
  allTemplates[agentId].push(template);
  setItem(BILL_TEMPLATES_KEY, allTemplates);
  
  return template;
}

/**
 * Update bill template
 */
export function updateBillTemplate(
  agentId: string,
  templateId: string,
  input: UpdateBillTemplateInput
): BillTemplate | null {
  const allTemplates = getItem<Record<string, BillTemplate[]>>(BILL_TEMPLATES_KEY, {});
  const templates = allTemplates[agentId] || [];
  
  const index = templates.findIndex(t => t.id === templateId);
  if (index === -1) return null;
  
  templates[index] = {
    ...templates[index],
    ...input,
    updatedAt: new Date().toISOString(),
  };
  
  allTemplates[agentId] = templates;
  setItem(BILL_TEMPLATES_KEY, allTemplates);
  
  return templates[index];
}

/**
 * Increment template usage count
 */
export function incrementBillTemplateUsage(agentId: string, templateId: string): void {
  const allTemplates = getItem<Record<string, BillTemplate[]>>(BILL_TEMPLATES_KEY, {});
  const templates = allTemplates[agentId] || [];
  
  const index = templates.findIndex(t => t.id === templateId);
  if (index !== -1) {
    templates[index].usageCount++;
    allTemplates[agentId] = templates;
    setItem(BILL_TEMPLATES_KEY, allTemplates);
  }
}

/**
 * Delete bill template
 */
export function deleteBillTemplate(agentId: string, templateId: string): boolean {
  const allTemplates = getItem<Record<string, BillTemplate[]>>(BILL_TEMPLATES_KEY, {});
  const templates = allTemplates[agentId] || [];
  
  const index = templates.findIndex(t => t.id === templateId);
  if (index === -1) return false;
  
  templates.splice(index, 1);
  allTemplates[agentId] = templates;
  setItem(BILL_TEMPLATES_KEY, allTemplates);
  
  return true;
}

/**
 * Toggle bill template active
 */
export function toggleBillTemplateActive(agentId: string, templateId: string): BillTemplate | null {
  const template = getBillTemplateById(agentId, templateId);
  if (!template) return null;
  
  return updateBillTemplate(agentId, templateId, { isActive: !template.isActive });
}

// ==============================================
// Quick Replies CRUD
// ==============================================

/**
 * Get all quick replies for an agent
 */
export function getQuickReplies(agentId: string): QuickReplyTemplate[] {
  const allReplies = getItem<Record<string, QuickReplyTemplate[]>>(QUICK_REPLIES_KEY, {});
  return allReplies[agentId] || [];
}

/**
 * Get quick reply by ID
 */
export function getQuickReplyById(agentId: string, replyId: string): QuickReplyTemplate | null {
  const replies = getQuickReplies(agentId);
  return replies.find(r => r.id === replyId) || null;
}

/**
 * Get quick reply by shortcut
 */
export function getQuickReplyByShortcut(agentId: string, shortcut: string): QuickReplyTemplate | null {
  const replies = getQuickReplies(agentId);
  return replies.find(r => r.isActive && r.shortcut === shortcut) || null;
}

/**
 * Get active quick replies
 */
export function getActiveQuickReplies(agentId: string): QuickReplyTemplate[] {
  return getQuickReplies(agentId).filter(r => r.isActive);
}

/**
 * Get quick replies by category
 */
export function getQuickRepliesByCategory(
  agentId: string,
  category: QuickReplyCategory
): QuickReplyTemplate[] {
  return getQuickReplies(agentId).filter(r => r.category === category);
}

/**
 * Create quick reply
 */
export function createQuickReply(agentId: string, input: CreateQuickReplyInput): QuickReplyTemplate {
  const allReplies = getItem<Record<string, QuickReplyTemplate[]>>(QUICK_REPLIES_KEY, {});
  
  if (!allReplies[agentId]) {
    allReplies[agentId] = [];
  }
  
  const now = new Date().toISOString();
  const reply: QuickReplyTemplate = {
    id: generateQuickReplyId(),
    agentId,
    name: input.name,
    category: input.category,
    message: input.message,
    variables: parseMessageVariables(input.message),
    shortcut: input.shortcut,
    usageCount: 0,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  };
  
  allReplies[agentId].push(reply);
  setItem(QUICK_REPLIES_KEY, allReplies);
  
  return reply;
}

/**
 * Update quick reply
 */
export function updateQuickReply(
  agentId: string,
  replyId: string,
  input: UpdateQuickReplyInput
): QuickReplyTemplate | null {
  const allReplies = getItem<Record<string, QuickReplyTemplate[]>>(QUICK_REPLIES_KEY, {});
  const replies = allReplies[agentId] || [];
  
  const index = replies.findIndex(r => r.id === replyId);
  if (index === -1) return null;
  
  const updatedReply = {
    ...replies[index],
    ...input,
    updatedAt: new Date().toISOString(),
  };
  
  // Recalculate variables if message changed
  if (input.message) {
    updatedReply.variables = parseMessageVariables(input.message);
  }
  
  replies[index] = updatedReply;
  allReplies[agentId] = replies;
  setItem(QUICK_REPLIES_KEY, allReplies);
  
  return replies[index];
}

/**
 * Increment quick reply usage count
 */
export function incrementQuickReplyUsage(agentId: string, replyId: string): void {
  const allReplies = getItem<Record<string, QuickReplyTemplate[]>>(QUICK_REPLIES_KEY, {});
  const replies = allReplies[agentId] || [];
  
  const index = replies.findIndex(r => r.id === replyId);
  if (index !== -1) {
    replies[index].usageCount++;
    allReplies[agentId] = replies;
    setItem(QUICK_REPLIES_KEY, allReplies);
  }
}

/**
 * Delete quick reply
 */
export function deleteQuickReply(agentId: string, replyId: string): boolean {
  const allReplies = getItem<Record<string, QuickReplyTemplate[]>>(QUICK_REPLIES_KEY, {});
  const replies = allReplies[agentId] || [];
  
  const index = replies.findIndex(r => r.id === replyId);
  if (index === -1) return false;
  
  replies.splice(index, 1);
  allReplies[agentId] = replies;
  setItem(QUICK_REPLIES_KEY, allReplies);
  
  return true;
}

/**
 * Toggle quick reply active
 */
export function toggleQuickReplyActive(agentId: string, replyId: string): QuickReplyTemplate | null {
  const reply = getQuickReplyById(agentId, replyId);
  if (!reply) return null;
  
  return updateQuickReply(agentId, replyId, { isActive: !reply.isActive });
}

/**
 * Initialize default quick replies
 */
export function initializeDefaultQuickReplies(agentId: string): QuickReplyTemplate[] {
  const existing = getQuickReplies(agentId);
  if (existing.length > 0) return existing;
  
  const allReplies = getItem<Record<string, QuickReplyTemplate[]>>(QUICK_REPLIES_KEY, {});
  const now = new Date().toISOString();
  
  const defaultReplies: QuickReplyTemplate[] = DEFAULT_QUICK_REPLIES.map(template => ({
    id: generateQuickReplyId(),
    agentId,
    name: template.name,
    category: template.category,
    message: template.message,
    variables: template.variables,
    shortcut: template.shortcut,
    usageCount: 0,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  }));
  
  allReplies[agentId] = defaultReplies;
  setItem(QUICK_REPLIES_KEY, allReplies);
  
  return defaultReplies;
}

// ==============================================
// Statistics
// ==============================================

/**
 * Get template summary
 */
export function getTemplateSummary(agentId: string): TemplateSummary {
  const billTemplates = getBillTemplates(agentId);
  const quickReplies = getQuickReplies(agentId);
  
  return {
    billTemplates: billTemplates.length,
    billTemplateUsage: billTemplates.reduce((sum, t) => sum + t.usageCount, 0),
    quickReplies: quickReplies.length,
    quickReplyUsage: quickReplies.reduce((sum, r) => sum + r.usageCount, 0),
  };
}

/**
 * Get most used bill templates
 */
export function getMostUsedBillTemplates(agentId: string, limit: number = 5): BillTemplate[] {
  return getBillTemplates(agentId)
    .filter(t => t.isActive)
    .sort((a, b) => b.usageCount - a.usageCount)
    .slice(0, limit);
}

/**
 * Get most used quick replies
 */
export function getMostUsedQuickReplies(agentId: string, limit: number = 5): QuickReplyTemplate[] {
  return getQuickReplies(agentId)
    .filter(r => r.isActive)
    .sort((a, b) => b.usageCount - a.usageCount)
    .slice(0, limit);
}

// ==============================================
// Utilities
// ==============================================

/**
 * Get bill template count
 */
export function getBillTemplateCount(agentId: string): number {
  return getBillTemplates(agentId).length;
}

/**
 * Get quick reply count
 */
export function getQuickReplyCount(agentId: string): number {
  return getQuickReplies(agentId).length;
}

/**
 * Check if shortcut exists
 */
export function shortcutExists(
  agentId: string,
  shortcut: string,
  excludeId?: string
): boolean {
  const replies = getQuickReplies(agentId);
  return replies.some(r => r.shortcut === shortcut && r.id !== excludeId);
}

/**
 * Clear all templates for agent
 */
export function clearTemplates(agentId: string): void {
  const allBillTemplates = getItem<Record<string, BillTemplate[]>>(BILL_TEMPLATES_KEY, {});
  const allQuickReplies = getItem<Record<string, QuickReplyTemplate[]>>(QUICK_REPLIES_KEY, {});
  
  delete allBillTemplates[agentId];
  delete allQuickReplies[agentId];
  
  setItem(BILL_TEMPLATES_KEY, allBillTemplates);
  setItem(QUICK_REPLIES_KEY, allQuickReplies);
}

/**
 * Clear all templates (admin)
 */
export function clearAllTemplates(): void {
  removeItem(BILL_TEMPLATES_KEY);
  removeItem(QUICK_REPLIES_KEY);
}

