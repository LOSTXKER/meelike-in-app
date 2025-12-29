// ==============================================
// BILLS STORAGE
// LocalStorage utilities for Bill management
// ==============================================

import { getItem, setItem, removeItem } from './base';
import type {
  Bill,
  BillItem,
  BillStatus,
  BillSummary,
  BillFilter,
  BillSort,
  generateBillId,
} from '@/app/types/bill';

const STORAGE_KEY = 'meelike_agent_bills';

// ==============================================
// CRUD Operations
// ==============================================

/**
 * Get all bills for an agent
 */
export function getBills(agentId: string): Bill[] {
  const allBills = getItem<Record<string, Bill[]>>(STORAGE_KEY, {});
  return allBills[agentId] || [];
}

/**
 * Get a single bill by ID
 */
export function getBillById(agentId: string, billId: string): Bill | null {
  const bills = getBills(agentId);
  return bills.find(b => b.id === billId) || null;
}

/**
 * Save a new bill
 */
export function saveBill(bill: Bill): Bill {
  const allBills = getItem<Record<string, Bill[]>>(STORAGE_KEY, {});
  
  if (!allBills[bill.agentId]) {
    allBills[bill.agentId] = [];
  }
  
  // Check for duplicate ID
  const existingIndex = allBills[bill.agentId].findIndex(b => b.id === bill.id);
  if (existingIndex >= 0) {
    allBills[bill.agentId][existingIndex] = bill;
  } else {
    allBills[bill.agentId].unshift(bill); // Add to beginning (newest first)
  }
  
  setItem(STORAGE_KEY, allBills);
  return bill;
}

/**
 * Update an existing bill
 */
export function updateBill(agentId: string, billId: string, updates: Partial<Bill>): Bill | null {
  const allBills = getItem<Record<string, Bill[]>>(STORAGE_KEY, {});
  const bills = allBills[agentId] || [];
  
  const index = bills.findIndex(b => b.id === billId);
  if (index === -1) return null;
  
  bills[index] = { ...bills[index], ...updates };
  allBills[agentId] = bills;
  setItem(STORAGE_KEY, allBills);
  
  return bills[index];
}

/**
 * Delete a bill
 */
export function deleteBill(agentId: string, billId: string): boolean {
  const allBills = getItem<Record<string, Bill[]>>(STORAGE_KEY, {});
  const bills = allBills[agentId] || [];
  
  const index = bills.findIndex(b => b.id === billId);
  if (index === -1) return false;
  
  bills.splice(index, 1);
  allBills[agentId] = bills;
  setItem(STORAGE_KEY, allBills);
  
  return true;
}

/**
 * Save multiple bills (batch)
 */
export function saveBills(agentId: string, newBills: Bill[]): void {
  const allBills = getItem<Record<string, Bill[]>>(STORAGE_KEY, {});
  
  if (!allBills[agentId]) {
    allBills[agentId] = [];
  }
  
  // Merge: update existing, add new
  newBills.forEach(bill => {
    const existingIndex = allBills[agentId].findIndex(b => b.id === bill.id);
    if (existingIndex >= 0) {
      allBills[agentId][existingIndex] = bill;
    } else {
      allBills[agentId].unshift(bill);
    }
  });
  
  setItem(STORAGE_KEY, allBills);
}

// ==============================================
// Status Updates
// ==============================================

/**
 * Confirm a bill (pending → confirmed)
 */
export function confirmBill(agentId: string, billId: string): Bill | null {
  return updateBill(agentId, billId, {
    status: 'confirmed',
    confirmedAt: new Date().toISOString(),
  });
}

/**
 * Start processing a bill (confirmed → processing)
 */
export function startProcessingBill(agentId: string, billId: string): Bill | null {
  return updateBill(agentId, billId, {
    status: 'processing',
    startedAt: new Date().toISOString(),
  });
}

/**
 * Complete a bill (processing → completed)
 */
export function completeBill(agentId: string, billId: string): Bill | null {
  return updateBill(agentId, billId, {
    status: 'completed',
    completedAt: new Date().toISOString(),
  });
}

/**
 * Cancel a bill
 */
export function cancelBill(agentId: string, billId: string, reason?: string): Bill | null {
  return updateBill(agentId, billId, {
    status: 'cancelled',
    cancelledAt: new Date().toISOString(),
    cancellationReason: reason,
  });
}

/**
 * Update bill item progress
 */
export function updateBillItemProgress(
  agentId: string,
  billId: string,
  itemId: string,
  progress: number,
  currentCount?: number
): Bill | null {
  const bill = getBillById(agentId, billId);
  if (!bill) return null;
  
  const updatedItems = bill.items.map(item => {
    if (item.id === itemId) {
      return {
        ...item,
        progress,
        currentCount: currentCount ?? item.currentCount,
      };
    }
    return item;
  });
  
  return updateBill(agentId, billId, { items: updatedItems });
}

// ==============================================
// Queries
// ==============================================

/**
 * Filter and sort bills
 */
