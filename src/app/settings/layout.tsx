// src/app/settings/layout.tsx
"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

// --- Icons for Tabs ---
const UserIcon = () => <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-5.5-2.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM10 12a5.99 5.99 0 00-4.793 2.39A6.483 6.483 0 0010 16.5a6.483 6.483 0 004.793-2.11A5.99 5.99 0 0010 12z" clipRule="evenodd" /></svg>;
const KeyIcon = () => <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.25 8.25a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5a.75.75 0 01.75-.75z" clipRule="evenodd" /><path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM3.473 3.473a6.5 6.5 0 119.194 9.194A6.5 6.5 0 013.473 3.473zM11.25 5.5a.75.75 0 01.75.75v.01a.75.75 0 01-1.5 0V6.25a.75.75 0 01.75-.75z" clipRule="evenodd" /></svg>;
const ShieldIcon = () => <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 1a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0V1.75A.75.75 0 0110 1zM5.005 4.03a.75.75 0 01.995-.496l1.06 1.06a.75.75 0 01-1.06 1.06l-1.06-1.06a.75.75 0 01.065-1.564zm9.99 0a.75.75 0 01.065 1.564l-1.06 1.06a.75.75 0 11-1.06-1.06l1.06-1.06a.75.75 0 01.995.496zM10 4a6 6 0 100 12 6 6 0 000-12zM3.75 10a6.25 6.25 0 1112.5 0 6.25 6.25 0 01-12.5 0z" clipRule="evenodd" /></svg>;
const ClockIcon = () => <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" /></svg>;
const StarIcon = () => <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.868 2.884c.321-.772 1.308-.772 1.629 0l1.378 3.318a1 1 0 00.95.69l3.457.502c.81.118 1.135 1.106.544 1.68l-2.502 2.438a1 1 0 00-.287.95l.59 3.444c.14 1.087-.923 1.91-1.68 1.403l-3.091-1.625a1 1 0 00-1.053 0l-3.091 1.625c-.757.497-1.82-.316-1.68-1.403l.59-3.444a1 1 0 00-.287-.95l-2.502-2.438c-.59-.574-.266-1.562.544-1.68l3.457-.502a1 1 0 00.95-.69l1.378-3.318z" clipRule="evenodd" /></svg>;
const CodeBracketIcon = () => <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6.28 5.22a.75.75 0 010 1.06L2.56 10l3.72 3.72a.75.75 0 01-1.06 1.06L.97 10.53a.75.75 0 010-1.06l4.25-4.25a.75.75 0 011.06 0zm7.44 0a.75.75 0 011.06 0l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06-1.06L17.44 10l-3.72-3.72a.75.75 0 010-1.06zM11.378 2.01a.75.75 0 01.612.868l-2.5 14.5a.75.75 0 01-1.478-.256l2.5-14.5a.75.75 0 01.866-.612z" clipRule="evenodd" /></svg>;


const tabs = [
    { name: 'โปรไฟล์', href: '/settings', icon: UserIcon },
    { name: 'รหัสผ่าน', href: '/settings/password', icon: KeyIcon },
    { name: '2FA', href: '/settings/2fa', icon: ShieldIcon },
    { name: 'เวลา', href: '/settings/timezone', icon: ClockIcon },
    { name: 'ระดับสมาชิก', href: '/settings/membership', icon: StarIcon },
    { name: 'API Key', href: '/settings/api', icon: CodeBracketIcon },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
    const pathname = usePathname();

    const baseClasses = "flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors group";
    const inactiveClasses = "text-brand-text-light dark:text-dark-text-light hover:bg-brand-secondary-light/50 dark:hover:bg-dark-surface";
    const activeClasses = "font-semibold text-brand-text-dark dark:text-dark-text-dark bg-brand-secondary-light dark:bg-dark-surface";

    return (
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            {/* --- Banner --- */}
            <div className="relative p-8 rounded-2xl overflow-hidden mb-8" style={{ background: 'linear-gradient(90deg, #E0F2F1, #FFF3E0)'}}>
                <div className="dark:hidden absolute inset-0 bg-gradient-to-r from-green-50 to-orange-50 opacity-75"></div>
                <div className="hidden dark:block absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-900 opacity-50"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-bold text-brand-text-dark dark:text-dark-text-dark">ตั้งค่าโปรไฟล์ของคุณ</h1>
                        <p className="max-w-3xl text-brand-text-light dark:text-dark-text-light mt-2">
                            จัดการข้อมูลส่วนตัว, ความปลอดภัย, และการตั้งค่า API ของคุณได้ที่นี่
                        </p>
                    </div>
                    <img src="https://placehold.co/150x100/FFC107/FFFFFF?text=🚀" alt="Rocket" className="w-32 h-auto flex-shrink-0" />
                </div>
            </div>

            {/* --- Tabs --- */}
            <div className="mb-8 overflow-x-auto">
                <nav className="flex space-x-2 border-b border-brand-border dark:border-dark-border pb-2">
                    {tabs.map((tab) => {
                        const isActive = pathname === tab.href;
                        return (
                            <Link key={tab.name} href={tab.href}>
                                <span className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses} whitespace-nowrap`}>
                                    <tab.icon />
                                    {tab.name}
                                </span>
                            </Link>
                        )
                    })}
                </nav>
            </div>
            
            {/* --- Page Content --- */}
            <div>
                {children}
            </div>
        </main>
    );
}