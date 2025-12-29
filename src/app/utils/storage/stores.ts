// ==============================================
// STORES STORAGE
// LocalStorage utilities for Agent Store management
// ==============================================

import { getItem, setItem, removeItem } from './base';
import type {
  StoreSettings,
  StoreService,
  StoreLevel,
  PaymentMethod,
  StoreAnalyticsBasic,
  StoreAnalyticsPro,
  CreateStoreServiceInput,
  UpdateStoreServiceInput,
  UpdateStoreSettingsInput,
} from '@/app/types/store';
import {
  generateStoreServiceId,
  generatePaymentMethodId,
  getMaxServicesForLevel,
} from '@/app/types/store';

const STORAGE_KEY = 'meelike_agent_stores';
const ANALYTICS_KEY = 'meelike_agent_store_analytics';

// ==============================================
// Store Settings CRUD
// ==============================================

/**
 * Get store settings by agent ID
 */
export function getStoreSettings(agentId: string): StoreSettings | null {
  const stores = getItem<Record<string, StoreSettings>>(STORAGE_KEY, {});
  return stores[agentId] || null;
}

/**
 * Get store by username (public)
 */
export function getStoreByUsername(username: string): StoreSettings | null {
  const stores = getItem<Record<string, StoreSettings>>(STORAGE_KEY, {});
  return Object.values(stores).find(s => s.username === username) || null;
}

/**
 * Create store settings
 */
export function createStoreSettings(
  agentId: string,
  username: string,
  level: StoreLevel = 'starter'
): StoreSettings {
  const stores = getItem<Record<string, StoreSettings>>(STORAGE_KEY, {});
  
  const now = new Date().toISOString();
  const store: StoreSettings = {
    id: `store_${agentId}`,
    agentId,
    username,
    storeName: username,
    paymentInfo: [],
    level,
    hideMeeLikeBranding: false,
    theme: 'auto',
    services: [],
    maxServices: getMaxServicesForLevel(level),
    totalViews: 0,
    totalOrders: 0,
    totalRevenue: 0,
    averageRating: 0,
    totalReviews: 0,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  };
  
  stores[agentId] = store;
  setItem(STORAGE_KEY, stores);
  
  return store;
}

/**
 * Update store settings
 */
export function updateStoreSettings(
  agentId: string,
  input: UpdateStoreSettingsInput
): StoreSettings | null {
  const stores = getItem<Record<string, StoreSettings>>(STORAGE_KEY, {});
  const store = stores[agentId];
  
  if (!store) return null;
  
  stores[agentId] = {
    ...store,
    ...input,
    updatedAt: new Date().toISOString(),
  };
  
  setItem(STORAGE_KEY, stores);
  return stores[agentId];
}

/**
 * Update store level (from subscription)
 */
export function updateStoreLevel(agentId: string, level: StoreLevel): StoreSettings | null {
  const stores = getItem<Record<string, StoreSettings>>(STORAGE_KEY, {});
  const store = stores[agentId];
  
  if (!store) return null;
  
  stores[agentId] = {
    ...store,
    level,
    maxServices: getMaxServicesForLevel(level),
    hideMeeLikeBranding: level === 'business' ? store.hideMeeLikeBranding : false,
    updatedAt: new Date().toISOString(),
  };
  
  setItem(STORAGE_KEY, stores);
  return stores[agentId];
}

/**
 * Delete store
 */
export function deleteStore(agentId: string): boolean {
  const stores = getItem<Record<string, StoreSettings>>(STORAGE_KEY, {});
  
  if (!stores[agentId]) return false;
  
  delete stores[agentId];
  setItem(STORAGE_KEY, stores);
  
  return true;
}

// ==============================================
// Store Services
// ==============================================

/**
 * Get all services for a store
 */
export function getStoreServices(agentId: string): StoreService[] {
  const store = getStoreSettings(agentId);
  return store?.services || [];
}

/**
 * Get active services for a store (public)
 */
export function getActiveStoreServices(agentId: string): StoreService[] {
  return getStoreServices(agentId).filter(s => s.isActive);
}

/**
 * Get store service by ID
 */
export function getStoreServiceById(agentId: string, serviceId: string): StoreService | null {
  const services = getStoreServices(agentId);
  return services.find(s => s.id === serviceId) || null;
}

/**
 * Add service to store
 */
