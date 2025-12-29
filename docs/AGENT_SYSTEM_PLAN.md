# 📋 แผนพัฒนาระบบ Agent (ตัวแทนจำหน่าย)

## 🎯 Overview

ระบบ Agent คือเครื่องมือสำหรับตัวแทนจำหน่าย (Reseller) ที่ช่วยให้:
- จัดการลูกค้าของตัวเอง
- สั่งออเดอร์ในนามลูกค้า
- คำนวณต้นทุน กำไร และยอดขายอัตโนมัติ
- เชื่อม API จากเว็บ SMM อื่นๆ เพื่อเปรียบเทียบราคา/สั่งข้ามแพลตฟอร์ม

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         AGENT DASHBOARD                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐            │
│  │   Overview    │  │    Clients    │  │   Analytics   │            │
│  │   (หน้าหลัก)  │  │  (ลูกค้า)     │  │  (สถิติ/รายงาน) │           │
│  └───────────────┘  └───────────────┘  └───────────────┘            │
│                                                                      │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐            │
│  │  New Order    │  │ Order History │  │  API Connect  │            │
│  │  (สั่งออเดอร์)│  │  (ประวัติ)    │  │  (เชื่อม API) │            │
│  └───────────────┘  └───────────────┘  └───────────────┘            │
│                                                                      │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐            │
│  │   Pricing     │  │  Membership   │  │   Settings    │            │
│  │  (ตั้งราคา)   │  │  (ระดับสมาชิก)│  │  (ตั้งค่า)    │            │
│  └───────────────┘  └───────────────┘  └───────────────┘            │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📁 โครงสร้างไฟล์ที่ต้องสร้าง

```
src/app/agent/
├── page.tsx                    # Overview Dashboard (มีแล้ว - ต้องปรับปรุง)
├── layout.tsx                  # Agent Layout (มีแล้ว - ต้องปรับปรุง)
├── clients/
│   └── page.tsx               # จัดการลูกค้า (มีแล้ว - ต้องปรับปรุง)
├── new-order/
│   └── page.tsx               # สร้างออเดอร์ (มีแล้ว - ต้องปรับปรุง)
├── orders/
│   └── page.tsx               # ประวัติออเดอร์ทั้งหมด (ใหม่)
├── analytics/
│   └── page.tsx               # รายงาน/สถิติ (ใหม่)
├── pricing/
│   └── page.tsx               # ตั้งราคาขาย (ใหม่)
├── api-connect/
│   └── page.tsx               # เชื่อม API ภายนอก (ใหม่)
├── membership/
│   └── page.tsx               # ระดับสมาชิก Agent (ใหม่)
└── settings/
    └── page.tsx               # ตั้งค่า Agent (ใหม่)

src/app/utils/storage/
├── agent.ts                    # Agent storage functions (ใหม่)
├── agentClients.ts             # Client management (ใหม่)
├── agentOrders.ts              # Order management (ใหม่)
├── agentPricing.ts             # Pricing rules (ใหม่)
└── externalApi.ts              # External API connections (ใหม่)

src/app/types/
├── agent.ts                    # Agent type definitions (ใหม่)
```

---

## 🔑 ฟีเจอร์หลัก

### 1. 📊 Overview Dashboard (หน้าหลัก)

**วัตถุประสงค์:** แสดงภาพรวมธุรกิจของ Agent

**Components:**
- **Stat Cards:**
  - กำไรวันนี้ / สัปดาห์นี้ / เดือนนี้
  - ยอดขายรวม
  - จำนวนออเดอร์
  - จำนวนลูกค้า
  - ยอดค้างชำระ

- **Quick Actions:**
  - ปุ่มสร้างออเดอร์ด่วน
  - ปุ่มเพิ่มลูกค้าใหม่

- **Recent Activity:**
  - ออเดอร์ล่าสุด 5 รายการ
  - กิจกรรมล่าสุด

- **Charts:**
  - กราฟยอดขาย 7 วันย้อนหลัง
  - กราฟกำไร/ต้นทุน

---

### 2. 👥 Client Management (จัดการลูกค้า)

**วัตถุประสงค์:** จัดการข้อมูลลูกค้าของ Agent

