// src/app/history/deposits/page.tsx
"use client";

import React from 'react';
import Table from '@/app/components/Table'; // Import Table

// --- Icons ---
const CalendarIcon = () => <svg className="w-5 h-5 mr-2 text-brand-text-light dark:text-dark-text-light" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zM4.5 6A1.25 1.25 0 003.25 7.25v8A1.25 1.25 0 004.5 16.5h11A1.25 1.25 0 0016.75 15.25v-8A1.25 1.25 0 0015.5 6h-11z" clipRule="evenodd" /></svg>;
const ExportIcon = () => <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" /><path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" /></svg>;
const DownloadIcon = () => <svg className="w-4 h-4 mr-1.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" /></svg>;


// --- Type Definitions ---
type DepositStatus = 'Completed' | 'Pending' | 'Failed';

interface Deposit {
    id: string;
    date: string;
    method: string;
    amount: number;
    status: DepositStatus;
    taxInvoiceAvailable: boolean; 
}

// --- Dummy Data ---
const dummyDeposits: Deposit[] = [
    { id: 'DP-2025-00125', date: '19/08/2025 14:30', method: 'สแกน QR Code', amount: 500.00, status: 'Completed', taxInvoiceAvailable: true },
    { id: 'DP-2025-00124', date: '18/08/2025 11:05', method: 'True Money Wallet', amount: 300.00, status: 'Completed', taxInvoiceAvailable: false },
];

const statusStyles: { [key in DepositStatus]: string } = {
    Completed: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
    Failed: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
};

export default function DepositHistoryPage() {
    const tableHeaders = [
        { label: 'รหัสรายการ', align: 'left' as const },
        { label: 'วันที่ทำรายการ', align: 'left' as const },
        { label: 'วิธีการชำระเงิน', align: 'left' as const },
        { label: 'จำนวนเงิน', align: 'right' as const },
        { label: 'สถานะ', align: 'center' as const },
        { label: 'ใบกำกับภาษี', align: 'center' as const }
    ];

    return (
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            <h1 className="text-3xl font-bold text-brand-text-dark dark:text-dark-text-dark mb-8">
                ประวัติการเติมเงิน
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
                    {dummyDeposits.map(deposit => (
                        <tr key={deposit.id} className="border-t border-brand-border dark:border-dark-border">
                            <td className="p-3 font-semibold text-brand-primary dark:text-dark-primary">
                                {deposit.id}
                            </td>
                            <td className="p-3 text-brand-text-dark dark:text-dark-text-dark whitespace-nowrap">
                                {deposit.date}
                            </td>
                            <td className="p-3 text-brand-text-light dark:text-dark-text-light">
                                {deposit.method}
                            </td>
                            <td className="p-3 text-right font-semibold text-brand-text-dark dark:text-dark-text-dark">
                                ฿{deposit.amount.toFixed(2)}
                            </td>
                            <td className="p-3 text-center">
                                <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${statusStyles[deposit.status]}`}>
                                    {deposit.status}
                                </span>
                            </td>
                            <td className="p-3 text-center">
                                {deposit.taxInvoiceAvailable ? (
                                    <button className="flex items-center justify-center mx-auto text-xs font-semibold text-white bg-brand-success rounded-full px-3 py-1.5 hover:opacity-90 transition-opacity">
                                        <DownloadIcon />
                                        ดาวน์โหลด
                                    </button>
                                ) : (
                                    <button className="flex items-center justify-center mx-auto text-xs font-semibold text-gray-500 bg-gray-200 dark:bg-gray-700 dark:text-gray-400 rounded-full px-3 py-1.5 cursor-not-allowed" disabled>
                                        -
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </Table>
                 {dummyDeposits.length === 0 && (
                    <div className="text-center py-10 text-brand-text-light dark:text-dark-text-light">
                        <p>ไม่พบประวัติการเติมเงิน</p>
                    </div>
                )}
            </div>
        </main>
    );
}