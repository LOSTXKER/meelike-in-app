// src/app/affiliate/page.tsx
"use client";

import React, { useRef, useState } from 'react';

// --- Icons ---
const LinkIcon = () => <svg className="w-5 h-5 mr-3 text-brand-text-light dark:text-dark-text-light" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M12.232 4.232a2.5 2.5 0 013.536 3.536l-1.225 1.224a.75.75 0 001.061 1.06l1.224-1.224a4 4 0 00-5.656-5.656l-3 3a4 4 0 00.225 5.865.75.75 0 00.977-1.138 2.5 2.5 0 01-.142-3.665l3-3z" /><path d="M8.603 14.53a2.5 2.5 0 01-3.536-3.536l1.225-1.224a.75.75 0 00-1.061-1.06l-1.224 1.224a4 4 0 005.656 5.656l3-3a4 4 0 00-.225-5.865.75.75 0 00-.977 1.138 2.5 2.5 0 01.142 3.665l-3 3z" /></svg>;
const CopyIcon = () => <svg className="w-6 h-6 mb-1 mx-auto" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M7 3.5A1.5 1.5 0 018.5 2h3.879a1.5 1.5 0 011.06.44l3.122 3.121A1.5 1.5 0 0117 6.621V16.5a1.5 1.5 0 01-1.5 1.5h-11A1.5 1.5 0 013 16.5v-13A1.5 1.5 0 014.5 2H6a1.5 1.5 0 011 1.5v1zM8.5 2a.5.5 0 00-.5.5v1a.5.5 0 00.5.5H11a.5.5 0 00.5-.5v-1a.5.5 0 00-.5-.5h-2.5z" /></svg>;
const ArrowUpIcon = () => <svg className="w-4 h-4 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 17a.75.75 0 01-.75-.75V5.612L5.28 9.68a.75.75 0 01-1.06-1.06l5.25-5.25a.75.75 0 011.06 0l5.25 5.25a.75.75 0 11-1.06 1.06l-3.97-3.968v10.638A.75.75 0 0110 17z" clipRule="evenodd" /></svg>;
const ArrowDownIcon = () => <svg className="w-4 h-4 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a.75.75 0 01.75.75v10.638l3.97-3.968a.75.75 0 111.06 1.06l-5.25 5.25a.75.75 0 01-1.06 0l-5.25-5.25a.75.75 0 111.06-1.06l3.97 3.968V3.75A.75.75 0 0110 3z" clipRule="evenodd" /></svg>;
const StarsIcon = () => <svg className="w-8 h-8 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.868 2.884c.321-.772 1.308-.772 1.629 0l1.378 3.318a1 1 0 00.95.69l3.457.502c.81.118 1.135 1.106.544 1.68l-2.502 2.438a1 1 0 00-.287.95l.59 3.444c.14 1.087-.923 1.91-1.68 1.403l-3.091-1.625a1 1 0 00-1.053 0l-3.091 1.625c-.757.497-1.82-.316-1.68-1.403l.59-3.444a1 1 0 00-.287-.95l-2.502-2.438c-.59-.574-.266-1.562.544-1.68l3.457-.502a1 1 0 00.95-.69l1.378-3.318z" clipRule="evenodd" /></svg>;


// --- Components ---
const AffiliateStatCard = ({ title, value, percentage, arrowUp = true }: { title: string, value: string, percentage?: string, arrowUp?: boolean }) => (
    <div className="bg-brand-surface dark:bg-dark-surface p-5 rounded-xl border border-brand-border dark:border-dark-border">
        <p className="text-sm font-medium text-brand-text-light dark:text-dark-text-light">{title}</p>
        <div className="flex justify-between items-end mt-1">
            <p className="text-2xl font-bold text-brand-text-dark dark:text-dark-text-dark">{value}</p>
            {percentage && (
                <div className={`flex items-center text-xs font-semibold ${arrowUp ? 'text-brand-success' : 'text-brand-error'}`}>
                    {arrowUp ? <ArrowUpIcon /> : <ArrowDownIcon />}
                    <span>{percentage}</span>
                </div>
            )}
        </div>
    </div>
);