**Data Structure:**
```typescript
interface AgentClient {
  id: string;
  name: string;                    // ชื่อลูกค้า/ร้านค้า
  contactPerson?: string;          // ชื่อผู้ติดต่อ
  phone?: string;                  // เบอร์โทร
  email?: string;                  // อีเมล
  socialMedia?: {
    facebook?: string;
    line?: string;
    instagram?: string;
  };
  notes?: string;                  // หมายเหตุ
  pricingTier: 'default' | 'vip' | 'wholesale' | 'custom';
  customMarkup?: number;           // ส่วนเพิ่มราคาเฉพาะลูกค้านี้ (%)
  creditBalance: number;           // ยอดเงินค้างชำระ
  totalSpent: number;              // ยอดใช้จ่ายรวม
  totalOrders: number;             // จำนวนออเดอร์ทั้งหมด
  createdAt: string;
  lastOrderAt?: string;
}
```

**Features:**
- ✅ เพิ่ม/แก้ไข/ลบลูกค้า
- ✅ ค้นหาลูกค้า
- ✅ ตั้งค่าส่วนลด/ราคาพิเศษเฉพาะลูกค้า
- ✅ ดูประวัติออเดอร์ของลูกค้า
- ✅ ระบบ Credit (ค้างชำระ)
- ✅ Import/Export ข้อมูลลูกค้า

---

### 3. 🛒 New Order (สร้างออเดอร์)

**วัตถุประสงค์:** สร้างออเดอร์ให้ลูกค้าพร้อมคำนวณกำไร

**Data Structure:**
```typescript
interface AgentOrder {
  id: string;
  clientId: string;
  clientName: string;
  
  // Service Info
  serviceId: number;
  serviceName: string;
  category: string;
  link: string;
  quantity: number;
  
  // Pricing
  baseCost: number;              // ราคาต้นทุน (ก่อนส่วนลด Agent)
  agentDiscount: number;         // ส่วนลด Agent (%)
  actualCost: number;            // ต้นทุนจริง (หลังส่วนลด)
  salePrice: number;             // ราคาขายให้ลูกค้า
  profit: number;                // กำไร
  profitMargin: number;          // กำไร (%)
  
  // Status
  status: 'pending' | 'processing' | 'completed' | 'canceled' | 'refunded';
  paymentStatus: 'unpaid' | 'partial' | 'paid';
  
  // External API (ถ้าสั่งจากเว็บอื่น)
  externalProvider?: string;
  externalOrderId?: string;
  
  // Timestamps
  createdAt: string;
  completedAt?: string;
  
  // Notes
  notes?: string;
}
```

**Features:**
- ✅ เลือกลูกค้า (หรือเพิ่มใหม่)
- ✅ เลือกบริการ (จากระบบเรา หรือ API ภายนอก)
- ✅ คำนวณต้นทุน/กำไรอัตโนมัติ
- ✅ ตั้งราคาขายได้เอง
- ✅ แนะนำราคาขายที่เหมาะสม
- ✅ Quick Order (ใช้ค่าเริ่มต้น)
- ✅ Mass Order (สั่งหลายรายการพร้อมกัน)

---

### 4. 💰 Pricing Rules (ตั้งราคาขาย)

**วัตถุประสงค์:** ตั้งค่าการคิดราคาขายอัตโนมัติ

**Data Structure:**
```typescript
interface PricingRule {
  id: string;
  name: string;
  type: 'percentage' | 'fixed' | 'tiered';
  
  // Percentage markup
  markupPercent?: number;         // เช่น 20 = เพิ่ม 20% จากต้นทุน
  
  // Fixed amount
  fixedMarkup?: number;           // เพิ่มคงที่ เช่น 50 บาท/ออเดอร์
  
  // Tiered pricing
  tiers?: {
    minAmount: number;
    maxAmount: number;
    markupPercent: number;
  }[];
  
  // Conditions
  applyToCategories?: string[];   // ใช้กับหมวดหมู่ไหนบ้าง
  applyToClients?: string[];      // ใช้กับลูกค้าไหนบ้าง
  
  isDefault: boolean;
  isActive: boolean;
}

interface PricingPreset {
  id: string;
  name: string;
  description: string;
  rules: PricingRule[];
}
```

