// src/app/settings/page.tsx
"use client";

import React from 'react';

// --- Reusable Components ---
const SettingsCard = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="bg-brand-surface dark:bg-dark-surface p-6 rounded-xl shadow-md border border-brand-border dark:border-dark-border">
        <h2 className="text-xl font-bold text-brand-text-dark dark:text-dark-text-dark mb-6 pb-4 border-b border-brand-border dark:border-dark-border">{title}</h2>
        {children}
    </div>
);

const InputGroup = ({ label, id, type = 'text', value, placeholder }: { label: string, id: string, type?: string, value?: string, placeholder?: string }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-semibold text-brand-text-dark dark:text-dark-text-dark mb-2">{label}</label>
        <input
            type={type}
            id={id}
            defaultValue={value}
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


export default function ProfilePage() {
    return (
        <div className="space-y-8">
            {/* --- General Information Card --- */}
            <SettingsCard title="ข้อมูลทั่วไป">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputGroup label="ชื่อ" id="name" value="Saruth" />
                    <InputGroup label="อีเมล" id="email" type="email" value="saruth05@hotmail.co" />
                    <InputGroup label="ชื่อผู้ใช้งาน" id="username" value="saruth05" />
                </div>
                <SaveButton />
            </SettingsCard>
            
            {/* --- Billing Information Card --- */}
            <SettingsCard title="ข้อมูลการเรียกเก็บเงิน">
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputGroup label="ชื่อบริษัท" id="company_name" placeholder="กรอกชื่อบริษัทของคุณ" />
                        <InputGroup label="หมายเลขประจำตัวผู้เสียภาษี" id="tax_id" placeholder="กรอกหมายเลขประจำตัวผู้เสียภาษี" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <InputGroup label="ที่อยู่บรรทัดที่ 1" id="address1" placeholder="กรอกที่อยู่ของคุณ" />
                         <InputGroup label="ที่อยู่บรรทัดที่ 2" id="address2" placeholder="กรอกที่อยู่ของคุณ (ถ้ามี)" />
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                         <InputGroup label="จังหวัด" id="province" placeholder="กรอกจังหวัด" />
                         <InputGroup label="รหัสไปรษณีย์" id="zipcode" placeholder="กรอกรหัสไปรษณีย์" />
                         <InputGroup label="ประเทศ" id="country" placeholder="กรอกประเทศ" />
                    </div>
                </div>
                <SaveButton />
            </SettingsCard>
        </div>
    );
}