// src/app/refunds/page.tsx
"use client";

import React from 'react';
import Table from '@/app/components/Table'; // Import Table

// --- Icons ---
const CalendarIcon = () => <svg className="w-5 h-5 mr-2 text-brand-text-light dark:text-dark-text-light" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zM4.5 6A1.25 1.25 0 003.25 7.25v8A1.25 1.25 0 004.5 16.5h11A1.25 1.25 0 0016.75 15.25v-8A1.25 1.25 0 0015.5 6h-11z" clipRule="evenodd" /></svg>;
const ExportIcon = () => <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" /><path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" /></svg>;

// --- Type Definitions ---
interface Refund {
    refundId: number;
    date: string;
    orderId: string;
    amount: number;
    reason: string;
}

// --- Dummy Data ---
const dummyRefunds: Refund[] = [
    { refundId: 8, date: '10/08/2025 16:11', orderId: 'ORD-2025-000021', amount: 6.86, reason: 'Order canceled by admin' },
];

export default function RefundPage() {
    const tableHeaders = [
        { label: 'วันที่ทำรายการ', align: 'left' as const },
        { label: 'รหัสรายการ', align: 'left' as const },
        { label: 'รหัสคำสั่งซื้อ', align: 'left' as const },
        { label: 'เหตุผล', align: 'left' as const },
        { label: 'จำนวนเงินคืน', align: 'right' as const }
    ];

    return (
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            <h1 className="text-3xl font-bold text-brand-text-dark dark:text-dark-text-dark mb-8">
                การคืนเงิน
            </h1>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                 <div className="relative w-full sm:w-72">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <CalendarIcon />
                    </div>
                    <input 
                        type="text" 
                        placeholder="เลือกช่วงวันที่"
                        className="w-full bg-brand-surface dark:bg-dark-surface border border-brand-border dark:border-dark-border rounded-lg py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-brand-primary focus:outline-none"
                    />
                </div>
                <button className="w-full sm:w-auto flex items-center justify-center text-sm font-semibold text-white bg-brand-primary dark:bg-dark-primary dark:text-brand-text-dark rounded-full px-5 py-2.5 hover:opacity-90 transition-opacity">
                    <ExportIcon />
                    Export Data
                </button>
            </div>

            <div className="bg-brand-surface dark:bg-dark-surface p-6 rounded-xl shadow-md border border-brand-border dark:border-dark-border">
                <Table headers={tableHeaders}>
                    {dummyRefunds.map(refund => (
                        <tr key={refund.refundId} className="border-t border-brand-border dark:border-dark-border">
                            <td className="p-3 text-brand-text-dark dark:text-dark-text-dark whitespace-nowrap">
                                {refund.date}
                            </td>
                            <td className="p-3 font-semibold text-brand-text-dark dark:text-dark-text-dark">
                                {refund.refundId}
                            </td>
                            <td className="p-3 text-brand-primary dark:text-dark-primary hover:underline cursor-pointer">
                                {refund.orderId}
                            </td>
                             <td className="p-3 text-brand-text-light dark:text-dark-text-light">
                                {refund.reason}
                            </td>
                            <td className="p-3 text-right font-semibold text-brand-error">
                                ฿{refund.amount.toFixed(2)}
                            </td>
                        </tr>
                    ))}
                </Table>
                 {dummyRefunds.length === 0 && (
                    <div className="text-center py-10 text-brand-text-light dark:text-dark-text-light">
                        <p>ไม่พบประวัติการคืนเงิน</p>
                    </div>
                )}
            </div>
        </main>
    );
}