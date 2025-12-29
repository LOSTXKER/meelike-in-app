// src/app/add-funds/page.tsx
"use client";

import React, { useState } from 'react';
import Link from 'next/link';

// --- Icons ---
const WalletIcon = () => <svg className="w-8 h-8 mr-3 text-brand-text-dark dark:text-dark-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>;
const CheckCircleIcon = () => <svg className="w-6 h-6 text-brand-primary dark:text-dark-primary" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>;
const InfoIcon = () => <svg className="w-5 h-5 text-brand-text-dark dark:text-dark-text-light inline-block mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>;
const WarningIcon = () => <svg className="w-6 h-6 text-brand-error mr-3 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8.257 3.099c.636-1.21 2.27-1.21 2.906 0l4.5 8.625c.636 1.21-.24 2.776-1.453 2.776H5.204c-1.213 0-2.089-1.566-1.453-2.776l4.5-8.625zM10 14a1 1 0 100-2 1 1 0 000 2zm0-7a1 1 0 011 1v2a1 1 0 11-2 0V8a1 1 0 011-1z" clipRule="evenodd" /></svg>;
const GiftIcon = () => <svg className="w-4 h-4 mr-1.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 5a3 3 0 013-3h4a3 3 0 013 3v1h1a1 1 0 011 1v4a1 1 0 01-1 1H4a1 1 0 01-1-1V7a1 1 0 011-1h1V5zm4 0a1 1 0 00-1 1v1h2V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>;
const DocumentIcon = () => <svg className="w-6 h-6 text-blue-500 mr-3 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm3.5 4.5a.75.75 0 000 1.5h5a.75.75 0 000-1.5h-5zM8 9a.75.75 0 01.75-.75h2.5a.75.75 0 010 1.5H8.75A.75.75 0 018 9zm.75 2.25a.75.75 0 000 1.5h.5a.75.75 0 000-1.5h-.5z" clipRule="evenodd" /></svg>;

// --- Data with Dynamic Descriptions ---
const paymentMethods = [
    { 
        id: 'truemoney', 
        name: 'True Money Wallet (โบนัส 15%)',
        minAmount: 10.00,
        shortDescription: "เติมเงินผ่านซองอั่งเปา",
        longDescription: () => (
             <div className="mt-6">
                <p className="text-brand-text-light dark:text-dark-text-light mb-4">
                    เติมเงินด้วยซองอั่งเปา TrueMoney Wallet เท่านั้น!
                </p>
                 <div className="text-sm p-4 bg-brand-bg dark:bg-dark-surface rounded-lg">
                    <p className="flex items-center text-brand-error font-semibold mb-3">
                        <GiftIcon /> เติมขั้นต่ำ 10 บาท สูงสุดไม่เกิน 10,000 บาท ต่อครั้ง
                    </p>
                    <ol className="list-decimal list-inside space-y-1 text-brand-text-light dark:text-dark-text-light">
                        <li>เปิดแอป TrueMoney Wallet และไปที่ "ส่งซองของขวัญ"</li>
                        <li>เลือกประเภท "แบ่งจำนวนเงินเท่ากัน"</li>
                        <li>ใส่จำนวนเงินที่ต้องการเติม และใส่จำนวนคนรับซอง "1" คน</li>
                        <li>สร้างซองและคัดลอกลิงก์ซองอั่งเปา</li>
                        <li>นำลิงก์มาวางในช่อง "ลิงก์ซองอั่งเปา" แล้วกด 'ยืนยัน'</li>
                    </ol>
                     <p className="border-t border-brand-border dark:border-dark-border pt-3 mt-3 font-semibold">
                        💰 เติมเงินทุกยอด รับโบนัสเพิ่มทันที 15% !
                    </p>
                </div>
            </div>
        )
    },
    { 
        id: 'promptpay_qr', 
        name: 'สแกน QR Code (โบนัส 5%)',
        minAmount: 10.00,
        shortDescription: "ชำระเงินผ่านทุกแอปธนาคาร",
        longDescription: () => (
            <div className="mt-6">
                 <p className="text-brand-text-light dark:text-dark-text-light mb-4">
                    สแกนด้วย QR Code ผ่านแอปพลิเคชันธนาคาร เงินเข้าทันที!
                </p>
                <div className="text-sm p-4 bg-brand-bg dark:bg-dark-surface rounded-lg">
                    <p className="flex items-center text-brand-error font-semibold mb-3">
                        <GiftIcon /> เติมขั้นต่ำ 10 บาท สูงสุดไม่เกิน 30,000 บาท ต่อครั้ง
                    </p>
                    <p className="font-semibold text-brand-text-dark dark:text-dark-text-dark">ขั้นตอนการเติมเงิน:</p>
                    <ol className="list-decimal list-inside space-y-1 text-brand-text-light dark:text-dark-text-light">
                        <li>กรอกจำนวนเงินที่ต้องการเติมในช่องด้านล่าง</li>
                        <li>กดปุ่ม 'ยืนยัน'</li>
                        <li>ระบบจะแสดง QR Code เพื่อให้คุณสแกนชำระเงิน</li>
                    </ol>
                     <p className="border-t border-brand-border dark:border-dark-border pt-3 mt-3 font-semibold">
                        💰 เติมเงิน 500 บาทขึ้นไป รับโบนัสเพิ่มทันที 5% !
                    </p>
                </div>
            </div>
        )
    }
];

