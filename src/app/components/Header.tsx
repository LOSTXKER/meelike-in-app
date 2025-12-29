// src/app/components/Header.tsx
"use client";

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

// Dynamic imports to prevent hydration mismatch
const SurveyPromoCard = dynamic(() => import('./SurveyPromoCard'), { ssr: false });
const DailyLoginIndicator = dynamic(() => import('./DailyLoginIndicator'), { 
  ssr: false,
  loading: () => <div className="w-11 h-10 rounded-xl bg-gray-100 dark:bg-dark-bg animate-pulse" />
});

import { hasSurvey } from '../utils/localStorage';

// Icons
const MoonIcon = () => <svg className="w-6 h-6 text-brand-text-light dark:text-dark-text-light" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path></svg>;
const SunIcon = () => <svg className="w-6 h-6 text-brand-text-light dark:text-dark-text-light" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm-.707 10.607a1 1 0 011.414 0l.707-.707a1 1 0 111.414 1.414l-.707-.707a1 1 0 01-1.414 0zM1 11a1 1 0 100-2H0a1 1 0 100 2h1z" fillRule="evenodd" clipRule="evenodd"></path></svg>;
const MenuIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>;
const LanguageIcon = () => <svg className="w-6 h-6 text-brand-text-light dark:text-dark-text-light" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802" /></svg>;
const CartIcon = () => <svg className="w-6 h-6 text-brand-text-light dark:text-dark-text-light" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.658-.463 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>;

// Mobile Survey Promo Button (compact version)
function MobileSurveyPromo({ onOpenSurvey }: { onOpenSurvey: () => void }) {
    const [isVisible, setIsVisible] = React.useState(false);

    React.useEffect(() => {
        // Check if survey is completed
        if (!hasSurvey()) {
            setIsVisible(true);
        }
    }, []);

    React.useEffect(() => {
        const handleSurveyCompleted = () => setIsVisible(false);
        window.addEventListener('surveyCompleted', handleSurveyCompleted);
        return () => window.removeEventListener('surveyCompleted', handleSurveyCompleted);
    }, []);

    if (!isVisible) return null;

    return (
        <button
            onClick={onOpenSurvey}
            className="lg:hidden relative flex items-center gap-1 bg-brand-secondary hover:bg-brand-secondary-light dark:bg-dark-primary dark:hover:bg-dark-primary/80 text-brand-text-dark rounded-full px-3 py-2 shadow-md hover:shadow-lg transition-all"
        >
            <span className="text-lg">🎁</span>
            <span className="text-xs font-bold hidden sm:inline">+10 เครดิต</span>
            {/* Ping indicator */}
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-error opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-error"></span>
            </span>
        </button>
    );
}


