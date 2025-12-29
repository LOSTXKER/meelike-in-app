// src/app/agent/clients/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getClients, getClientStats } from '@/app/utils/storage';
import { AgentClient, ClientSegment } from '@/app/types/client';

// Icons
const SearchIcon = () => <svg className="w-4 h-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>;
const PlusIcon = () => <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" /></svg>;
const UsersIcon = () => <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M7 8a3 3 0 100-6 3 3 0 000 6zM14.5 9a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM1.615 16.428a1.224 1.224 0 01-.569-1.175 6.002 6.002 0 0111.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 017 18a9.953 9.953 0 01-5.385-1.572zM14.5 16h-.106c.07-.297.088-.611.048-.933a7.47 7.47 0 00-1.588-3.755 4.502 4.502 0 015.874 2.636.818.818 0 01-.36.98A7.465 7.465 0 0114.5 16z" /></svg>;

const getSegmentBadge = (segment: ClientSegment) => {
  const classes = {
    vip: 'badge-vip',
    regular: 'badge-regular',
    new: 'badge-new',
    inactive: 'badge-inactive',
  };
  
  const labels = {
    vip: 'VIP',
    regular: 'ลูกค้าประจำ',
    new: 'ลูกค้าใหม่',
    inactive: 'ไม่ใช้งาน',
  };
  
  return (
    <span className={`badge ${classes[segment]}`}>
      {labels[segment]}
    </span>
  );
};

export default function ClientsPage() {
  const [clients, setClients] = useState<AgentClient[]>([]);
  const [stats, setStats] = useState({ vip: 0, regular: 0, new: 0, inactive: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [segmentFilter, setSegmentFilter] = useState<ClientSegment | 'all'>('all');
  
  // Mock Agent ID
  const agentId = 'agent-001';
  
  useEffect(() => {
    loadClients();
  }, [segmentFilter]);
  
  const loadClients = () => {
    const filter = segmentFilter !== 'all' ? { segment: segmentFilter } : undefined;
    const allClients = getClients(agentId, filter);
    const clientStats = getClientStats(agentId);
    
    setClients(allClients);
    setStats(clientStats);
  };
  
  const filteredClients = clients.filter(client => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      client.name.toLowerCase().includes(query) ||
      client.phone?.toLowerCase().includes(query) ||
      client.email?.toLowerCase().includes(query)
    );
  });
  
  const totalClients = stats.vip + stats.regular + stats.new + stats.inactive;
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-primary mb-2">จัดการลูกค้า</h1>
        <p className="text-sm text-secondary">ดูและจัดการรายชื่อลูกค้าของคุณ</p>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center">
              <UsersIcon />
            </div>
            <div>
              <p className="text-sm text-secondary">ทั้งหมด</p>
              <p className="text-xl font-bold text-primary">{totalClients}</p>
            </div>
          </div>
        </div>
        
        <div className="card cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setSegmentFilter('vip')}>
          <p className="text-sm text-secondary">VIP</p>
          <p className="text-xl font-bold text-primary">{stats.vip}</p>
          <p className="text-xs text-tertiary">ซื้อ ฿5,000+</p>
        </div>
        
        <div className="card cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setSegmentFilter('regular')}>
          <p className="text-sm text-secondary">ลูกค้าประจำ</p>
          <p className="text-xl font-bold text-primary">{stats.regular}</p>
          <p className="text-xs text-tertiary">ซื้อ 3+ ครั้ง</p>
        </div>
        
        <div className="card cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setSegmentFilter('new')}>
          <p className="text-sm text-secondary">ลูกค้าใหม่</p>
          <p className="text-xl font-bold text-primary">{stats.new}</p>
          <p className="text-xs text-tertiary">ซื้อครั้งแรก</p>
        </div>
        
        <div className="card cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setSegmentFilter('inactive')}>
          <p className="text-sm text-secondary">ไม่ใช้งาน</p>
          <p className="text-xl font-bold text-primary">{stats.inactive}</p>
          <p className="text-xs text-tertiary">30+ วัน</p>
        </div>
      </div>
      
      {/* Client List */}
      <div className="card">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-lg font-bold text-primary">รายชื่อลูกค้า</h2>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-grow">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <SearchIcon />
              </span>
              <input 
                type="text" 
                placeholder="ค้นหาชื่อ, เบอร์, อีเมล..." 
                className="input pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select 
              className="input"
              value={segmentFilter}
              onChange={(e) => setSegmentFilter(e.target.value as ClientSegment | 'all')}
            >
              <option value="all">ทั้งหมด</option>
              <option value="vip">VIP</option>
              <option value="regular">ลูกค้าประจำ</option>
              <option value="new">ลูกค้าใหม่</option>
              <option value="inactive">ไม่ใช้งาน</option>
            </select>
            <Link href="/agent/clients/new" className="btn-primary inline-flex items-center whitespace-nowrap">
              <PlusIcon />
              <span className="ml-1">เพิ่มลูกค้า</span>
            </Link>
          </div>
        </div>
        
        {filteredClients.length === 0 ? (
          <div className="text-center py-12">
            <UsersIcon />
            <p className="text-secondary text-lg mb-4 mt-4">ยังไม่มีลูกค้า</p>
            <Link href="/agent/clients/new" className="btn-primary inline-flex items-center">
              <PlusIcon />
              เพิ่มลูกค้าแรก
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y border-default">
              <thead className="bg-surface">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-secondary uppercase">ชื่อลูกค้า</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-secondary uppercase">ติดต่อ</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-secondary uppercase">Segment</th>
                  <th className="px-6 py-3 text-right text-xs font-bold text-secondary uppercase">ยอดซื้อ</th>
                  <th className="px-6 py-3 text-right text-xs font-bold text-secondary uppercase">จำนวนบิล</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-secondary uppercase">ซื้อล่าสุด</th>
                  <th className="px-6 py-3 text-center text-xs font-bold text-secondary uppercase">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y border-default">
                {filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-surface transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-primary">{client.name}</div>
                      {client.tags.length > 0 && (
                        <div className="flex gap-1 mt-1 flex-wrap">
                          {client.tags.slice(0, 2).map(tag => (
                            <span key={tag} className="badge badge-sm">
                              {tag}
                            </span>
                          ))}
                          {client.tags.length > 2 && (
                            <span className="badge badge-sm">+{client.tags.length - 2}</span>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-primary">{client.phone || '-'}</div>
                      <div className="text-xs text-tertiary">{client.email || '-'}</div>
                    </td>
                    <td className="px-6 py-4">
                      {getSegmentBadge(client.segment)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="text-sm font-semibold text-primary">฿{client.totalSpent.toLocaleString()}</div>
                      <div className="text-xs text-tertiary">฿{client.averageOrderValue.toFixed(0)}/บิล</div>
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-primary">
                      {client.totalOrders}
                    </td>
                    <td className="px-6 py-4 text-sm text-secondary">
                      {client.lastOrderAt 
                        ? new Date(client.lastOrderAt).toLocaleDateString('th-TH') 
                        : '-'}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Link 
                        href={`/agent/clients/${client.id}`}
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