export default function AddFundsPage() {
    const [selectedMethodId, setSelectedMethodId] = useState('promptpay_qr');
    const selectedMethod = paymentMethods.find(p => p.id === selectedMethodId);

    return (
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            <h1 className="text-3xl font-bold text-brand-text-dark dark:text-dark-text-dark mb-6">
                เติมเงิน
            </h1>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border-l-4 border-brand-info mb-6 flex items-start">
                <DocumentIcon />
                <div>
                    <h3 className="font-bold text-blue-800 dark:text-blue-300 mb-1">สามารถออกใบกำกับภาษีได้</h3>
                    <p className="text-sm text-brand-text-light dark:text-dark-text-light">
                        เรารองรับการออกใบกำกับภาษีเต็มรูปแบบ ดูขั้นตอนและรายละเอียดได้ที่ Sidebar ด้านขวามือ
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-brand-surface dark:bg-dark-bg p-6 sm:p-8 rounded-2xl shadow-lg border border-brand-border dark:border-dark-border">
                        <div className="flex items-center justify-between pb-6 border-b border-brand-border dark:border-dark-border">
                            <div className='flex items-center'>
                               <WalletIcon />
                                <div>
                                    <p className="text-sm font-semibold text-brand-text-light dark:text-dark-text-light">ยอดเงินคงเหลือ</p>
                                    <p className="text-2xl font-bold text-brand-text-dark dark:text-dark-text-dark">THB 1,250.00</p>
                                </div>
                            </div>
                            <Link href="/history/deposits">
                                <span className="text-sm font-semibold text-brand-primary dark:text-dark-primary hover:underline">ประวัติการเติมเงิน</span>
                            </Link>
                        </div>
                        
                        <div className="py-6">
                            <div className="mb-6">
                                <h2 className="text-lg font-bold mb-4"><span className="bg-brand-primary text-white dark:bg-dark-primary dark:text-brand-text-dark rounded-full w-6 h-6 inline-flex items-center justify-center mr-2 text-sm">1</span> เลือกช่องทาง</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {paymentMethods.map(method => (
                                        <div
                                            key={method.id}
                                            onClick={() => setSelectedMethodId(method.id)}
                                            className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedMethodId === method.id ? 'border-brand-primary dark:border-dark-primary bg-brand-bg dark:bg-dark-bg' : 'border-brand-border dark:border-dark-border hover:border-brand-primary-light'}`}
                                        >
                                            <div className="flex justify-between items-center">
                                                <p className="font-semibold text-base">{method.name}</p>
                                                {selectedMethodId === method.id && <CheckCircleIcon />}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {selectedMethod && selectedMethod.longDescription()}

                            <div className="border-t border-brand-border dark:border-dark-border pt-6 mt-6">
                                <h2 className="text-lg font-bold mb-4"><span className="bg-brand-primary text-white dark:bg-dark-primary dark:text-brand-text-dark rounded-full w-6 h-6 inline-flex items-center justify-center mr-2 text-sm">2</span> จำนวนเงิน</h2>
                                <div className="relative">
                                    <span className="absolute left-0 top-0 bottom-0 flex items-center px-4 font-bold text-brand-text-dark dark:text-dark-text-dark border-r border-brand-border dark:border-dark-border">THB</span>
                                    <input type="number" placeholder="กรอกจำนวนเงินที่ต้องการเติม" className="w-full bg-brand-bg dark:bg-dark-bg border border-brand-border dark:border-dark-border rounded-lg py-3 pl-20 pr-4 focus:ring-2 focus:ring-brand-primary focus:outline-none"/>
                                </div>
                                <p className="text-xs text-brand-text-light dark:text-dark-text-light mt-2">จำนวนเงินขั้นต่ำ: ฿{selectedMethod?.minAmount.toFixed(2)}</p>
                                <div className="mt-4">
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input type="checkbox" className="form-checkbox h-4 w-4 rounded text-brand-primary dark:text-dark-primary focus:ring-brand-primary dark:focus:ring-dark-primary border-brand-border dark:border-dark-border bg-brand-bg dark:bg-dark-surface"/>
                                        <span className="text-sm text-brand-text-dark dark:text-dark-text-dark">
                                            ออกใบกำกับภาษี
                                            <Link href="/settings">
                                                <span className="text-brand-primary dark:text-dark-primary hover:underline ml-1 cursor-pointer">(กรอกข้อมูลของผู้ซื้อ)</span>
                                            </Link>
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-brand-border dark:border-dark-border">
                             <button className="w-full font-bold py-4 px-6 rounded-lg bg-brand-accent dark:bg-dark-primary text-white dark:text-brand-text-dark hover:opacity-90 transition-opacity duration-300 shadow-lg text-lg">
                                ยืนยัน
                            </button>
                        </div>
                    </div>
                </div>
                {/* Sidebar */}
                <div className="lg:col-span-1 space-y-6 sticky top-8">
                     <div className="bg-brand-secondary-light/60 dark:bg-dark-surface p-6 rounded-xl border border-brand-border dark:border-dark-border">
                        <h3 className="font-bold text-brand-text-dark dark:text-dark-text-dark mb-3 flex items-center"><InfoIcon /> การออกใบกำกับภาษี</h3>
                        <ol className="text-sm list-decimal list-inside space-y-2 text-brand-text-light dark:text-dark-text-light">
                            <li>ไปที่หน้า <Link href="/settings"><span className="font-semibold text-brand-primary dark:text-dark-primary hover:underline cursor-pointer">ตั้งค่าผู้ใช้</span></Link></li>
                            <li>กรอกข้อมูลที่อยู่และเลขประจำตัวผู้เสียภาษีให้ครบถ้วน"</li>
                            <li>มาหน้า <Link href="/settings"><span className="font-semibold text-brand-primary dark:text-dark-primary hover:underline cursor-pointer">เติมเงิน</span></Link> กรอกข้อมูลเติมเงิน และ ติ๊กเครื่องหมาย "ออกใบกำกับภาษี"</li>
                            <li>เมื่อเติมเงินแล้ว สามารถโหลดใบกำกับภาษีได้ที่หน้า <Link href="/settings"><span className="font-semibold text-brand-primary dark:text-dark-primary hover:underline cursor-pointer">ประวัติการเติมเงิน</span></Link></li>
                        </ol>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-xl border-l-4 border-brand-error">
                        <div className="flex">
                            <WarningIcon />
                            <div>
                                <h3 className="font-bold text-brand-error mb-2">ข้อควรระวัง</h3>
                                <p className="text-sm text-brand-text-light dark:text-dark-text-light">
                                    เมื่อคุณเติมเงินเข้าสู่เว็บไซต์สำเร็จ คุณจะไม่สามารถถอนยอดคงเหลือออกเป็นเงินสดหรือขอคืนเงินเข้าบัญชีธนาคารของคุณได้ 
                                    <span className="font-bold text-brand-error"> ดังนั้น!! ก่อนเติมเงินทุกครั้งกรุณาตรวจสอบจำนวนที่คุณต้องการ ก่อนกดเติมเงิน</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}