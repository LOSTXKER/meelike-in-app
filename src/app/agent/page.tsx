// src/app/agent/page.tsx
"use client";

import React from 'react';
import Link from 'next/link';

// --- Icons ---
const FilterIcon = () => <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M2.628 1.601C5.028 1.206 7.49 1 10 1s4.973.206 7.372.601a.75.75 0 01.628.74v2.288a2.25 2.25 0 01-.659 1.59l-4.682 4.683a2.25 2.25 0 00-.659 1.59v3.037c0 .684-.31 1.33-.844 1.757l-1.937 1.55A.75.75 0 018 18.25v-5.757a2.25 2.25 0 00-.659-1.59L2.659 6.22A2.25 2.25 0 012 4.629V2.34a.75.75 0 01.628-.74z" clipRule="evenodd" /></svg>;
const SearchIcon = () => <svg className="w-4 h-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>;
const PlusIcon = () => <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" /></svg>;


// --- Dummy Data (ข้อมูลตัวอย่าง) ---
const agentOrders = [
    { id: 'MEE-001', client: 'ร้านเสื้อผ้าคุณ A', service: 'ถูกใจโพส [❤️ Love]', link: 'facebook.com/post/1', status: 'Completed', cost: 75.00, salePrice: 150.00, profit: 75.00, date: '2024-08-30' },
    { id: 'MEE-002', client: 'ร้านกาแฟ B', service: 'ผู้ติดตาม (คนไทย)', link: 'instagram.com/cafeB', status: 'Processing', cost: 114.00, salePrice: 200.00, profit: 86.00, date: '2024-08-29' },
    { id: 'MEE-003', client: 'ช่างภาพ C', service: 'เพิ่มวิววิดีโอ', link: 'tiktok.com/video/3', status: 'Completed', cost: 5.00, salePrice: 10.00, profit: 5.00, date: '2024-08-29' },
    { id: 'MEE-004', client: 'ร้านเสื้อผ้าคุณ A', service: 'ถูกใจเพจ ♻️ ประกัน 30 วัน', link: 'facebook.com/pageA', status: 'Canceled', cost: 0, salePrice: 0, profit: 0, date: '2024-08-28' },
];

const getStatusChip = (status: string) => {
    switch (status) {
        case 'Completed': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
        case 'Processing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
        case 'Canceled': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
        default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
};

export default function AgentDashboardPage() {
    // คำนวณยอดรวมกำไร
    const totalProfit = agentOrders.reduce((sum, order) => sum + order.profit, 0);

    return (
        <div className="space-y-8">
            {/* --- Stat Cards --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                 <div className="bg-brand-surface dark:bg-dark-surface p-5 rounded-xl shadow-md border border-brand-border dark:border-dark-border">
                    <p className="text-sm text-brand-text-light dark:text-dark-text-light">กำไรทั้งหมด</p>
                    <p className="text-2xl font-bold text-brand-success mt-1">฿{totalProfit.toFixed(2)}</p>
                </div>
                <div className="bg-brand-surface dark:bg-dark-surface p-5 rounded-xl shadow-md border border-brand-border dark:border-dark-border">
                    <p className="text-sm text-brand-text-light dark:text-dark-text-light">ออเดอร์ทั้งหมด</p>
                    <p className="text-2xl font-bold text-brand-text-dark dark:text-dark-text-dark mt-1">{agentOrders.length}</p>
                </div>
                 <div className="bg-brand-surface dark:bg-dark-surface p-5 rounded-xl shadow-md border border-brand-border dark:border-dark-border">
                    <p className="text-sm text-brand-text-light dark:text-dark-text-light">ลูกค้าในระบบ</p>
                    <p className="text-2xl font-bold text-brand-text-dark dark:text-dark-text-dark mt-1">3</p>
                </div>
            </div>

            {/* --- Orders Table --- */}
            <div className="bg-brand-surface dark:bg-dark-surface p-6 rounded-xl shadow-md border border-brand-border dark:border-dark-border">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                    <h2 className="text-xl font-bold text-brand-text-dark dark:text-dark-text-dark">ประวัติออเดอร์ลูกค้า</h2>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <div className="relative flex-grow">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3"><SearchIcon /></span>
                            <input type="text" placeholder="ค้นหา..." className="w-full bg-brand-bg dark:bg-dark-bg border border-brand-border dark:border-dark-border rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-brand-primary focus:outline-none"/>
                        </div>
                         <Link href="/agent/new-order" className="flex-shrink-0 text-md font-semibold text-white bg-brand-primary hover:opacity-90 dark:bg-dark-primary dark:text-brand-text-dark rounded-lg px-4 py-2 transition-opacity flex items-center justify-center">
                            <PlusIcon />
                            สร้างออเดอร์
                        </Link>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-brand-border dark:divide-dark-border">
                        <thead className="bg-brand-bg dark:bg-dark-bg">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-brand-text-light dark:text-dark-text-light uppercase tracking-wider">ลูกค้า</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-brand-text-light dark:text-dark-text-light uppercase tracking-wider">บริการ</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-brand-text-light dark:text-dark-text-light uppercase tracking-wider">สถานะ</th>
                                <th className="px-6 py-3 text-right text-xs font-bold text-brand-text-light dark:text-dark-text-light uppercase tracking-wider">ต้นทุน</th>
                                <th className="px-6 py-3 text-right text-xs font-bold text-brand-text-light dark:text-dark-text-light uppercase tracking-wider">ราคาขาย</th>
                                <th className="px-6 py-3 text-right text-xs font-bold text-brand-text-light dark:text-dark-text-light uppercase tracking-wider">กำไร</th>
                            </tr>
                        </thead>
                        <tbody className="bg-brand-surface dark:bg-dark-surface divide-y divide-brand-border dark:divide-dark-border">
                            {agentOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-brand-bg dark:hover:bg-dark-bg transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-semibold text-brand-text-dark dark:text-dark-text-dark">{order.client}</div>
                                        <div className="text-xs text-brand-text-light dark:text-dark-text-light truncate max-w-xs">{order.link}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-text-dark dark:text-dark-text-dark">{order.service}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusChip(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-brand-text-light dark:text-dark-text-light">฿{order.cost.toFixed(2)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-brand-text-dark dark:text-dark-text-dark">฿{order.salePrice.toFixed(2)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-brand-success">฿{order.profit.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}