export function addStoreService(
  agentId: string,
  input: CreateStoreServiceInput
): StoreService | null {
  const stores = getItem<Record<string, StoreSettings>>(STORAGE_KEY, {});
  const store = stores[agentId];
  
  if (!store) return null;
  
  // Check limit
  if (store.services.length >= store.maxServices && store.maxServices !== Infinity) {
    return null;
  }
  
  const now = new Date().toISOString();
  const service: StoreService = {
    id: generateStoreServiceId(),
    serviceId: input.serviceId,
    serviceName: input.serviceName,
    category: input.category,
    displayName: input.displayName,
    description: input.description,
    baseCost: input.baseCost,
    salePrice: input.salePrice,
    minQuantity: input.minQuantity || 100,
    maxQuantity: input.maxQuantity || 10000,
    isActive: input.isActive ?? true,
    sortOrder: store.services.length,
    totalSold: 0,
    createdAt: now,
    updatedAt: now,
  };
  
  store.services.push(service);
  store.updatedAt = now;
  
  setItem(STORAGE_KEY, stores);
  return service;
}

/**
 * Update store service
 */
export function updateStoreService(
  agentId: string,
  serviceId: string,
  input: UpdateStoreServiceInput
): StoreService | null {
  const stores = getItem<Record<string, StoreSettings>>(STORAGE_KEY, {});
  const store = stores[agentId];
  
  if (!store) return null;
  
  const serviceIndex = store.services.findIndex(s => s.id === serviceId);
  if (serviceIndex === -1) return null;
  
  store.services[serviceIndex] = {
    ...store.services[serviceIndex],
    ...input,
    updatedAt: new Date().toISOString(),
  };
  
  store.updatedAt = new Date().toISOString();
  setItem(STORAGE_KEY, stores);
  
  return store.services[serviceIndex];
}

/**
 * Remove service from store
 */
export function removeStoreService(agentId: string, serviceId: string): boolean {
  const stores = getItem<Record<string, StoreSettings>>(STORAGE_KEY, {});
  const store = stores[agentId];
  
  if (!store) return false;
  
  const serviceIndex = store.services.findIndex(s => s.id === serviceId);
  if (serviceIndex === -1) return false;
  
  store.services.splice(serviceIndex, 1);
  store.updatedAt = new Date().toISOString();
  
  setItem(STORAGE_KEY, stores);
  return true;
}

/**
 * Reorder store services
 */
export function reorderStoreServices(agentId: string, serviceIds: string[]): boolean {
  const stores = getItem<Record<string, StoreSettings>>(STORAGE_KEY, {});
  const store = stores[agentId];
  
  if (!store) return false;
  
  // Create a map of services
  const serviceMap = new Map(store.services.map(s => [s.id, s]));
  
  // Reorder based on provided IDs
  const reorderedServices: StoreService[] = [];
  serviceIds.forEach((id, index) => {
    const service = serviceMap.get(id);
    if (service) {
      reorderedServices.push({ ...service, sortOrder: index });
    }
  });
  
  // Add any missing services at the end
  store.services.forEach(service => {
    if (!serviceIds.includes(service.id)) {
      reorderedServices.push({ ...service, sortOrder: reorderedServices.length });
    }
  });
  
  store.services = reorderedServices;
  store.updatedAt = new Date().toISOString();
  
  setItem(STORAGE_KEY, stores);
  return true;
}

// ==============================================
// Payment Methods
// ==============================================

/**
 * Get payment methods
 */
export function getPaymentMethods(agentId: string): PaymentMethod[] {
  const store = getStoreSettings(agentId);
  return store?.paymentInfo || [];
}

/**
 * Add payment method
 */
export function addPaymentMethod(
  agentId: string,
  method: Omit<PaymentMethod, 'id' | 'sortOrder'>
): PaymentMethod | null {
  const stores = getItem<Record<string, StoreSettings>>(STORAGE_KEY, {});
  const store = stores[agentId];
  
  if (!store) return null;
  
  const paymentMethod: PaymentMethod = {
    ...method,
    id: generatePaymentMethodId(),
    sortOrder: store.paymentInfo.length,
  };
  
  store.paymentInfo.push(paymentMethod);
  store.updatedAt = new Date().toISOString();
  
  setItem(STORAGE_KEY, stores);
  return paymentMethod;
}

/**
 * Update payment method
 */
export function updatePaymentMethod(
  agentId: string,
  methodId: string,
  updates: Partial<PaymentMethod>
): PaymentMethod | null {
  const stores = getItem<Record<string, StoreSettings>>(STORAGE_KEY, {});
  const store = stores[agentId];
  
  if (!store) return null;
  
  const methodIndex = store.paymentInfo.findIndex(m => m.id === methodId);
  if (methodIndex === -1) return null;
  
  store.paymentInfo[methodIndex] = {
    ...store.paymentInfo[methodIndex],
    ...updates,
  };
  
  store.updatedAt = new Date().toISOString();
  setItem(STORAGE_KEY, stores);
  
  return store.paymentInfo[methodIndex];
}

