# MeeLike - SMM Panel Dashboard

> บริการเพิ่มผู้ติดตาม Social Media ครบวงจร

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

---

> [!IMPORTANT]
> ## Prototype Project
> 
> นี่คือ **Prototype** สำหรับทดสอบและพัฒนา UI/UX ก่อนนำไปใช้งานจริง
> 
> **ข้อจำกัด:**
> - ใช้ **localStorage** เก็บข้อมูล (Mock Data)
> - ยังไม่มี Backend API จริง
> - ยังไม่มีระบบ Authentication จริง
> - ยังไม่มีระบบชำระเงินจริง
> 
> **วัตถุประสงค์:**
> - ทดสอบ User Flow และ UX
> - ออกแบบ UI Components
> - วางแผนโครงสร้างระบบ
> - เตรียม Production-ready codebase

---

## Overview

MeeLike เป็น SMM Panel ที่ให้บริการเพิ่มผู้ติดตาม, ไลค์, วิว และ engagement ต่างๆ บน Social Media platforms

### Architecture (Shopee Style)

```
MeeLike (User Mode)              MeeLike Agent (Agent Mode)
meelike.com/                     meelike.com/agent/
├── สั่งซื้อบริการ                 ├── สร้างบิลให้ลูกค้า
├── ประวัติออเดอร์                ├── จัดการลูกค้า
└── เติมเงิน                      └── ดูรายได้/กำไร

→ แยก Layout เหมือน Shopee/Seller Center
→ Same codebase, login ครั้งเดียว switch ได้
```

### Key Features

**User Mode (สำหรับผู้ใช้ทั่วไป):**
- สั่งซื้อบริการ - Facebook, Instagram, TikTok, YouTube, Twitter และอื่นๆ
- ระบบเติมเงิน - PromptPay, บัตรเครดิต, โอนเงิน
- Daily Login Bonus - รับโบนัสทุกวันที่เข้าใช้งาน
- Referral System - แนะนำเพื่อน รับค่าคอมมิชชั่น
- Tier System - ส่วนลดตามยอดใช้จ่าย (ลูกหมี → เทพหมี)

**Agent Mode (สำหรับตัวแทนจำหน่าย):** *(Coming Soon)*
- Bill System - สร้างบิล/ใบเสนอราคาให้ลูกค้า
- Client Management - จัดการลูกค้าของตัวเอง
- Revenue Dashboard - ดูรายได้และกำไร
- Public Bill Link - ลูกค้าดูบิลและเช็คสถานะได้

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 15** | React Framework (App Router) |
| **TypeScript** | Type Safety |
| **Tailwind CSS** | Styling |
| **Framer Motion** | Animations |
| **localStorage** | Mock Data Storage |

---

## UI Guidelines

> [!WARNING]
> **ต้องใช้ธีมสีของเว็บเท่านั้น!** ห้ามสร้างสีใหม่เอง

### Icon & Emoji Policy

| Do | Don't |
|-------|---------|
| ใช้ **Icon** จาก Heroicons, Lucide หรือ SVG | ใช้ Emoji ในหน้าเว็บ |
| ใช้ `<IconName className="w-5 h-5" />` | ใช้ "😀", "🎉", "✅" ใน UI |
| สร้าง Icon components ใน `/components/icons/` | ใส่ Emoji ใน button, badge, heading |

**ตัวอย่าง:**

```tsx
// ✅ ถูกต้อง - ใช้ Icon
import { CheckCircleIcon } from '@heroicons/react/24/solid';

<span className="badge badge-success">
  <CheckCircleIcon className="w-4 h-4" />
  สำเร็จ
</span>

// ❌ ผิด - ใช้ Emoji
<span className="badge badge-success">
  ✅ สำเร็จ
</span>
```

### Color System

ระบบสีใช้ **CSS Variables** ที่เปลี่ยนตาม theme อัตโนมัติ (Light/Dark)

**ดูรายละเอียดใน:**
- `src/app/globals.css` - CSS Variables & Utility Classes
- `tailwind.config.ts` - Tailwind Colors
- `src/app/styles/COLOR_SYSTEM.md` - Reference Guide

### Semantic Colors (แนะนำ)

```tsx
// ✅ แนะนำ: ใช้ Semantic Colors (เปลี่ยนตาม theme อัตโนมัติ)
<div className="bg-surface text-primary border border-default">
  ใช้ได้ทั้ง Light และ Dark mode!
</div>

// ❌ ไม่แนะนำ: ต้องใส่ dark: เอง
<div className="bg-brand-surface dark:bg-dark-surface">
  ต้องใส่ dark: ทุกที่
</div>
```

