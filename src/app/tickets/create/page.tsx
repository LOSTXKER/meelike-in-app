// src/app/tickets/create/page.tsx
"use client";

import React, { useState } from 'react';
import Link from 'next/link';

// --- Icons ---
const InfoIcon = () => <svg className="w-5 h-5 mr-3 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>;
const WarningIcon = () => <svg className="w-6 h-6 text-brand-warning mr-3 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8.257 3.099c.636-1.21 2.27-1.21 2.906 0l4.5 8.625c.636 1.21-.24 2.776-1.453 2.776H5.204c-1.213 0-2.089-1.566-1.453-2.776l4.5-8.625zM10 14a1 1 0 100-2 1 1 0 000 2zm0-7a1 1 0 011 1v2a1 1 0 11-2 0V8a1 1 0 011-1z" clipRule="evenodd" /></svg>;
const PaperClipIcon = () => <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M15.621 4.379a3 3 0 00-4.242 0l-7 7a3 3 0 004.241 4.243h.001l.497-.5a.75.75 0 011.064 1.057l-.498.501-.002.002a4.5 4.5 0 01-6.364-6.364l7-7a4.5 4.5 0 016.368 6.36l-3.455 3.553A2.625 2.625 0 119.52 9.52l3.45-3.451a.75.75 0 111.061 1.06l-3.45 3.451a1.125 1.125 0 001.59 1.591l3.455-3.553a3 3 0 000-4.242z" clipRule="evenodd" /></svg>;
const QuestionMarkIcon = () => <svg className="w-5 h-5 mr-3 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.94 6.94a.75.75 0 11-1.06-1.061 3.5 3.5 0 116.628 2.31A7.03 7.03 0 0012 11a.75.75 0 01-1.5 0v-.546A5.53 5.53 0 019 6.94zM11 13a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" /></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>;
const ClockIcon = () => <svg className="w-5 h-5 mr-3 flex-shrink-0 text-brand-primary dark:text-dark-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" /></svg>;


// --- Components ---
const FaqItem = ({ question, children }: { question: string, children: React.ReactNode }) => (
    <details className="border-b border-brand-border dark:border-dark-border pb-4 group last:border-b-0 last:pb-0">
        <summary className="flex justify-between items-center cursor-pointer py-2 font-semibold text-brand-text-dark dark:text-dark-text-dark">
            <span className="flex items-center text-left">{question}</span>
            <span className="plus-icon transition-transform duration-300 text-brand-primary dark:text-dark-primary group-open:rotate-45 flex-shrink-0 ml-4">
                <PlusIcon />
            </span>
        </summary>
        <div className="pt-2 text-sm text-brand-text-light dark:text-dark-text-light pr-6">
            {children}
        </div>
    </details>
);

