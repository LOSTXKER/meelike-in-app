// src/app/agent/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getBills, getBillSummary } from '@/app/utils/storage';
import { Bill, BillStatus } from '@/app/types/bill';

// --- Icons ---
const FilterIcon = () => <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M2.628 1.601C5.028 1.206 7.49 1 10 1s4.973.206 7.372.601a.75.75 0 01.628.74v2.288a2.25 2.25 0 01-.659 1.59l-4.682 4.683a2.25 2.25 0 00-.659 1.59v3.037c0 .684-.31 1.33-.844 1.757l-1.937 1.55A.75.75 0 018 18.25v-5.757a2.25 2.25 0 00-.659-1.59L2.659 6.22A2.25 2.25 0 012 4.629V2.34a.75.75 0 01.628-.74z" clipRule="evenodd" /></svg>;
const SearchIcon = () => <svg className="w-4 h-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>;
const PlusIcon = () => <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" /></svg>;
const UsersIcon = () => <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M7 8a3 3 0 100-6 3 3 0 000 6zM14.5 9a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM1.615 16.428a1.224 1.224 0 01-.569-1.175 6.002 6.002 0 0111.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 017 18a9.953 9.953 0 01-5.385-1.572zM14.5 16h-.106c.07-.297.088-.611.048-.933a7.47 7.47 0 00-1.588-3.755 4.502 4.502 0 015.874 2.636.818.818 0 01-.36.98A7.465 7.465 0 0114.5 16z" /></svg>;
const StoreIcon = () => <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M1 2.75A.75.75 0 011.75 2h16.5a.75.75 0 010 1.5H18v8.75A2.75 2.75 0 0115.25 15h-1.072l.798 3.06a.75.75 0 01-1.452.38L13.41 18H6.59l-.114.44a.75.75 0 01-1.452-.38L5.823 15H4.75A2.75 2.75 0 012 12.25V3.5h-.25A.75.75 0 011 2.75zM7.373 15l-.391 1.5h6.037l-.392-1.5H7.373zm7.49-8.931a.75.75 0 01-.175 1.046 19.326 19.326 0 01-3.398 2.154.75.75 0 01-.73-1.311 17.827 17.827 0 003.129-1.987.75.75 0 011.174.098z" clipRule="evenodd" /></svg>;

const getStatusBadge = (status: BillStatus) => {
  const statusClasses = {
    pending: 'badge-warning',
    confirmed: 'badge-info',
    processing: 'badge-primary',
    completed: 'badge-success',
    cancelled: 'badge-error',
  };
  
  const statusLabels = {
    pending: 'รอชำระ',
    confirmed: 'รอดำเนินการ',
    processing: 'กำลังทำ',
    completed: 'สำเร็จ',
    cancelled: 'ยกเลิก',
  };
  
  return (
    <span className={`badge ${statusClasses[status]}`}>
      {statusLabels[status]}
    </span>
  );
};

