// src/app/agent/new-order/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// --- (ส่วนนี้ให้นำ Component และข้อมูลจากไฟล์ order/page.tsx เดิมมาใช้) ---
// เพื่อความกระชับ จะสมมติว่าคุณได้ import สิ่งเหล่านี้มาแล้ว
// import CategoryDropdown, { mainCategories, Category } from '@/app/components/CategoryDropdown';
// import ServiceSelect from '@/app/components/ServiceSelect'; // อาจจะต้องดัดแปลงเล็กน้อย
// import { services, Service } from '@/app/data/services'; // สมมติว่าแยกข้อมูลบริการออกมา

// --- Mockup Components and Data for this example ---
// ในโปรเจกต์จริงให้นำ Component จากไฟล์เดิมมาใช้
const CategoryDropdown = ({ selected, onSelect }: any) => <select className="w-full bg-brand-bg dark:bg-dark-bg border border-brand-border dark:border-dark-border rounded-lg py-2.5 px-4 focus:ring-2 focus:ring-brand-primary focus:outline-none" value={selected.id} onChange={(e) => onSelect({ id: e.target.value })}><option value="facebook">Facebook</option><option value="instagram">Instagram</option></select>;
const ServiceSelect = ({ selected, onSelect, options }: any) => <select className="w-full bg-brand-bg dark:bg-dark-bg border border-brand-border dark:border-dark-border rounded-lg py-2.5 px-4 focus:ring-2 focus:ring-brand-primary focus:outline-none" value={selected?.id} onChange={(e) => onSelect(options.find((s:any) => s.id == e.target.value))}><option>เลือกบริการ</option>{options.map((o:any) => <option key={o.id} value={o.id}>{o.name}</option>)}</select>;
const mainCategories = [{id: 'facebook', name: 'Facebook'}, {id: 'instagram', name: 'Instagram'}];
const services = [
    { id: 1, category: "facebook", name: "ถูกใจโพสอีโมจิ [❤️ Love]", price: 75.00, min: 100, max: 50000, speed: "5K/วัน", refill: false },
    { id: 3, category: "instagram", name: "ผู้ติดตาม (คนไทย)", price: 120.00, min: 100, max: 10000, speed: "0/วัน", refill: true },
];
const clients = [
    { id: 1, name: "ร้านเสื้อผ้าคุณ A" },
    { id: 2, name: "ร้านกาแฟ B" },
    { id: 3, name: "ช่างภาพ C" },
];
// --- End Mockup ---

