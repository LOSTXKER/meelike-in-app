// src/app/page.tsx
"use client";

import React, { useState } from 'react';
import Link from 'next/link'; 
import dynamic from 'next/dynamic';
import Table from './components/Table';

// Dynamic imports
const ChartComponent = dynamic(() => import('./components/ChartComponent'), { ssr: false });
const DashboardSurveyBanner = dynamic(() => import('./components/DashboardSurveyBanner'), { ssr: false });
const DashboardLeaderboard = dynamic(() => import('./components/DashboardLeaderboard'), { ssr: false });
const DailyLoginWidget = dynamic(() => import('./components/DailyLoginWidget'), { ssr: false }); 

// --- Icons ---
const CheckIcon = () => <svg className="w-5 h-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>;
const WalletIcon = () => <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M2.5 4A1.5 1.5 0 001 5.5V6h18v-.5A1.5 1.5 0 0017.5 4h-15zM19 7.5H1V14a1 1 0 001 1h16a1 1 0 001-1V7.5z" /></svg>;
const SparklesIcon = () => <svg className="w-5 h-5 text-pink-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.868 2.884c.321-.772 1.308-.772 1.629 0l1.378 3.318a1 1 0 00.95.69l3.457.502c.81.118 1.135 1.106.544 1.68l-2.502 2.438a1 1 0 00-.287.95l.59 3.444c.14 1.087-.923 1.91-1.68 1.403l-3.091-1.625a1 1 0 00-1.053 0l-3.091 1.625c-.757.497-1.82-.316-1.68-1.403l.59-3.444a1 1 0 00-.287-.95l-2.502-2.438c-.59-.574-.266-1.562.544-1.68l3.457-.502a1 1 0 00.95-.69l1.378-3.318z" clipRule="evenodd" /></svg>;
const CogIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /></svg>;
const GiftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 5a3 3 0 013-3h4a3 3 0 013 3v1h1a1 1 0 011 1v4a1 1 0 01-1 1H4a1 1 0 01-1-1V7a1 1 0 011-1h1V5zm4 0a1 1 0 00-1 1v1h2V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>;
const TicketIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 100 4v2a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" /></svg>;
const StarIconSmall = () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>;


const ActivityItem = ({ icon, title, time }: { icon: React.ReactNode, title: React.ReactNode, time: string }) => (
    <li className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-0.5">{icon}</div>
        <div className="flex-1 min-w-0">
            <p className="text-sm text-brand-text-dark dark:text-dark-text-dark">{title}</p>
            <p className="text-xs text-brand-text-light dark:text-dark-text-light">{time}</p>
        </div>
    </li>
);

// Quick Stat Card - Compact version using brand colors
const QuickStatCard = ({ icon, label, value, unit }: { 
    icon: React.ReactNode, 
    label: string, 
    value: string, 
    unit: string
}) => (
    <div className="bg-white dark:bg-dark-surface p-4 rounded-xl border border-brand-border dark:border-dark-border">
        <div className="flex items-center gap-2 mb-2">
            <span className="text-brand-primary dark:text-dark-primary">{icon}</span>
            <span className="text-sm font-medium text-brand-text-light dark:text-dark-text-light">{label}</span>
        </div>
        <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-brand-text-dark dark:text-dark-text-dark">{value}</span>
            <span className="text-sm text-brand-text-light dark:text-dark-text-light">{unit}</span>
        </div>
    </div>
);

// --- Tier Data ---
const membershipTiers = [
    { name: "ลูกหมี", discount: 0, spendThreshold: 0 },
    { name: "น้องหมี", discount: 3, spendThreshold: 0 },
    { name: "พี่หมี", discount: 5, spendThreshold: 10000 },
    { name: "พ่อหมี", discount: 7, spendThreshold: 50000 },
    { name: "เทพหมี", discount: 10, spendThreshold: 100000 },
];

