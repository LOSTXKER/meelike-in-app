// src/app/settings/2fa/page.tsx
"use client";
import React from 'react';

const SettingsCard = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="bg-brand-surface dark:bg-dark-surface p-6 rounded-xl shadow-md border border-brand-border dark:border-dark-border">
        <h2 className="text-xl font-bold text-brand-text-dark dark:text-dark-text-dark mb-6 pb-4 border-b border-brand-border dark:border-dark-border">{title}</h2>
        {children}
    </div>
);

export default function TwoFactorAuthPage() {
    return (
         <SettingsCard title="ยกระดับความปลอดภัยให้บัญชีของคุณ">
            <p className="text-brand-text-light dark:text-dark-text-light mb-6 leading-relaxed">
                เปิดใช้งานการยืนยันตัวตนสองขั้นตอน (2FA) เพื่อเพิ่มเกราะป้องกันให้กับบัญชีของคุณอีกชั้น ทุกครั้งที่เข้าสู่ระบบ นอกจากรหัสผ่านแล้ว คุณจะต้องกรอกรหัสที่สร้างขึ้นใหม่จากแอปพลิเคชันบนมือถือของคุณ ซึ่งจะช่วยป้องกันการเข้าถึงบัญชีโดยไม่ได้รับอนุญาตได้อย่างมีประสิทธิภาพ
            </p>
            <div className="flex justify-end mt-6">
                <button className="text-md font-semibold text-white bg-brand-primary dark:bg-dark-primary dark:text-brand-text-dark rounded-full px-8 py-3 hover:opacity-90 transition-opacity">
                    เปิดใช้งาน 2FA
                </button>
            </div>
        </SettingsCard>
    );
}