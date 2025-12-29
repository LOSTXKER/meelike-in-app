// src/app/components/ServiceDetailsModal.tsx
"use client";

import React from 'react';
import ServiceReviews from '@/app/components/ServiceReviews';
import { type Service } from '@/app/data/services'; // Import centralized type

interface ServiceDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    service: Service | null;
}

// Icons
const CheckCircleIcon = () => <svg className="w-5 h-5 text-brand-success" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>;
const XCircleIcon = () => <svg className="w-5 h-5 text-brand-error" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" /></svg>;

export default function ServiceDetailsModal({ isOpen, onClose, service }: ServiceDetailsModalProps) {
    if (!isOpen || !service) return null;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 transition-opacity duration-300" 
            onClick={onClose}
        >
            <div 
                className="bg-brand-surface dark:bg-dark-surface rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex flex-col border-b border-brand-border dark:border-dark-border flex-shrink-0">
                    <div className="flex justify-between items-center p-4">
                        <h2 className="text-lg font-bold text-brand-text-dark dark:text-dark-text-dark">{service.name}</h2>
                        <button onClick={onClose} className="text-brand-text-light dark:text-dark-text-light text-2xl font-light hover:text-brand-text-dark dark:hover:text-dark-text-dark transition-colors">&times;</button>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    {/* Details Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-8">
                         {/* Left Column */}
                        <div className="lg:col-span-3 space-y-4">
                            <div className="bg-brand-bg dark:bg-dark-bg p-4 rounded-lg border border-brand-border dark:border-dark-border">
                                <p className="text-2xl font-bold text-brand-text-dark dark:text-dark-text-dark">฿{service.price.toFixed(2)}
                                    <span className="text-base font-normal text-brand-text-light dark:text-dark-text-light"> / 1,000 {service.unit}</span>
                                </p>
                            </div>
                            
                            <div className="text-sm space-y-3 text-brand-text-light dark:text-dark-text-light">
                                <div>
                                    <h3 className="font-semibold text-brand-text-dark dark:text-dark-text-dark mb-1">▪️ รายละเอียด</h3>
                                    <ul className="list-disc list-inside space-y-1 pl-2">
                                        <li>เริ่มต้น: 0-1 ชม.</li>
                                        <li>ความเร็ว: 100-1K/วัน</li>
                                        <li>การรับประกัน: {service.refill ? "มี (Refill)" : "ไม่มี"}</li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-brand-text-dark dark:text-dark-text-dark mb-1">หมายเหตุ:</h3>
                                    <ul className="space-y-2 mt-2 text-xs">
                                        <li className="flex items-start"><CheckCircleIcon /> ตรวจสอบลิงค์ให้ถูกต้องก่อนส่งและต้องเป็นโปรไฟล์สาธารณะเท่านั้น</li>
                                        <li className="flex items-start"><XCircleIcon /> ไม่รองรับบัญชีครีเอเตอร์ / บัญชีพรีเมียม</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        {/* Right Column */}
                        <div className="lg:col-span-2 space-y-6">
                             <div className="bg-brand-bg dark:bg-dark-bg p-4 rounded-xl border border-brand-border dark:border-dark-border space-y-3">
                                <div className="flex justify-between text-sm"><span className="text-brand-text-light dark:text-dark-text-light">เวลาเฉลี่ย</span> <span className="font-semibold">{service.avgTime}</span></div>
                                <div className="flex justify-between text-sm"><span className="text-brand-text-light dark:text-dark-text-light">สั่งขั้นต่ำ</span> <span className="font-semibold">{service.min.toLocaleString()}</span></div>
                                <div className="flex justify-between text-sm"><span className="text-brand-text-light dark:text-dark-text-light">สั่งสูงสุด</span> <span className="font-semibold">{service.max.toLocaleString()}</span></div>
                                <div className="flex justify-between text-sm items-center">
                                    <span className="text-brand-text-light dark:text-dark-text-light">Refill</span>
                                    <span className={`font-semibold flex items-center gap-1 ${service.refill ? 'text-brand-success' : 'text-brand-error'}`}>
                                        {service.refill ? <CheckCircleIcon/> : <XCircleIcon/>}
                                        {service.refill ? 'Yes' : 'No'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Divider */}
                    <div className="border-t border-brand-border dark:border-dark-border my-6"></div>
                    
                    {/* Reviews Section Title */}
                    <h3 className="text-lg font-bold text-brand-text-dark dark:text-dark-text-dark mb-4">รีวิวจากผู้ใช้</h3>

                    {/* Reviews Component */}
                    <ServiceReviews 
                        serviceId={service.id.toString()}
                        serviceName={service.name}
                        compact={false}
                    />
                </div>
                 {/* Footer */}
                 <div className="p-4 mt-auto border-t border-brand-border dark:border-dark-border flex-shrink-0 flex justify-end items-center gap-4">
                     <p className="text-sm text-brand-text-light dark:text-dark-text-light hidden sm:block">พร้อมที่จะสั่งซื้อบริการนี้แล้วหรือยัง?</p>
                     <a href={`/order?service=${service.id}`} className="font-bold py-2 px-6 rounded-lg bg-brand-primary text-white dark:bg-dark-primary dark:text-brand-text-dark hover:opacity-90 transition-all duration-300 shadow-md">
                        ไปที่หน้าสั่งซื้อ
                    </a>
                 </div>
            </div>
            {/* Simple animation */}
            <style jsx global>{`
                @keyframes fadeInScale {
                    from {
                        opacity: 0;
                        transform: scale(.95);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                .animate-fade-in-scale {
                    animation: fadeInScale 0.2s ease-out forwards;
                }
                /* Hide scrollbar for Chrome, Safari and Opera */
                .custom-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                /* Hide scrollbar for IE, Edge and Firefox */
                .custom-scrollbar {
                    -ms-overflow-style: none;  /* IE and Edge */
                    scrollbar-width: none;  /* Firefox */
                }
            `}</style>
        </div>
    );
}