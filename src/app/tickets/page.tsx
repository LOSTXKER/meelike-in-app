// src/app/tickets/page.tsx
"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Table from '@/app/components/Table'; 

// --- Icons ---
const CreateTicketIcon = () => <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" /><path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" /></svg>;
const TicketIconLarge = () => <svg className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>;
const FilterIcon = () => <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>;
const SearchIcon = () => <svg className="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>;
const CalendarIcon = () => <svg className="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zM4.5 6A1.25 1.25 0 003.25 7.25v8A1.25 1.25 0 004.5 16.5h11A1.25 1.25 0 0016.75 15.25v-8A1.25 1.25 0 0015.5 6h-11z" clipRule="evenodd" /></svg>;


import { dummyTickets, Ticket, TicketStatus, TicketCategory } from './data';

const statusStyles: { [key in TicketStatus]: string } = {
    Open: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
    Answered: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    Closed: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
};

const categories: ('All' | TicketCategory)[] = ['All', 'คำสั่งซื้อ', 'เติมเงินไม่เข้า', 'เช่าเว็บปั้มไลค์', 'แจ้งเรื่องใบเสร็จ/ใบกำกับภาษี', 'สอบถามทั่วไป-อื่นๆ', 'สมัครตัวแทน'];
const statuses: ('All' | TicketStatus)[] = ['All', 'Open', 'Answered', 'Closed'];

export default function TicketsPage() {
    const router = useRouter();
    const [activeCategory, setActiveCategory] = useState<typeof categories[0]>('All');
    const [activeStatus, setActiveStatus] = useState<typeof statuses[0]>('All');

    const filteredTickets = useMemo(() => {
        return dummyTickets.filter(ticket => {
            const matchesCategory = activeCategory === 'All' || ticket.category === activeCategory;
            const matchesStatus = activeStatus === 'All' || ticket.status === activeStatus;
            return matchesCategory && matchesStatus;
        });
    }, [activeCategory, activeStatus]);
    
    const handleRowClick = (ticketId: string) => {
        router.push(`/tickets/${ticketId}`);
    };

    const tableHeaders = [
        { label: 'รหัสตั๋ว', align: 'left' as const },
        { label: 'หัวข้อ', align: 'left' as const },
        { label: 'สถานะ', align: 'center' as const },
        { label: 'อัปเดตล่าสุด', align: 'left' as const }
    ];

    if (dummyTickets.length === 0) {
        return (
             <main className="flex-1 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
                {/* ... Empty ticket content ... */}
            </main>
        )
    }

    return (
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-8">
                <h1 className="text-3xl font-bold text-brand-text-dark dark:text-dark-text-dark">ประวัติตั๋ว</h1>
                <Link href="/tickets/create">
                    <span className="w-full mt-4 md:mt-0 md:w-auto flex items-center justify-center text-md font-semibold text-white bg-brand-primary dark:bg-dark-primary dark:text-brand-text-dark rounded-full px-6 py-3 hover:opacity-90 transition-opacity">
                        <CreateTicketIcon />
                        สร้างตั๋วใหม่
                    </span>
                </Link>
            </div>
            
            {/* --- Filter Section --- */}
            <div className="bg-brand-surface dark:bg-dark-surface p-6 rounded-xl shadow-md border border-brand-border dark:border-dark-border mb-6">
                <h2 className="text-lg font-semibold flex items-center mb-4"><FilterIcon /> ตัวกรอง</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                        <label className="text-sm font-semibold mb-1 block">ค้นหา</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3"><SearchIcon /></span>
                            <input type="text" placeholder="ID, หัวข้อเรื่อง..." className="w-full bg-brand-bg dark:bg-dark-bg border border-brand-border dark:border-dark-border rounded-lg py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-brand-primary focus:outline-none"/>
                        </div>
                    </div>
                     <div>
                        <label className="text-sm font-semibold mb-1 block">วันที่สร้างปัญหา</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3"><CalendarIcon /></span>
                            <input type="text" placeholder="เลือกวันที่" className="w-full bg-brand-bg dark:bg-dark-bg border border-brand-border dark:border-dark-border rounded-lg py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-brand-primary focus:outline-none"/>
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-semibold mb-1 block">วันที่ปิดปัญหา</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3"><CalendarIcon /></span>
                            <input type="text" placeholder="เลือกวันที่" className="w-full bg-brand-bg dark:bg-dark-bg border border-brand-border dark:border-dark-border rounded-lg py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-brand-primary focus:outline-none"/>
                        </div>
                    </div>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-semibold mb-2 block">ประเภท</label>
                        <div className="flex flex-wrap gap-2">
                           {categories.map(cat => (
                               <button 
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 flex items-center transform active:scale-95 ${activeCategory === cat ? 'bg-brand-primary text-white dark:bg-dark-primary dark:text-brand-text-dark shadow-md' : 'bg-brand-bg dark:bg-dark-bg hover:bg-brand-border dark:hover:bg-dark-border'}`}
                               >
                                {cat}
                               </button>
                           ))}
                        </div>
                    </div>
                     <div>
                        <label className="text-sm font-semibold mb-2 block">สถานะ</label>
                        <div className="flex flex-wrap gap-2">
                            {statuses.map(stat => (
                               <button 
                                key={stat}
                                onClick={() => setActiveStatus(stat)}
                                className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 flex items-center transform active:scale-95 ${activeStatus === stat ? 'bg-brand-primary text-white dark:bg-dark-primary dark:text-brand-text-dark shadow-md' : 'bg-brand-bg dark:bg-dark-bg hover:bg-brand-border dark:hover:bg-dark-border'}`}
                               >
                                {stat}
                               </button>
                           ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-brand-surface dark:bg-dark-surface p-6 rounded-xl shadow-md border border-brand-border dark:border-dark-border">
                <Table headers={tableHeaders}>
                    {filteredTickets.map(ticket => (
                        <tr 
                            key={ticket.id} 
                            className="border-t border-brand-border dark:border-dark-border hover:bg-brand-bg dark:hover:bg-dark-bg cursor-pointer"
                            onClick={() => handleRowClick(ticket.id)}
                        >
                            <td className="p-3 font-semibold text-brand-primary dark:text-dark-primary">
                                {ticket.id}
                            </td>
                            <td className="p-3 text-brand-text-dark dark:text-dark-text-dark">
                                {ticket.subject}
                            </td>
                            <td className="p-3 text-center">
                                <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${statusStyles[ticket.status]}`}>
                                    {ticket.status}
                                </span>
                            </td>
                            <td className="p-3 text-brand-text-light dark:text-dark-text-light whitespace-nowrap">
                                {ticket.lastUpdated}
                            </td>
                        </tr>
                    ))}
                </Table>
                {filteredTickets.length === 0 && (
                    <div className="text-center py-10 text-brand-text-light dark:text-dark-text-light">
                        <p>ไม่พบรายการตั๋วที่ตรงกับตัวกรอง</p>
                    </div>
                )}
            </div>
        </main>
    );
}