// src/app/utils/storage/bills.ts
// ═══════════════════════════════════════════════════════════════════════════
// 📋 BILL STORAGE - localStorage utilities
// ═══════════════════════════════════════════════════════════════════════════

import { Bill, BillSummary, CreateBillInput, BillFilter, BillStatus } from '@/app/types/bill';
import { getFromStorage, saveToStorage, generateId } from './base';

const BILLS_KEY = 'meelike_bills';

// ─────────────────────────────────────────────────────────────────────────────
// Get Bills
// ─────────────────────────────────────────────────────────────────────────────

export const getBills = (agentId: string, filter?: BillFilter): Bill[] => {
  const bills = getFromStorage<Bill[]>(BILLS_KEY, []);
  let filtered = bills.filter(bill => bill.agentId === agentId);
  
  if (filter) {
    // Filter by status
    if (filter.status && filter.status !== 'all') {
      filtered = filtered.filter(bill => bill.status === filter.status);
    }
    
    // Filter by client
    if (filter.clientId) {
      filtered = filtered.filter(bill => bill.clientId === filter.clientId);
    }
    
    // Filter by date range
    if (filter.dateFrom) {
      filtered = filtered.filter(bill => bill.createdAt >= filter.dateFrom!);
    }
    if (filter.dateTo) {
      filtered = filtered.filter(bill => bill.createdAt <= filter.dateTo!);
    }
    
    // Search
    if (filter.search) {
      const search = filter.search.toLowerCase();
      filtered = filtered.filter(bill => 
        bill.id.toLowerCase().includes(search) ||
        bill.clientName.toLowerCase().includes(search) ||
        bill.serviceName.toLowerCase().includes(search)
      );
    }
  }
  
  // Sort by date (newest first)
  return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const getBillById = (billId: string): Bill | null => {
  const bills = getFromStorage<Bill[]>(BILLS_KEY, []);
  return bills.find(bill => bill.id === billId) || null;
};

// ─────────────────────────────────────────────────────────────────────────────
// Create Bill
// ─────────────────────────────────────────────────────────────────────────────

export const createBill = (agentId: string, agentUsername: string, input: CreateBillInput): Bill => {
  const bills = getFromStorage<Bill[]>(BILLS_KEY, []);
  
  // Calculate pricing
  const baseCost = 100; // Mock: should come from service data
  const agentDiscount = 5; // Mock: should come from tier
  const actualCost = baseCost - agentDiscount;
  const salePrice = input.salePrice;
  const profit = salePrice - actualCost - (input.couponCode ? 10 : 0); // Mock coupon
  const profitMargin = (profit / salePrice) * 100;
  
  const newBill: Bill = {
    id: `BILL-${generateId(5)}`,
    agentId,
    agentUsername,
    clientId: input.clientId,
    clientName: input.clientName,
    clientContact: input.clientContact,
    serviceId: input.serviceId,
    serviceName: input.serviceName,
    category: input.category,
    link: input.link,
    quantity: input.quantity,
    baseCost,
    agentDiscount,
    actualCost,
    salePrice,
    profit,
    profitMargin,
    displayPrice: salePrice,
    couponCode: input.couponCode,
    couponDiscount: input.couponCode ? 10 : undefined,
    status: 'pending',
    source: 'manual',
    createdAt: new Date().toISOString(),
    agentNote: input.agentNote,
    customerNote: input.customerNote,
  };
  
  bills.push(newBill);
  saveToStorage(BILLS_KEY, bills);
  
  return newBill;
};

// ─────────────────────────────────────────────────────────────────────────────
// Update Bill Status
// ─────────────────────────────────────────────────────────────────────────────

export const updateBillStatus = (billId: string, status: BillStatus): Bill | null => {
  const bills = getFromStorage<Bill[]>(BILLS_KEY, []);
  const billIndex = bills.findIndex(bill => bill.id === billId);
  
  if (billIndex === -1) return null;
  
  const now = new Date().toISOString();
  bills[billIndex].status = status;
  
  // Update timestamps based on status
  if (status === 'confirmed') {
    bills[billIndex].confirmedAt = now;
  } else if (status === 'processing') {
    bills[billIndex].startedAt = now;
  } else if (status === 'completed') {
    bills[billIndex].completedAt = now;
  } else if (status === 'cancelled') {
    bills[billIndex].cancelledAt = now;
  }
  
  saveToStorage(BILLS_KEY, bills);
  return bills[billIndex];
};

// ─────────────────────────────────────────────────────────────────────────────
// Get Bill Summary
// ─────────────────────────────────────────────────────────────────────────────

export const getBillSummary = (agentId: string): BillSummary => {
  const bills = getBills(agentId);
  
  return {
    total: bills.length,
    pending: bills.filter(b => b.status === 'pending').length,
    confirmed: bills.filter(b => b.status === 'confirmed').length,
    processing: bills.filter(b => b.status === 'processing').length,
    completed: bills.filter(b => b.status === 'completed').length,
    cancelled: bills.filter(b => b.status === 'cancelled').length,
    totalRevenue: bills
      .filter(b => b.status === 'completed')
      .reduce((sum, b) => sum + b.salePrice, 0),
    totalProfit: bills
      .filter(b => b.status === 'completed')
      .reduce((sum, b) => sum + b.profit, 0),
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// Delete Bill
// ─────────────────────────────────────────────────────────────────────────────

export const deleteBill = (billId: string): boolean => {
  const bills = getFromStorage<Bill[]>(BILLS_KEY, []);
  const filtered = bills.filter(bill => bill.id !== billId);
  
  if (filtered.length === bills.length) return false;
  
  saveToStorage(BILLS_KEY, filtered);
  return true;
};

