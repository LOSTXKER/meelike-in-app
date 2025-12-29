"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AgentHeader } from '../../components';

// Mock services data
const mockServices = [
  { id: 1, name: 'เพิ่มไลค์โพสต์ Facebook (คนไทย)', category: 'Facebook', cost: 0.08, min: 100, max: 50000 },
  { id: 2, name: 'เพิ่มผู้ติดตาม Facebook', category: 'Facebook', cost: 0.12, min: 100, max: 10000 },
  { id: 3, name: 'เพิ่มผู้ติดตาม Instagram', category: 'Instagram', cost: 0.15, min: 100, max: 10000 },
  { id: 4, name: 'เพิ่มไลค์โพสต์ Instagram', category: 'Instagram', cost: 0.05, min: 100, max: 50000 },
  { id: 5, name: 'เพิ่มวิว TikTok', category: 'TikTok', cost: 0.02, min: 1000, max: 1000000 },
  { id: 6, name: 'เพิ่มผู้ติดตาม TikTok', category: 'TikTok', cost: 0.2, min: 100, max: 10000 },
  { id: 7, name: 'เพิ่มสมาชิก YouTube', category: 'YouTube', cost: 3, min: 100, max: 5000 },
  { id: 8, name: 'เพิ่มวิว YouTube', category: 'YouTube', cost: 0.05, min: 1000, max: 100000 },
];

// Mock clients
const mockClients = [
  { id: 'client_1', name: 'ร้านกาแฟ A', contact: '081-234-5678' },
  { id: 'client_2', name: 'ร้านเสื้อผ้า B', contact: '092-345-6789' },
  { id: 'client_3', name: 'คุณ C', contact: 'line_id_c' },
];

// Icons
const BackIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const PlusIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