**Features:**
- ✅ ตั้ง Markup เป็น % หรือจำนวนคงที่
- ✅ ตั้งราคาแยกตามหมวดหมู่
- ✅ ตั้งราคาพิเศษสำหรับลูกค้า VIP
- ✅ Pricing Presets (เช่น "ราคาปลีก", "ราคาส่ง", "ราคา VIP")
- ✅ Price Calculator Tool

---

### 5. 📈 Analytics & Reports (รายงานและสถิติ)

**วัตถุประสงค์:** วิเคราะห์ผลประกอบการ

**Reports:**
- **รายงานยอดขาย:**
  - ยอดขายรายวัน/สัปดาห์/เดือน
  - เปรียบเทียบกับช่วงก่อนหน้า
  
- **รายงานกำไร:**
  - กำไรรายวัน/สัปดาห์/เดือน
  - กำไรแยกตามบริการ
  - กำไรแยกตามลูกค้า
  
- **รายงานลูกค้า:**
  - ลูกค้าที่ทำยอดสูงสุด
  - ลูกค้าที่ไม่เคยซื้อนานแล้ว
  
- **รายงานบริการ:**
  - บริการขายดี
  - บริการกำไรดี

**Export Options:**
- PDF
- Excel
- CSV

---

### 6. 🔌 API Connect (เชื่อม API ภายนอก) ⭐ Killer Feature

**วัตถุประสงค์:** เชื่อมต่อกับเว็บ SMM Panel อื่นเพื่อ:
1. เปรียบเทียบราคา
2. สั่งออเดอร์จากเว็บอื่นผ่านระบบเรา
3. ดูสถานะออเดอร์รวมจากทุกที่

**Data Structure:**
```typescript
interface ExternalApiConnection {
  id: string;
  name: string;                   // ชื่อเว็บ (เช่น "SMM Panel X")
  apiUrl: string;                 // API Endpoint
  apiKey: string;                 // API Key (encrypted)
  isActive: boolean;
  lastSyncAt?: string;
  
  // Service mapping
  serviceMapping?: {
    localServiceId: number;
    externalServiceId: string;
    externalPrice: number;
  }[];
  
  // Stats
  totalOrdersSent: number;
  totalSpent: number;
}

interface ExternalService {
  providerId: string;
  providerName: string;
  serviceId: string;
  name: string;
  price: number;                  // ราคาต่อ 1000
  min: number;
  max: number;
  category: string;
}
```

**Pre-integrated Providers (เชื่อมให้แล้ว):**
```typescript
const preIntegratedProviders = [
  {
    id: 'provider_a',
    name: 'SMM Panel Thailand',
    apiUrl: 'https://smmth.com/api/v2',
    description: 'เว็บไทย ราคาถูก บริการครบ',
    categories: ['facebook', 'instagram', 'tiktok'],
  },
  {
    id: 'provider_b', 
    name: 'Global SMM',
    apiUrl: 'https://globalsmm.io/api',
    description: 'เว็บต่างประเทศ บริการหลากหลาย',
    categories: ['youtube', 'twitter', 'linkedin'],
  },
  // ... more providers
];
```

**Features:**
- ✅ เพิ่ม/ลบ API Connection
- ✅ ทดสอบ Connection
- ✅ ดึงรายการบริการจากเว็บอื่น
- ✅ เปรียบเทียบราคาอัตโนมัติ
- ✅ สั่งออเดอร์ผ่าน API ภายนอก
- ✅ Sync สถานะออเดอร์
- ✅ Price Alert (แจ้งเตือนเมื่อราคาถูกลง)

**Price Comparison View:**
```
┌─────────────────────────────────────────────────────────────────┐
│  🔍 เปรียบเทียบราคา: ถูกใจโพสต์ Facebook                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ⭐ MeeLike (เรา)           ฿75.00/1K    ✓ แนะนำ (ถูกสุด)        │
│  🌐 SMM Panel Thailand     ฿78.00/1K                             │
│  🌐 Global SMM             ฿82.00/1K                             │
│  🌐 Fast Panel             ฿85.00/1K                             │
│                                                                  │
│  💡 ประหยัด ฿3-10/1K ถ้าสั่งผ่าน MeeLike                        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

### 7. 🏆 Agent Membership (ระดับสมาชิก Agent)

**วัตถุประสงค์:** ระบบสมาชิกเพื่อให้ส่วนลดและสิทธิพิเศษตามระดับ

**Membership Tiers:**
```typescript
interface AgentMembership {
  id: string;
  name: string;
  icon: string;
  color: string;
  
