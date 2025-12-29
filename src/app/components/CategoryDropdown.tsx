// src/app/components/CategoryDropdown.tsx
"use client";

import React, { useState, useEffect, useRef } from 'react';

// --- Icons ---
const FacebookIcon = () => <svg className="w-5 h-5 mr-3 text-[#1877F2] flex-shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/></svg>;
const InstagramIcon = () => <svg className="w-5 h-5 mr-3 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><defs><radialGradient id="instaGradient" r="150%" cx="30%" cy="107%"><stop stopColor="#fdf497" offset="0" /><stop stopColor="#fdf497" offset="0.05" /><stop stopColor="#fd5949" offset="0.45" /><stop stopColor="#d6249f" offset="0.6" /><stop stopColor="#285AEB" offset="0.9" /></radialGradient></defs><rect width="20" height="20" x="2" y="2" rx="5" ry="5" stroke="url(#instaGradient)"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" stroke="url(#instaGradient)"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="url(#instaGradient)"></line></svg>;
const TikTokIcon = () => <svg className="w-5 h-5 mr-3 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-2.43.05-4.84-.95-6.43-2.82-1.5-1.76-2.31-4.09-2.09-6.35.23-2.44 1.52-4.63 3.4-6.02C8.21 6.5 10.36 5.8 12.53 5.85v4.02c-1.44-.02-2.85.31-4.08.93-.65.34-1.25.77-1.78 1.28-.52.51-.87 1.15-1.04 1.84-.17.68-.13 1.42.06 2.11.19.69.54 1.32 1.02 1.83.48.51 1.05.9 1.68 1.17.63.27 1.3.41 1.98.41.68 0 1.35-.14 1.98-.41.63-.27 1.2-.66 1.68-1.17.48-.51.83-1.14 1.02-1.83.19-.69.23-1.43.06-2.11-.17-.69-.52-1.33-1.04-1.84-.53-.51-1.13-.94-1.78-1.28-1.23-.62-2.64-.95-4.08-.93v-4.02c2.17-.05 4.32.65 5.92 2.15 1.57 1.48 2.45 3.58 2.48 5.72.05 2.52-.95 4.97-2.82 6.46-1.78 1.4-4.06 2.18-6.31 2.05-2.22-.13-4.33-1.08-5.88-2.67-1.57-1.61-2.45-3.8-2.32-5.99.13-2.23 1.14-4.37 2.72-5.93 1.6-1.56 3.73-2.42 5.91-2.45.02-3.87.01-7.73.02-11.6z"/></svg>;
const YouTubeIcon = () => <svg className="w-5 h-5 mr-3 text-[#FF0000] flex-shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M21.582 7.243c-.24-.89-1.01-1.57-1.92-1.76-2.52-.48-6.66-.48-6.66-.48s-4.14 0-6.66.48c-.91.19-1.68.87-1.92 1.76C4 9.043 4 12 4 12s0 2.957.42 4.757c.24.89 1.01 1.57 1.92 1.76 2.52.48 6.66.48 6.66.48s4.14 0 6.66-.48c.91-.19 1.68-.87 1.92-1.76C22 14.957 22 12 22 12s0-2.957-.418-4.757zM9.82 14.507V9.493l4.57 2.507-4.57 2.507z"/></svg>;
const StarIcon = () => <svg className="w-5 h-5 mr-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>;
const ChevronDownIcon = ({ isOpen }: { isOpen: boolean }) => <svg className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" /></svg>;

// --- Type Definitions ---
export interface Category {
    id: string;
    name: string;
    icon?: React.ReactNode;
}

interface CategoryDropdownProps {
    categories: Category[];
    selected: Category;
    onSelect: (category: Category) => void;
    widthClass?: string;
}

export const mainCategories: Category[] = [
    { id: 'fav', name: 'บริการที่ชื่นชอบ', icon: <StarIcon /> },
    { id: 'facebook', name: 'Facebook', icon: <FacebookIcon /> },
    { id: 'instagram', name: 'Instagram', icon: <InstagramIcon /> },
    { id: 'tiktok', name: 'TikTok', icon: <TikTokIcon /> },
    { id: 'youtube', name: 'Youtube', icon: <YouTubeIcon /> },
];

export const filterCategories: Category[] = [
    { id: 'all', name: 'ทุกหมวดหมู่', icon: null },
    ...mainCategories.slice(1) // Exclude 'Favorites'
];


export default function CategoryDropdown({ categories, selected, onSelect, widthClass = 'w-full md:w-64' }: CategoryDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (category: Category) => {
        onSelect(category);
        setIsOpen(false);
    };

    return (
        <div className={`relative ${widthClass}`} ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-brand-bg dark:bg-dark-bg border border-brand-border dark:border-dark-border rounded-lg py-2.5 px-4 text-left flex items-center justify-between focus:ring-2 focus:ring-brand-primary focus:outline-none"
            >
                <span className="flex items-center truncate">
                    {selected.icon}
                    {selected.name}
                </span>
                <ChevronDownIcon isOpen={isOpen} />
            </button>
            {isOpen && (
                <div className="absolute z-10 mt-1 w-full bg-brand-surface dark:bg-dark-surface rounded-lg shadow-lg border border-brand-border dark:border-dark-border">
                    <ul className="py-1 max-h-60 overflow-auto">
                        {categories.map(cat => (
                            <li
                                key={cat.id}
                                onClick={() => handleSelect(cat)}
                                className="px-4 py-2 text-sm text-brand-text-dark dark:text-dark-text-dark hover:bg-brand-bg dark:hover:bg-dark-bg cursor-pointer flex items-center"
                            >
                                {cat.icon}
                                {cat.name}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}