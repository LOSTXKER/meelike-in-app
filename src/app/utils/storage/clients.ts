// ==============================================
// CLIENTS STORAGE
// LocalStorage utilities for Client management
// ==============================================

import { getItem, setItem, removeItem } from './base';
import type {
  Client,
  ClientSegment,
  LoyaltyTier,
  ClientSummary,
  ClientFilter,
  ClientSort,
  CreateClientInput,
  UpdateClientInput,
} from '@/app/types/client';
import {
  generateClientId,
  calculateSegment,
  calculateLoyaltyTier,
  getLoyaltyTierDiscount,
} from '@/app/types/client';

const STORAGE_KEY = 'meelike_agent_clients';

// ==============================================
// CRUD Operations
// ==============================================

/**
 * Get all clients for an agent
 */
export function getClients(agentId: string): Client[] {
  const allClients = getItem<Record<string, Client[]>>(STORAGE_KEY, {});
  return allClients[agentId] || [];
}

/**
 * Get a single client by ID
 */
export function getClientById(agentId: string, clientId: string): Client | null {
  const clients = getClients(agentId);
  return clients.find(c => c.id === clientId) || null;
}

/**
 * Get client by contact
 */
export function getClientByContact(agentId: string, contact: string): Client | null {
  const clients = getClients(agentId);
  return clients.find(c => c.contact === contact) || null;
}

/**
 * Create a new client
 */
export function createClient(agentId: string, input: CreateClientInput): Client {
  const allClients = getItem<Record<string, Client[]>>(STORAGE_KEY, {});
  
  if (!allClients[agentId]) {
    allClients[agentId] = [];
  }
  
  const now = new Date().toISOString();
  const client: Client = {
    id: generateClientId(),
    agentId,
    name: input.name,
    contact: input.contact,
    email: input.email,
    note: input.note,
    tags: input.tags || [],
    totalOrders: 0,
    totalSpent: 0,
    segment: 'new',
    loyaltyTier: 'none',
    loyaltyDiscount: 0,
    createdAt: now,
    updatedAt: now,
  };
  
  allClients[agentId].push(client);
  setItem(STORAGE_KEY, allClients);
  
  return client;
}

/**
 * Update an existing client
 */
export function updateClient(
  agentId: string,
  clientId: string,
  input: UpdateClientInput
): Client | null {
  const allClients = getItem<Record<string, Client[]>>(STORAGE_KEY, {});
  const clients = allClients[agentId] || [];
  
  const index = clients.findIndex(c => c.id === clientId);
  if (index === -1) return null;
  
  clients[index] = {
    ...clients[index],
    ...input,
    updatedAt: new Date().toISOString(),
  };
  
  allClients[agentId] = clients;
  setItem(STORAGE_KEY, allClients);
  
  return clients[index];
}

/**
 * Delete a client
 */
export function deleteClient(agentId: string, clientId: string): boolean {
  const allClients = getItem<Record<string, Client[]>>(STORAGE_KEY, {});
  const clients = allClients[agentId] || [];
  
  const index = clients.findIndex(c => c.id === clientId);
  if (index === -1) return false;
  
  clients.splice(index, 1);
  allClients[agentId] = clients;
  setItem(STORAGE_KEY, allClients);
  
  return true;
}

/**
 * Get or create client by contact
 */
export function getOrCreateClient(
  agentId: string,
  name: string,
  contact: string
): Client {
  const existing = getClientByContact(agentId, contact);
  if (existing) return existing;
  
  return createClient(agentId, { name, contact });
}

// ==============================================
// Stats Updates
// ==============================================

/**
 * Update client stats after an order
 */
export function updateClientStats(
  agentId: string,
  clientId: string,
  orderAmount: number
): Client | null {
  const client = getClientById(agentId, clientId);
  if (!client) return null;
  
  const newTotalOrders = client.totalOrders + 1;
  const newTotalSpent = client.totalSpent + orderAmount;
  const lastOrderDate = new Date().toISOString();
  
  // Recalculate segment and loyalty
  const segment = calculateSegment(newTotalOrders, newTotalSpent, lastOrderDate);
  const loyaltyTier = calculateLoyaltyTier(newTotalOrders);
  const loyaltyDiscount = getLoyaltyTierDiscount(loyaltyTier);
  
  return updateClient(agentId, clientId, {
    // Can't update these directly via UpdateClientInput, need to extend
  }) as Client | null;
}

/**
 * Update client order stats (internal)
 */