export default function AgentDashboardPage() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [summary, setSummary] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    processing: 0,
    completed: 0,
    totalRevenue: 0,
    totalProfit: 0,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<BillStatus | 'all'>('all');
  
  // Mock Agent ID (ในอนาคตจะมาจาก Auth)
  const agentId = 'agent-001';
  const agentUsername = 'mystore';
  
  useEffect(() => {
    loadBills();
  }, [statusFilter]);
  
  const loadBills = () => {
    const filter = statusFilter !== 'all' ? { status: statusFilter } : undefined;
    const allBills = getBills(agentId, filter);
    const billSummary = getBillSummary(agentId);
    
    setBills(allBills);
    setSummary(billSummary);
  };
  
  const filteredBills = bills.filter(bill => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      bill.id.toLowerCase().includes(query) ||
      bill.clientName.toLowerCase().includes(query) ||
      bill.serviceName.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-8">
      {/* --- Quick Actions Banner --- */}
      <div className="bg-gradient-to-r from-brand-primary to-brand-primary/80 dark:from-brand-primary/90 dark:to-brand-primary/70 text-white p-6 rounded-xl shadow-lg">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">Agent Center</h1>
            <p className="text-brand-text-light/90">จัดการบิล ลูกค้า และร้านค้าของคุณ</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link 
              href="/agent/new-order" 
              className="btn-primary inline-flex items-center bg-white text-brand-primary hover:bg-gray-50"
            >
              <PlusIcon />
              สร้างบิลใหม่
            </Link>
            <Link 
              href="/agent/clients" 
              className="btn-secondary inline-flex items-center border-white text-white hover:bg-white/10"
            >
              <UsersIcon />
              <span className="ml-2">ลูกค้า</span>
            </Link>
            <Link 
              href={`/store/${agentUsername}`} 
              className="btn-secondary inline-flex items-center border-white text-white hover:bg-white/10"
              target="_blank"
            >
              <StoreIcon />
              <span className="ml-2">ดูหน้าร้าน</span>
            </Link>
          </div>
        </div>
      </div>
      
      {/* --- Stat Cards --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <p className="text-sm text-secondary">กำไรทั้งหมด</p>
          <p className="text-2xl font-bold text-profit mt-1">฿{summary.totalProfit.toLocaleString()}</p>
          <p className="text-xs text-tertiary mt-1">จากบิลที่สำเร็จ</p>
        </div>
        
        <div className="card">
          <p className="text-sm text-secondary">ยอดขายรวม</p>
          <p className="text-2xl font-bold text-primary mt-1">฿{summary.totalRevenue.toLocaleString()}</p>
          <p className="text-xs text-tertiary mt-1">{summary.completed} บิล</p>
        </div>
        
        <div className="card">
          <p className="text-sm text-secondary">บิลทั้งหมด</p>
          <p className="text-2xl font-bold text-primary mt-1">{summary.total}</p>
          <div className="flex gap-2 text-xs mt-1">
            <span className="text-warning">รอชำระ: {summary.pending}</span>
            <span className="text-info">รอทำ: {summary.confirmed}</span>
          </div>
        </div>
        
        <div className="card">
          <p className="text-sm text-secondary">กำลังทำ</p>
          <p className="text-2xl font-bold text-primary mt-1">{summary.processing}</p>
          <p className="text-xs text-tertiary mt-1">บิลที่กำลังดำเนินการ</p>
        </div>
      </div>

      {/* --- Bills Table --- */}
      <div className="card">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div>
            <h2 className="text-xl font-bold text-primary">บิลทั้งหมด</h2>
            <p className="text-sm text-secondary mt-1">จัดการบิลของลูกค้า</p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-grow">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <SearchIcon />
              </span>
              <input 
                type="text" 
                placeholder="ค้นหา ID, ลูกค้า, บริการ..." 
                className="input pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select 
              className="input"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as BillStatus | 'all')}
            >
              <option value="all">ทั้งหมด</option>
              <option value="pending">รอชำระ</option>
              <option value="confirmed">รอดำเนินการ</option>
              <option value="processing">กำลังทำ</option>
              <option value="completed">สำเร็จ</option>
              <option value="cancelled">ยกเลิก</option>
            </select>
          </div>
        </div>

        {filteredBills.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-secondary text-lg mb-4">ยังไม่มีบิล</p>
            <Link href="/agent/new-order" className="btn-primary inline-flex items-center">
              <PlusIcon />
              สร้างบิลแรก
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y border-default">
              <thead className="bg-surface">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-secondary uppercase tracking-wider">ID / ลูกค้า</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-secondary uppercase tracking-wider">บริการ</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-secondary uppercase tracking-wider">สถานะ</th>
                  <th className="px-6 py-3 text-right text-xs font-bold text-secondary uppercase tracking-wider">ต้นทุน</th>
                  <th className="px-6 py-3 text-right text-xs font-bold text-secondary uppercase tracking-wider">ราคาขาย</th>
                  <th className="px-6 py-3 text-right text-xs font-bold text-secondary uppercase tracking-wider">กำไร</th>
                  <th className="px-6 py-3 text-center text-xs font-bold text-secondary uppercase tracking-wider">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y border-default">
                {filteredBills.map((bill) => (
                  <tr key={bill.id} className="hover:bg-surface transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-primary">{bill.id}</div>
                      <div className="text-xs text-secondary">{bill.clientName}</div>
                      <div className="text-xs text-tertiary">{new Date(bill.createdAt).toLocaleDateString('th-TH')}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-primary">{bill.serviceName}</div>
                      <div className="text-xs text-tertiary truncate max-w-xs">{bill.link}</div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(bill.status)}
                    </td>
                    <td className="px-6 py-4 text-sm text-right font-medium text-cost">
                      ฿{bill.actualCost.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-right font-medium text-primary">
                      ฿{bill.salePrice.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-right font-bold text-profit">
                      ฿{bill.profit.toLocaleString()}
                      <div className="text-xs text-tertiary">({bill.profitMargin.toFixed(1)}%)</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Link 
                        href={`/agent/bills/${bill.id}`}
                        className="text-brand-primary hover:text-brand-primary/80 font-semibold text-sm"
                      >
                        ดูรายละเอียด
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}