export default function NewOrderPage() {
  const router = useRouter();
  
  // Form state
  const [selectedService, setSelectedService] = useState<typeof mockServices[0] | null>(null);
  const [serviceSearch, setServiceSearch] = useState('');
  const [quantity, setQuantity] = useState('');
  const [link, setLink] = useState('');
  const [salePrice, setSalePrice] = useState('');
  
  // Client state
  const [selectedClient, setSelectedClient] = useState<typeof mockClients[0] | null>(null);
  const [clientSearch, setClientSearch] = useState('');
  const [showNewClientForm, setShowNewClientForm] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientContact, setNewClientContact] = useState('');
  
  // UI state
  const [showServiceDropdown, setShowServiceDropdown] = useState(false);
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [note, setNote] = useState('');

  // Filter services
  const filteredServices = useMemo(() => {
    if (!serviceSearch) return mockServices;
    const query = serviceSearch.toLowerCase();
    return mockServices.filter(s => 
      s.name.toLowerCase().includes(query) ||
      s.category.toLowerCase().includes(query)
    );
  }, [serviceSearch]);

  // Filter clients
  const filteredClients = useMemo(() => {
    if (!clientSearch) return mockClients;
    const query = clientSearch.toLowerCase();
    return mockClients.filter(c =>
      c.name.toLowerCase().includes(query) ||
      c.contact.toLowerCase().includes(query)
    );
  }, [clientSearch]);

  // Calculate costs
  const calculations = useMemo(() => {
    if (!selectedService || !quantity) {
      return { baseCost: 0, actualCost: 0, profit: 0, margin: 0 };
    }
    
    const qty = parseInt(quantity) || 0;
    const sale = parseFloat(salePrice) || 0;
    const baseCost = selectedService.cost * qty;
    const agentDiscount = 0; // Would come from subscription
    const actualCost = baseCost - (baseCost * agentDiscount / 100);
    const profit = sale - actualCost;
    const margin = sale > 0 ? (profit / sale) * 100 : 0;
    
    return { baseCost, actualCost, profit, margin };
  }, [selectedService, quantity, salePrice]);

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 2,
    }).format(value);
  };

  // Handle submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Would create bill here
    console.log('Creating bill...', {
      service: selectedService,
      quantity,
      link,
      salePrice,
      client: selectedClient || { name: newClientName, contact: newClientContact },
      note,
    });
    router.push('/agent/orders');
  };

  // Suggested price (50% margin)
  const suggestedPrice = useMemo(() => {
    if (!selectedService || !quantity) return 0;
    const cost = selectedService.cost * parseInt(quantity);
    return Math.ceil(cost * 2); // 100% markup
  }, [selectedService, quantity]);

  return (
    <>
      <AgentHeader
        title="สร้างบิลใหม่"
        subtitle="สร้างบิลสำหรับลูกค้าของคุณ"
      />

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 lg:p-6 max-w-4xl mx-auto">
          {/* Back Button */}
          <Link
            href="/agent/orders"
            className="inline-flex items-center gap-2 text-secondary hover:text-primary mb-6 transition-colors"
          >
            <BackIcon />
            <span>กลับ</span>
          </Link>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Service Selection */}
            <div className="bg-surface dark:bg-dark-surface rounded-xl border border-default p-5">
              <h2 className="font-semibold text-primary mb-4">เลือกบริการ</h2>
              
              {/* Service Search */}
              <div className="relative">
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-tertiary">
                    <SearchIcon />
                  </span>
                  <input
                    type="text"
                    placeholder="ค้นหาบริการ..."
                    value={serviceSearch}
                    onChange={(e) => {
                      setServiceSearch(e.target.value);
                      setShowServiceDropdown(true);
                    }}
                    onFocus={() => setShowServiceDropdown(true)}
                    className="w-full pl-10 pr-4 py-2.5 bg-main border border-default rounded-lg text-sm focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary outline-none"
                  />
                </div>
                
                {/* Service Dropdown */}
                {showServiceDropdown && (
                  <div className="absolute z-10 mt-1 w-full bg-surface dark:bg-dark-surface border border-default rounded-lg shadow-lg max-h-60 overflow-auto">
                    {filteredServices.map(service => (
                      <button
                        key={service.id}
                        type="button"
                        onClick={() => {
                          setSelectedService(service);
                          setServiceSearch(service.name);
                          setShowServiceDropdown(false);
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-hover transition-colors flex justify-between items-center"
                      >
                        <div>
                          <p className="font-medium text-primary">{service.name}</p>
                          <p className="text-xs text-tertiary">{service.category} • Min: {service.min.toLocaleString()} - Max: {service.max.toLocaleString()}</p>
                        </div>
                        <span className="text-sm font-medium text-secondary">฿{service.cost}/หน่วย</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Selected Service Info */}
              {selectedService && (
                <div className="mt-4 p-4 bg-brand-primary/5 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-primary">{selectedService.name}</p>
                      <p className="text-sm text-secondary mt-1">{selectedService.category}</p>
                    </div>
                    <span className="text-brand-primary font-semibold">฿{selectedService.cost}/หน่วย</span>
                  </div>
                  <div className="flex gap-4 mt-3 text-xs text-tertiary">
                    <span>Min: {selectedService.min.toLocaleString()}</span>
                    <span>Max: {selectedService.max.toLocaleString()}</span>
                  </div>
                </div>
              )}

              {/* Link Input */}
              {selectedService && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-secondary mb-2">
                    ลิงก์
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    className="w-full px-4 py-2.5 bg-main border border-default rounded-lg text-sm focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary outline-none"
                    required
                  />
                </div>
              )}

              {/* Quantity Input */}
              {selectedService && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-secondary mb-2">
                    จำนวน
                  </label>
                  <input
                    type="number"
                    placeholder={`${selectedService.min.toLocaleString()} - ${selectedService.max.toLocaleString()}`}
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    min={selectedService.min}
                    max={selectedService.max}
                    className="w-full px-4 py-2.5 bg-main border border-default rounded-lg text-sm focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary outline-none"
                    required
                  />
                </div>
              )}
            </div>

            {/* Pricing */}
            {selectedService && quantity && (
              <div className="bg-surface dark:bg-dark-surface rounded-xl border border-default p-5">
                <h2 className="font-semibold text-primary mb-4">ราคาขาย</h2>
                
                <div className="space-y-4">
                  {/* Sale Price Input */}
                  <div>
                    <label className="block text-sm font-medium text-secondary mb-2">
                      ราคาขายลูกค้า (บาท)
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-4 flex items-center text-tertiary">฿</span>
                      <input
                        type="number"
                        placeholder={suggestedPrice.toString()}
                        value={salePrice}
                        onChange={(e) => setSalePrice(e.target.value)}
                        min={0}
                        step="0.01"
                        className="w-full pl-10 pr-4 py-2.5 bg-main border border-default rounded-lg text-sm focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary outline-none"
                        required
                      />
                    </div>
                    <p className="text-xs text-tertiary mt-1">
                      ราคาแนะนำ: {formatCurrency(suggestedPrice)} (กำไร 50%)
                    </p>
                  </div>

                  {/* Cost Breakdown */}
                  <div className="p-4 bg-hover rounded-lg space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-secondary">ต้นทุน</span>
                      <span className="text-primary">{formatCurrency(calculations.baseCost)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-secondary">ราคาขาย</span>
                      <span className="text-primary">{formatCurrency(parseFloat(salePrice) || 0)}</span>
                    </div>
                    <div className="border-t border-default pt-2 mt-2">
                      <div className="flex justify-between">
                        <span className="font-medium text-primary">กำไร</span>
                        <span className={`font-bold ${calculations.profit >= 0 ? 'text-success' : 'text-error'}`}>
                          {formatCurrency(calculations.profit)}
                          <span className="text-xs ml-1">({calculations.margin.toFixed(1)}%)</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Client Selection */}
            {selectedService && quantity && salePrice && (
              <div className="bg-surface dark:bg-dark-surface rounded-xl border border-default p-5">
                <h2 className="font-semibold text-primary mb-4">ลูกค้า</h2>
                
                {!showNewClientForm ? (
                  <>
                    {/* Client Search */}
                    <div className="relative">
                      <div className="relative">
                        <span className="absolute inset-y-0 left-3 flex items-center text-tertiary">
                          <SearchIcon />
                        </span>
                        <input
                          type="text"
                          placeholder="ค้นหาลูกค้า..."
                          value={clientSearch}
                          onChange={(e) => {
                            setClientSearch(e.target.value);
                            setShowClientDropdown(true);
                          }}
                          onFocus={() => setShowClientDropdown(true)}
                          className="w-full pl-10 pr-4 py-2.5 bg-main border border-default rounded-lg text-sm focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary outline-none"
                        />
                      </div>
                      
                      {/* Client Dropdown */}
                      {showClientDropdown && (
                        <div className="absolute z-10 mt-1 w-full bg-surface dark:bg-dark-surface border border-default rounded-lg shadow-lg max-h-60 overflow-auto">
                          {filteredClients.map(client => (
                            <button
                              key={client.id}
                              type="button"
                              onClick={() => {
                                setSelectedClient(client);
                                setClientSearch(client.name);
                                setShowClientDropdown(false);
                              }}
                              className="w-full px-4 py-3 text-left hover:bg-hover transition-colors"
                            >
                              <p className="font-medium text-primary">{client.name}</p>
                              <p className="text-xs text-tertiary">{client.contact}</p>
                            </button>
                          ))}
                          <button
                            type="button"
                            onClick={() => {
                              setShowNewClientForm(true);
                              setShowClientDropdown(false);
                            }}
                            className="w-full px-4 py-3 text-left hover:bg-hover transition-colors border-t border-default flex items-center gap-2 text-brand-primary"
                          >
                            <PlusIcon />
                            <span>เพิ่มลูกค้าใหม่</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Selected Client */}
                    {selectedClient && (
                      <div className="mt-4 p-4 bg-brand-primary/5 rounded-lg flex justify-between items-center">
                        <div>
                          <p className="font-medium text-primary">{selectedClient.name}</p>
                          <p className="text-sm text-secondary">{selectedClient.contact}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedClient(null);
                            setClientSearch('');
                          }}
                          className="text-error hover:underline text-sm"
                        >
                          เปลี่ยน
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  /* New Client Form */
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary mb-2">
                        ชื่อลูกค้า
                      </label>
                      <input
                        type="text"
                        placeholder="ชื่อ-นามสกุล หรือ ชื่อร้าน"
                        value={newClientName}
                        onChange={(e) => setNewClientName(e.target.value)}
                        className="w-full px-4 py-2.5 bg-main border border-default rounded-lg text-sm focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary outline-none"
                        required={showNewClientForm}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary mb-2">
                        ช่องทางติดต่อ
                      </label>
                      <input
                        type="text"
                        placeholder="เบอร์โทร หรือ LINE ID"
                        value={newClientContact}
                        onChange={(e) => setNewClientContact(e.target.value)}
                        className="w-full px-4 py-2.5 bg-main border border-default rounded-lg text-sm focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary outline-none"
                        required={showNewClientForm}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setShowNewClientForm(false);
                        setNewClientName('');
                        setNewClientContact('');
                      }}
                      className="text-sm text-secondary hover:text-primary"
                    >
                      ยกเลิก เลือกลูกค้าที่มีอยู่
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Note */}
            {selectedService && quantity && salePrice && (selectedClient || (newClientName && newClientContact)) && (
              <div className="bg-surface dark:bg-dark-surface rounded-xl border border-default p-5">
                <h2 className="font-semibold text-primary mb-4">หมายเหตุ (ไม่บังคับ)</h2>
                <textarea
                  placeholder="หมายเหตุสำหรับออเดอร์นี้..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-main border border-default rounded-lg text-sm focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary outline-none resize-none"
                />
              </div>
            )}

            {/* Submit */}
            {selectedService && quantity && salePrice && (selectedClient || (newClientName && newClientContact)) && (
              <div className="flex gap-3">
                <Link
                  href="/agent/orders"
                  className="flex-1 py-3 text-center font-medium text-secondary bg-hover hover:bg-brand-primary/10 rounded-lg transition-colors"
                >
                  ยกเลิก
                </Link>
                <button
                  type="submit"
                  className="flex-1 py-3 font-medium text-white bg-brand-primary hover:bg-brand-primary/90 rounded-lg transition-colors"
                >
                  สร้างบิล
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );
}