export default function AgentNewOrderPage() {
    const [selectedCategory, setSelectedCategory] = useState(mainCategories[0]);
    const [selectedService, setSelectedService] = useState<any | null>(null);
    const [quantity, setQuantity] = useState(0);
    const [salePrice, setSalePrice] = useState(''); // ราคาขาย
    const [selectedClient, setSelectedClient] = useState<any | null>(null);

    const filteredServices = services.filter(s => s.category === selectedCategory.id);
    
    useEffect(() => {
        setSelectedService(null);
    }, [selectedCategory]);

    // คำนวณต้นทุนและกำไร
    const agentDiscount = 0.05; // สมมติว่าตัวแทนได้ส่วนลด 5%
    const cost = selectedService && quantity ? (selectedService.price / 1000) * quantity * (1 - agentDiscount) : 0;
    const profit = salePrice && cost ? parseFloat(salePrice) - cost : 0;


    return (
        <div className="bg-brand-surface dark:bg-dark-surface p-6 rounded-xl shadow-md border border-brand-border dark:border-dark-border">
            <h2 className="text-xl font-bold text-brand-text-dark dark:text-dark-text-dark mb-6">
                สร้างออเดอร์ใหม่สำหรับลูกค้า
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* --- Left Column: Form --- */}
                <div className="space-y-5">
                     <div>
                        <label className="text-sm font-semibold text-brand-text-dark dark:text-dark-text-dark mb-2 block">
                            ลูกค้า <Link href="/agent/clients" className="text-xs text-brand-primary hover:underline ml-2">(จัดการลูกค้า)</Link>
                        </label>
                        <select 
                            value={selectedClient?.id || ''}
                            onChange={(e) => setSelectedClient(clients.find(c => c.id == parseInt(e.target.value)))}
                            className="w-full bg-brand-bg dark:bg-dark-bg border border-brand-border dark:border-dark-border rounded-lg py-2.5 px-4 focus:ring-2 focus:ring-brand-primary focus:outline-none"
                        >
                            <option value="">-- เลือกลูกค้า --</option>
                            {clients.map(client => (
                                <option key={client.id} value={client.id}>{client.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="text-sm font-semibold text-brand-text-dark dark:text-dark-text-dark mb-2 block">หมวดหมู่</label>
                        <CategoryDropdown categories={mainCategories} selected={selectedCategory} onSelect={setSelectedCategory} />
                    </div>
                     <div>
                        <label className="text-sm font-semibold text-brand-text-dark dark:text-dark-text-dark mb-2 block">บริการ</label>
                        <ServiceSelect options={filteredServices} selected={selectedService} onSelect={setSelectedService} placeholder="เลือกบริการ" />
                    </div>
                     <div>
                        <label htmlFor="link" className="text-sm font-semibold text-brand-text-dark dark:text-dark-text-dark mb-2 block">ลิงก์</label>
                        <input type="text" id="link" placeholder="https://example.com" className="w-full bg-brand-bg dark:bg-dark-bg border border-brand-border dark:border-dark-border rounded-lg py-2.5 px-4 focus:ring-2 focus:ring-brand-primary focus:outline-none"/>
                   </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="quantity" className="text-sm font-semibold text-brand-text-dark dark:text-dark-text-dark mb-2 block">จำนวน</label>
                            <input 
                                type="number" 
                                id="quantity" 
                                placeholder="ใส่จำนวน" 
                                value={quantity || ''}
                                onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                                min={selectedService?.min} 
                                max={selectedService?.max} 
                                className="w-full bg-brand-bg dark:bg-dark-bg border border-brand-border dark:border-dark-border rounded-lg py-2.5 px-4 focus:ring-2 focus:ring-brand-primary focus:outline-none"/>
                        </div>
                        <div>
                            <label htmlFor="salePrice" className="text-sm font-semibold text-brand-text-dark dark:text-dark-text-dark mb-2 block">ราคาที่ขาย (บาท)</label>
                            <input 
                                type="number" 
                                id="salePrice" 
                                value={salePrice}
                                onChange={(e) => setSalePrice(e.target.value)}
                                placeholder="0.00" 
                                className="w-full bg-brand-bg dark:bg-dark-bg border border-brand-border dark:border-dark-border rounded-lg py-2.5 px-4 focus:ring-2 focus:ring-brand-primary focus:outline-none"/>
                        </div>
                    </div>
                </div>

                {/* --- Right Column: Summary --- */}
                <div className="bg-brand-bg dark:bg-dark-bg p-6 rounded-xl border border-brand-border dark:border-dark-border space-y-4">
                    <h3 className="font-bold text-lg text-brand-text-dark dark:text-dark-text-dark">สรุปรายการ</h3>
                    <div className="text-sm space-y-3">
                        <div className="flex justify-between">
                            <span className="text-brand-text-light dark:text-dark-text-light">ลูกค้า:</span>
                            <span className="font-semibold">{selectedClient?.name || '-'}</span>
                        </div>
                         <div className="flex justify-between">
                            <span className="text-brand-text-light dark:text-dark-text-light">บริการ:</span>
                            <span className="font-semibold text-right max-w-[60%] truncate">{selectedService?.name || '-'}</span>
                        </div>
                        <hr className="border-brand-border dark:border-dark-border"/>
                        <div className="flex justify-between items-center">
                            <span className="text-brand-text-light dark:text-dark-text-light">ต้นทุน (ส่วนลด {agentDiscount * 100}%):</span>
                            <span className="font-bold text-lg text-brand-error">฿{cost.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-brand-text-light dark:text-dark-text-light">ราคาขาย:</span>
                            <span className="font-bold text-lg">฿{parseFloat(salePrice || '0').toFixed(2)}</span>
                        </div>
                        <div className="bg-green-100/50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-3 flex justify-between items-center mt-2">
                           <span className="font-semibold text-lg text-green-800 dark:text-green-200">กำไรที่คาดว่าจะได้รับ</span>
                           <span className="text-2xl font-bold text-green-800 dark:text-green-200">฿{profit > 0 ? profit.toFixed(2) : '0.00'}</span>
                       </div>
                    </div>
                    <button 
                        type="button" 
                        disabled={!selectedClient || !selectedService || !quantity || !salePrice}
                        className="w-full mt-4 text-md font-semibold text-white bg-brand-primary hover:opacity-90 dark:bg-dark-primary dark:text-brand-text-dark rounded-lg px-6 py-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                     >
                        ยืนยันการสั่งซื้อให้ลูกค้า
                   </button>
                </div>
            </div>
        </div>
    );
}