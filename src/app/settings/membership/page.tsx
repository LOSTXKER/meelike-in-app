// src/app/settings/membership/page.tsx
"use client";

import React from 'react';

// --- อัปเดตข้อมูลระดับสมาชิก (นำ features ออก) ---
const membershipTiers = [
    {
        name: "ลูกหมี",
        requirement: "ระดับเริ่มต้นสำหรับสมาชิกใหม่",
        discount: 0,
        imageUrl: "https://placehold.co/100x100/FCD77F/473B30?text=🐻",
        spendThreshold: 0,
    },
    {
        name: "น้องหมี",
        requirement: "สมัครตัวแทนเพื่อรับ",
        discount: 3,
        imageUrl: "https://placehold.co/100x100/FDE8BD/473B30?text=😊",
        spendThreshold: 0, // This is a special tier, not based on spending
    },
    {
        name: "พี่หมี",
        requirement: "ใช้จ่ายครบ 10,000 บาท",
        discount: 5,
        imageUrl: "https://placehold.co/100x100/A6CDE3/FFFFFF?text=💪",
        spendThreshold: 10000,
    },
    {
        name: "พ่อหมี",
        requirement: "ใช้จ่ายครบ 50,000 บาท",
        discount: 7,
        imageUrl: "https://placehold.co/100x100/937058/FFFFFF?text=😎",
        spendThreshold: 50000,
    },
    {
        name: "เทพหมี",
        requirement: "ใช้จ่ายครบ 100,000 บาท",
        discount: 10,
        imageUrl: "https://placehold.co/100x100/BC4749/FFFFFF?text=👑",
        spendThreshold: 100000,
    },
];

// --- Sub-Components ---
const MembershipCard = ({ tier, isActive }: { tier: typeof membershipTiers[0], isActive: boolean }) => (
    <div className={`relative bg-brand-surface dark:bg-dark-surface p-6 rounded-2xl shadow-md border border-brand-border dark:border-dark-border flex flex-col justify-center text-center transition-transform hover:-translate-y-1 ${isActive ? 'border-2 border-brand-primary dark:border-dark-primary' : ''}`}>
        {isActive && (
            <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-brand-primary dark:bg-dark-primary text-white dark:text-brand-text-dark text-xs font-bold px-3 py-1 rounded-full">
                ระดับของคุณ
            </div>
        )}
        <img src={tier.imageUrl} alt={tier.name} className="w-24 h-24 rounded-full mx-auto mb-4" />
        <h3 className="text-xl font-bold text-brand-text-dark dark:text-dark-text-dark">{tier.name}</h3>
        <p className="text-sm text-brand-text-light dark:text-dark-text-light mt-1 h-10 flex items-center justify-center">{tier.requirement}</p>
        {tier.discount > 0 ? (
             <p className="text-lg font-bold text-brand-error my-2">ส่วนลด {tier.discount}%</p>
        ) : (
            <p className="text-lg font-bold text-brand-text-light dark:text-dark-text-light my-2">ไม่มีส่วนลด</p>
        )}
    </div>
);


export default function MembershipPage() {
    // Dummy data for user's current status
    const currentUserSpend = 1250; // Example: User has spent 1,250 THB
    const currentUserTier = membershipTiers.slice().reverse().find(tier => currentUserSpend >= tier.spendThreshold && tier.name !== "น้องหมี") || membershipTiers[0];
    const nextTierIndex = membershipTiers.findIndex(tier => tier.spendThreshold > currentUserSpend && tier.name !== "น้องหมี");
    const nextTier = nextTierIndex !== -1 ? membershipTiers[nextTierIndex] : null;

    const progressPercentage = nextTier ? (currentUserSpend / nextTier.spendThreshold) * 100 : 100;
    const remainingSpend = nextTier ? nextTier.spendThreshold - currentUserSpend : 0;

    return (
        <div className="space-y-8">
            {/* --- Current Status Card --- */}
            <div className="bg-brand-surface dark:bg-dark-surface p-6 rounded-2xl shadow-lg border-t-4 border-brand-primary dark:border-dark-primary">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                    
                    {/* --- Left Column: Current Tier --- */}
                    <div className="md:col-span-1">
                        <h2 className="text-sm uppercase font-bold text-brand-primary dark:text-dark-primary">ระดับสมาชิกปัจจุบัน</h2>
                        <p className="text-3xl font-bold text-brand-text-dark dark:text-dark-text-dark mt-1">{currentUserTier.name}</p>
                        <p className="text-lg font-bold text-brand-error">ส่วนลดปัจจุบัน: {currentUserTier.discount}%</p>
                    </div>

                    {/* --- Middle Column: Spend Progress --- */}
                    <div className="md:col-span-2">
                        {nextTier ? (
                            <>
                                <div className="flex justify-between items-center text-sm mb-1">
                                    <span className="text-brand-text-light dark:text-dark-text-light">เป้าหมายสู่ระดับ <span className="font-bold text-brand-text-dark dark:text-dark-text-dark">{nextTier.name}</span></span>
                                    <span className="font-semibold text-brand-text-dark dark:text-dark-text-dark">{currentUserSpend.toLocaleString()} / {nextTier.spendThreshold.toLocaleString()}</span>
                                </div>
                                <div className="w-full bg-brand-bg dark:bg-dark-bg rounded-full h-4 border border-brand-border dark:border-dark-border overflow-hidden">
                                    <div className="bg-brand-secondary dark:bg-dark-primary h-full rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
                                </div>
                                <p className="text-sm text-brand-text-light dark:text-dark-text-light mt-2 text-right">
                                    ใช้จ่ายอีก <strong className="text-xl font-bold text-brand-success">฿{remainingSpend.toLocaleString()}</strong> เพื่อรับส่วนลด <strong className="text-xl font-bold text-brand-error">{nextTier.discount}%</strong>
                                </p>
                            </>
                        ) : (
                            <p className="font-semibold text-brand-success text-center text-lg">🎉 คุณอยู่ในระดับสูงสุดแล้ว!</p>
                        )}
                    </div>
                </div>
            </div>

            {/* --- All Tiers Display --- */}
            <div>
                 <h2 className="text-2xl font-bold text-brand-text-dark dark:text-dark-text-dark mb-6">ระดับสมาชิกทั้งหมด</h2>
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                    {membershipTiers.map(tier => (
                        <MembershipCard 
                            key={tier.name}
                            tier={tier}
                            isActive={currentUserTier.name === tier.name}
                        />
                    ))}
                 </div>
            </div>
        </div>
    );
}