export function updateClientOrderStats(
  agentId: string,
  clientId: string,
  orderAmount: number
): Client | null {
  const allClients = getItem<Record<string, Client[]>>(STORAGE_KEY, {});
  const clients = allClients[agentId] || [];
  
  const index = clients.findIndex(c => c.id === clientId);
  if (index === -1) return null;
  
  const client = clients[index];
  const newTotalOrders = client.totalOrders + 1;
  const newTotalSpent = client.totalSpent + orderAmount;
  const lastOrderDate = new Date().toISOString();
  
  // Recalculate segment and loyalty
  const segment = calculateSegment(newTotalOrders, newTotalSpent, lastOrderDate);
  const loyaltyTier = calculateLoyaltyTier(newTotalOrders);
  const loyaltyDiscount = getLoyaltyTierDiscount(loyaltyTier);
  
  clients[index] = {
    ...client,
    totalOrders: newTotalOrders,
    totalSpent: newTotalSpent,
    lastOrderDate,
    segment,
    loyaltyTier,
    loyaltyDiscount,
    updatedAt: new Date().toISOString(),
  };
  
  allClients[agentId] = clients;
  setItem(STORAGE_KEY, allClients);
  
  return clients[index];
}

/**
 * Recalculate all client segments
 */
export function recalculateAllSegments(agentId: string): void {
  const allClients = getItem<Record<string, Client[]>>(STORAGE_KEY, {});
  const clients = allClients[agentId] || [];
  
  const updatedClients = clients.map(client => ({
    ...client,
    segment: calculateSegment(
      client.totalOrders,
      client.totalSpent,
      client.lastOrderDate
    ),
    loyaltyTier: calculateLoyaltyTier(client.totalOrders),
    loyaltyDiscount: getLoyaltyTierDiscount(calculateLoyaltyTier(client.totalOrders)),
    updatedAt: new Date().toISOString(),
  }));
  
  allClients[agentId] = updatedClients;
  setItem(STORAGE_KEY, allClients);
}

// ==============================================
// Tags
// ==============================================

/**
 * Add tag to client
 */
export function addClientTag(agentId: string, clientId: string, tag: string): Client | null {
  const client = getClientById(agentId, clientId);
  if (!client) return null;
  
  if (client.tags.includes(tag)) return client;
  
  return updateClient(agentId, clientId, {
    tags: [...client.tags, tag],
  });
}

/**
 * Remove tag from client
 */
export function removeClientTag(agentId: string, clientId: string, tag: string): Client | null {
  const client = getClientById(agentId, clientId);
  if (!client) return null;
  
  return updateClient(agentId, clientId, {
    tags: client.tags.filter(t => t !== tag),
  });
}

/**
 * Get all unique tags for agent
 */
export function getAllClientTags(agentId: string): string[] {
  const clients = getClients(agentId);
  const tags = new Set<string>();
  
  clients.forEach(client => {
    client.tags.forEach(tag => tags.add(tag));
  });
  
  return Array.from(tags).sort();
}

// ==============================================
// Queries
// ==============================================

/**
 * Filter and sort clients
 */
export function queryClients(
  agentId: string,
  filter?: ClientFilter,
  sort?: ClientSort
): Client[] {
  let clients = getClients(agentId);
  
  // Apply filters
  if (filter) {
    if (filter.segment && filter.segment !== 'all') {
      clients = clients.filter(c => c.segment === filter.segment);
    }
    
    if (filter.loyaltyTier && filter.loyaltyTier !== 'all') {
      clients = clients.filter(c => c.loyaltyTier === filter.loyaltyTier);
    }
    
    if (filter.tag) {
      clients = clients.filter(c => c.tags.includes(filter.tag!));
    }
    
    if (filter.hasOrders !== undefined) {
      clients = clients.filter(c => 
        filter.hasOrders ? c.totalOrders > 0 : c.totalOrders === 0
      );
    }
    
    if (filter.search) {
      const search = filter.search.toLowerCase();
      clients = clients.filter(c =>
        c.name.toLowerCase().includes(search) ||
        c.contact.toLowerCase().includes(search) ||
        c.email?.toLowerCase().includes(search)
      );
    }
  }
  
  // Apply sort
  if (sort) {
    clients.sort((a, b) => {
      let comparison = 0;
      
      switch (sort.field) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'totalOrders':
          comparison = a.totalOrders - b.totalOrders;
          break;
        case 'totalSpent':
          comparison = a.totalSpent - b.totalSpent;
          break;
        case 'lastOrderDate':
          const aDate = a.lastOrderDate ? new Date(a.lastOrderDate).getTime() : 0;
          const bDate = b.lastOrderDate ? new Date(b.lastOrderDate).getTime() : 0;
          comparison = aDate - bDate;
          break;
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
      }
      
      return sort.order === 'desc' ? -comparison : comparison;
    });
  } else {
    // Default: by name
    clients.sort((a, b) => a.name.localeCompare(b.name));
  }
  
  return clients;
}

