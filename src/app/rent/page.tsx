// src/app/rent/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import PageBanner from '@/app/components/PageBanner'; 

// --- Icons ---
const ApiIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
const SubPanelIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const AffiliateIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c1.104 0 2.08.896 2.08 2s-.976 2-2.08 2-2.08-.896-2.08-2 .976-2 2.08-2zm0 0v.01M12 2a10 10 0 100 20 10 10 0 000-20z" /></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>;
const DownloadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-primary dark:text-dark-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>;
const ThemeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-brand-primary dark:text-dark-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>;
const DragDropIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-brand-primary dark:text-dark-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 003 0m-3 0V7m0 9.5V14m0-2.5h1.5a1.5 1.5 0 010 3H7m1.5-3a1.5 1.5 0 010-3H7m0 0V7m0 2.5h1.5M17 11.5V14m0-2.5v-6a1.5 1.5 0 00-3 0m3 6a1.5 1.5 0 01-3 0m3 0V7m0 9.5V14m0-2.5h-1.5a1.5 1.5 0 000 3H17m-1.5-3a1.5 1.5 0 000-3H17m0 0V7m0 2.5h-1.5" /></svg>;

// --- Components ---
const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <div className="bg-brand-surface dark:bg-dark-surface p-6 rounded-2xl shadow-sm border border-brand-border dark:border-dark-border">
        <div className="bg-brand-secondary-light dark:bg-dark-border text-brand-primary dark:text-dark-primary w-12 h-12 rounded-xl flex items-center justify-center mb-4">
            {icon}
        </div>
        <h3 className="font-bold mb-1 text-brand-text-dark dark:text-dark-text-dark">{title}</h3>
        <p className="text-sm text-brand-text-light dark:text-dark-text-light">{description}</p>
    </div>
);

const FaqItem = ({ question, children }: { question: string, children: React.ReactNode }) => (
    <details className="border-b border-brand-border dark:border-dark-border pb-4 group last:border-b-0 last:pb-0">
        <summary className="flex justify-between items-center cursor-pointer py-2 font-semibold text-brand-text-dark dark:text-dark-text-dark">
            <span className="flex items-center text-left">{question}</span>
            <span className="plus-icon transition-transform duration-300 text-brand-primary dark:text-dark-primary group-open:rotate-45 flex-shrink-0 ml-4">
                <PlusIcon />
            </span>
        </summary>
        <p className="pt-2 text-sm text-brand-text-light dark:text-dark-text-light pr-6">
            {children}
        </p>
    </details>
);