const MembershipCard = () => {
    const currentUserSpend = 1250; 
    const currentUserTier = membershipTiers.slice().reverse().find(tier => currentUserSpend >= tier.spendThreshold && tier.name !== "น้องหมี") || membershipTiers[0];
    const nextTierIndex = membershipTiers.findIndex(tier => tier.spendThreshold > currentUserSpend && tier.name !== "น้องหมี");
    const nextTier = nextTierIndex !== -1 ? membershipTiers[nextTierIndex] : null;
    const remainingSpend = nextTier ? nextTier.spendThreshold - currentUserSpend : 0;
    const progress = nextTier ? (currentUserSpend / nextTier.spendThreshold) * 100 : 100;

    return (
        <Link href="/settings/membership" className="block">
            <div className="bg-white dark:bg-dark-surface p-4 rounded-xl border border-gray-200 dark:border-dark-border shadow-sm transition-all duration-300 hover:shadow-md hover:border-amber-400 dark:hover:border-amber-600 cursor-pointer">
                <div className="flex items-center gap-4">
                    {/* Avatar/Icon */}
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-2xl shadow-md">
                        🐻
                    </div>
                    
                    {/* Main Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                            <span className="font-bold text-gray-800 dark:text-white text-lg">{currentUserTier.name}</span>
                            <span className="text-xs bg-gradient-to-r from-red-500 to-pink-500 text-white px-2.5 py-0.5 rounded-full font-bold shadow-sm">
                                {currentUserTier.discount}% OFF
                            </span>
                        </div>
                        {/* Progress Bar */}
                        <div className="flex items-center gap-3">
                            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                                <div className="bg-gradient-to-r from-amber-400 to-orange-500 h-full rounded-full transition-all shadow-sm" style={{ width: `${progress}%` }}></div>
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400 font-semibold whitespace-nowrap">
                                {currentUserSpend.toLocaleString()} / {nextTier ? nextTier.spendThreshold.toLocaleString() : 'MAX'}
                            </span>
                        </div>
                    </div>

                    {/* Next Tier Info */}
                    {nextTier && (
                        <div className="hidden sm:flex items-center gap-3 flex-shrink-0 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-lg border border-emerald-200 dark:border-emerald-800/30">
                            <div className="text-right">
                                <p className="text-xs text-gray-600 dark:text-gray-400">ใช้จ่ายอีก <span className="font-bold text-emerald-600 dark:text-emerald-400">฿{remainingSpend.toLocaleString()}</span></p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">เพื่อรับส่วนลด <span className="font-bold text-red-500">{nextTier.discount}%</span></p>
                            </div>
                        </div>
                    )}

                    {/* Arrow */}
                    <svg className="w-5 h-5 text-amber-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            </div>
        </Link>
    );
};


