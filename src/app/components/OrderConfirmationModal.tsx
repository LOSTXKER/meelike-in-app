// src/app/components/OrderConfirmationModal.tsx
"use client";

import React, { useState } from 'react';
import Link from 'next/link';

// --- Icons ---
const ClockIcon = () => <svg className="w-5 h-5 mr-3 text-brand-text-light dark:text-dark-text-light" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" /></svg>;
const WarningIcon = () => <svg className="w-5 h-5 mr-3 text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>;
const LinkIcon = () => <svg className="w-5 h-5 mr-3 text-brand-text-light dark:text-dark-text-light" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M12.232 4.232a2.5 2.5 0 013.536 3.536l-1.225 1.224a.75.75 0 001.061 1.06l1.224-1.224a4 4 0 00-5.656-5.656l-3 3a4 4 0 00.225 5.865.75.75 0 00.977-1.138 2.5 2.5 0 01-.142-3.665l3-3z" /><path d="M8.603 14.53a2.5 2.5 0 01-3.536-3.536l1.225-1.224a.75.75 0 00-1.061-1.06l-1.224 1.224a4 4 0 005.656 5.656l3-3a4 4 0 00-.225-5.865.75.75 0 00-.977 1.138 2.5 2.5 0 01.142 3.665l-3 3z" /></svg>;
const ChartDownIcon = () => <svg className="w-5 h-5 mr-3 text-brand-text-light dark:text-dark-text-light" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a.75.75 0 01.75.75v10.638l3.97-3.968a.75.75 0 111.06 1.06l-5.25 5.25a.75.75 0 01-1.06 0l-5.25-5.25a.75.75 0 111.06-1.06l3.97 3.968V3.75A.75.75 0 0110 3z" clipRule="evenodd" /></svg>;
const CancelIcon = () => <svg className="w-5 h-5 mr-3 text-brand-text-light dark:text-dark-text-light" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" /></svg>;
const RiskIcon = () => <svg className="w-5 h-5 mr-3 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 1a9 9 0 100 18 9 9 0 000-18zM9.25 7.25a.75.75 0 00-1.5 0v5a.75.75 0 001.5 0v-5zm1.5 0a.75.75 0 01.75.75v5a.75.75 0 01-1.5 0v-5a.75.75 0 01.75-.75z" clipRule="evenodd" /></svg>;


