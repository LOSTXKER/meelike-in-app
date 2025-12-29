// src/app/components/StatusFilter.tsx
"use client";

import React from 'react';

// --- Type Definitions ---
export type OrderStatus = 'Awaiting' | 'Pending' | 'In Progress' | 'Completed' | 'Partially Completed' | 'Canceled' | 'Processing' | 'On Refill' | 'Refilled' | 'Fail' | 'Error';

export const statusFilters: { key: OrderStatus | 'All', label: string }[] = [
    { key: 'All', label: 'All' },
    { key: 'Awaiting', label: 'Awaiting' },
    { key: 'Pending', label: 'Pending' },
    { key: 'In Progress', label: 'In Progress' },
    { key: 'Processing', label: 'Processing' },
    { key: 'Completed', label: 'Completed' },
    { key: 'Partially Completed', label: 'Partially Completed' },
    { key: 'On Refill', label: 'On Refill' },
    { key: 'Refilled', label: 'Refilled' },
    { key: 'Canceled', label: 'Canceled' },
    { key: 'Fail', label: 'Fail' },
    { key: 'Error', label: 'Error' },
];

// --- Icons ---
const AllIcon = () => <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>;
const AwaitingIcon = () => <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>;
const PendingIcon = () => <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>;
const InProgressIcon = () => <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>;
const ProcessingIcon = () => <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>;
const CompletedIcon = () => <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>;
const PartiallyCompletedIcon = () => <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a.75.75 0 01.75.75v6.518a.75.75 0 01-1.5 0V2.75A.75.75 0 0110 2zM2.066 11.25a.75.75 0 01.75-.75h14.368a.75.75 0 010 1.5H2.816a.75.75 0 01-.75-.75zM10 18a8 8 0 100-16 8 8 0 000 16zM9.25 10a.75.75 0 011.5 0v3.5a.75.75 0 01-1.5 0v-3.5z"></path></svg>;
const OnRefillIcon = () => <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h5M20 20v-5h-5M4 20h5v-5M20 4h-5v5"></path></svg>;
const RefilledIcon = () => <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18a6 6 0 100-12 6 6 0 000 12z"></path></svg>;
const CanceledIcon = () => <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>;
const FailIcon = () => <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path></svg>;
const ErrorIcon = () => <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>;

const iconMap: { [key in OrderStatus | 'All']: React.ReactNode } = {
    All: <AllIcon />, Awaiting: <AwaitingIcon />, Pending: <PendingIcon />, 'In Progress': <InProgressIcon />,
    Processing: <ProcessingIcon />, Completed: <CompletedIcon />, 'Partially Completed': <PartiallyCompletedIcon />,
    'On Refill': <OnRefillIcon />, Refilled: <RefilledIcon />, Canceled: <CanceledIcon />,
    Fail: <FailIcon />, Error: <ErrorIcon />,
};

const statusButtonStyles: { [key: string]: string } = {
    All: 'text-brand-text-dark dark:text-dark-text-dark bg-brand-bg dark:bg-dark-bg hover:bg-brand-border dark:hover:bg-dark-border',
    Awaiting: 'text-gray-800 bg-gray-100 hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600',
    Pending: 'text-yellow-800 bg-yellow-100 hover:bg-yellow-200 dark:text-yellow-300 dark:bg-yellow-900/50 dark:hover:bg-yellow-900/80',
    'In Progress': 'text-blue-800 bg-blue-100 hover:bg-blue-200 dark:text-blue-300 dark:bg-blue-900/50 dark:hover:bg-blue-900/80',
    Processing: 'text-indigo-800 bg-indigo-100 hover:bg-indigo-200 dark:text-indigo-300 dark:bg-indigo-900/50 dark:hover:bg-indigo-900/80',
    Completed: 'text-green-800 bg-green-100 hover:bg-green-200 dark:text-green-300 dark:bg-green-900/50 dark:hover:bg-green-900/80',
    'Partially Completed': 'text-purple-800 bg-purple-100 hover:bg-purple-200 dark:text-purple-300 dark:bg-purple-900/50 dark:hover:bg-purple-900/80',
    'On Refill': 'text-cyan-800 bg-cyan-100 hover:bg-cyan-200 dark:text-cyan-300 dark:bg-cyan-900/50 dark:hover:bg-cyan-900/80',
    Refilled: 'text-teal-800 bg-teal-100 hover:bg-teal-200 dark:text-teal-300 dark:bg-teal-900/50 dark:hover:bg-teal-900/80',
    Canceled: 'text-gray-800 bg-gray-100 hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600',
    Fail: 'text-red-800 bg-red-100 hover:bg-red-200 dark:text-red-300 dark:bg-red-900/50 dark:hover:bg-red-900/80',
    Error: 'text-red-900 bg-red-200 hover:bg-red-300 dark:text-red-200 dark:bg-red-800/50 dark:hover:bg-red-800/80',
};

interface StatusFilterProps {
    activeStatus: OrderStatus | 'All';
    setActiveStatus: (status: OrderStatus | 'All') => void;
}

export default function StatusFilter({ activeStatus, setActiveStatus }: StatusFilterProps) {
    return (
        <div>
            <label className="text-sm font-semibold mb-2 block">สถานะ</label>
            <div className="flex flex-wrap gap-2">
                {statusFilters.map(({ key, label }) => (
                    <button
                        key={key}
                        onClick={() => setActiveStatus(key)}
                        className={`px-3 py-1.5 text-sm font-semibold rounded-full transition-all duration-200 flex items-center transform active:scale-95 ${
                            activeStatus === key 
                            ? 'bg-brand-primary text-white dark:bg-dark-primary dark:text-brand-text-dark shadow-md scale-105' 
                            : statusButtonStyles[key]
                        }`}
                    >
                        {iconMap[key as OrderStatus | 'All']}
                        {label}
                    </button>
                ))}
            </div>
        </div>
    );
}