/**
 * Get clients by segment
 */
export function getClientsBySegment(agentId: string, segment: ClientSegment): Client[] {
  return queryClients(agentId, { segment });
}

/**
 * Get clients by loyalty tier
 */
export function getClientsByLoyaltyTier(agentId: string, tier: LoyaltyTier): Client[] {
  return queryClients(agentId, { loyaltyTier: tier });
}

/**
 * Search clients
 */
export function searchClients(agentId: string, query: string, limit?: number): Client[] {
  const results = queryClients(agentId, { search: query });
  return limit ? results.slice(0, limit) : results;
}

// ==============================================
// Statistics
// ==============================================

/**
 * Get client summary for dashboard
 */
export function getClientSummary(agentId: string): ClientSummary {
  const clients = getClients(agentId);
  
  const summary: ClientSummary = {
    total: clients.length,
    vip: 0,
    regular: 0,
    new: 0,
    inactive: 0,
    totalRevenue: 0,
    avgOrderValue: 0,
  };
  
  let totalOrders = 0;
  
  clients.forEach(client => {
    summary[client.segment]++;
    summary.totalRevenue += client.totalSpent;
    totalOrders += client.totalOrders;
  });
  
  summary.avgOrderValue = totalOrders > 0 
    ? summary.totalRevenue / totalOrders 
    : 0;
  
  return summary;
}

/**
 * Get top clients by spending
 */
export function getTopClients(agentId: string, limit: number = 10): Client[] {
  return queryClients(agentId, {}, { field: 'totalSpent', order: 'desc' })
    .slice(0, limit);
}

/**
 * Get segment distribution
 */
export function getSegmentDistribution(agentId: string): Record<ClientSegment, number> {
  const clients = getClients(agentId);
  const distribution: Record<ClientSegment, number> = {
    vip: 0,
    regular: 0,
    new: 0,
    inactive: 0,
  };
  
  clients.forEach(client => {
    distribution[client.segment]++;
  });
  
  return distribution;
}

// ==============================================
// Utilities
// ==============================================

/**
 * Check if contact exists
 */
export function contactExists(agentId: string, contact: string, excludeClientId?: string): boolean {
  const clients = getClients(agentId);
  return clients.some(c => c.contact === contact && c.id !== excludeClientId);
}

/**
 * Get client count
 */
export function getClientCount(agentId: string): number {
  return getClients(agentId).length;
}

/**
 * Clear all clients for an agent
 */
export function clearClients(agentId: string): void {
  const allClients = getItem<Record<string, Client[]>>(STORAGE_KEY, {});
  delete allClients[agentId];
  setItem(STORAGE_KEY, allClients);
}

/**
 * Clear all clients (admin)
 */
export function clearAllClients(): void {
  removeItem(STORAGE_KEY);
}

/**
 * Export clients to JSON
 */
export function exportClientsToJson(agentId: string): string {
  const clients = getClients(agentId);
  return JSON.stringify(clients, null, 2);
}

/**
 * Import clients from JSON
 */
export function importClientsFromJson(agentId: string, json: string): number {
  try {
    const clients = JSON.parse(json) as Client[];
    const allClients = getItem<Record<string, Client[]>>(STORAGE_KEY, {});
    
    if (!allClients[agentId]) {
      allClients[agentId] = [];
    }
    
    // Merge: update existing by contact, add new
    clients.forEach(client => {
      const existingIndex = allClients[agentId].findIndex(c => c.contact === client.contact);
      if (existingIndex >= 0) {
        allClients[agentId][existingIndex] = {
          ...allClients[agentId][existingIndex],
          ...client,
          updatedAt: new Date().toISOString(),
        };
      } else {
        allClients[agentId].push({
          ...client,
          id: generateClientId(),
          agentId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    });
    
    setItem(STORAGE_KEY, allClients);
    return clients.length;
  } catch {
    return 0;
  }
}

