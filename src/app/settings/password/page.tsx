// src/app/settings/password/page.tsx
"use client";
import React from 'react';

// Reusing components from the profile page for consistency
const SettingsCard = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="bg-brand-surface dark:bg-dark-surface p-6 rounded-xl shadow-md border border-brand-border dark:border-dark-border">
        <h2 className="text-xl font-bold text-brand-text-dark dark:text-dark-text-dark mb-6 pb-4 border-b border-brand-border dark:border-dark-border">{title}</h2>
        {children}
    </div>
);

const InputGroup = ({ label, id, placeholder }: { label: string, id: string, placeholder: string }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-semibold text-brand-text-dark dark:text-dark-text-dark mb-2">{label}</label>
        <input
            type="password"
            id={id}
            placeholder={placeholder}
            className="w-full bg-brand-bg dark:bg-dark-bg border border-brand-border dark:border-dark-border rounded-lg py-2.5 px-4 focus:ring-2 focus:ring-brand-primary focus:outline-none"
        />
    </div>
);

const SaveButton = () => (
    <div className="flex justify-end mt-6">
        <button className="text-md font-semibold text-white bg-brand-primary dark:bg-dark-primary dark:text-brand-text-dark rounded-full px-8 py-3 hover:opacity-90 transition-opacity">
            บันทึก
        </button>
    </div>
);

export default function PasswordPage() {
    return (
        <SettingsCard title="รหัสผ่าน">
            <div className="max-w-md mx-auto space-y-6">
                <InputGroup label="รหัสผ่านปัจจุบัน" id="current_password" placeholder="กรอกรหัสผ่านปัจจุบันของคุณ" />
                <InputGroup label="รหัสผ่านใหม่" id="new_password" placeholder="กรอกรหัสผ่านใหม่" />
                <InputGroup label="ยืนยันรหัสผ่านใหม่" id="confirm_password" placeholder="ยืนยันรหัสผ่านใหม่ของคุณ" />
            </div>
            <SaveButton />
        </SettingsCard>
    );
}