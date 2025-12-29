// src/app/agent/new-order/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createBill } from '@/app/utils/storage';
import { getClients } from '@/app/utils/storage';
import { AgentClient } from '@/app/types/client';
import CategoryDropdown from '@/app/components/CategoryDropdown';

// Icons
const BackIcon = () => <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" /></svg>;
const PlusIcon = () => <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" /></svg>;

export default function NewBillPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [clients, setClients] = useState<AgentClient[]>([]);
  
  // Mock Agent ID
  const agentId = 'agent-001';
  const agentUsername = 'mystore';
  
  // Form State
  const [useExistingClient, setUseExistingClient] = useState(false);
  const [clientId, setClientId] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientContact, setClientContact] = useState('');
  
  const [serviceId, setServiceId] = useState(1);
  const [serviceName, setServiceName] = useState('ผู้ติดตาม Instagram (คนไทย)');
  const [category, setCategory] = useState('Instagram');
  const [link, setLink] = useState('');
  const [quantity, setQuantity] = useState(100);
  
  const [baseCost, setBaseCost] = useState(100);
  const [agentDiscount, setAgentDiscount] = useState(5);
  const [salePrice, setSalePrice] = useState(150);
  const [couponCode, setCouponCode] = useState('');
  
  const [agentNote, setAgentNote] = useState('');
  const [customerNote, setCustomerNote] = useState('');
  
  useEffect(() => {
    const allClients = getClients(agentId);
    setClients(allClients);
  }, []);
  
  useEffect(() => {
    if (useExistingClient && clientId) {
      const client = clients.find(c => c.id === clientId);
      if (client) {
        setClientName(client.name);
        setClientContact(client.phone || client.email || '');
      }
    }
  }, [useExistingClient, clientId, clients]);
  
  const actualCost = baseCost - agentDiscount;
  const profit = salePrice - actualCost;
  const profitMargin = salePrice > 0 ? (profit / salePrice) * 100 : 0;
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const newBill = createBill(agentId, agentUsername, {
        clientId: useExistingClient ? clientId : undefined,
        clientName,
        clientContact,
        serviceId,
        serviceName,
        category,
        link,
        quantity,
        salePrice,
        couponCode: couponCode || undefined,
        agentNote: agentNote || undefined,
        customerNote: customerNote || undefined,
      });
      
      alert(`✅ สร้างบิล ${newBill.id} สำเร็จ!`);
      router.push('/agent');
    } catch (error) {
      alert('เกิดข้อผิดพลาด: ' + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => router.back()}
          className="btn-secondary w-10 h-10 p-0 flex items-center justify-center"
        >
          <BackIcon />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-primary">สร้างบิลใหม่</h1>
          <p className="text-sm text-secondary">สร้างบิลสำหรับลูกค้าของคุณ</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Client Info */}
        <div className="card">
          <h2 className="text-lg font-bold text-primary mb-4">ข้อมูลลูกค้า</h2>
          
          <div className="flex items-center gap-4 mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                checked={!useExistingClient}
                onChange={() => setUseExistingClient(false)}
                className="w-4 h-4"
              />
              <span className="text-sm text-primary">ลูกค้าใหม่</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                checked={useExistingClient}
                onChange={() => setUseExistingClient(true)}
                className="w-4 h-4"
              />
              <span className="text-sm text-primary">ลูกค้าเดิม</span>
            </label>
          </div>
          
          {useExistingClient ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-primary mb-1">
                  เลือกลูกค้า *
                </label>
                <select 
                  className="input"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  required
                >
                  <option value="">-- เลือกลูกค้า --</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>
                      {client.name} ({client.phone || client.email})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-primary mb-1">
                  ชื่อลูกค้า *
                </label>
                <input 
                  type="text"
                  className="input"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="ชื่อลูกค้า / ชื่อร้าน"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-1">
                  ช่องทางติดต่อ *
                </label>
                <input 
                  type="text"
                  className="input"
                  value={clientContact}
                  onChange={(e) => setClientContact(e.target.value)}
                  placeholder="เบอร์โทร / LINE / Email"
                  required
                />
              </div>
            </div>
          )}
        </div>
        
        {/* Service Info */}
        <div className="card">
          <h2 className="text-lg font-bold text-primary mb-4">บริการ</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-primary mb-1">
                เลือกบริการ *
              </label>
              <CategoryDropdown 
                onSelectService={(service) => {
                  setServiceId(service.id);
                  setServiceName(service.name);
                  setCategory(service.category);
                }}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-primary mb-1">
                ลิงก์ *
              </label>
              <input 
                type="url"
                className="input"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://..."
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-primary mb-1">
                จำนวน *
              </label>
              <input 
                type="number"
                className="input"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                min="1"
                required
              />
            </div>
          </div>
        </div>
        
        {/* Pricing */}
        <div className="card">
          <h2 className="text-lg font-bold text-primary mb-4">ราคา</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-primary mb-1">
                  ราคา MeeLike
                </label>
                <input 
                  type="number"
                  className="input"
                  value={baseCost}
                  onChange={(e) => setBaseCost(parseFloat(e.target.value))}
                  step="0.01"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-1">
                  ส่วนลด Tier
                </label>
                <input 
                  type="number"
                  className="input"
                  value={agentDiscount}
                  onChange={(e) => setAgentDiscount(parseFloat(e.target.value))}
                  step="0.01"
                  disabled
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-primary mb-1">
                ราคาขายให้ลูกค้า *
              </label>
              <input 
                type="number"
                className="input"
                value={salePrice}
                onChange={(e) => setSalePrice(parseFloat(e.target.value))}
                step="0.01"
                min="0"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-primary mb-1">
                คูปอง (ถ้ามี)
              </label>
              <input 
                type="text"
                className="input"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="SAVE10"
              />
            </div>
            
            {/* Profit Summary */}
            <div className="bg-surface p-4 rounded-lg border border-default">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-secondary">ต้นทุนจริง:</span>
                <span className="text-sm font-semibold text-cost">฿{actualCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-secondary">ราคาขาย:</span>
                <span className="text-sm font-semibold text-primary">฿{salePrice.toFixed(2)}</span>
              </div>
              <div className="border-t border-default pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="text-base font-bold text-secondary">กำไร:</span>
                  <div className="text-right">
                    <span className="text-lg font-bold text-profit">฿{profit.toFixed(2)}</span>
                    <span className="text-xs text-tertiary ml-2">({profitMargin.toFixed(1)}%)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Notes */}
        <div className="card">
          <h2 className="text-lg font-bold text-primary mb-4">หมายเหตุ</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-primary mb-1">
                หมายเหตุสำหรับคุณ
              </label>
              <textarea 
                className="input min-h-[80px]"
                value={agentNote}
                onChange={(e) => setAgentNote(e.target.value)}
                placeholder="บันทึกส่วนตัว (ลูกค้าไม่เห็น)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-1">
                หมายเหตุจากลูกค้า
              </label>
              <textarea 
                className="input min-h-[80px]"
                value={customerNote}
                onChange={(e) => setCustomerNote(e.target.value)}
                placeholder="คำขอพิเศษจากลูกค้า"
              />
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex gap-4">
          <button 
            type="button"
            onClick={() => router.back()}
            className="btn-secondary flex-1"
          >
            ยกเลิก
          </button>
          <button 
            type="submit"
            disabled={isLoading}
            className="btn-primary flex-1"
          >
            {isLoading ? 'กำลังสร้าง...' : 'สร้างบิล'}
          </button>
        </div>
      </form>
    </div>
  );
}