| Category | Classes |
|----------|---------|
| **Background** | `bg-main`, `bg-surface`, `bg-surface-hover` |
| **Text** | `text-primary`, `text-secondary`, `text-muted` |
| **Brand** | `bg-brand`, `bg-accent`, `text-brand` |
| **Border** | `border-default`, `border-light` |
| **Status** | `bg-success`, `bg-warning`, `bg-error`, `bg-info` |

### Contrast Guidelines (สำคัญ!)

เมื่อใช้ background สีเข้ม ต้องใช้ **text-on-*** ที่ตรงกัน:

| Background | Text Class | ผลลัพธ์ |
|------------|------------|--------|
| `bg-brand` | `text-on-brand` | Light: ครีม, Dark: ดำ |
| `bg-accent` | `text-on-accent` | Light: น้ำตาล, Dark: ครีม |
| `bg-warning` | `text-on-warning` | น้ำตาลเข้ม/ดำ (ไม่ใช่ขาว!) |
| `bg-success` | `text-on-success` | ขาว/ดำ |
| `bg-error` | `text-on-error` | ขาว/ดำ |

```tsx
// ✅ ถูกต้อง - Contrast ดี
<div className="bg-warning text-on-warning">
  พื้นเหลือง + text เข้ม = อ่านง่าย!
</div>

// ❌ ผิด - Contrast ไม่ดี
<div className="bg-warning text-white">
  พื้นเหลือง + text ขาว = อ่านยาก!
</div>
```

### Component Classes

```tsx
// Buttons
<button className="btn-primary">Primary</button>
<button className="btn-secondary">Secondary</button>
<button className="btn-outline">Outline</button>
<button className="btn-ghost">Ghost</button>

// Cards
<div className="card p-6">Card Content</div>
<div className="card-hover p-6">Hoverable Card</div>

// Inputs
<input className="input" placeholder="Enter text..." />

// Badges
<span className="badge badge-success">Success</span>
<span className="badge badge-warning">Warning</span>

// Status Badges (with dot)
<span className="status-badge status-badge-pending">รอชำระ</span>
<span className="status-badge status-badge-completed">สำเร็จ</span>

// Subscription Badges
<span className="badge-boost">Boost</span>
<span className="badge-boost-plus">Boost+</span>

// Alerts
<div className="alert alert-warning">Warning message</div>
```

### General Rules

| Do | Don't |
|-------|---------|
| ใช้ CSS Variables/Tailwind classes ที่มีอยู่ | สร้างสีใหม่แบบ hardcode |
| ใช้ `bg-surface`, `text-primary` | ใช้ `bg-[#123456]` |
| ใช้ `text-on-*` บน background สีเข้ม | ใช้ `text-white` บนพื้นเหลือง |
| ดู existing components เป็นตัวอย่าง | ออกแบบ UI ใหม่ทั้งหมด |
| Follow design system ที่มี | Mix หลาย design styles |

---

## Roadmap

### Phase 1: Core Features (Done)
- [x] Landing Page
- [x] User Authentication (Mock)
- [x] Service Catalog
- [x] Order System
- [x] Order History
- [x] Wallet & Top-up
- [x] Daily Login Bonus
- [x] Referral System
- [x] Tier System (Membership)

### Phase 2: UI Architecture (Shopee Style)
- [ ] User Mode Layout (สั่งซื้อให้ตัวเอง)
- [ ] Agent Mode Layout (สร้างบิลให้ลูกค้า)
- [ ] Mode Switcher Component
- [ ] Shared Components

### Phase 3: Agent System (Bill System)
- [ ] Agent Onboarding (ตั้งค่าครั้งแรก)
- [ ] Bill Creator (Step-by-step)
- [ ] Bill List & Management
- [ ] Public Bill Page (ลูกค้าดู)
- [ ] Client Management
- [ ] Agent Stats/Revenue

### Phase 4: Subscription & Polish
- [ ] Subscription Page (Free/Boost/Boost+)
- [ ] Limit Enforcement
- [ ] Upgrade Prompts
- [ ] Export Data (CSV/Excel)
- [ ] UI/UX Polish

---

## Project Structure (Shopee Style)

