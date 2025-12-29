// src/app/utils/storage/stores.ts
// ═══════════════════════════════════════════════════════════════════════════
// 🏪 AGENT STORE STORAGE - localStorage utilities
// ═══════════════════════════════════════════════════════════════════════════

import { AgentStore, StoreService, StoreStats, CreateStoreInput, UpdateStoreServiceInput } from '@/app/types/store';
import { getFromStorage, saveToStorage, generateId } from './base';

const STORES_KEY = 'meelike_stores';

// ─────────────────────────────────────────────────────────────────────────────
// Get Store
// ─────────────────────────────────────────────────────────────────────────────

export const getStoreByAgentId = (agentId: string): AgentStore | null => {
  const stores = getFromStorage<AgentStore[]>(STORES_KEY, []);
  return stores.find(store => store.agentId === agentId) || null;
};

export const getStoreByUsername = (username: string): AgentStore | null => {
  const stores = getFromStorage<AgentStore[]>(STORES_KEY, []);
  return stores.find(store => store.username === username) || null;
};

// ─────────────────────────────────────────────────────────────────────────────
// Create Store
// ─────────────────────────────────────────────────────────────────────────────

export const createStore = (agentId: string, input: CreateStoreInput): AgentStore => {
  const stores = getFromStorage<AgentStore[]>(STORES_KEY, []);
  
  // Check if store already exists
  const existingStore = stores.find(store => store.agentId === agentId);
  if (existingStore) {
    throw new Error('Agent already has a store');
  }
  
  // Check if username is taken
  const usernameTaken = stores.find(store => store.username === input.username);
  if (usernameTaken) {
    throw new Error('Username is already taken');
  }
  
  const newStore: AgentStore = {
    id: `STORE-${generateId(6)}`,
    agentId,
    name: input.name,
    username: input.username,
    description: input.description,
    hideMeeLikeBranding: false,
    contactLine: input.contactLine,
    contactFacebook: input.contactFacebook,
    contactPhone: input.contactPhone,
    contactEmail: input.contactEmail,
    paymentInfo: input.paymentInfo,
    services: [],
    isActive: true,
    autoConfirmPayment: false,
    totalOrders: 0,
    totalRevenue: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  stores.push(newStore);
  saveToStorage(STORES_KEY, stores);
  
  return newStore;
};

// ─────────────────────────────────────────────────────────────────────────────
// Update Store
// ─────────────────────────────────────────────────────────────────────────────

export const updateStore = (agentId: string, updates: Partial<CreateStoreInput>): AgentStore | null => {
  const stores = getFromStorage<AgentStore[]>(STORES_KEY, []);
  const storeIndex = stores.findIndex(store => store.agentId === agentId);
  
  if (storeIndex === -1) return null;
  
  stores[storeIndex] = {
    ...stores[storeIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  saveToStorage(STORES_KEY, stores);
  return stores[storeIndex];
};

// ─────────────────────────────────────────────────────────────────────────────
// Store Services
// ─────────────────────────────────────────────────────────────────────────────

export const addStoreService = (agentId: string, input: UpdateStoreServiceInput): StoreService | null => {
  const stores = getFromStorage<AgentStore[]>(STORES_KEY, []);
  const storeIndex = stores.findIndex(store => store.agentId === agentId);
  
  if (storeIndex === -1) return null;
  
  // Check if service already exists
  const existingService = stores[storeIndex].services.find(
    s => s.serviceId === input.serviceId
  );
  
  if (existingService) {
    throw new Error('Service already added to store');
  }
  
  const newService: StoreService = {
    id: `SRV-${generateId(6)}`,
    serviceId: input.serviceId,
    serviceName: 'Service Name', // Should be fetched from services data
    category: 'Category', // Should be fetched from services data
    description: input.description,
    originalPrice: 100, // Should be fetched from services data
    salePrice: input.salePrice,
    isActive: input.isActive,
    sortOrder: stores[storeIndex].services.length,
    viewCount: 0,
    orderCount: 0,
  };
  
  stores[storeIndex].services.push(newService);
  stores[storeIndex].updatedAt = new Date().toISOString();
  
  saveToStorage(STORES_KEY, stores);
  return newService;
};

export const updateStoreService = (
  agentId: string,
  serviceId: number,
  updates: Partial<UpdateStoreServiceInput>
): StoreService | null => {
  const stores = getFromStorage<AgentStore[]>(STORES_KEY, []);
  const storeIndex = stores.findIndex(store => store.agentId === agentId);
  
  if (storeIndex === -1) return null;
  
  const serviceIndex = stores[storeIndex].services.findIndex(
    s => s.serviceId === serviceId
  );
  
  if (serviceIndex === -1) return null;
  
  stores[storeIndex].services[serviceIndex] = {
    ...stores[storeIndex].services[serviceIndex],
    ...updates,
  };
  
  stores[storeIndex].updatedAt = new Date().toISOString();
  
  saveToStorage(STORES_KEY, stores);
  return stores[storeIndex].services[serviceIndex];
};

export const removeStoreService = (agentId: string, serviceId: number): boolean => {
  const stores = getFromStorage<AgentStore[]>(STORES_KEY, []);
  const storeIndex = stores.findIndex(store => store.agentId === agentId);
  
  if (storeIndex === -1) return false;
  
  const originalLength = stores[storeIndex].services.length;
  stores[storeIndex].services = stores[storeIndex].services.filter(
    s => s.serviceId !== serviceId
  );
  
  if (stores[storeIndex].services.length === originalLength) return false;
  
  stores[storeIndex].updatedAt = new Date().toISOString();
  saveToStorage(STORES_KEY, stores);
  return true;
};

// ─────────────────────────────────────────────────────────────────────────────
// Store Stats
// ─────────────────────────────────────────────────────────────────────────────

export const getStoreStats = (agentId: string): StoreStats | null => {
  const store = getStoreByAgentId(agentId);
  if (!store) return null;
  
  const totalViews = store.services.reduce((sum, s) => sum + s.viewCount, 0);
  const totalOrders = store.services.reduce((sum, s) => sum + s.orderCount, 0);
  
  // Calculate top services
  const topServices = store.services
    .filter(s => s.orderCount > 0)
    .sort((a, b) => b.orderCount - a.orderCount)
    .slice(0, 5)
    .map(s => ({
      serviceId: s.serviceId,
      serviceName: s.serviceName,
      orderCount: s.orderCount,
      percentage: totalOrders > 0 ? (s.orderCount / totalOrders) * 100 : 0,
    }));
  
  return {
    views: totalViews,
    orders: totalOrders,
    revenue: store.totalRevenue,
    conversionRate: totalViews > 0 ? (totalOrders / totalViews) * 100 : 0,
    topServices,
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// Update Store Stats (called after order)
// ─────────────────────────────────────────────────────────────────────────────

export const incrementStoreServiceView = (username: string, serviceId: number): void => {
  const stores = getFromStorage<AgentStore[]>(STORES_KEY, []);
  const storeIndex = stores.findIndex(store => store.username === username);
  
  if (storeIndex === -1) return;
  
  const serviceIndex = stores[storeIndex].services.findIndex(
    s => s.serviceId === serviceId
  );
  
  if (serviceIndex === -1) return;
  
  stores[storeIndex].services[serviceIndex].viewCount++;
  saveToStorage(STORES_KEY, stores);
};

export const incrementStoreServiceOrder = (username: string, serviceId: number, amount: number): void => {
  const stores = getFromStorage<AgentStore[]>(STORES_KEY, []);
  const storeIndex = stores.findIndex(store => store.username === username);
  
  if (storeIndex === -1) return;
  
  const serviceIndex = stores[storeIndex].services.findIndex(
    s => s.serviceId === serviceId
  );
  
  if (serviceIndex === -1) return;
  
  stores[storeIndex].services[serviceIndex].orderCount++;
  stores[storeIndex].totalOrders++;
  stores[storeIndex].totalRevenue += amount;
  
  saveToStorage(STORES_KEY, stores);
};

