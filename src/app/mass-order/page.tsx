// src/app/mass-order/page.tsx
"use client";

import React from 'react';

// ไอคอนสำหรับกล่องคำแนะนำ
const InfoIcon = () => (
    <svg className="w-5 h-5 text-brand-text-light dark:text-dark-text-light inline-block mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
    </svg>
);

export default function MassOrderPage() {
    return (
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            <h1 className="text-3xl font-bold text-brand-text-dark dark:text-dark-text-dark mb-8">
                สั่งซื้อจำนวนมาก
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* คอลัมน์ซ้าย: ฟอร์มสำหรับสั่งซื้อ */}
                <div className="lg:col-span-2 bg-brand-surface dark:bg-dark-surface p-6 rounded-xl shadow-md border border-brand-border dark:border-dark-border">
                    <form>
                        <label htmlFor="mass-order-input" className="text-sm font-semibold text-brand-text-dark dark:text-dark-text-dark mb-2 block">
                            วางรายการสั่งซื้อของคุณที่นี่
                        </label>
                        <textarea
                            id="mass-order-input"
                            rows={15}
                            className="w-full bg-brand-bg dark:bg-dark-bg border border-brand-border dark:border-dark-border rounded-lg py-2.5 px-4 focus:ring-2 focus:ring-brand-primary focus:outline-none text-sm font-mono"
                            placeholder={"ID บริการ|ลิงก์|ปริมาณ\nID บริการ|ลิงก์|ปริมาณ\n..."}
                        />

                        <div className="mt-6 border-t border-brand-border dark:border-dark-border pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div>
                                <span className="text-lg font-semibold">ยอดรวมทั้งหมด:</span>
                                <span className="text-2xl font-bold text-brand-text-dark dark:text-dark-text-dark ml-2">฿0.00</span>
                            </div>
                            <button 
                                type="submit" 
                                className="w-full sm:w-auto text-md font-semibold text-white bg-brand-primary dark:bg-dark-primary dark:text-brand-text-dark rounded-full px-8 py-3 hover:opacity-90 transition-opacity"
                            >
                                ยืนยันการสั่งซื้อ
                            </button>
                        </div>
                    </form>
                </div>

                {/* คอลัมน์ขวา: คำแนะนำ */}
                <div className="lg:col-span-1 sticky top-8 bg-brand-surface dark:bg-dark-surface p-6 rounded-xl shadow-md border border-brand-border dark:border-dark-border">
                    <h2 className="text-xl font-bold mb-4 flex items-center">
                        <InfoIcon />
                        โปรดอ่าน คำแนะนำ!
                    </h2>
                    <div className="space-y-4 text-sm text-brand-text-light dark:text-dark-text-light">
                        <p>
                            วางคำสั่งซื้อของคุณ หนึ่งคำสั่งต่อหนึ่งบรรทัด โดยใช้เครื่องหมาย `|` คั่นกลางระหว่างข้อมูลแต่ละส่วน
                        </p>
                        
                        <div>
                            <p className="font-semibold text-brand-text-dark dark:text-dark-text-dark mb-1">รูปแบบที่ถูกต้อง:</p>
                            <code className="block bg-brand-bg dark:bg-dark-bg p-3 rounded-lg text-brand-text-dark dark:text-dark-text-dark">
                                ID บริการ|ลิงก์|ปริมาณ
                            </code>
                        </div>

                        <div>
                             <p className="font-semibold text-brand-text-dark dark:text-dark-text-dark mb-2">ตัวอย่างการสั่งซื้อ:</p>
                             <div className="bg-brand-bg dark:bg-dark-bg p-4 rounded-lg text-xs font-mono text-brand-text-dark dark:text-dark-text-dark space-y-1">
                                <p>2609|https://www.facebook.com/AAAAA/|1000</p>
                                <p>2609|https://www.facebook.com/BBBBB/|1000</p>
                                <p>2609|https://www.facebook.com/CCCCC/|2500</p>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}