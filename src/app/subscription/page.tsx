"use client";

import React, { useState } from 'react';
import Link from 'next/link';

// Icons
const CheckIcon = () => (
  <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const XIcon = () => (
  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const BackIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const StarIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

type BillingPeriod = 'monthly' | 'yearly';

interface PlanFeature {
  name: string;
  free: boolean | string;
  boost: boolean | string;
  boostPlus: boolean | string;
}

const FEATURES: PlanFeature[] = [
  { name: 'บิลต่อเดือน', free: '50', boost: '300', boostPlus: 'ไม่จำกัด' },
  { name: 'ลูกค้า', free: '20', boost: '200', boostPlus: 'ไม่จำกัด' },
  { name: 'เปิดร้าน Public Store', free: true, boost: true, boostPlus: true },
  { name: 'ข้อความตอบกลับด่วน', free: '3', boost: '20', boostPlus: 'ไม่จำกัด' },
  { name: 'คูปองส่วนลด', free: false, boost: '5', boostPlus: 'ไม่จำกัด' },
  { name: 'Flash Sale', free: false, boost: false, boostPlus: true },
  { name: 'Loyalty Tiers', free: false, boost: false, boostPlus: true },
  { name: 'แจ้งเตือน In-App', free: true, boost: true, boostPlus: true },
  { name: 'แจ้งเตือน LINE', free: false, boost: true, boostPlus: true },
  { name: 'แจ้งเตือน Email', free: false, boost: false, boostPlus: true },
  { name: 'สถิติร้านค้า', free: 'พื้นฐาน', boost: 'ขั้นสูง', boostPlus: 'Pro' },
  { name: 'Custom URL ร้าน', free: false, boost: true, boostPlus: true },
  { name: 'ซ่อน MeeLike Branding', free: false, boost: false, boostPlus: true },
  { name: 'Priority Support', free: false, boost: false, boostPlus: true },
];

export default function SubscriptionPage() {
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('monthly');
  
  const prices = {
    free: { monthly: 0, yearly: 0 },
    boost: { monthly: 149, yearly: 1490 }, // 2 months free
    boostPlus: { monthly: 399, yearly: 3990 }, // 2 months free
  };

  const currentPlan = 'boost'; // Mock current plan

  return (
    <div className="min-h-screen bg-main">
      {/* Header */}
      <div className="bg-surface border-b border-default">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Link
            href="/agent"
            className="inline-flex items-center gap-2 text-secondary hover:text-primary transition-colors"
          >
            <BackIcon />
            <span>กลับ Agent Center</span>
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">
            เลือกแพ็คเกจที่เหมาะกับคุณ
          </h1>
          <p className="text-secondary">
            เริ่มต้นฟรี อัปเกรดได้ตลอดเวลา
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-surface rounded-xl p-1 border border-default inline-flex">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
                billingPeriod === 'monthly'
                  ? 'bg-brand-primary text-white'
                  : 'text-secondary hover:text-primary'
              }`}
            >
              รายเดือน
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
                billingPeriod === 'yearly'
                  ? 'bg-brand-primary text-white'
                  : 'text-secondary hover:text-primary'
              }`}
            >
              รายปี
              <span className="ml-1 text-xs text-green-500">ประหยัด 17%</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Free Plan */}
          <PlanCard
            name="Free"
            description="สำหรับเริ่มต้น"
            price={prices.free[billingPeriod]}
            period={billingPeriod}
            features={['50 บิล/เดือน', '20 ลูกค้า', 'Public Store', 'สถิติพื้นฐาน']}
            isCurrentPlan={currentPlan === 'free'}
            buttonText={currentPlan === 'free' ? 'แพ็คเกจปัจจุบัน' : 'เริ่มใช้ฟรี'}
            buttonDisabled={currentPlan === 'free'}
          />

          {/* Boost Plan */}
          <PlanCard
            name="Boost"
            description="สำหรับ Agent มืออาชีพ"
            price={prices.boost[billingPeriod]}
            period={billingPeriod}
            features={['300 บิล/เดือน', '200 ลูกค้า', 'แจ้งเตือน LINE', 'คูปอง 5 รายการ', 'สถิติขั้นสูง']}
            isPopular
            isCurrentPlan={currentPlan === 'boost'}
            buttonText={currentPlan === 'boost' ? 'แพ็คเกจปัจจุบัน' : 'สมัคร Boost'}
            buttonDisabled={currentPlan === 'boost'}
            badgeColor="bg-amber-500"
          />

          {/* Boost+ Plan */}
          <PlanCard
            name="Boost+"
            description="สำหรับธุรกิจขนาดใหญ่"
            price={prices.boostPlus[billingPeriod]}
            period={billingPeriod}
            features={['ไม่จำกัดบิล', 'ไม่จำกัดลูกค้า', 'Flash Sale', 'Loyalty Tiers', 'ซ่อน MeeLike Branding', 'Priority Support']}
            isCurrentPlan={currentPlan === 'boostPlus'}
            buttonText={currentPlan === 'boostPlus' ? 'แพ็คเกจปัจจุบัน' : 'สมัคร Boost+'}
            buttonDisabled={currentPlan === 'boostPlus'}
            badgeColor="bg-gradient-to-r from-purple-500 to-pink-500"
          />
        </div>

        {/* Feature Comparison */}
        <div className="bg-surface rounded-2xl border border-default overflow-hidden">
          <div className="p-6 border-b border-default">
            <h2 className="text-xl font-bold text-primary">เปรียบเทียบฟีเจอร์ทั้งหมด</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50">
                  <th className="text-left py-4 px-6 text-sm font-medium text-secondary">ฟีเจอร์</th>
                  <th className="text-center py-4 px-4 text-sm font-medium text-secondary">Free</th>
                  <th className="text-center py-4 px-4 text-sm font-medium text-amber-500">Boost</th>
                  <th className="text-center py-4 px-4 text-sm font-medium text-purple-500">Boost+</th>
                </tr>
              </thead>
              <tbody>
                {FEATURES.map((feature, index) => (
                  <tr key={feature.name} className={index % 2 === 0 ? '' : 'bg-gray-50/50 dark:bg-gray-800/30'}>
                    <td className="py-3 px-6 text-sm text-primary">{feature.name}</td>
                    <td className="py-3 px-4 text-center">
                      <FeatureValue value={feature.free} />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <FeatureValue value={feature.boost} />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <FeatureValue value={feature.boostPlus} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-primary text-center mb-6">คำถามที่พบบ่อย</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <FAQItem
              question="เปลี่ยนแพ็คเกจได้ตลอดเวลาหรือไม่?"
              answer="ได้ครับ คุณสามารถอัปเกรดหรือดาวน์เกรดแพ็คเกจได้ตลอดเวลา ระบบจะคำนวณส่วนต่างให้อัตโนมัติ"
            />
            <FAQItem
              question="ถ้าบิลเกินโควต้าจะเกิดอะไรขึ้น?"
              answer="ระบบจะแจ้งเตือนล่วงหน้าเมื่อใกล้ถึงโควต้า และคุณยังสามารถใช้งานได้ต่อไปแต่จะถูกจำกัดบางฟีเจอร์"
            />
            <FAQItem
              question="รองรับการชำระเงินอะไรบ้าง?"
              answer="รองรับ PromptPay, บัตรเครดิต/เดบิต, และ True Money Wallet"
            />
            <FAQItem
              question="มีทดลองใช้ฟรีหรือไม่?"
              answer="มีครับ! แพ็คเกจ Boost และ Boost+ มีทดลองใช้ฟรี 14 วัน ไม่ต้องผูกบัตร"
            />
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-secondary mb-4">
            มีคำถามเพิ่มเติม? ติดต่อเราได้เลย
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/tickets/create"
              className="px-6 py-2 border border-default rounded-lg text-secondary hover:text-primary hover:bg-hover transition-colors"
            >
              ส่งข้อความ
            </Link>
            <a
              href="https://line.me/ti/p/@meelike"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              LINE @meelike
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// Plan Card Component
function PlanCard({
  name,
  description,
  price,
  period,
  features,
  isPopular,
  isCurrentPlan,
  buttonText,
  buttonDisabled,
  badgeColor,
}: {
  name: string;
  description: string;
  price: number;
  period: BillingPeriod;
  features: string[];
  isPopular?: boolean;
  isCurrentPlan?: boolean;
  buttonText: string;
  buttonDisabled?: boolean;
  badgeColor?: string;
}) {
  return (
    <div
      className={`relative bg-surface rounded-2xl border-2 p-6 ${
        isPopular ? 'border-brand-primary shadow-lg' : 'border-default'
      }`}
    >
      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="px-3 py-1 bg-brand-primary text-white text-xs font-bold rounded-full flex items-center gap-1">
            <StarIcon />
            ยอดนิยม
          </span>
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-6">
        <span className={`inline-block px-3 py-1 text-xs font-bold text-white rounded-lg ${badgeColor || 'bg-gray-500'}`}>
          {name}
        </span>
        <p className="text-sm text-secondary mt-2">{description}</p>
        <div className="mt-4">
          <span className="text-4xl font-bold text-primary">฿{price.toLocaleString()}</span>
          <span className="text-secondary">/{period === 'monthly' ? 'เดือน' : 'ปี'}</span>
        </div>
      </div>

      {/* Features */}
      <ul className="space-y-3 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2 text-sm text-primary">
            <CheckIcon />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {/* Button */}
      <button
        disabled={buttonDisabled}
        className={`w-full py-3 rounded-lg font-semibold transition-colors ${
          isCurrentPlan
            ? 'bg-gray-100 text-gray-500 dark:bg-gray-800 cursor-not-allowed'
            : isPopular
            ? 'bg-brand-primary text-white hover:bg-brand-primary/90'
            : 'bg-gray-100 text-primary hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700'
        }`}
      >
        {buttonText}
      </button>
    </div>
  );
}

// Feature Value Component
function FeatureValue({ value }: { value: boolean | string }) {
  if (typeof value === 'boolean') {
    return value ? (
      <span className="inline-flex justify-center"><CheckIcon /></span>
    ) : (
      <span className="inline-flex justify-center"><XIcon /></span>
    );
  }
  return <span className="text-sm text-primary">{value}</span>;
}

// FAQ Item Component
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-surface rounded-xl border border-default">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 text-left flex items-center justify-between"
      >
        <span className="font-medium text-primary">{question}</span>
        <svg
          className={`w-5 h-5 text-secondary transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="px-4 pb-4">
          <p className="text-sm text-secondary">{answer}</p>
        </div>
      )}
    </div>
  );
}