export default function DashboardPage() {
  const [activeFilter, setActiveFilter] = useState<'7d' | '30d' | '1y'>('30d');

  const tableHeaders = [
    { label: 'บริการ', align: 'left' as const },
    { label: 'หมวดหมู่', align: 'left' as const },
    { label: 'จำนวนรายการ', align: 'center' as const },
    { label: 'ยอดค่าใช้จ่าย', align: 'right' as const }
  ];

  return (
    <main className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold">สวัสดี, Saruth! 🐻</h2>
        <p className="text-brand-text-light dark:text-dark-text-light mt-1 text-sm">ภาพรวมบัญชีของคุณในวันนี้</p>
      </div>

      {/* Announcement */}
      <div className="bg-yellow-50 dark:bg-dark-surface p-3 rounded-lg border-l-4 border-yellow-400 dark:border-dark-primary flex items-center shadow-sm mb-6">
        <svg className="w-5 h-5 text-yellow-600 dark:text-dark-primary mr-3 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M8.257 3.099c.636-1.21 2.27-1.21 2.906 0l4.5 8.625c.636 1.21-.24 2.776-1.453 2.776H5.204c-1.213 0-2.089-1.566-1.453-2.776l4.5-8.625zM10 14a1 1 0 100-2 1 1 0 000 2zm0-7a1 1 0 011 1v2a1 1 0 11-2 0V8a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
        <p className="text-sm text-yellow-800 dark:text-dark-text-light font-medium">
            <span className="font-bold">ประกาศ:</span> โปรโมชั่นเติมเงิน รับโบนัสเพิ่ม 10% ทันที!
        </p>
      </div>

      {/* Survey Banner */}
      <div className="mb-6">
        <DashboardSurveyBanner onOpenSurvey={() => {
            window.dispatchEvent(new CustomEvent('openSurveyModal'));
        }} />
      </div>

      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row gap-6 mb-6">
          {/* Left Column: Main Content */}
          <div className="lg:w-2/3 space-y-5">
              {/* Membership Banner */}
              <MembershipCard />
              
              {/* Quick Stats - Compact Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <QuickStatCard icon={<CogIcon />} label="กำลังดำเนินการ" value="0" unit="รายการ" />
                  <QuickStatCard icon={<WalletIcon />} label="ยอดเงินคงเหลือ" value="1,250" unit="THB" />
                  <QuickStatCard icon={<GiftIcon />} label="ค่าคอมมิชชั่น" value="0" unit="THB" />
                  <QuickStatCard icon={<TicketIcon />} label="ตั๋วที่เปิดอยู่" value="0" unit="ตั๋ว" />
              </div>

              {/* Chart - Spending */}
              <div className="bg-white dark:bg-dark-surface p-5 rounded-xl border border-brand-border dark:border-dark-border">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4">
                      <h3 className="text-base font-semibold mb-2 sm:mb-0 text-brand-text-dark dark:text-dark-text-dark">📊 ยอดค่าใช้จ่าย</h3>
                      <div className="flex space-x-1 bg-brand-bg dark:bg-dark-bg p-1 rounded-lg self-start">
                          {(['7d', '30d', '1y'] as const).map((filter) => (
                              <button key={filter} onClick={() => setActiveFilter(filter)} className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${ activeFilter === filter ? 'bg-white dark:bg-dark-surface shadow text-brand-text-dark dark:text-dark-text-dark' : 'text-brand-text-light dark:text-dark-text-light' }`}>
                                  {filter === '7d' ? '7 วัน' : filter === '30d' ? '30 วัน' : '1 ปี'}
                              </button>
                          ))}
                      </div>
                  </div>
                  <div className="h-72">
                      <ChartComponent filter={activeFilter} />
                  </div>
              </div>

              {/* Activity + Pending Reviews + Badges */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Recent Activity */}
                  <div className="bg-white dark:bg-dark-surface p-5 rounded-xl border border-brand-border dark:border-dark-border">
                      <h3 className="text-base font-semibold mb-4 text-brand-text-dark dark:text-dark-text-dark">ความเคลื่อนไหวล่าสุด</h3>
                      <ul className="space-y-3">
                          <ActivityItem
                              icon={<div className="p-1.5 bg-brand-secondary/20 dark:bg-dark-primary/20 rounded-full"><CheckIcon /></div>}
                              title={<><span className="font-semibold">ออเดอร์ #12345</span> สำเร็จแล้ว</>}
                              time="2 นาทีที่แล้ว"
                          />
                          <ActivityItem
                              icon={<div className="p-1.5 bg-brand-secondary/20 dark:bg-dark-primary/20 rounded-full"><WalletIcon /></div>}
                              title={<><span className="font-semibold">เติมเงิน 500 บาท</span> สำเร็จแล้ว</>}
                              time="1 ชั่วโมงที่แล้ว"
                          />
                          <ActivityItem
                              icon={<div className="p-1.5 bg-brand-secondary/20 dark:bg-dark-primary/20 rounded-full"><SparklesIcon /></div>}
                              title={<>ได้รับเหรียญ <span className="font-semibold">"First Top-up"</span></>}
                              time="1 ชั่วโมงที่แล้ว"
                          />
                      </ul>
                  </div>

                  {/* Pending Reviews */}
                  <div className="bg-white dark:bg-dark-surface p-5 rounded-xl border border-brand-border dark:border-dark-border">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-base font-semibold text-brand-text-dark dark:text-dark-text-dark">รอรีวิว</h3>
                      <span className="bg-brand-secondary/20 dark:bg-dark-primary/20 text-brand-text-dark dark:text-dark-text-dark text-xs font-bold px-2 py-0.5 rounded-full">3</span>
                    </div>
                    <div className="space-y-2">
                        {/* Review Item */}
                        <Link href="/history" className="flex items-center justify-between p-2.5 bg-brand-bg dark:bg-dark-bg rounded-lg hover:bg-brand-secondary/10 dark:hover:bg-dark-primary/10 transition-colors group">
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-brand-text-dark dark:text-dark-text-dark truncate">#12345</p>
                                <p className="text-xs text-brand-text-light dark:text-dark-text-light">เพิ่มไลค์ Facebook</p>
                            </div>
                            <div className="flex items-center gap-1 text-brand-secondary dark:text-dark-primary">
                                <StarIconSmall />
                                <span className="text-xs font-bold">+0.25</span>
                            </div>
                        </Link>
                        <Link href="/history" className="flex items-center justify-between p-2.5 bg-brand-bg dark:bg-dark-bg rounded-lg hover:bg-brand-secondary/10 dark:hover:bg-dark-primary/10 transition-colors group">
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-brand-text-dark dark:text-dark-text-dark truncate">#12344</p>
                                <p className="text-xs text-brand-text-light dark:text-dark-text-light">เพิ่มผู้ติดตาม IG</p>
                            </div>
                            <div className="flex items-center gap-1 text-brand-secondary dark:text-dark-primary">
                                <StarIconSmall />
                                <span className="text-xs font-bold">+0.25</span>
                            </div>
                        </Link>
                        <Link href="/history" className="flex items-center justify-between p-2.5 bg-brand-bg dark:bg-dark-bg rounded-lg hover:bg-brand-secondary/10 dark:hover:bg-dark-primary/10 transition-colors group">
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-brand-text-dark dark:text-dark-text-dark truncate">#12343</p>
                                <p className="text-xs text-brand-text-light dark:text-dark-text-light">เพิ่มวิว TikTok</p>
                            </div>
                            <div className="flex items-center gap-1 text-brand-secondary dark:text-dark-primary">
                                <StarIconSmall />
                                <span className="text-xs font-bold">+0.25</span>
                            </div>
                        </Link>
                    </div>
                    <Link href="/history" className="mt-3 block text-center text-sm font-medium text-brand-primary dark:text-dark-primary hover:underline">
                      ดูทั้งหมด →
                    </Link>
                  </div>

                  {/* Badges */}
                  <div className="bg-white dark:bg-dark-surface p-5 rounded-xl border border-brand-border dark:border-dark-border">
                    <h3 className="text-base font-semibold mb-4 text-brand-text-dark dark:text-dark-text-dark">เหรียญรางวัล</h3>
                    <div className="grid grid-cols-2 gap-3 text-center">
                        <div className="p-3 bg-brand-secondary/10 dark:bg-dark-primary/10 rounded-xl">
                            <div className="text-3xl">🏆</div><p className="text-xs mt-1.5 font-medium text-brand-text-light dark:text-dark-text-light">มือใหม่</p>
                        </div>
                        <div className="p-3 bg-brand-secondary/10 dark:bg-dark-primary/10 rounded-xl">
                            <div className="text-3xl">🥇</div><p className="text-xs mt-1.5 font-medium text-brand-text-light dark:text-dark-text-light">ออเดอร์แรก</p>
                        </div>
                        <div className="p-3 bg-brand-bg dark:bg-dark-bg rounded-xl opacity-50">
                            <div className="text-3xl grayscale">🎖️</div><p className="text-xs mt-1.5 font-medium text-brand-text-light dark:text-dark-text-light">100 ออเดอร์</p>
                        </div>
                        <div className="p-3 bg-brand-bg dark:bg-dark-bg rounded-xl opacity-50">
                            <div className="text-3xl grayscale">🏅</div><p className="text-xs mt-1.5 font-medium text-brand-text-light dark:text-dark-text-light">Gold Bear</p>
                        </div>
                    </div>
                  </div>
              </div>
          </div>
          
          {/* Right Column: Daily Login + Leaderboard */}
          <div className="lg:w-1/3 space-y-4">
              <DailyLoginWidget />
              <DashboardLeaderboard />
          </div>
      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-dark-surface p-5 rounded-xl border border-brand-border dark:border-dark-border">
          <h3 className="text-base font-semibold mb-4 text-brand-text-dark dark:text-dark-text-dark">📋 บริการที่สั่งซื้อมากที่สุด</h3>
          <Table headers={tableHeaders}>
              <tr className="border-b border-brand-border dark:border-dark-border">
                  <td className="px-4 py-3 font-medium whitespace-nowrap text-left text-sm">เพิ่มไลค์ Facebook (คนไทย)</td>
                  <td className="px-4 py-3 text-left text-sm">Facebook</td>
                  <td className="px-4 py-3 text-center text-sm">15</td>
                  <td className="px-4 py-3 text-right text-sm">THB 1,250.00</td>
              </tr>
              <tr className="border-b border-brand-border dark:border-dark-border">
                  <td className="px-4 py-3 font-medium whitespace-nowrap text-left text-sm">เพิ่มผู้ติดตาม Instagram</td>
                  <td className="px-4 py-3 text-left text-sm">Instagram</td>
                  <td className="px-4 py-3 text-center text-sm">12</td>
                  <td className="px-4 py-3 text-right text-sm">THB 980.00</td>
              </tr>
              <tr>
                  <td className="px-4 py-3 font-medium whitespace-nowrap text-left text-sm">เพิ่มวิววิดีโอ TikTok</td>
                  <td className="px-4 py-3 text-left text-sm">TikTok</td>
                  <td className="px-4 py-3 text-center text-sm">10</td>
                  <td className="px-4 py-3 text-right text-sm">THB 750.00</td>
              </tr>
          </Table>
      </div>
    </main>
  );
}