```
src/
├── app/
│   ├── (user)/                 # USER MODE (สั่งซื้อให้ตัวเอง)
│   │   ├── layout.tsx          # User layout + sidebar
│   │   ├── page.tsx            # User dashboard
│   │   ├── order/              # สั่งซื้อบริการ
│   │   ├── history/            # ประวัติออเดอร์
│   │   └── topup/              # เติมเงิน
│   │
│   ├── (agent)/                # AGENT MODE (สร้างบิลให้ลูกค้า)
│   │   ├── layout.tsx          # Agent layout + sidebar
│   │   └── agent/
│   │       ├── page.tsx        # Agent dashboard
│   │       ├── bills/          # จัดการบิล
│   │       ├── clients/        # จัดการลูกค้า
│   │       └── stats/          # สถิติ/รายได้
│   │
│   ├── bill/[code]/            # PUBLIC BILL (ลูกค้าดู)
│   │
│   ├── subscription/           # แพ็คเกจ Subscription
│   │
│   ├── globals.css             # CSS Variables & Utility Classes
│   │
│   └── styles/
│       └── COLOR_SYSTEM.md     # Color Reference Guide
│
├── components/
│   ├── layouts/                # UserSidebar, AgentSidebar
│   ├── shared/                 # Shared components
│   ├── user/                   # User-specific components
│   ├── agent/                  # Agent-specific components
│   ├── bill/                   # Public bill components
│   └── icons/                  # SVG Icon components
│
├── types/                      # TypeScript Types
│
└── utils/storage/              # localStorage utilities
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm / yarn / pnpm

### Installation

```bash
# Clone repository
git clone https://github.com/your-username/meelike-dashboard.git
cd meelike-dashboard

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

### Environment Variables

```env
# .env.local (if needed)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Documentation

| Document | Description |
|----------|-------------|
| [`docs/AGENT_SYSTEM_PLAN.md`](./docs/AGENT_SYSTEM_PLAN.md) | แผนพัฒนาระบบ Agent และ Subscription |
| [`src/app/styles/COLOR_SYSTEM.md`](./src/app/styles/COLOR_SYSTEM.md) | Color System Reference Guide |

---

## Business Model

```
┌─────────────────────────────────────────────────────────────────┐
│                     MEELIKE BUSINESS MODEL                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. Service Margin (30%)                                        │
│     └── กำไรจากการขายบริการ                                     │
│                                                                  │
│  2. Subscription Revenue                                        │
│     ├── Boost: ฿149/เดือน                                       │
│     └── Boost+: ฿399/เดือน                                      │
│                                                                  │
│  3. Network Effect                                              │
│     └── Public Bill แสดง "Powered by MeeLike" (Free/Boost)      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Subscription Tiers

| Tier | Price | Key Features |
|------|-------|--------------|
| **Free** | ฿0 | 50 bills/month, 20 clients, MeeLike Branding |
| **Boost** | ฿149/mo | 300 bills/month, 100 clients, CSV Export |
| **Boost+** | ฿399/mo | Unlimited, Hide Branding, API Access |

---

## Target Users

1. **Regular Users** - ซื้อบริการเพื่อใช้งานส่วนตัว
2. **Agents (Resellers)** - ตัวแทนจำหน่าย เปิดร้านขายต่อให้ลูกค้า
3. **Businesses** - ธุรกิจที่ต้องการเพิ่ม engagement

---

## Key Metrics (Target)

| Metric | Current | Year 1 Target |
|--------|---------|---------------|
| Total Users | 50,000 | 75,000 |
| Monthly Active Users | 4,000 | 7,500 |
| Agent Adoption | 0% | 30% |
| Subscription Revenue | ฿0 | ฿800K/year |

---

## Prototype to Production Checklist

เมื่อ Prototype พร้อม จะต้องทำสิ่งต่อไปนี้ก่อนใช้งานจริง:

| Task | Status | Priority |
|------|--------|----------|
| Setup Backend API (Node.js/Go) | - | High |
| Database (PostgreSQL/MySQL) | - | High |
| User Authentication (JWT/Session) | - | High |
| Payment Gateway Integration | - | High |
| External SMM API Integration | - | High |
| Wildcard DNS & SSL Setup | - | Medium |
| Email Notifications | - | Medium |
| Admin Dashboard | - | Medium |
| Rate Limiting & Security | - | Medium |
| Logging & Monitoring | - | Low |
| CI/CD Pipeline | - | Low |

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## License

This project is proprietary software. All rights reserved.

---

<p align="center">
  <strong>PROTOTYPE PROJECT</strong><br>
  Made with care by MeeLike Team
</p>