const StepCard = ({ number, title, description }: { number: string, title: string, description: string }) => (
    <div className="text-center">
        <div className="mx-auto w-12 h-12 mb-4 flex items-center justify-center bg-brand-bg dark:bg-dark-bg border-2 border-brand-border dark:border-dark-border rounded-full">
            <span className="text-xl font-bold text-brand-primary dark:text-dark-primary">{number}</span>
        </div>
        <h3 className="font-bold text-md text-brand-text-dark dark:text-dark-text-dark">{title}</h3>
        <p className="text-xs text-brand-text-light dark:text-dark-text-light mt-1">{description}</p>
    </div>
);

export default function AffiliatePage() {
    const referralLink = "https://meelike-th.com/referral?ref=hI7Hl7";
    const linkSectionRef = useRef<HTMLDivElement>(null);
    const [isHighlighted, setIsHighlighted] = useState(false);

    const handleStartEarningClick = () => {
        linkSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        setIsHighlighted(true);
        setTimeout(() => {
            setIsHighlighted(false);
        }, 1500); // Highlight duration
    };

    return (
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
             <style jsx>{`
                @keyframes highlight-fade {
                    0% { box-shadow: 0 0 0 4px rgba(252, 215, 127, 0); }
                    50% { box-shadow: 0 0 0 4px rgba(252, 215, 127, 0.4); }
                    100% { box-shadow: 0 0 0 4px rgba(252, 215, 127, 0); }
                }
                .highlight-animation {
                    animation: highlight-fade 1.5s ease-out;
                }
            `}</style>
            
            {/* --- Engaging Intro Banner --- */}
            <div className="bg-brand-secondary-light dark:bg-dark-surface p-8 rounded-xl shadow-sm border border-brand-border dark:border-dark-border flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
                <div className="flex-shrink-0 -mt-16 md:mt-0">
                    <div className="w-24 h-24 bg-white dark:bg-dark-bg rounded-full flex items-center justify-center shadow">
                        <StarsIcon />
                    </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                    <h1 className="text-2xl md:text-3xl font-bold text-brand-text-dark dark:text-dark-text-dark">
                        สร้างรายได้ง่ายๆ กับ MeeLike Affiliate
                    </h1>
                    <p className="text-brand-text-light dark:text-dark-text-light mt-2">
                        รับค่าคอมมิชชั่น <strong className="text-brand-primary dark:text-dark-primary">5%</strong> จากทุกยอดเติมเงินของเพื่อนที่คุณแนะนำ
                    </p>
                </div>
                <div className="flex-shrink-0">
                     <button 
                        onClick={handleStartEarningClick}
                        className="w-full md:w-auto text-md font-semibold text-white bg-brand-accent dark:bg-dark-primary dark:text-brand-text-dark rounded-full px-8 py-4 hover:opacity-90 transition-opacity shadow-lg shadow-brand-accent/20 dark:shadow-dark-primary/20"
                     >
                        เริ่มต้นสร้างรายได้
                    </button>
                </div>
            </div>


            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <AffiliateStatCard title="Conversion Rate" value="0.00%" percentage="+0.00%" />
                <AffiliateStatCard title="Rate" value="5.00%" />
                <AffiliateStatCard title="Total Referrals" value="0" percentage="+0.00%" />
                <AffiliateStatCard title="Register" value="0" percentage="-0.00%" arrowUp={false} />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-8">
                 {/* Link and Steps Column */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Referral Link Card */}
                    <div ref={linkSectionRef} className={`bg-brand-surface dark:bg-dark-surface p-6 rounded-xl shadow-md border border-brand-border dark:border-dark-border scroll-mt-8 transition-all duration-300 ${isHighlighted ? 'highlight-animation' : ''}`}>
                        <h2 className="text-lg font-bold mb-4 flex items-center text-brand-text-dark dark:text-dark-text-dark">
                            <LinkIcon />
                            ลิงก์แนะนำของฉัน
                        </h2>
                        <div className="flex flex-col sm:flex-row gap-4 items-center">
                            <input 
                                type="text"
                                readOnly
                                value={referralLink}
                                className="w-full bg-brand-bg dark:bg-dark-bg border border-brand-border dark:border-dark-border rounded-lg py-4 px-4 font-mono text-sm"
                            />
                            <button 
                                onClick={() => navigator.clipboard.writeText(referralLink)}
                                className="flex-shrink-0 w-24 h-24 flex flex-col items-center justify-center text-md font-semibold text-white bg-brand-accent hover:opacity-90 dark:bg-dark-primary dark:text-brand-text-dark rounded-xl transition-opacity"
                            >
                                <CopyIcon />
                                <span>คัดลอก</span>
                            </button>
                        </div>
                    </div>
                     {/* 4 Steps Section -- โค้ดที่แก้ไข -- */}
                    <div className="bg-brand-surface dark:bg-dark-surface p-6 rounded-xl shadow-sm border border-brand-border dark:border-dark-border">
                        <h2 className="text-xl font-bold mb-6 text-center text-brand-text-dark dark:text-dark-text-dark">4 ขั้นตอนง่ายๆ</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StepCard number="1" title="คัดลอกลิงก์" description="คัดลอกลิงก์แนะนำของคุณ" />
                            <StepCard number="2" title="นำไปแชร์" description="แชร์ให้เพื่อนของคุณ" />
                            <StepCard number="3" title="เพื่อนสมัคร/เติมเงิน" description="เพื่อนสมัครและเติมเงิน" />
                            <StepCard number="4" title="รับค่าแนะนำ" description="รับ 5% (ขั้นต่ำ 10 บาท)" />
                        </div>
                    </div>
                </div>

                 {/* Summary and Terms Column */}
                <div className="lg:col-span-1 space-y-8 sticky top-8">
                    <div className="bg-brand-surface dark:bg-dark-surface p-6 rounded-xl shadow-md border border-brand-border dark:border-dark-border space-y-4">
                        <h2 className="text-lg font-bold text-brand-text-dark dark:text-dark-text-dark">สรุปยอดเงินค่าคอมมิชชั่น</h2>
                        <div className="space-y-3">
                             <div className="flex justify-between items-center border-b border-brand-border dark:border-dark-border pb-3">
                                <span className="text-sm text-brand-text-light dark:text-dark-text-light">ทั้งหมด</span>
                                <span className="font-bold text-lg text-brand-primary dark:text-dark-primary">฿0.00</span>
                             </div>
                             <div className="flex justify-between items-center border-b border-brand-border dark:border-dark-border pb-3">
                                <span className="text-sm text-brand-text-light dark:text-dark-text-light">รอทำจ่าย</span>
                                <span className="font-bold text-lg text-brand-text-dark dark:text-dark-text-dark">฿0.00</span>
                             </div>
                             <div className="flex justify-between items-center pb-2">
                                <span className="text-sm text-brand-text-light dark:text-dark-text-light">ได้รับแล้ว</span>
                                <span className="font-bold text-lg text-brand-text-dark dark:text-dark-text-dark">฿0.00</span>
                             </div>
                        </div>
                    </div>
                    <div className="bg-brand-surface dark:bg-dark-surface p-6 rounded-xl shadow-md border border-brand-border dark:border-dark-border">
                        <h2 className="text-lg font-bold mb-2 text-brand-text-dark dark:text-dark-text-dark">หลักการทำงานของค่าคอมมิชชั่น</h2>
                        <div className="text-sm text-brand-text-light dark:text-dark-text-light leading-relaxed space-y-3">
                            <p>
                                เริ่มต้นง่ายๆ เพียงคัดลอกลิงก์แนะนำของคุณและส่งต่อให้เพื่อน เมื่อเพื่อนของคุณสมัครสมาชิกและ <strong className="text-brand-text-dark dark:text-dark-text-light">เติมเงินครั้งแรก</strong> คุณจะได้รับค่าแนะนำทันที <strong className="text-brand-text-dark dark:text-dark-text-light">5%</strong>
                            </p>
                            <p>
                                เช่น: หากเพื่อนเติมเงิน <strong className="text-brand-text-dark dark:text-dark-text-light">1,000 บาท</strong> คุณจะได้รับค่าคอมมิชชั่น <strong className="text-brand-success">50 บาท</strong>
                            </p>
                             <p>
                                ยิ่งไปกว่านั้น คุณจะได้รับ <strong className="text-brand-success">5% จากทุกๆ ยอดการเติมเงิน</strong> ของเพื่อนคนนั้น ยิ่งแชร์มาก ยิ่งสร้างรายได้มากขึ้น!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}