export function queryBills(
  agentId: string,
  filter?: BillFilter,
  sort?: BillSort
): Bill[] {
  let bills = getBills(agentId);
  
  // Apply filters
  if (filter) {
    if (filter.status && filter.status !== 'all') {
      bills = bills.filter(b => b.status === filter.status);
    }
    
    if (filter.source && filter.source !== 'all') {
      bills = bills.filter(b => b.source === filter.source);
    }
    
    if (filter.clientId) {
      bills = bills.filter(b => b.clientId === filter.clientId);
    }
    
    if (filter.dateFrom) {
      const fromDate = new Date(filter.dateFrom);
      bills = bills.filter(b => new Date(b.createdAt) >= fromDate);
    }
    
    if (filter.dateTo) {
      const toDate = new Date(filter.dateTo);
      toDate.setHours(23, 59, 59, 999);
      bills = bills.filter(b => new Date(b.createdAt) <= toDate);
    }
    
    if (filter.search) {
      const search = filter.search.toLowerCase();
      bills = bills.filter(b =>
        b.id.toLowerCase().includes(search) ||
        b.clientName.toLowerCase().includes(search) ||
        b.clientContact.toLowerCase().includes(search) ||
        b.items.some(i => i.serviceName.toLowerCase().includes(search))
      );
    }
  }
  
  // Apply sort
  if (sort) {
    bills.sort((a, b) => {
      let comparison = 0;
      
      switch (sort.field) {
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'totalAmount':
          comparison = a.totalAmount - b.totalAmount;
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'clientName':
          comparison = a.clientName.localeCompare(b.clientName);
          break;
      }
      
      return sort.order === 'desc' ? -comparison : comparison;
    });
  } else {
    // Default: newest first
    bills.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  
  return bills;
}

/**
 * Get bills by status
 */
export function getBillsByStatus(agentId: string, status: BillStatus): Bill[] {
  return queryBills(agentId, { status });
}

/**
 * Get bills by client
 */
export function getBillsByClient(agentId: string, clientId: string): Bill[] {
  return queryBills(agentId, { clientId });
}

/**
 * Get recent bills
 */
export function getRecentBills(agentId: string, limit: number = 10): Bill[] {
  const bills = getBills(agentId);
  return bills
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}

// ==============================================
// Statistics
// ==============================================

/**
 * Get bill summary for dashboard
 */
export function getBillSummary(agentId: string): BillSummary {
  const bills = getBills(agentId);
  
  const summary: BillSummary = {
    total: bills.length,
    pending: 0,
    confirmed: 0,
    processing: 0,
    completed: 0,
    cancelled: 0,
    totalRevenue: 0,
    totalProfit: 0,
    totalCost: 0,
  };
  
  bills.forEach(bill => {
    summary[bill.status]++;
    
    if (bill.status === 'completed') {
      summary.totalRevenue += bill.totalAmount;
      summary.totalProfit += bill.totalProfit;
      summary.totalCost += bill.totalCost;
    }
  });
  
  return summary;
}

/**
 * Get bill count by period
 */
export function getBillCountByPeriod(
  agentId: string,
  period: 'today' | 'week' | 'month' | 'all'
): number {
  const bills = getBills(agentId);
  const now = new Date();
  
  if (period === 'all') return bills.length;
  
  return bills.filter(bill => {
    const billDate = new Date(bill.createdAt);
    
    switch (period) {
      case 'today':
        return billDate.toDateString() === now.toDateString();
      case 'week':
        const weekAgo = new Date(now);
        weekAgo.setDate(weekAgo.getDate() - 7);
        return billDate >= weekAgo;
      case 'month':
        return billDate.getMonth() === now.getMonth() &&
               billDate.getFullYear() === now.getFullYear();
    }
  }).length;
}

/**
 * Get revenue by period
 */
export function getRevenueByPeriod(
  agentId: string,
  period: 'today' | 'week' | 'month' | 'all'
): { revenue: number; profit: number; cost: number } {
  const bills = getBills(agentId);
  const now = new Date();
  
  const filteredBills = bills.filter(bill => {
    if (bill.status !== 'completed') return false;
    if (period === 'all') return true;
    
    const billDate = new Date(bill.completedAt || bill.createdAt);
    
    switch (period) {
      case 'today':
        return billDate.toDateString() === now.toDateString();
      case 'week':
        const weekAgo = new Date(now);
        weekAgo.setDate(weekAgo.getDate() - 7);
        return billDate >= weekAgo;
      case 'month':
        return billDate.getMonth() === now.getMonth() &&
               billDate.getFullYear() === now.getFullYear();
    }
  });
  
  return filteredBills.reduce(
    (acc, bill) => ({
      revenue: acc.revenue + bill.totalAmount,
      profit: acc.profit + bill.totalProfit,
      cost: acc.cost + bill.totalCost,
    }),
    { revenue: 0, profit: 0, cost: 0 }
  );
}

// ==============================================
// Utilities
// ==============================================

/**
 * Check if bill ID exists
 */
export function billIdExists(agentId: string, billId: string): boolean {
  return getBillById(agentId, billId) !== null;
}

/**
 * Generate unique bill ID
 */
export function generateUniqueBillId(agentId: string): string {
  let id: string;
  do {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    id = `BILL-${randomNum}`;
  } while (billIdExists(agentId, id));
  return id;
}

/**
 * Clear all bills for an agent
 */
export function clearBills(agentId: string): void {
  const allBills = getItem<Record<string, Bill[]>>(STORAGE_KEY, {});
  delete allBills[agentId];
  setItem(STORAGE_KEY, allBills);
}

/**
 * Clear all bills (admin)
 */
export function clearAllBills(): void {
  removeItem(STORAGE_KEY);
}

/**
 * Export bills to JSON
 */
export function exportBillsToJson(agentId: string): string {
  const bills = getBills(agentId);
  return JSON.stringify(bills, null, 2);
}

/**
 * Import bills from JSON
 */
export function importBillsFromJson(agentId: string, json: string): number {
  try {
    const bills = JSON.parse(json) as Bill[];
    saveBills(agentId, bills);
    return bills.length;
  } catch {
    return 0;
  }
}

