// src/app/utils/storage/clients.ts
// ═══════════════════════════════════════════════════════════════════════════
// 👥 CLIENT STORAGE - localStorage utilities
// ═══════════════════════════════════════════════════════════════════════════

import { AgentClient, ClientStats, CreateClientInput, ClientFilter, ClientSegment } from '@/app/types/client';
import { getFromStorage, saveToStorage, generateId } from './base';
import { getBills } from './bills';

const CLIENTS_KEY = 'meelike_clients';

// ─────────────────────────────────────────────────────────────────────────────
// Helper: Calculate Client Segment
// ─────────────────────────────────────────────────────────────────────────────

const calculateSegment = (totalSpent: number, totalOrders: number, lastOrderAt?: string): ClientSegment => {
  // VIP: ยอดซื้อ ฿5,000+
  if (totalSpent >= 5000) return 'vip';
  
  // Inactive: ไม่ซื้อ 30+ วัน
  if (lastOrderAt) {
    const daysSinceLastOrder = Math.floor(
      (Date.now() - new Date(lastOrderAt).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysSinceLastOrder >= 30) return 'inactive';
  }
  
  // Regular: ซื้อ 3+ ครั้ง
  if (totalOrders >= 3) return 'regular';
  
  // New: ซื้อครั้งแรก
  return 'new';
};

// ─────────────────────────────────────────────────────────────────────────────
// Get Clients
// ─────────────────────────────────────────────────────────────────────────────

export const getClients = (agentId: string, filter?: ClientFilter): AgentClient[] => {
  const clients = getFromStorage<AgentClient[]>(CLIENTS_KEY, []);
  let filtered = clients.filter(client => client.agentId === agentId);
  
  if (filter) {
    // Filter by segment
    if (filter.segment && filter.segment !== 'all') {
      filtered = filtered.filter(client => client.segment === filter.segment);
    }
    
    // Filter by tags
    if (filter.tags && filter.tags.length > 0) {
      filtered = filtered.filter(client => 
        filter.tags!.some(tag => client.tags.includes(tag))
      );
    }
    
    // Search
    if (filter.search) {
      const search = filter.search.toLowerCase();
      filtered = filtered.filter(client =>
        client.name.toLowerCase().includes(search) ||
        client.phone?.toLowerCase().includes(search) ||
        client.email?.toLowerCase().includes(search)
      );
    }
  }
  
  // Sort by last order (newest first), then by name
  return filtered.sort((a, b) => {
    if (a.lastOrderAt && b.lastOrderAt) {
      return new Date(b.lastOrderAt).getTime() - new Date(a.lastOrderAt).getTime();
    }
    return a.name.localeCompare(b.name);
  });
};

export const getClientById = (clientId: string): AgentClient | null => {
  const clients = getFromStorage<AgentClient[]>(CLIENTS_KEY, []);
  return clients.find(client => client.id === clientId) || null;
};

// ─────────────────────────────────────────────────────────────────────────────
// Create Client
// ─────────────────────────────────────────────────────────────────────────────

export const createClient = (agentId: string, input: CreateClientInput): AgentClient => {
  const clients = getFromStorage<AgentClient[]>(CLIENTS_KEY, []);
  
  const newClient: AgentClient = {
    id: `CLIENT-${generateId(6)}`,
    agentId,
    name: input.name,
    contactPerson: input.contactPerson,
    phone: input.phone,
    email: input.email,
    socialMedia: input.socialMedia,
    tags: input.tags || [],
    notes: input.notes,
    segment: 'new',
    totalSpent: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  clients.push(newClient);
  saveToStorage(CLIENTS_KEY, clients);
  
  return newClient;
};

// ─────────────────────────────────────────────────────────────────────────────
// Update Client
// ─────────────────────────────────────────────────────────────────────────────

export const updateClient = (clientId: string, updates: Partial<CreateClientInput>): AgentClient | null => {
  const clients = getFromStorage<AgentClient[]>(CLIENTS_KEY, []);
  const clientIndex = clients.findIndex(client => client.id === clientId);
  
  if (clientIndex === -1) return null;
  
  clients[clientIndex] = {
    ...clients[clientIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  saveToStorage(CLIENTS_KEY, clients);
  return clients[clientIndex];
};

// ─────────────────────────────────────────────────────────────────────────────
// Update Client Stats (called after bill completion)
// ─────────────────────────────────────────────────────────────────────────────

export const updateClientStats = (clientId: string, billAmount: number): void => {
  const clients = getFromStorage<AgentClient[]>(CLIENTS_KEY, []);
  const clientIndex = clients.findIndex(client => client.id === clientId);
  
  if (clientIndex === -1) return;
  
  const client = clients[clientIndex];
  const newTotalSpent = client.totalSpent + billAmount;
  const newTotalOrders = client.totalOrders + 1;
  const newAverageOrderValue = newTotalSpent / newTotalOrders;
  const lastOrderAt = new Date().toISOString();
  
  clients[clientIndex] = {
    ...client,
    totalSpent: newTotalSpent,
    totalOrders: newTotalOrders,
    averageOrderValue: newAverageOrderValue,
    lastOrderAt,
    segment: calculateSegment(newTotalSpent, newTotalOrders, lastOrderAt),
    updatedAt: new Date().toISOString(),
  };
  
  saveToStorage(CLIENTS_KEY, clients);
};

// ─────────────────────────────────────────────────────────────────────────────
// Get Client Stats
// ─────────────────────────────────────────────────────────────────────────────

export const getClientStats = (agentId: string): ClientStats => {
  const clients = getClients(agentId);
  
  return {
    vip: clients.filter(c => c.segment === 'vip').length,
    regular: clients.filter(c => c.segment === 'regular').length,
    new: clients.filter(c => c.segment === 'new').length,
    inactive: clients.filter(c => c.segment === 'inactive').length,
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// Delete Client
// ─────────────────────────────────────────────────────────────────────────────

export const deleteClient = (clientId: string): boolean => {
  const clients = getFromStorage<AgentClient[]>(CLIENTS_KEY, []);
  const filtered = clients.filter(client => client.id !== clientId);
  
  if (filtered.length === clients.length) return false;
  
  saveToStorage(CLIENTS_KEY, filtered);
  return true;
};

// ─────────────────────────────────────────────────────────────────────────────
// Get All Client Tags
// ─────────────────────────────────────────────────────────────────────────────

export const getAllClientTags = (agentId: string): string[] => {
  const clients = getClients(agentId);
  const tags = new Set<string>();
  
  clients.forEach(client => {
    client.tags.forEach(tag => tags.add(tag));
  });
  
  return Array.from(tags).sort();
};