  // Requirements
  minMonthlySpending: number;     // ยอดใช้ขั้นต่ำ/เดือน
  minTotalSpending?: number;      // ยอดใช้รวมขั้นต่ำ
  
  // Benefits
  discountPercent: number;        // ส่วนลดราคาบริการ
  apiAccessLevel: 'basic' | 'advanced' | 'unlimited';
  maxApiConnections: number;      // จำนวน API ที่เชื่อมได้
  prioritySupport: boolean;
  customBranding: boolean;        // ใส่โลโก้ตัวเอง
  whiteLabel: boolean;            // White Label (ระดับสูงสุด)
  
  // Features
  features: string[];
}
```

**ตัวอย่าง Tiers:**

| ระดับ | ยอดใช้/เดือน | ส่วนลด | API | สิทธิพิเศษ |
|-------|-------------|--------|-----|-----------|
| 🥉 Bronze | ฿0 - ฿999 | 5% | 1 | - |
| 🥈 Silver | ฿1,000 - ฿4,999 | 8% | 3 | Priority Support |
| 🥇 Gold | ฿5,000 - ฿14,999 | 12% | 5 | + Custom Branding |
| 💎 Diamond | ฿15,000 - ฿49,999 | 15% | 10 | + White Label Ready |
| 👑 Partner | ฿50,000+ | 20% | ∞ | + Revenue Share |

**Features:**
- ✅ แสดงระดับปัจจุบันและ Progress สู่ระดับถัดไป
- ✅ ประวัติสิทธิพิเศษที่ได้รับ
- ✅ Badge แสดงในโปรไฟล์
- ✅ Monthly Reset vs Lifetime Achievement

---

### 8. ⚙️ Agent Settings (ตั้งค่า)

**Settings:**
- **Profile:**
  - ชื่อร้าน/แบรนด์
  - โลโก้ (สำหรับ Gold+)
  - ข้อมูลติดต่อ
  
- **Notifications:**
  - แจ้งเตือนออเดอร์เสร็จ
  - แจ้งเตือนลูกค้าสั่งออเดอร์ (ถ้ามี storefront)
  - แจ้งเตือนราคาเปลี่ยน
  
- **Invoice/Receipt:**
  - Template ใบเสร็จ
  - ข้อมูลร้านในใบเสร็จ
  - ส่งใบเสร็จอัตโนมัติ

- **Defaults:**
  - Markup เริ่มต้น
  - Payment terms เริ่มต้น
  - หมวดหมู่เริ่มต้น

---

## 🌟 Killer Features (ฟีเจอร์เด็ด)

### 1. 🔄 Smart Price Comparison
- เปรียบเทียบราคาจากหลายเว็บอัตโนมัติ
- แนะนำเว็บที่ถูกที่สุดสำหรับแต่ละบริการ
- แจ้งเตือนเมื่อราคาถูกลง

### 2. 📱 Agent Storefront (ร้านค้าส่วนตัว)
```
yourstore.meelike.com/order
```
- ลูกค้าสั่งออเดอร์เองได้
- ใช้ราคาที่ Agent ตั้งไว้
- ออเดอร์เข้าระบบ Agent โดยตรง

### 3. 🤖 Auto-Ordering Bot
- ตั้งกฎสั่งออเดอร์อัตโนมัติ
- เช่น "ถ้าราคา X ต่ำกว่า Y ให้สั่งจาก Provider Z"
- ประหยัดเวลาและได้ราคาดีที่สุด

### 4. 📊 Profit Optimization AI
- วิเคราะห์กำไรและแนะนำการปรับราคา
- บอกว่าบริการไหนควรขายเพิ่ม/ลด
- คาดการณ์รายได้

### 5. 💳 Client Credit System
- ให้ลูกค้าเติมเงินล่วงหน้า
- หักอัตโนมัติเมื่อสั่งออเดอร์
- ดูยอดคงเหลือแบบ Real-time

### 6. 📲 LINE/Telegram Bot Integration
- รับออเดอร์ผ่าน LINE
- แจ้งสถานะผ่าน Telegram
- ลูกค้าสั่งไม่ต้องเข้าเว็บ

---

## 💰 Business Model

### Revenue Streams:
1. **Transaction Fee:** คิดค่าบริการ 1-3% ต่อออเดอร์ที่สั่งผ่าน External API
2. **Membership Fee:** (Optional) ค่าสมาชิกรายเดือนสำหรับฟีเจอร์พิเศษ
3. **Commission:** ส่วนแบ่งจาก Provider ที่เราแนะนำ

### Pricing Strategy:
- ราคาต้นทุนถูกกว่าคู่แข่ง → Agent มีกำไรมากขึ้น → มาใช้เว็บเรา
- Free tier มีฟีเจอร์เพียงพอ → ดึงดูดผู้ใช้ใหม่
- Premium features สำหรับ Agent ที่ทำยอดสูง → Upsell

---

## 🗓️ Implementation Phases

### Phase 1: Foundation (1-2 สัปดาห์)
- [x] Overview Dashboard (ปรับปรุง)
- [x] Client Management (ปรับปรุง)
- [x] New Order (ปรับปรุง)
- [ ] Order History Page
- [ ] Basic Analytics

### Phase 2: Pricing & Membership (1-2 สัปดาห์)
- [ ] Pricing Rules System
- [ ] Agent Membership Tiers
- [ ] Discount Calculation
- [ ] Progress Tracking

### Phase 3: API Integration (2-3 สัปดาห์)
- [ ] External API Connection UI
- [ ] Service Fetching
- [ ] Price Comparison
- [ ] Cross-platform Ordering
- [ ] Pre-integrated Providers

### Phase 4: Advanced Features (2-3 สัปดาห์)
- [ ] Advanced Analytics & Reports
- [ ] Invoice/Receipt System
- [ ] Client Credit System
- [ ] Notifications System

### Phase 5: Killer Features (3-4 สัปดาห์)
- [ ] Agent Storefront
- [ ] Auto-Ordering Bot
- [ ] LINE/Telegram Integration
- [ ] Profit Optimization AI

---

## 🎨 UI/UX Guidelines

### Navigation:
```
Agent Dashboard
├── 📊 Overview
├── 👥 Clients
├── 🛒 New Order
├── 📋 Orders
├── 💰 Pricing
├── 📈 Analytics
├── 🔌 API Connect
├── 🏆 Membership
└── ⚙️ Settings
```

### Color Scheme:
- Primary Actions: Brand Primary Color
- Profit/Success: Green (#22C55E)
- Cost/Warning: Orange (#F59E0B)
- Loss/Error: Red (#EF4444)

### Key UX Principles:
1. **One-Click Actions:** สั่งออเดอร์ได้เร็วที่สุด
2. **Clear Profit Display:** แสดงกำไรชัดเจนทุกที่
3. **Smart Defaults:** ใส่ค่าเริ่มต้นที่ดีที่สุด
4. **Mobile-First:** ใช้งานบนมือถือได้สะดวก

---

## 🔐 Security Considerations

1. **API Keys Encryption:** เข้ารหัส API Key ก่อนเก็บ
2. **Rate Limiting:** จำกัดจำนวน API calls
3. **Audit Logging:** เก็บ log การเปลี่ยนแปลงราคา/ข้อมูล
4. **Role-based Access:** ถ้ามี Sub-agent ในอนาคต

---

## 📝 Notes

- ระบบนี้ใช้ localStorage สำหรับ mock data (เหมือนระบบอื่นในโปรเจกต์)
- สามารถเปลี่ยนเป็น backend API ได้ในอนาคต
- External API integration จะเป็น mock ก่อน แล้วค่อยต่อจริง

---

## ✅ Next Steps

1. **สร้าง Type Definitions** สำหรับ Agent system
2. **สร้าง Storage Utils** สำหรับจัดการข้อมูล
3. **พัฒนา Phase 1** - Foundation pages
4. **ทดสอบและปรับปรุง** UI/UX