const Section = ({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) => (
    <div className="flex items-start">
        <div className="flex-shrink-0 mt-1">{icon}</div>
        <div className="flex-1">
            <h3 className="font-bold text-md text-brand-text-dark dark:text-dark-text-dark">{title}</h3>
            <div className="mt-2 text-sm text-brand-text-light dark:text-dark-text-light space-y-2">
                {children}
            </div>
        </div>
    </div>
);

interface OrderConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export default function OrderConfirmationModal({ isOpen, onClose, onConfirm }: OrderConfirmationModalProps) {
    const [isAccepted, setIsAccepted] = useState(false);

    if (!isOpen) return null;

    const handleConfirm = () => {
        if (isAccepted) {
            onConfirm();
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 transition-opacity duration-300 animate-fade-in"
            onClick={onClose}
        >
            <div 
                className="bg-brand-surface dark:bg-dark-surface rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-brand-border dark:border-dark-border flex-shrink-0">
                    <h2 className="text-lg font-bold text-brand-text-dark dark:text-dark-text-dark">Terms and Conditions</h2>
                    <button onClick={onClose} className="text-brand-text-light dark:text-dark-text-light text-2xl font-light">&times;</button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto space-y-6">
                    <Section icon={<ClockIcon />} title="⏳ ระยะเวลาในการดำเนินการ">
                        <ul className="list-disc list-inside">
                            <li>การสั่งซื้อแต่ละครั้งอาจใช้เวลา 0-24 ชั่วโมง ในการประมวลผล</li>
                            <li>สามารถเร่งความเร็ว หรือ ยกเลิกได้หากเกิน 24 ชั่วโมง (ใช้เวลาดำเนินการ 12-48 ชั่วโมง)</li>
                            <li>หากระบบเริ่มดำเนินการแล้ว จะ <strong>ไม่สามารถ</strong> ขอเร่งความเร็วหรือยกเลิกได้ กรุณารอจนกว่าจะเสร็จสิ้น</li>
                        </ul>
                    </Section>

                    <Section icon={<WarningIcon />} title="⚠️ ข้อควรระวัง">
                         <ul className="list-disc list-inside">
                            <li>อย่าสั่งซื้อลิงก์เดิมซ้ำ หากคำสั่งซื้อเดิมยังไม่เสร็จสมบูรณ์</li>
                            <li>อย่าใช้หลายเซิร์ฟเวอร์หรือเว็บอื่นพร้อมกัน กับลิงก์เดียวกัน เนื่องจากระบบได้บันทึกยอดเริ่มต้นและคำนวณยอดที่ควรสิ้นสุดไว้แล้ว หากฝ่าฝืน อาจทำให้ยอดผู้ติดตามหรือยอดไลค์ไม่ถูกต้อง และ เราไม่รับผิดชอบในทุกกรณี</li>
                            <li>หากมีการเปลี่ยน Username ระหว่างการทำงาน ระบบจะยุติการทำงานและถือว่าเสร็จสิ้นทันที โดยไม่มีการรับผิดชอบ</li>
                        </ul>
                    </Section>
                    
                    <Section icon={<LinkIcon />} title="🔗 ลิงก์และข้อมูลที่ถูกต้อง">
                        <ul className="list-disc list-inside">
                             <li><strong className="text-brand-text-dark dark:text-dark-text-dark">กรุณาตรวจสอบลิงก์ก่อนสั่งซื้อ เราไม่สามารถยกเลิกหรือคืนเงินได้</strong></li>
                             <li>หากแนบลิงก์ผิด ลิงก์ไม่ถูกต้อง ทางเราไม่รับผิดชอบทุกกรณี เช่น:
                                <ul className="list-[circle] list-inside ml-4 text-red-600 dark:text-red-400">
                                     <li>แนบลิงก์ผิดประเภท ไม่ตรงกับบริการที่สั่งซื้อ</li>
                                     <li>แนบลิงก์ในรูปแบบที่ไม่ถูกต้อง</li>
                                     <li>แนบลิงก์ผิด Account</li>
                                     <li>แนบลิงก์ซ้ำ ในบริการประเภทเดียวกันในขณะที่คำสั่งซื้อเดิมยังไม่ขึ้นเสร็จสมบูรณ์</li>
                                </ul>
                            </li>
                            <li>👉และรวมถึงในกรณีอื่นๆ ที่แนบลิงก์ไม่ตรงเงื่อนไขของบริการ ทางเราไม่สามารถรับผิดชอบได้ทุกกรณี</li>
                            <li className="italic">ดูตัวอย่างการใส่ลิงค์ที่ถูกต้อง คลิกที่นี่</li>
                        </ul>
                    </Section>

                    <Section icon={<ChartDownIcon />} title="📉 การขอเติมยอดลด">
                        <ul className="list-disc list-inside">
                            <li>สามารถขอเติมยอดได้หากยอดลดลง มากกว่า 10% ของยอดที่สั่งซื้อ</li>
                            <li className="font-semibold text-brand-text-dark dark:text-dark-text-dark">การรับประกันจะสิ้นสุดทันทีหาก:
                                <ul className="list-[circle] list-inside ml-4 font-normal">
                                    <li>การรับประกันจะขาดทันทีเมื่อคุณสั่งซื้อออเดอร์ใหม่สำหรับลิ้งค์เดียวกัน เราจะรับประกันแค่คำสั่งซื้อล่าสุดของลิงค์นั้นเท่านั้น</li>
                                    <li>การรับประกันจะขาดทันทีหากเปลี่ยนชื่อหรือลิงค์ เพราะระบบไม่สามารถรู้ได้ ว่านี่คือบัญชีที่ปั้มกับระบบจริงหรือไม่</li>
                                    <li>การรับประกันจะขาดทันทีหากยอดปัจจุบันต่ำกว่ายอดเริ่ม ระบบจะถือว่ายอดลดจากที่อื่น</li>
                                </ul>
                            </li>
                        </ul>
                    </Section>

                    <Section icon={<CancelIcon />} title="❌ การขอยกเลิก">
                        <p>หากเกิน 24 ชั่วโมง สามารถขอยกเลิกได้ (ใช้เวลายกเลิก 12-48 ชั่วโมง)</p>
                    </Section>
                    
                    <Section icon={<RiskIcon />} title="❗ ความเสี่ยงและข้อจำกัด">
                         <ul className="list-disc list-inside">
                             <li>การเพิ่มยอดไลค์/ติดตาม อาจขัดต่อนโยบายของแพลตฟอร์มนั้น ๆ</li>
                             <li>เราเป็นเพียงผู้ให้บริการ และไม่รับผิดชอบต่อความเสียหายใด ๆ</li>
                             <li>หากบัญชีของคุณถูกระงับ เราไม่สามารถช่วยแก้ไขได้</li>
                             <li>ตัวอย่างเพจที่อาจโดนแบน:
                                <ul className="list-[circle] list-inside ml-4">
                                    <li>เพจที่รับเพิ่มยอดไลค์ (ผิดนโยบาย Facebook)</li>
                                    <li>เพจที่เกี่ยวข้องกับการขายยา หรือสิ่งผิดกฎหมาย</li>
                                    <li>บัญชีที่สมัครใหม่และไม่มีตัวตนจริง</li>
                                </ul>
                             </li>
                         </ul>
                    </Section>
                </div>

                {/* Footer */}
                <div className="p-4 mt-auto border-t border-brand-border dark:border-dark-border flex-shrink-0 space-y-4">
                    <label className="flex items-center space-x-3 cursor-pointer">
                        <input 
                            type="checkbox" 
                            checked={isAccepted}
                            onChange={(e) => setIsAccepted(e.target.checked)}
                            className="form-checkbox h-5 w-5 rounded text-brand-primary dark:text-dark-primary focus:ring-brand-primary dark:focus:ring-dark-primary border-brand-border dark:border-dark-border bg-brand-bg dark:bg-dark-surface"
                        />
                        <span className="text-sm text-brand-text-dark dark:text-dark-text-dark">
                            ฉันได้อ่านและยอมรับ <Link href="/terms"><span className="text-brand-primary dark:text-dark-primary hover:underline font-semibold">เงื่อนไขและบริการ</span></Link> ทั้งหมดแล้ว
                        </span>
                    </label>

                    <div className="flex flex-col-reverse sm:flex-row justify-end items-center gap-3">
                        {/* --- โค้ดที่แก้ไข --- */}
                        <button 
                            onClick={onClose} 
                            className="w-full sm:w-48 justify-center flex font-semibold py-3 px-6 rounded-lg text-brand-text-light dark:text-dark-text-light hover:bg-brand-bg dark:hover:bg-dark-surface transition-colors">
                            ยกเลิก
                        </button>
                        <button 
                            onClick={handleConfirm}
                            disabled={!isAccepted}
                            className="w-full sm:w-48 justify-center flex font-bold py-3 px-6 text-lg rounded-lg bg-brand-accent text-white hover:opacity-90 transition-all shadow-md hover:shadow-lg shadow-brand-accent/30 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-100">
                            สั่งซื้อ
                        </button>
                    </div>
                </div>
            </div>
            
            <style jsx global>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fadeIn 0.2s ease-out forwards; }
                @keyframes fadeInScale { from { opacity: 0; transform: scale(.95); } to { opacity: 1; transform: scale(1); } }
                .animate-fade-in-scale { animation: fadeInScale 0.2s ease-out forwards; }
            `}</style>
        </div>
    );
}