/**
 * Remove payment method
 */
export function removePaymentMethod(agentId: string, methodId: string): boolean {
  const stores = getItem<Record<string, StoreSettings>>(STORAGE_KEY, {});
  const store = stores[agentId];
  
  if (!store) return false;
  
  const methodIndex = store.paymentInfo.findIndex(m => m.id === methodId);
  if (methodIndex === -1) return false;
  
  store.paymentInfo.splice(methodIndex, 1);
  store.updatedAt = new Date().toISOString();
  
  setItem(STORAGE_KEY, stores);
  return true;
}

// ==============================================
// Store Stats
// ==============================================

/**
 * Increment store view count
 */
export function incrementStoreViews(agentId: string): void {
  const stores = getItem<Record<string, StoreSettings>>(STORAGE_KEY, {});
  const store = stores[agentId];
  
  if (!store) return;
  
  store.totalViews++;
  setItem(STORAGE_KEY, stores);
}

/**
 * Update store stats after order
 */
export function updateStoreOrderStats(
  agentId: string,
  orderAmount: number
): void {
  const stores = getItem<Record<string, StoreSettings>>(STORAGE_KEY, {});
  const store = stores[agentId];
  
  if (!store) return;
  
  store.totalOrders++;
  store.totalRevenue += orderAmount;
  store.updatedAt = new Date().toISOString();
  
  setItem(STORAGE_KEY, stores);
}

/**
 * Update store rating
 */
export function updateStoreRating(
  agentId: string,
  newRating: number,
  totalReviews: number
): void {
  const stores = getItem<Record<string, StoreSettings>>(STORAGE_KEY, {});
  const store = stores[agentId];
  
  if (!store) return;
  
  // Calculate new average
  const totalRating = store.averageRating * store.totalReviews + newRating;
  store.totalReviews = totalReviews;
  store.averageRating = totalRating / totalReviews;
  store.updatedAt = new Date().toISOString();
  
  setItem(STORAGE_KEY, stores);
}

/**
 * Update service sold count
 */
export function updateServiceSoldCount(
  agentId: string,
  storeServiceId: string,
  quantity: number
): void {
  const stores = getItem<Record<string, StoreSettings>>(STORAGE_KEY, {});
  const store = stores[agentId];
  
  if (!store) return;
  
  const serviceIndex = store.services.findIndex(s => s.id === storeServiceId);
  if (serviceIndex !== -1) {
    store.services[serviceIndex].totalSold += quantity;
  }
  
  setItem(STORAGE_KEY, stores);
}

// ==============================================
// Analytics
// ==============================================

/**
 * Get basic store analytics
 */
export function getBasicAnalytics(
  agentId: string,
  period: 'today' | '7days' | '30days' | 'all' = '7days'
): StoreAnalyticsBasic {
  const store = getStoreSettings(agentId);
  
  if (!store) {
    return { period, views: 0, orders: 0, revenue: 0 };
  }
  
  // In real app, would calculate based on period
  // For mock, return totals
  return {
    period,
    views: store.totalViews,
    orders: store.totalOrders,
    revenue: store.totalRevenue,
  };
}

// ==============================================
// Validation
// ==============================================

/**
 * Check if username is available
 */
export function isUsernameAvailable(username: string, excludeAgentId?: string): boolean {
  const stores = getItem<Record<string, StoreSettings>>(STORAGE_KEY, {});
  
  return !Object.values(stores).some(
    s => s.username === username && s.agentId !== excludeAgentId
  );
}

/**
 * Check if store exists
 */
export function storeExists(agentId: string): boolean {
  return getStoreSettings(agentId) !== null;
}

// ==============================================
// Utilities
// ==============================================

/**
 * Get store count
 */
export function getStoreCount(): number {
  const stores = getItem<Record<string, StoreSettings>>(STORAGE_KEY, {});
  return Object.keys(stores).length;
}

/**
 * Get all stores (admin)
 */
export function getAllStores(): StoreSettings[] {
  const stores = getItem<Record<string, StoreSettings>>(STORAGE_KEY, {});
  return Object.values(stores);
}

/**
 * Clear store
 */
export function clearStore(agentId: string): void {
  deleteStore(agentId);
}

/**
 * Clear all stores (admin)
 */
export function clearAllStores(): void {
  removeItem(STORAGE_KEY);
  removeItem(ANALYTICS_KEY);
}

