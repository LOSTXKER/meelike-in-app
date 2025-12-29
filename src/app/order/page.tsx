// src/app/order/page.tsx
"use client";

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import CategoryDropdown, { mainCategories, Category } from '@/app/components/CategoryDropdown';
import OrderConfirmationModal from '@/app/components/OrderConfirmationModal';
import ServiceReviews from '@/app/components/ServiceReviews';
import { allServices, type Service } from '@/app/data/services'; // Import centralized data

// --- Icons ---
const SearchIcon = () => <svg className="w-4 h-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>;
const ChevronDownIcon = ({ isOpen }: { isOpen: boolean }) => ( <svg className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" /></svg>);
const CheckIcon = () => <svg className="w-5 h-5 text-brand-primary dark:text-dark-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.052-.143z" clipRule="evenodd" /></svg>;
const CheckCircleIcon = () => <svg className="w-5 h-5 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>;
const XCircleIcon = () => <svg className="w-5 h-5 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" /></svg>;
const ExclamationTriangleIcon = () => <svg className="w-5 h-5 text-yellow-500 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>;
const DripIcon = () => <svg className="w-5 h-5 text-brand-success mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.53 3.464A1.25 1.25 0 004.8 5.12l-1.3 3.837A.75.75 0 004.25 10h11.5a.75.75 0 00.75-.957l-1.3-3.838a1.25 1.25 0 00-.73-1.656l-5-2.5a1.25 1.25 0 00-1.44 0l-5 2.5z" clipRule="evenodd" /><path d="M4.183 11.25a.75.75 0 000 1.5h11.634a.75.75 0 000-1.5H4.183zM4 14.25a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H4.75A.75.75 0 014 14.25z" /></svg>;
const SpeedIcon = () => <svg className="w-6 h-6 text-brand-text-light dark:text-dark-text-light" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a.75.75 0 100-1.5.75.75 0 000 1.5z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5a.75.75 0 100-1.5.75.75 0 000 1.5z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12a.75.75 0 10-1.5 0 .75.75 0 001.5 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a.75.75 0 10-1.5 0 .75.75 0 001.5 0z" /></svg>;
const ClockIcon = () => <svg className="w-6 h-6 text-brand-text-light dark:text-dark-text-light" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const ArrowDownUpIcon = () => <svg className="w-6 h-6 text-brand-text-light dark:text-dark-text-light" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" /></svg>;
const ArrowPathIcon = () => <svg className="w-6 h-6 text-brand-text-light dark:text-dark-text-light" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.664 0l3.181-3.183m-4.991-2.695v-2.695A8.25 8.25 0 005.68 9.348v2.695Z" /></svg>;

// --- CustomSelectProps Interface ---
interface CustomSelectProps {
    options: Service[];
    selected: Service | null;
    onSelect: (option: Service) => void;
    placeholder: string;
}

// --- Sub-Components ---
const ServiceSelect: React.FC<CustomSelectProps> = ({ options, selected, onSelect, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [ref]);
    
    const handleSelectOption = (option: Service) => {
        onSelect(option);
        setIsOpen(false);
        setSearchTerm('');
    };

    const displayValue = selected ? selected.name : placeholder;
    const filteredOptions = options.filter(option => option.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="relative" ref={ref}>
            <button type="button" onClick={() => setIsOpen(!isOpen)} className="w-full bg-brand-bg dark:bg-dark-bg border border-brand-border dark:border-dark-border rounded-lg py-2.5 px-4 text-left flex items-center justify-between focus:ring-2 focus:ring-brand-primary focus:outline-none">
                <span className="truncate">{displayValue}</span>
                <ChevronDownIcon isOpen={isOpen} />
            </button>
            {isOpen && (
                <div className="absolute z-10 mt-1 w-full bg-brand-surface dark:bg-dark-surface rounded-lg shadow-lg border border-brand-border dark:border-dark-border">
                    <div className="p-2 border-b border-brand-border dark:border-dark-border">
                         <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3"><SearchIcon /></span>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                placeholder="ค้นหา..."
                                className="w-full bg-brand-bg dark:bg-dark-bg border border-brand-border dark:border-dark-border rounded-md py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-brand-primary focus:outline-none"
                                autoFocus
                            />
                         </div>
                    </div>
                    <ul className="py-1 max-h-60 overflow-auto">
                        {filteredOptions.map(option => (
                            <li key={option.id} onClick={() => handleSelectOption(option)} className="px-4 py-2 text-sm text-brand-text-dark dark:text-dark-text-dark hover:bg-brand-bg dark:hover:bg-dark-bg cursor-pointer flex items-center justify-between">
                                <div className="flex items-center w-full">
                                    <span className="bg-gray-200 dark:bg-gray-600 text-xs font-bold mr-3 px-2 py-1 rounded">{option.id}</span>
                                    <span className="flex-1 truncate">{option.name}</span>
                                    <span className="ml-4 font-semibold whitespace-nowrap">฿{option.price.toFixed(2)}<span className="text-xs font-normal text-brand-text-light dark:text-dark-text-light"> / 1000</span></span>
                                </div>
                                {selected?.id === option.id && <CheckIcon />}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

const StatCard = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
    <div className="bg-brand-bg dark:bg-dark-bg p-4 rounded-lg flex items-center">
        <div className="flex-shrink-0">{icon}</div>
        <div className="ml-3">
            <p className="text-xs text-brand-text-light dark:text-dark-text-light">{label}</p>
            <p className="text-md font-bold text-brand-text-dark dark:text-dark-text-dark">{value}</p>
        </div>
    </div>
);

export default function OrderPage() {
    const [selectedCategory, setSelectedCategory] = useState<Category>(mainCategories[0]);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [isDripFeed, setIsDripFeed] = useState(false);
    const [isDripFeedOpen, setIsDripFeedOpen] = useState(true);
    const [mounted, setMounted] = useState(false);

    // <-- 2. State for Modal -->
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const filteredServices = selectedCategory.id === 'fav'
        ? allServices 
        : allServices.filter(s => s.category === selectedCategory.id);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        setSelectedService(null);
    }, [selectedCategory]);

    // <-- 3. Function to handle the final order confirmation -->
    const handleConfirmOrder = () => {
        console.log("Order Confirmed!");
        // Here you would typically submit the form or call an API
        setIsModalOpen(false); // Close modal after confirmation
    };

    // Prevent hydration mismatch by not rendering until mounted
    if (!mounted) {
        return (
            <>
                <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
                    <div className="animate-pulse space-y-8">
                        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                        <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                </main>
            </>
        );
    }

    return (
        <>
            <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
                 <h1 className="text-3xl font-bold text-brand-text-dark dark:text-dark-text-dark mb-8">
                    สร้างรายการสั่งซื้อใหม่
                </h1>
                
                <div className="bg-yellow-50 dark:bg-dark-surface border-l-4 border-yellow-400 dark:border-dark-primary p-4 rounded-md mb-8 shadow-sm">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-yellow-400 dark:text-dark-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-md font-bold text-yellow-800 dark:text-dark-primary">ข้อควรทราบก่อนสั่งซื้อ</h3>
                            <div className="mt-2 text-sm text-yellow-700 dark:text-dark-text-light">
                                <ul className="list-disc list-inside space-y-1">
                                    <li><strong>ตรวจสอบลิงก์ให้ถูกต้อง:</strong> หากลิงก์ผิดรูปแบบ คำสั่งซื้ออาจไม่สำเร็จ และทางเราขอสงวนสิทธิ์ไม่คืนเงินทุกกรณี</li>
                                    <li className="text-red-600 dark:text-red-400"><strong>ไม่สามารถยกเลิกได้:</strong> เมื่อยืนยันคำสั่งซื้อแล้ว จะไม่สามารถยกเลิกหรือขอเงินคืนได้</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* --- Left Column --- */}
                    <div className="lg:col-span-2">
                        <div className="bg-brand-surface dark:bg-dark-surface p-6 rounded-xl shadow-md border border-brand-border dark:border-dark-border">
                            <div className="space-y-6">
                                
                                {/* Section 1: Service Selection */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-semibold text-brand-text-dark dark:text-dark-text-dark mb-2 block">หมวดหมู่</label>
                                        <CategoryDropdown categories={mainCategories} selected={selectedCategory} onSelect={setSelectedCategory} widthClass="w-full"/>
                                    </div>
                                    <div>
                                        <label className="text-sm font-semibold text-brand-text-dark dark:text-dark-text-dark mb-2 block">บริการ</label>
                                        <ServiceSelect options={filteredServices} selected={selectedService} onSelect={setSelectedService} placeholder="เลือกบริการ" />
                                    </div>
                                </div>

                                {/* Section 2: Description */}
                                <div>
                                    <h3 className="text-sm font-semibold text-brand-text-dark dark:text-dark-text-dark mb-2">คำอธิบายลักษณะ</h3>
                                    <div className="text-sm p-4 bg-brand-bg dark:bg-dark-bg rounded-lg border border-brand-border dark:border-dark-border space-y-3">
                                        <p>ลิงก์ตัวอย่าง: https://www.facebook.com/photo/?fbid=xxxxxxxxxxxxx</p>
                                        <p><strong className="text-brand-error">❌ (ไม่รองรับชื่อลิ้งค์ภาษาไทย, ลิ้งค์มือถือขึ้นด้วย m. และ web.)</strong></p>
                                        <hr className="border-brand-border dark:border-dark-border my-2"/>
                                        <ul className="space-y-2 text-xs">
                                            <li className="flex items-start"><CheckCircleIcon /> บริการนี้ใช้ได้เฉพาะโพสต์เปิดสาธารณะเท่านั้น!!</li>
                                            <li className="flex items-start"><CheckCircleIcon /> การสั่งซื้อจะถือว่าสมบูรณ์หากคุณใส่ลิงค์ผิดรูปแบบ</li>
                                            <li className="flex items-start"><ExclamationTriangleIcon/> กรุณาเปิดจำนวนคนกดถูกใจ หากระบบมีปัญหาทางเราจะไม่รับผิดชอบคืนเงินใดๆ</li>
                                            <li className="flex items-start"><XCircleIcon /> ไม่มีการคืนเงินหากโพสต์ถูกตั้งค่าปิดให้เป็นส่วนตัว</li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Section 3: Form Inputs */}
                                <div className="space-y-4">
                                   <div>
                                        <label htmlFor="link" className="text-sm font-semibold text-brand-text-dark dark:text-dark-text-dark mb-2 block">ลิงก์</label>
                                        <input type="text" id="link" placeholder="https://example.com" className="w-full bg-brand-bg dark:bg-dark-bg border border-brand-border dark:border-dark-border rounded-lg py-2.5 px-4 focus:ring-2 focus:ring-brand-primary focus:outline-none"/>
                                   </div>
                                   <div>
                                        <label htmlFor="quantity" className="text-sm font-semibold text-brand-text-dark dark:text-dark-text-dark mb-2 block">จำนวน</label>
                                        <input type="number" id="quantity" placeholder="ใส่จำนวนที่ต้องการ" min={selectedService?.min} max={selectedService?.max} className="w-full bg-brand-bg dark:bg-dark-bg border border-brand-border dark:border-dark-border rounded-lg py-2.5 px-4 focus:ring-2 focus:ring-brand-primary focus:outline-none"/>
                                        {selectedService && <p className="text-xs text-brand-text-light dark:text-dark-text-light mt-1">ขั้นต่ำ: {selectedService.min.toLocaleString()} / สูงสุด: {selectedService.max.toLocaleString()}</p>}
                                   </div>
                                   <div className="pt-2">
                                      <label className="flex items-center space-x-2 cursor-pointer">
                                          <input type="checkbox" checked={isDripFeed} onChange={(e) => setIsDripFeed(e.target.checked)} className="form-checkbox h-4 w-4 rounded text-brand-primary dark:text-dark-primary focus:ring-brand-primary dark:focus:ring-dark-primary border-brand-border dark:border-dark-border bg-brand-bg dark:bg-dark-surface"/>
                                          <span className="text-sm font-semibold text-brand-text-dark dark:text-dark-text-dark">เปิดใช้งาน Drip Feed</span>
                                      </label>
                                   </div>
                                </div>

                                {/* Drip Feed Section */}
                                {isDripFeed && (
                                   <div className="space-y-4 transition-all duration-300">
                                       <button onClick={() => setIsDripFeedOpen(!isDripFeedOpen)} className="w-full flex justify-between items-center p-3 bg-brand-bg dark:bg-dark-bg border border-brand-border dark:border-dark-border rounded-lg">
                                           <span className="flex items-center font-semibold text-md"><DripIcon /> Drip Feed</span>
                                           <ChevronDownIcon isOpen={isDripFeedOpen} />
                                       </button>
                                       {isDripFeedOpen && (
                                           <div className="p-4 bg-brand-bg dark:bg-dark-bg border border-t-0 border-brand-border dark:border-dark-border rounded-b-lg space-y-4">
                                               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                   <div>
                                                      <label className="text-xs font-semibold mb-1 block">วัน</label>
                                                      <select className="w-full bg-brand-surface dark:bg-dark-surface border border-brand-border dark:border-dark-border rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary">
                                                          <option>Choose...</option>
                                                      </select>
                                                   </div>
                                                   <div>
                                                      <label className="text-xs font-semibold mb-1 block">ชั่วโมง</label>
                                                      <select className="w-full bg-brand-surface dark:bg-dark-surface border border-brand-border dark:border-dark-border rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary">
                                                          <option>Choose...</option>
                                                      </select>
                                                   </div>
                                                    <div>
                                                      <label className="text-xs font-semibold mb-1 block">นาที</label>
                                                      <select className="w-full bg-brand-surface dark:bg-dark-surface border border-brand-border dark:border-dark-border rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary">
                                                          <option>Choose...</option>
                                                      </select>
                                                   </div>
                                               </div>
                                               <div>
                                                    <div className="flex justify-between items-center">
                                                        <label className="text-xs font-semibold mb-1 block">จำนวนต่อรอบ</label>
                                                        <p className="text-xs text-brand-error">ระยะห่างของเวลาแต่ละรอบ: 47 minutes</p>
                                                    </div>
                                                    <input type="number" placeholder="กรอกจำนวนที่ต้องการสั่งซื้อต่อรอบ" className="w-full bg-brand-surface dark:bg-dark-surface border border-brand-border dark:border-dark-border rounded-lg py-2 px-4 text-sm focus:ring-2 focus:ring-brand-primary focus:outline-none"/>
                                               </div>
                                           </div>
                                       )}
                                   </div>
                                )}
                                
                                {/* Section 4: Summary & Actions (NEW Button Design) */}
                                <div className="mt-6 border-t border-brand-border dark:border-dark-border pt-6 space-y-4">
                                   <div className="bg-green-100/50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 flex justify-between items-center">
                                       <span className="font-semibold text-lg text-green-800 dark:text-green-200">ยอดสุทธิทั้งหมด</span>
                                       <span className="text-2xl font-bold text-green-800 dark:text-green-200">฿0.17</span>
                                   </div>
                                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                       {/* <-- 4. Modify Order Button to open modal --> */}
                                       <button 
                                           type="button" 
                                           onClick={() => setIsModalOpen(true)}
                                           className="text-md font-semibold text-white bg-brand-primary hover:opacity-90 dark:bg-dark-primary dark:text-brand-text-dark rounded-lg px-6 py-3 transition-opacity flex items-center justify-center"
                                        >
                                           <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M3.125 1.75A1.375 1.375 0 001.75 3.125v13.75A1.375 1.375 0 003.125 18.25h13.75A1.375 1.375 0 0018.25 16.875V3.125A1.375 1.375 0 0016.875 1.75H3.125zM2.5 3.125c0-.345.28-.625.625-.625h13.75c.345 0 .625.28.625.625v3.172A4.522 4.522 0 0015.5 6.25h-11a4.522 4.522 0 00-1.298.047V3.125zM15.5 7.75a3.022 3.022 0 012.75 3.047v2.956A1.375 1.375 0 0016.875 15h-1.355a3.021 3.021 0 01-5.04 0H4.48A3.022 3.022 0 011.75 10.797v-2.956A3.022 3.022 0 014.5 7.75h11z" /></svg>
                                           สั่งซื้อ
                                       </button>
                                       <button className="text-md font-semibold text-brand-text-dark bg-brand-secondary hover:opacity-90 dark:bg-dark-secondary dark:text-dark-text-dark rounded-lg px-6 py-3 transition-colors flex items-center justify-center">
                                          <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M1 1.75A.75.75 0 011.75 1h1.628a1.75 1.75 0 011.734 1.51L5.18 3a6.5 6.5 0 0112.429 2.251.75.75 0 01-1.494.15A5 5 0 005.478 5.07L4.63 2.5H1.75a.75.75 0 01-.75-.75zM2.5 7.5A.75.75 0 013.25 7h12.5a.75.75 0 010 1.5H3.25A.75.75 0 012.5 7.5zM3 11.75A.75.75 0 003.75 11h12.5a.75.75 0 000-1.5H3.75A.75.75 0 003 11.75zM4.75 14h10.5a.75.75 0 010 1.5H4.75a.75.75 0 010-1.5z" /></svg>
                                           เพิ่มลงตะกร้า
                                       </button>
                                   </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- Right Column (Unified Card) --- */}
                    <div className="lg:sticky top-8">
                        <div className="bg-brand-surface dark:bg-dark-surface p-6 rounded-xl shadow-md border border-brand-border dark:border-dark-border">
                            {/* Service Details Section */}
                            {selectedService ? (
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="font-bold text-lg text-brand-text-dark dark:text-dark-text-dark">{selectedService.name}</h3>
                                        <p className="text-sm text-brand-text-light dark:text-dark-text-light">ราคาต่อ 1,000: <span className="text-2xl font-bold text-brand-primary dark:text-dark-primary">฿{selectedService.price.toFixed(2)}</span></p>
                                    </div>
                                    {/* --- ส่วนที่แก้ไข --- */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <StatCard icon={<SpeedIcon />} label="ความเร็วเฉลี่ย/วัน" value={selectedService.speed} />
                                        <StatCard icon={<ClockIcon />} label="เวลาทำงานเฉลี่ย" value="5 นาที" />
                                        {/* Combined Min/Max Card */}
                                        <div className="bg-brand-bg dark:bg-dark-bg p-4 rounded-lg flex items-center">
                                            <div className="flex-shrink-0"><ArrowDownUpIcon /></div>
                                            <div className="ml-3">
                                                <p className="text-xs text-brand-text-light dark:text-dark-text-light">สั่งขั้นต่ำ / สูงสุด</p>
                                                <p className="text-md font-bold text-brand-text-dark dark:text-dark-text-dark">
                                                    {selectedService.min.toLocaleString()} / {selectedService.max.toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                        {/* New Refill Card */}
                                        <div className="bg-brand-bg dark:bg-dark-bg p-4 rounded-lg flex items-center">
                                            <div className="flex-shrink-0"><ArrowPathIcon /></div>
                                            <div className="ml-3">
                                                <p className="text-xs text-brand-text-light dark:text-dark-text-light">Refill</p>
                                                <div className={`text-md font-bold flex items-center gap-1.5 ${selectedService.refill ? 'text-brand-success' : 'text-brand-error'}`}>
                                                    {selectedService.refill ? 
                                                        <CheckCircleIcon /> : 
                                                        <XCircleIcon />
                                                    }
                                                    <span>{selectedService.refill ? 'Yes' : 'No'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                 <div className="text-center py-10 text-brand-text-light dark:text-dark-text-light">
                                    <p>กรุณาเลือกบริการเพื่อดูรายละเอียด</p>
                                </div>
                            )}

                            {/* Divider */}
                            {selectedService && <hr className="my-6 border-brand-border dark:border-dark-border" />}
                            
                            {/* Reviews Section */}
                            {selectedService && (
                                <div className="mt-6">
                                    <ServiceReviews 
                                        serviceId={selectedService.id.toString()}
                                        serviceName={selectedService.name}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                 </div>
            </main>

            {/* <-- 5. Render the Modal --> */}
            <OrderConfirmationModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmOrder}
            />
        </>
    );
}