export default function CreateTicketPage() {
    const [subject, setSubject] = useState('');
    const isFormDisabled = !subject;

    // Helper function to generate common disabled styles
    const disabledClasses = "disabled:opacity-50 disabled:cursor-not-allowed";

    return (
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            <h1 className="text-3xl font-bold text-brand-text-dark dark:text-dark-text-dark mb-8">
                สร้างตั๋วใหม่
            </h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* --- Left Column: Form --- */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-xl border-l-4 border-brand-warning">
                        <div className="flex">
                            <WarningIcon />
                            <div>
                                <h3 className="font-bold text-yellow-800 dark:text-yellow-300 mb-2">โปรดอ่านกฎระเบียบก่อนเปิดตั๋ว</h3>
                                <ul className="text-sm text-brand-text-light dark:text-dark-text-light list-disc list-inside space-y-2">
                                    <li><strong className="text-yellow-700 dark:text-yellow-200">ห้ามเปิดตั๋วหมายเลขคำสั่งซื้อเดิมซ้ำ</strong> ในขณะที่ตั๋วเก่ายังไม่ถูกปิดเคส</li>
                                    <li>เมื่อตั๋วได้รับการแก้ไขแล้ว หากต้องการเปิดปัญหาใหม่ให้ใช้ตั๋วใหม่เท่านั้น</li>
                                    <li>ในการแก้ไขปัญหาแต่ละครั้งอาจใช้เวลาถึง <strong className="text-yellow-700 dark:text-yellow-200">72 ชั่วโมง! (ไม่รวมวันหยุด)</strong> โปรดอดทนรอ</li>
                                    <li>ขอสงวนสิทธิ์การตอบตั๋ว, แก้ไขปัญหา, หรือระงับการให้บริการกับผู้ที่ไม่อ่านกฎระเบียบนี้</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    {/* --- NEW BANNER FOR SUPPORT HOURS --- */}
                    <div className="bg-brand-secondary-light/60 dark:bg-dark-surface p-4 rounded-xl border border-brand-border dark:border-dark-border">
                         <div className="flex items-center justify-center">
                            <ClockIcon />
                             <p className="font-semibold text-center text-md text-brand-text-dark dark:text-dark-text-dark">
                                ให้บริการช่วยเหลือ: จันทร์-เสาร์ 8.00-23.59 น.
                            </p>
                        </div>
                    </div>


                    <div className="bg-brand-surface dark:bg-dark-surface p-6 sm:p-8 rounded-xl shadow-md border border-brand-border dark:border-dark-border">
                        <form className="space-y-6">
                            {/* --- Subject Selector (Always Enabled) --- */}
                            <div>
                                <label htmlFor="subject" className="block text-sm font-semibold text-brand-text-dark dark:text-dark-text-dark mb-2">เลือกหัวข้อ</label>
                                <select id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full bg-brand-bg dark:bg-dark-bg border border-brand-border dark:border-dark-border rounded-lg py-2.5 px-4 focus:ring-2 focus:ring-brand-primary focus:outline-none">
                                    <option value="">--- กรุณาเลือกหัวข้อ ---</option>
                                    <option>คำสั่งซื้อ</option>
                                    <option>เติมเงินไม่เข้า</option>
                                    <option>เช่าเว็บปั้มไลค์</option>
                                    <option>สมัครตัวแทน</option>
                                    <option>แจ้งเรื่องใบเสร็จ ใบกำกับภาษี</option>
                                    <option>สอบถามทั่วไป-อื่นๆ</option>
                                </select>
                            </div>

                            {/* --- Dynamic Fields Container --- */}
                            <fieldset disabled={isFormDisabled} className="space-y-6">
                                {/* Fields for 'คำสั่งซื้อ' */}
                                <div className={subject === 'คำสั่งซื้อ' ? 'space-y-6' : 'hidden'}>
                                    <div>
                                        <label htmlFor="request_type" className="block text-sm font-semibold text-brand-text-dark dark:text-dark-text-dark mb-2">คำขอ</label>
                                        <select id="request_type" className={`w-full bg-brand-bg dark:bg-dark-bg border border-brand-border dark:border-dark-border rounded-lg py-2.5 px-4 focus:ring-2 focus:ring-brand-primary focus:outline-none ${disabledClasses}`}>
                                            <option>--- เลือกประเภทคำขอ ---</option>
                                            <option>ขอเร่งความเร็ว (คำสั่งซื้อยังไม่เริ่มใน 24 ชม.)</option>
                                            <option>ขอเติมยอดลด</option>
                                            <option>สถานะเสร็จแต่ไม่ได้รับยอด</option>
                                            <option>ขอยกเลิก</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="order_id" className="block text-sm font-semibold text-brand-text-dark dark:text-dark-text-dark mb-2">หมายเลขคำสั่งซื้อ (Order ID)</label>
                                        <input type="text" id="order_id" placeholder="10000,10001,10002" className={`w-full bg-brand-bg dark:bg-dark-bg border border-brand-border dark:border-dark-border rounded-lg py-2.5 px-4 focus:ring-2 focus:ring-brand-primary focus:outline-none ${disabledClasses}`}/>
                                        <p className="text-xs text-brand-text-light dark:text-dark-text-light mt-1">หลายออเดอร์โปรดแยกด้วยจุลภาค " , "</p>
                                    </div>
                                </div>

                                {/* Fields for 'เติมเงินไม่เข้า' */}
                                <div className={subject === 'เติมเงินไม่เข้า' ? 'space-y-6' : 'hidden'}>
                                     <div>
                                        <label htmlFor="transaction_id" className="block text-sm font-semibold text-brand-text-dark dark:text-dark-text-dark mb-2">เลขธุรกรรม</label>
                                        <input type="text" id="transaction_id" className={`w-full bg-brand-bg dark:bg-dark-bg border border-brand-border dark:border-dark-border rounded-lg py-2.5 px-4 focus:ring-2 focus:ring-brand-primary focus:outline-none ${disabledClasses}`}/>
                                    </div>
                                    <div>
                                        <label htmlFor="amount" className="block text-sm font-semibold text-brand-text-dark dark:text-dark-text-dark mb-2">จำนวนเงินที่ชำระ</label>
                                        <input type="number" id="amount" className={`w-full bg-brand-bg dark:bg-dark-bg border border-brand-border dark:border-dark-border rounded-lg py-2.5 px-4 focus:ring-2 focus:ring-brand-primary focus:outline-none ${disabledClasses}`}/>
                                    </div>
                                </div>
                                
                                {/* Fields for 'เช่าเว็บปั้มไลค์' */}
                                <div className={subject === 'เช่าเว็บปั้มไลค์' ? 'space-y-6' : 'hidden'}>
                                     <div>
                                        <label htmlFor="request_type_rent" className="block text-sm font-semibold text-brand-text-dark dark:text-dark-text-dark mb-2">คำขอ</label>
                                        <select id="request_type_rent" className={`w-full bg-brand-bg dark:bg-dark-bg border border-brand-border dark:border-dark-border rounded-lg py-2.5 px-4 focus:ring-2 focus:ring-brand-primary focus:outline-none ${disabledClasses}`}>
                                            <option>สนใจเปิดเว็บไซค์</option>
                                            <option>แจ้งปัญหาออเดอร์</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Fields for 'สมัครตัวแทน' */}
                                <div className={subject === 'สมัครตัวแทน' ? 'space-y-6' : 'hidden'}>
                                    <div>
                                        <label htmlFor="username" className="block text-sm font-semibold text-brand-text-dark dark:text-dark-text-dark mb-2">ระบุ Username ของท่าน</label>
                                        <input type="text" id="username" className={`w-full bg-brand-bg dark:bg-dark-bg border border-brand-border dark:border-dark-border rounded-lg py-2.5 px-4 focus:ring-2 focus:ring-brand-primary focus:outline-none ${disabledClasses}`}/>
                                    </div>
                                </div>
                                
                                {/* --- Universal Message & File Upload --- */}
                                <div className={subject ? 'block' : 'hidden'}>
                                    <label htmlFor="message" className="block text-sm font-semibold text-brand-text-dark dark:text-dark-text-dark mb-2">ข้อความ</label>
                                    <textarea id="message" rows={8} placeholder="พิมพ์ข้อความที่นี่..." className={`w-full bg-brand-bg dark:bg-dark-bg border border-brand-border dark:border-dark-border rounded-lg py-2.5 px-4 focus:ring-2 focus:ring-brand-primary focus:outline-none ${disabledClasses}`}/>
                                </div>
                                <div>
                                    <label htmlFor="file_upload" className="block text-sm font-semibold text-brand-text-dark dark:text-dark-text-dark mb-2">แนบไฟล์</label>
                                    <label className={`w-full flex items-center justify-center px-4 py-3 bg-brand-bg dark:bg-dark-bg border-2 border-brand-border dark:border-dark-border border-dashed rounded-lg transition-colors ${isFormDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-brand-primary dark:hover:border-dark-primary'}`}>
                                        <PaperClipIcon/>
                                        <span className="text-sm text-brand-text-light dark:text-dark-text-light">เลือกไฟล์เพื่ออัปโหลด</span>
                                        <input id="file_upload" type="file" className="hidden" disabled={isFormDisabled} />
                                    </label>
                                </div>
                                <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:items-center gap-3 pt-4 border-t border-brand-border dark:border-dark-border">
                                    <Link href="/tickets">
                                        <span className={`w-full sm:w-auto flex items-center justify-center px-6 py-3 text-md font-semibold rounded-lg transition-colors ${isFormDisabled ? 'opacity-50 cursor-not-allowed text-brand-text-light dark:text-dark-text-light bg-brand-bg dark:bg-dark-bg' : 'text-brand-text-light dark:text-dark-text-light bg-brand-bg dark:bg-dark-bg hover:bg-brand-border dark:hover:bg-dark-border'}`}>
                                            ยกเลิก
                                        </span>
                                    </Link>
                                    <button type="submit" disabled={isFormDisabled} className={`w-full sm:w-auto flex items-center justify-center px-6 py-3 text-md font-semibold rounded-lg transition-opacity ${disabledClasses} bg-brand-accent dark:bg-dark-primary text-white dark:text-brand-text-dark hover:opacity-90`}>
                                        สร้างตั๋ว
                                    </button>
                                </div>
                            </fieldset>
                        </form>
                    </div>
                </div>

                {/* --- Right Column: Instructions & FAQ --- */}
                <div className="lg:col-span-1 space-y-6 lg:sticky top-8">
                     <div className="bg-brand-secondary-light dark:bg-dark-surface p-6 rounded-xl border border-brand-border dark:border-dark-border">
                        <h3 className="font-bold text-brand-text-dark dark:text-dark-text-dark mb-4 flex items-center"><InfoIcon /> ตัวอย่างการเขียนตั๋ว</h3>
                        <div className="text-sm space-y-4">
                            <div>
                                <p className="font-semibold text-brand-text-dark dark:text-dark-text-dark">เมื่อเลือกหัวข้อ "คำสั่งซื้อ":</p>
                                <ul className="list-disc list-inside pl-2 text-brand-text-light dark:text-dark-text-light">
                                    <li><strong className="text-xs">คำขอ:</strong> ขอเติมยอดลด</li>
                                    <li><strong className="text-xs">Order ID:</strong> 10000, 10001</li>
                                </ul>
                            </div>
                             <div>
                                <p className="font-semibold text-brand-text-dark dark:text-dark-text-dark">เมื่อเลือกหัวข้อ "เติมเงินไม่เข้า":</p>
                                <ul className="list-disc list-inside pl-2 text-brand-text-light dark:text-dark-text-light">
                                     <li><strong className="text-xs">เลขธุรกรรม:</strong> 88X-123-4567</li>
                                    <li><strong className="text-xs">จำนวนเงิน:</strong> 500.00</li>
                                </ul>
                            </div>
                            <p className="text-xs text-brand-primary dark:text-dark-primary pt-2 border-t border-brand-border dark:border-dark-border">*โปรดแจ้งข้อมูลที่จำเป็นให้ครบถ้วนเพื่อความรวดเร็วในการตรวจสอบ</p>
                        </div>
                    </div>
                    
                    {/* --- FAQ Section --- */}
                    <div className="bg-brand-surface dark:bg-dark-surface p-6 rounded-xl shadow-md border border-brand-border dark:border-dark-border">
                        <h3 className="font-bold text-brand-text-dark dark:text-dark-text-dark mb-4 flex items-center">
                            <QuestionMarkIcon />
                            คำถามที่พบบ่อย (FAQ)
                        </h3>
                        <div className="space-y-4">
                            <FaqItem question="ต้องการสมัครตัวแทนต้องทำอย่างไร?">
                                <p>เลือกหัวข้อ "สมัครตัวแทน" และระบุ Username ของท่านในช่องข้อความ จากนั้นทีมงานจะติดต่อกลับเพื่อแจ้งรายละเอียดและเงื่อนไขการเป็นตัวแทนครับ</p>
                            </FaqItem>
                            <FaqItem question="เติมเงินแล้วยอดไม่เข้า ต้องทำอย่างไร?">
                                <p>เลือกหัวข้อ "เติมเงินไม่เข้า" และกรอกข้อมูล "เลขธุรกรรม" และ "จำนวนเงินที่ชำระ" ให้ครบถ้วน พร้อมแนบสลิปการโอนเงินเพื่อให้ทีมงานตรวจสอบได้รวดเร็วยิ่งขึ้นครับ</p>
                            </FaqItem>
                            <FaqItem question="ต้องการเร่งความเร็วออเดอร์ต้องทำอย่างไร?">
                                <p>เลือกหัวข้อ "คำสั่งซื้อ" &gt; คำขอ "ขอเร่งความเร็ว" และระบุหมายเลขคำสั่งซื้อ (Order ID) ที่ต้องการให้ทีมงานตรวจสอบครับ</p>
                            </FaqItem>
                            <FaqItem question="ยอดลดต้องทำอย่างไร?">
                                <p>เลือกหัวข้อ "คำสั่งซื้อ" &gt; คำขอ "ขอเติมยอดลด" พร้อมระบุหมายเลขคำสั่งซื้อ (Order ID) ครับ</p>
                            </FaqItem>
                             <FaqItem question="ต้องการยกเลิกออเดอร์ต้องทำอย่างไร?">
                                <p>เลือกหัวข้อ "คำสั่งซื้อ" &gt; คำขอ "ขอยกเลิก" พร้อมระบุหมายเลขคำสั่งซื้อ (Order ID) ที่ต้องการยกเลิกครับ</p>
                            </FaqItem>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}