// --- Main Page Component ---
export default function RentPage() {
    const [orders, setOrders] = useState(0);
    const [monthlyCost, setMonthlyCost] = useState("3,000.00");

    const plans = [
        { limit: 1000, cost: 3000 }, { limit: 5000, cost: 4500 }, { limit: 15000, cost: 5500 },
        { limit: 50000, cost: 7500 }, { limit: 100001, cost: 9500 }
    ];

    useEffect(() => {
        let currentCost = plans[0].cost;
        for (const plan of plans) {
            if (orders <= plan.limit) {
                currentCost = plan.cost;
                break;
            }
            currentCost = plans[plans.length-1].cost
        }
        setMonthlyCost(currentCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
    }, [orders]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);
        setOrders(isNaN(value) ? 0 : value);
    };

    return (
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            <div className="space-y-16">
                 {/* 1. Hero Section with CTA Button - Brown background for light theme */}
                <div className="relative bg-brand-primary dark:bg-dark-surface p-8 sm:p-12 rounded-3xl overflow-hidden">
                     <div className="absolute -right-16 -bottom-16 w-48 h-48 bg-white/10 rounded-full"></div>
                    <div className="absolute -left-10 -top-20 w-40 h-40 bg-white/10 rounded-full"></div>
                    <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-white dark:text-dark-text-dark">เป็นเจ้าของเว็บปั้มไลค์<br/>เต็มระบบในไม่กี่คลิก 🚀</h1>
                            <p className="max-w-2xl text-white/90 dark:text-dark-text-light">
                                คุณจะได้รับเว็บไซต์เต็มรูปแบบ, เชื่อมต่อ API ไม่จำกัด, พร้อมระบบแผงเช่ารายย่อย และฟังก์ชั่นอื่นๆ อีกมากมาย
                            </p>
                        </div>
                        <div className="flex-shrink-0 mt-4 lg:mt-0">
                             <button className="w-full lg:w-auto bg-brand-secondary text-brand-text-dark font-bold py-4 px-8 rounded-lg hover:opacity-90 transition-opacity shadow-lg">
                                ติดต่อเราผ่าน LINE เดี๋ยวนี้
                            </button>
                        </div>
                    </div>
                </div>

                {/* 2. Features Section */}
                <div>
                    <h2 className="text-3xl font-bold text-center mb-8 text-brand-text-dark dark:text-dark-text-dark">สิ่งที่คุณจะได้รับ</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <FeatureCard icon={<ApiIcon />} title="เชื่อมต่อ API ไม่จำกัด" description="เชื่อมต่อกับผู้ให้บริการกี่รายก็ได้ตามที่คุณต้องการ" />
                        <FeatureCard icon={<SubPanelIcon />} title="ระบบแผงเช่ารายย่อย" description="ให้ลูกค้าของคุณเช่าเว็บต่อจากคุณ สร้างรายได้อีกทอด" />
                        <FeatureCard icon={<AffiliateIcon />} title="ระบบแนะนำสมาชิก" description="มาพร้อมระบบ Affiliate ในตัว สร้างเครือข่ายได้ทันที" />
                    </div>
                </div>
                
                {/* 3. Website Examples Section */}
                <div>
                    <h2 className="text-3xl font-bold text-center mb-8 text-brand-text-dark dark:text-dark-text-dark">ดีไซน์สวยงาม ปรับแต่งง่าย ไม่ต้องเขียนโค้ด</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-start">
                        {/* You can add more image cards here as needed */}
                        <div className="bg-brand-surface dark:bg-dark-surface p-6 rounded-2xl shadow-sm border border-brand-border dark:border-dark-border">
                            <div className="aspect-video bg-brand-bg dark:bg-dark-bg rounded-lg mb-4 flex items-center justify-center"><p className="text-brand-text-light dark:text-dark-text-light text-sm">(ภาพตัวอย่างเว็บ #1)</p></div>
                            <h3 className="font-bold text-brand-text-dark dark:text-dark-text-dark">ธีมหลากหลาย</h3>
                            <p className="text-sm text-brand-text-light dark:text-dark-text-light mt-1">เลือกธีมที่เข้ากับแบรนด์ของคุณ</p>
                        </div>
                        <div className="bg-brand-surface dark:bg-dark-surface p-6 rounded-2xl shadow-sm border border-brand-border dark:border-dark-border">
                           <div className="aspect-video bg-brand-bg dark:bg-dark-bg rounded-lg mb-4 flex items-center justify-center"><p className="text-brand-text-light dark:text-dark-text-light text-sm">(ภาพตัวอย่างเว็บ #2)</p></div>
                           <h3 className="font-bold text-brand-text-dark dark:text-dark-text-dark">ปรับแต่งอิสระ</h3>
                           <p className="text-sm text-brand-text-light dark:text-dark-text-light mt-1">ไม่จำเป็นต้องเขียนโค้ด</p>
                        </div>
                        <div className="bg-brand-surface dark:bg-dark-surface p-6 rounded-2xl shadow-sm border border-brand-border dark:border-dark-border">
                            <div className="aspect-video bg-brand-bg dark:bg-dark-bg rounded-lg mb-4 flex items-center justify-center"><p className="text-brand-text-light dark:text-dark-text-light text-sm">(ภาพตัวอย่างเว็บ #3)</p></div>
                             <h3 className="font-bold text-brand-text-dark dark:text-dark-text-dark">ลากและวาง</h3>
                             <p className="text-sm text-brand-text-light dark:text-dark-text-light mt-1">จัดการเนื้อหาได้ง่ายๆ</p>
                        </div>
                        <div className="bg-brand-surface dark:bg-dark-surface p-6 rounded-2xl shadow-sm border border-brand-border dark:border-dark-border">
                           <div className="aspect-video bg-brand-bg dark:bg-dark-bg rounded-lg mb-4 flex items-center justify-center"><p className="text-brand-text-light dark:text-dark-text-light text-sm">(ภาพตัวอย่างเว็บ #4)</p></div>
                           <h3 className="font-bold text-brand-text-dark dark:text-dark-text-dark">เทมเพลตสำเร็จรูป</h3>
                           <p className="text-sm text-brand-text-light dark:text-dark-text-light mt-1">เริ่มต้นใช้งานได้รวดเร็ว</p>
                        </div>
                    </div>
                </div>
                
                {/* 4. Download Manual Section */}
                <div className="bg-brand-secondary-light dark:bg-dark-bg p-8 rounded-2xl shadow-sm border border-brand-border dark:border-dark-border flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center">
                        <div className="hidden sm:block mr-6"><DownloadIcon /></div>
                        <div>
                            <h3 className="text-xl font-bold text-brand-text-dark dark:text-dark-text-dark">ดาวน์โหลดคู่มือการใช้งานฉบับเต็ม</h3>
                            <p className="text-brand-text-light dark:text-dark-text-light mt-1">คู่มือที่จะแนะนำทุกขั้นตอนการใช้งานแผงเช่าเว็บไซต์ ตั้งแต่การตั้งค่าเริ่มต้นไปจนถึงการจัดการลูกค้ารายย่อย</p>
                        </div>
                    </div>
                     <button className="w-full md:w-auto flex-shrink-0 bg-brand-primary dark:bg-dark-primary text-white dark:text-brand-text-dark font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity">
                        ดาวน์โหลดคู่มือ (PDF)
                    </button>
                </div>

                {/* 5. Pricing Plans */}
                <div>
                    <h3 className="text-3xl font-bold text-center mb-8 text-brand-text-dark dark:text-dark-text-dark">แผนราคาที่ยืดหยุ่น</h3>
                    <div className="bg-brand-surface dark:bg-dark-surface p-6 sm:p-8 rounded-2xl shadow-sm">
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
                            <div className="lg:col-span-2">
                                <h4 className="text-lg font-semibold mb-2 text-brand-text-dark dark:text-dark-text-dark">คำนวนค่าบริการรายเดือน</h4>
                                <p className="text-sm text-brand-text-light dark:text-dark-text-light mb-4">เริ่มต้นที่แผน A และระบบจะปรับแผนให้อัตโนมัติตามยอดสั่งซื้อจริง</p>
                                <label htmlFor="order-input" className="text-sm font-semibold text-brand-text-dark dark:text-dark-text-dark">จำนวนคำสั่งซื้อต่อเดือน</label>
                                <input id="order-input" type="number" value={orders} onChange={handleInputChange} className="w-full p-3 mt-2 mb-4 bg-brand-bg dark:bg-dark-bg border-2 border-brand-border dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary transition" min="0" max="100000" />
                                <input id="order-slider" type="range" min="0" max="100000" value={orders} onChange={handleInputChange} className="w-full h-2 bg-brand-secondary-light rounded-lg appearance-none cursor-pointer dark:bg-dark-border accent-brand-accent dark:accent-dark-primary" />
                                <div className="mt-6 flex justify-between items-center bg-brand-secondary-light dark:bg-dark-bg p-4 rounded-lg">
                                    <p className="font-semibold text-brand-text-dark dark:text-dark-text-dark">ค่าบริการโดยประมาณ</p>
                                    <p id="monthly-cost" className="text-2xl font-bold text-brand-primary dark:text-dark-primary">฿{monthlyCost}</p>
                                </div>
                            </div>
                            <div className="lg:col-span-3">
                                <div className="space-y-2">
                                    <div className="grid grid-cols-3 gap-4 p-3 rounded-lg font-semibold text-brand-text-dark dark:text-dark-text-dark"><p>Plan</p><p>จำนวนคำสั่งซื้อ</p><p className="text-right">ราคา/เดือน</p></div>
                                    <div className="grid grid-cols-3 gap-4 bg-brand-bg dark:bg-dark-border p-3 rounded-lg text-sm items-center"><p className="font-bold">Plan A</p><p>0 - 1,000</p><p className="text-right font-semibold">฿3,000.00</p></div>
                                    <div className="grid grid-cols-3 gap-4 bg-brand-bg dark:bg-dark-border p-3 rounded-lg text-sm items-center"><p className="font-bold">Plan B</p><p>1,001 - 5,000</p><p className="text-right font-semibold">฿4,500.00</p></div>
                                    <div className="grid grid-cols-3 gap-4 bg-brand-bg dark:bg-dark-border p-3 rounded-lg text-sm items-center"><p className="font-bold">Plan C</p><p>5,001 - 15,000</p><p className="text-right font-semibold">฿5,500.00</p></div>
                                    <div className="grid grid-cols-3 gap-4 bg-brand-bg dark:bg-dark-border p-3 rounded-lg text-sm items-center"><p className="font-bold">Plan D</p><p>15,001 - 50,000</p><p className="text-right font-semibold">฿7,500.00</p></div>
                                    <div className="grid grid-cols-3 gap-4 bg-brand-bg dark:bg-dark-border p-3 rounded-lg text-sm items-center"><p className="font-bold">Plan E</p><p>50,001+</p><p className="text-right font-semibold">฿9,500.00</p></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 6. FAQ Section */}
                <div>
                    <h3 className="text-3xl font-bold text-center mb-8 text-brand-text-dark dark:text-dark-text-dark">
                       คำถามที่พบบ่อย
                    </h3>
                    <div className="max-w-4xl mx-auto bg-brand-surface dark:bg-dark-surface p-6 sm:p-8 rounded-2xl shadow-sm">
                        <div className="space-y-4">
                            <FaqItem question="🟤 วิธีเช่าเว็บปั้มไลค์รายเดือน ?">คุณสามารถเริ่มต้นได้โดยการติดต่อทีมงานของเราเพื่อเปิดใช้งานแผน A ได้ทันที หลังจากนั้นค่าบริการจะถูกเรียกเก็บตามยอดการใช้งานจริงในแต่ละเดือน</FaqItem>
                            <FaqItem question="🟤 เว็บเช่ารายย่อยคืออะไร ?">คือระบบที่ให้ลูกค้าของคุณสามารถมาเช่าเว็บปั้มไลค์ต่อจากคุณได้ โดยเว็บของลูกค้าจะเชื่อมต่อ API กับเว็บหลักของคุณเพียงที่เดียว ทำให้คุณเป็นเหมือนผู้ให้บริการรายใหญ่</FaqItem>
                            <FaqItem question="🟤 ต้องใช้โฮสติ้งสำหรับเว็บปั้มไลค์หรือไม่ ?">ไม่ต้องครับ บริการของเราครอบคลุมทั้งระบบและโฮสติ้ง คุณเพียงแค่เตรียมโดเมนเนมของคุณและชี้ Name Server มาที่เราก็พร้อมใช้งานได้ทันที</FaqItem>
                            <FaqItem question="🟤 ฉันมีโดเมนแล้วฉันจะต้องทำอะไรต่อ ?">หลังจากที่คุณมีโดเมนแล้ว ขั้นตอนต่อไปคือการเปลี่ยนค่า Name Server (NS) ของโดเมนคุณให้ชี้มายังเซิร์ฟเวอร์ของเรา ซึ่งทีมงานจะให้ข้อมูล NS หลังจากที่คุณสมัครใช้บริการ</FaqItem>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}