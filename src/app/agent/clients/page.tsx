// src/app/agent/clients/page.tsx
"use client";

import React, { useState } from 'react';

// --- Icons ---
const UserPlusIcon = () => <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M11 5a3 3 0 11-6 0 3 3 0 016 0zM14 10a4 4 0 11-8 0 4 4 0 018 0zM15.35 15.15a.75.75 0 00-1.06-1.06l-2.09 2.09-2.09-2.09a.75.75 0 00-1.06 1.06l2.09 2.09-2.09 2.09a.75.75 0 101.06 1.06l2.09-2.09 2.09 2.09a.75.75 0 001.06-1.06l-2.09-2.09 2.09-2.09z" /></svg>;
const PencilIcon = () => <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" /></svg>;
const TrashIcon = () => <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.58.22-2.365.468a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1H8.75zM10 4.5a.75.75 0 01.75.75v8.5a.75.75 0 01-1.5 0v-8.5A.75.75 0 0110 4.5z" clipRule="evenodd" /></svg>;


// --- Dummy Data ---
const initialClients = [
    { id: 1, name: "ร้านเสื้อผ้าคุณ A", contact: "คุณ A", totalSpent: 150.00 },
    { id: 2, name: "ร้านกาแฟ B", contact: "คุณ B", totalSpent: 200.00 },
    { id: 3, name: "ช่างภาพ C", contact: "คุณ C", totalSpent: 10.00 },
];

export default function AgentClientsPage() {
    const [clients, setClients] = useState(initialClients);
    const [isAdding, setIsAdding] = useState(false);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left Column: Client List */}
            <div className="lg:col-span-2 bg-brand-surface dark:bg-dark-surface p-6 rounded-xl shadow-md border border-brand-border dark:border-dark-border">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">รายชื่อลูกค้า</h2>
                    <button 
                        onClick={() => setIsAdding(!isAdding)}
                        className="text-md font-semibold text-white bg-brand-primary hover:opacity-90 dark:bg-dark-primary dark:text-brand-text-dark rounded-lg px-4 py-2 transition-opacity flex items-center justify-center"
                    >
                        <UserPlusIcon />
                        {isAdding ? 'ยกเลิก' : 'เพิ่มลูกค้าใหม่'}
                    </button>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-brand-border dark:divide-dark-border">
                        <thead className="bg-brand-bg dark:bg-dark-bg">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold uppercase">ชื่อลูกค้า</th>
                                <th className="px-6 py-3 text-left text-xs font-bold uppercase">ผู้ติดต่อ</th>
                                <th className="px-6 py-3 text-right text-xs font-bold uppercase">ยอดใช้จ่ายรวม</th>
                                <th className="px-6 py-3 text-center text-xs font-bold uppercase">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-border dark:divide-dark-border">
                            {clients.map(client => (
                                <tr key={client.id} className="hover:bg-brand-bg dark:hover:bg-dark-bg">
                                    <td className="px-6 py-4 font-semibold">{client.name}</td>
                                    <td className="px-6 py-4 text-sm text-brand-text-light dark:text-dark-text-light">{client.contact}</td>
                                    <td className="px-6 py-4 text-right font-medium">฿{client.totalSpent.toFixed(2)}</td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex justify-center items-center gap-2">
                                            <button className="text-blue-500 hover:text-blue-700"><PencilIcon /></button>
                                            <button className="text-red-500 hover:text-red-700"><TrashIcon /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Right Column: Add Client Form */}
            {isAdding && (
                 <div className="lg:col-span-1 bg-brand-surface dark:bg-dark-surface p-6 rounded-xl shadow-md border border-brand-border dark:border-dark-border">
                    <h3 className="text-lg font-bold mb-4">ฟอร์มเพิ่มลูกค้าใหม่</h3>
                    <form className="space-y-4">
                        <div>
                            <label className="text-sm font-semibold mb-1 block">ชื่อลูกค้า / ร้านค้า</label>
                            <input type="text" placeholder="เช่น ร้านกาแฟ B" className="w-full bg-brand-bg dark:bg-dark-bg border-brand-border dark:border-dark-border rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary" />
                        </div>
                         <div>
                            <label className="text-sm font-semibold mb-1 block">ชื่อผู้ติดต่อ (ถ้ามี)</label>
                            <input type="text" placeholder="เช่น คุณ B" className="w-full bg-brand-bg dark:bg-dark-bg border-brand-border dark:border-dark-border rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary" />
                        </div>
                         <div>
                            <label className="text-sm font-semibold mb-1 block">ข้อมูลอื่นๆ (ถ้ามี)</label>
                            <textarea rows={3} placeholder="เช่น เบอร์โทร, Facebook" className="w-full bg-brand-bg dark:bg-dark-bg border-brand-border dark:border-dark-border rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary" />
                        </div>
                        <button type="submit" className="w-full font-semibold text-white bg-brand-success rounded-lg py-2.5">
                            บันทึกข้อมูลลูกค้า
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}