export default function Header() {
    const [theme, setTheme] = useState<string>('light');
    const [isProfileOpen, setProfileOpen] = useState<boolean>(false);
    const profileRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const savedTheme = localStorage.getItem('color-theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        if (savedTheme === 'dark') {
            document.documentElement.classList.add('dark');
            setTheme('dark');
        } else {
            document.documentElement.classList.remove('dark');
            setTheme('light');
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [profileRef]);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('color-theme', newTheme);
        document.documentElement.classList.toggle('dark');
    };
    
    const toggleSidebar = () => {
       document.getElementById('sidebar')?.classList.toggle('-translate-x-full');
    };

    return (
        <header className="relative z-10 h-20 bg-brand-surface/80 dark:bg-dark-surface/80 backdrop-blur-sm border-b border-brand-border dark:border-dark-border flex-shrink-0 flex items-center justify-between px-4 sm:px-6 lg:px-8">
            {/* Left Side */}
            <div className="flex items-center">
                <button onClick={toggleSidebar} className="sm:hidden p-2 rounded-lg -ml-2 text-brand-text-light dark:text-dark-text-light">
                    <MenuIcon />
                </button>
            </div>
            
            {/* Right Side */}
            <div className="flex items-center space-x-2 sm:space-x-4">
                {/* Daily Login Indicator */}
                <DailyLoginIndicator onClick={() => {
                    window.dispatchEvent(new CustomEvent('openDailyLoginModal'));
                }} />

                {/* Survey Promo Card with Countdown - Desktop */}
                <div className="hidden lg:block">
                    <SurveyPromoCard onOpenSurvey={() => {
                        window.dispatchEvent(new CustomEvent('openSurveyModal'));
                    }} />
                </div>
                
                {/* Survey Promo Card - Mobile/Tablet (compact) */}
                <MobileSurveyPromo onOpenSurvey={() => {
                    window.dispatchEvent(new CustomEvent('openSurveyModal'));
                }} />
                
                <a href="/order" className="hidden sm:flex items-center text-sm font-semibold text-brand-text-dark bg-brand-secondary dark:bg-dark-primary dark:text-brand-text-dark rounded-full px-4 py-2 hover:opacity-90 transition-opacity">
                    <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" /></svg>
                    สั่งซื้อใหม่
                </a>
                <div className="flex items-center space-x-2 bg-brand-bg dark:bg-dark-bg p-1 rounded-full">
                    <div className="flex items-center bg-brand-surface dark:bg-dark-surface px-3 py-1.5 rounded-full">
                        <svg className="w-5 h-5 text-brand-text-light dark:text-dark-text-light mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M2.5 4A1.5 1.5 0 001 5.5V6h18v-.5A1.5 1.5 0 0017.5 4h-15zM19 7.5H1V14a1 1 0 001 1h16a1 1 0 001-1V7.5z" /></svg>
                        <span className="text-sm font-semibold">1,250 THB</span>
                    </div>
                    
                    <button className="p-2 rounded-full hover:bg-brand-surface dark:hover:bg-dark-surface transition-colors">
                        <LanguageIcon />
                    </button>
                    <a href="/cart" className="p-2 rounded-full hover:bg-brand-surface dark:hover:bg-dark-surface transition-colors">
                        <CartIcon />
                    </a>

                    <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-brand-surface dark:hover:bg-dark-surface transition-colors">
                        {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                    </button>
                    <div className="relative" ref={profileRef}>
                        <button onClick={() => setProfileOpen(!isProfileOpen)} className="p-1 rounded-full hover:bg-brand-surface dark:hover:bg-dark-surface transition-colors">
                            <img className="w-8 h-8 rounded-full" src="https://placehold.co/100x100/FCD77F/473B30?text=S" alt="User Avatar" />
                        </button>
                        {isProfileOpen && (
                             <div className="absolute right-0 mt-2 w-64 bg-brand-surface dark:bg-dark-surface rounded-xl shadow-lg border border-brand-border dark:border-dark-border z-20">
                                <div className="p-4 border-b border-brand-border dark:border-dark-border">
                                    <div className="flex items-center space-x-3">
                                        <img className="w-12 h-12 rounded-full" src="https://placehold.co/100x100/FCD77F/473B30?text=S" alt="User Avatar" />
                                        <div>
                                            <p className="font-semibold text-md">Saruth</p>
                                            <p className="text-sm text-brand-text-light dark:text-dark-text-light">saruth05@hotmail.co</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="py-2">
                                    <a href="/settings" className="flex items-center px-4 py-2 text-sm text-brand-text-dark dark:text-dark-text-dark hover:bg-brand-bg dark:hover:bg-dark-bg">
                                        <svg className="w-5 h-5 mr-3 text-brand-text-light dark:text-dark-text-light" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-5.5-2.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM10 12a5.99 5.99 0 00-4.793 2.39A6.483 6.483 0 0010 16.5a6.483 6.483 0 004.793-2.11A5.99 5.99 0 0010 12z" clipRule="evenodd" /></svg>
                                        โปรไฟล์
                                    </a>
                                    <a href="/settings/api" className="flex items-center px-4 py-2 text-sm text-brand-text-dark dark:text-dark-text-dark hover:bg-brand-bg dark:hover:bg-dark-bg">
                                        <svg className="w-5 h-5 mr-3 text-brand-text-light dark:text-dark-text-light" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M7 3.5A1.5 1.5 0 018.5 2h3.879a1.5 1.5 0 011.06.44l3.122 3.121A1.5 1.5 0 0117 6.621V16.5a1.5 1.5 0 01-1.5 1.5h-11A1.5 1.5 0 013 16.5v-13A1.5 1.5 0 014.5 2H6a1.5 1.5 0 011 1.5v1zM8.5 2a.5.5 0 00-.5.5v1a.5.5 0 00.5.5H11a.5.5 0 00.5-.5v-1a.5.5 0 00-.5-.5h-2.5z" /><path d="M9.25 10.5a.75.75 0 00-1.5 0v2.5a.75.75 0 001.5 0v-2.5zM12.25 10.5a.75.75 0 00-1.5 0v2.5a.75.75 0 001.5 0v-2.5z" /></svg>
                                        เอกสาร API
                                    </a>
                                    {/* --- เพิ่มเมนูใหม่ที่นี่ --- */}
                                    <a href="/terms" className="flex items-center px-4 py-2 text-sm text-brand-text-dark dark:text-dark-text-dark hover:bg-brand-bg dark:hover:bg-dark-bg">
                                        <svg className="w-5 h-5 mr-3 text-brand-text-light dark:text-dark-text-light" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M2 3.5A1.5 1.5 0 013.5 2h1.148a1.5 1.5 0 011.465 1.175l.716 3.223a1.5 1.5 0 01-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 006.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 011.767-1.052l3.223.716A1.5 1.5 0 0118 15.352V16.5a1.5 1.5 0 01-1.5 1.5H3.5A1.5 1.5 0 012 16.5v-13z" clipRule="evenodd" /></svg>
                                        เงื่อนไขและบริการ
                                    </a>
                                </div>
                                <div className="py-2 border-t border-brand-border dark:border-dark-border">
                                    <a href="#" className="flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-brand-bg dark:hover:bg-dark-bg">
                                        <svg className="w-5 h-5 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25z" clipRule="evenodd" /><path fillRule="evenodd" d="M6 10a.75.75 0 01.75-.75h9.546l-1.048-1.047a.75.75 0 111.06-1.06l2.5 2.5a.75.75 0 010 1.06l-2.5 2.5a.75.75 0 11-1.06-1.06L16.296 10.75H6.75A.75.75 0 016 10z" clipRule="evenodd" /></svg>
                                        ลงชื่อออกจากระบบ
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}