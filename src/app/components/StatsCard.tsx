// src/app/components/StatsCard.tsx
import React from 'react';

// Define the types for the component's props
interface StatsCardProps {
  title: string;
  value: string;
  buttonText: string;
  buttonType?: 'primary' | 'secondary';
  icon?: React.ReactNode; // <-- เพิ่ม Prop สำหรับไอคอน
}

export default function StatsCard({ title, value, buttonText, buttonType = 'primary', icon }: StatsCardProps) {
    const primaryButtonClasses = "text-white bg-brand-primary dark:bg-dark-primary dark:text-brand-text-dark hover:opacity-90";
    const secondaryButtonClasses = "text-brand-primary dark:text-dark-primary hover:bg-brand-bg dark:hover:bg-dark-bg border border-brand-primary dark:border-dark-primary";

    // --- Logic สำหรับแยกตัวเลขและข้อความออกจากกัน ---
    const match = value.match(/(\d[\d,.]*)\s*(.*)/);
    let numberPart: string | null = null;
    let textPart: string | null = null;

    if (match) {
        numberPart = match[1];
        textPart = match[2];
    } else {
        numberPart = value; // ถ้าไม่เจอรูปแบบ ก็ให้แสดง value เต็มๆ
    }

    return (
        <div className="bg-brand-surface dark:bg-dark-surface p-6 rounded-xl shadow-md border border-brand-border dark:border-dark-border flex flex-col justify-between h-full">
            <div>
                <div className="flex items-center text-brand-text-light dark:text-dark-text-light">
                    {icon && <span className="mr-2">{icon}</span>}
                    <p className="text-sm font-medium">{title}</p>
                </div>
                <div className="mt-2 flex items-baseline space-x-2">
                    <p className="text-4xl font-bold text-brand-text-dark dark:text-dark-text-dark">{numberPart}</p>
                    {textPart && <p className="text-md font-medium text-brand-text-light dark:text-dark-text-light">{textPart}</p>}
                </div>
            </div>
            <a href="#" className={`text-sm font-semibold mt-4 self-start rounded-full px-4 py-2 transition-colors ${buttonType === 'primary' ? primaryButtonClasses : secondaryButtonClasses}`}>
                {buttonText}
            </a>
        </div>
    );
}