# 🎨 MeeLike Color System

## 📋 Quick Reference

### วิธีใช้ (แนะนำ - Semantic Colors)

```tsx
// ✅ แนะนำ: ใช้ Semantic Colors (เปลี่ยนตาม theme อัตโนมัติ)
<div className="bg-surface text-primary border border-default">
  ใช้ได้ทั้ง Light และ Dark mode!
</div>

// ❌ ไม่แนะนำ: ต้องใส่ dark: เอง
<div className="bg-brand-surface dark:bg-dark-surface text-brand-text-dark dark:text-dark-text-dark">
  ต้องใส่ dark: ทุกที่ 😓
</div>
```

---

## 🎯 Semantic Colors (แนะนำ!)

### Background

| Class | Light | Dark | ใช้สำหรับ |
|-------|-------|------|----------|
| `bg-main` | `#FFFAF5` | `#211D1A` | พื้นหลังหน้า |
| `bg-surface` | `#FFFFFF` | `#2C2825` | การ์ด, Modal |
| `bg-surface-hover` | `#FAF7F3` | `#37322D` | Hover state |
| `bg-surface-active` | `#F5F0EB` | `#413A34` | Active state |

### Text

| Class | Light | Dark | ใช้สำหรับ |
|-------|-------|------|----------|
| `text-primary` | `#473B30` | `#FFFAF5` | หัวข้อ, Text หลัก |
| `text-secondary` | `#937058` | `#C9B7AB` | Text รอง |
| `text-muted` | `#B4A08C` | `#8C7D6E` | Text จาง |
| `text-inverse` | `#FFFAF5` | `#473B30` | Text บน dark/light bg |

### Brand

| Class | Light | Dark | ใช้สำหรับ |
|-------|-------|------|----------|
| `bg-brand` | `#937058` | `#FCD77F` | ปุ่มหลัก |
| `bg-brand-hover` | `#785A46` | `#FAE196` | Hover |
| `text-brand` | `#937058` | `#FCD77F` | Link, Icon |
| `bg-accent` | `#FCD77F` | `#937058` | ปุ่มรอง |
| `bg-highlight` | `#F892A2` | `#F892A2` | Accent (ชมพู) |

### Border

| Class | Light | Dark | ใช้สำหรับ |
|-------|-------|------|----------|
| `border-default` | `#EAE5E0` | `#3A3532` | Border ปกติ |
| `border-light` | `#F5F2EE` | `#302C28` | Border จาง |
| `ring-focus` | `#937058` | `#FCD77F` | Focus ring |

---

## ✅ Status Colors

### Success (สำเร็จ)

```tsx
<div className="bg-success-bg text-success-text">สำเร็จ</div>
<span className="text-success">✅ เสร็จสมบูรณ์</span>
```

| Class | Light | Dark |
|-------|-------|------|
| `bg-success` | `#22C55E` | `#4ADE80` |
| `bg-success-bg` | `#DCFCE7` | `#14532D` |
| `text-success` | `#22C55E` | `#4ADE80` |
| `text-success-text` | `#15803D` | `#86EFAC` |

### Warning (เตือน)

```tsx
<div className="bg-warning-bg text-warning-text">เตือน</div>
<span className="text-warning">⚠️ โปรดระวัง</span>
```

| Class | Light | Dark |
|-------|-------|------|
| `bg-warning` | `#F59E0B` | `#FBBF24` |
| `bg-warning-bg` | `#FEF3C7` | `#713F12` |
| `text-warning` | `#F59E0B` | `#FBBF24` |
| `text-warning-text` | `#A16207` | `#FDE047` |

### Error (ผิดพลาด)

```tsx
<div className="bg-error-bg text-error-text">ผิดพลาด</div>
<span className="text-error">❌ เกิดข้อผิดพลาด</span>
```

| Class | Light | Dark |
|-------|-------|------|
| `bg-error` | `#EF4444` | `#F87171` |
| `bg-error-bg` | `#FEE2E2` | `#7F1D1D` |
| `text-error` | `#EF4444` | `#F87171` |
| `text-error-text` | `#B91C1C` | `#FECACA` |

### Info (ข้อมูล)

```tsx
<div className="bg-info-bg text-info-text">ข้อมูล</div>
<span className="text-info">ℹ️ หมายเหตุ</span>
```

| Class | Light | Dark |
|-------|-------|------|
| `bg-info` | `#3B82F6` | `#60A5FA` |
| `bg-info-bg` | `#DBEAFE` | `#1E3A8A` |
| `text-info` | `#3B82F6` | `#60A5FA` |
| `text-info-text` | `#1D4ED8` | `#BFDBFE` |

---

## 📦 Bill Status Colors (Agent System)

### Status Badge

```tsx
// วิธีที่ 1: ใช้ Component Class
<span className="status-badge status-badge-pending">รอชำระ</span>
<span className="status-badge status-badge-confirmed">รอดำเนินการ</span>
<span className="status-badge status-badge-processing">กำลังทำ</span>
<span className="status-badge status-badge-completed">สำเร็จ</span>
<span className="status-badge status-badge-cancelled">ยกเลิก</span>

// วิธีที่ 2: ใช้ Tailwind Colors
<span className="bg-status-pending-bg text-status-pending-text px-2.5 py-1 rounded-full text-xs font-semibold">
  รอชำระ
</span>
```

| Status | สี | Light BG | Dark BG |
|--------|---|----------|---------|
| 🟡 Pending (รอชำระ) | Amber | `#FEF3C7` | `#713F12` |
| 🔵 Confirmed (รอดำเนินการ) | Blue | `#DBEAFE` | `#1E3A8A` |
| 🟣 Processing (กำลังทำ) | Purple | `#EDE9FE` | `#4C1D95` |
| 🟢 Completed (สำเร็จ) | Green | `#DCFCE7` | `#14532D` |
| 🔴 Cancelled (ยกเลิก) | Red | `#FEE2E2` | `#7F1D1D` |

### Status Dot

```tsx
<span className="w-2 h-2 rounded-full status-dot-pending"></span>
<span className="w-2 h-2 rounded-full status-dot-confirmed"></span>
<span className="w-2 h-2 rounded-full status-dot-processing"></span>
<span className="w-2 h-2 rounded-full status-dot-completed"></span>
<span className="w-2 h-2 rounded-full status-dot-cancelled"></span>
```

---

## 💎 Subscription Badge Colors

```tsx
<span className="badge-boost px-3 py-1 rounded-full text-sm font-semibold">
  🌟 Boost
</span>
<span className="badge-boost-plus px-3 py-1 rounded-full text-sm font-semibold">
  💎 Boost+
</span>
```

| Badge | สี | Light BG | Dark BG |
|-------|---|----------|---------|
| 🌟 Boost | Amber | `#FEF3C7` | `#713F12` |
| 💎 Boost+ | Purple | `#EDE9FE` | `#4C1D95` |

---

## 💰 Profit/Cost Colors

```tsx
<span className="text-profit">+฿1,500</span>   // กำไร (Green)
<span className="text-cost">฿950</span>        // ต้นทุน (Gray)
<span className="text-loss">-฿200</span>       // ขาดทุน (Red)
```

| Class | Light | Dark | ใช้สำหรับ |
|-------|-------|------|----------|
| `text-profit` | `#22C55E` | `#4ADE80` | แสดงกำไร |
| `text-cost` | `#64748B` | `#94A3B8` | แสดงต้นทุน |
| `text-loss` | `#EF4444` | `#F87171` | แสดงขาดทุน |

---

## 📦 Component Classes

### Card

```tsx
<div className="card p-6">
  Content
</div>

<div className="card-hover p-6">
  Hoverable Card
</div>
```

### Button

```tsx
<button className="btn-primary">Primary</button>
<button className="btn-secondary">Secondary</button>
<button className="btn-outline">Outline</button>
<button className="btn-ghost">Ghost</button>
```

### Input

```tsx
<input className="input" placeholder="ค้นหา..." />
<input className="input-error" placeholder="Error state" />
```

### Badge

```tsx
<span className="badge badge-success">สำเร็จ</span>
<span className="badge badge-warning">รอดำเนินการ</span>
<span className="badge badge-error">ผิดพลาด</span>
<span className="badge badge-info">ข้อมูล</span>
```

---

## 🔄 Migration Guide

### จาก Legacy Colors → Semantic Colors

```tsx
// ❌ Before (ต้องใส่ dark: เอง)
<div className="bg-brand-surface dark:bg-dark-surface">
  <h1 className="text-brand-text-dark dark:text-dark-text-dark">Title</h1>
  <p className="text-brand-text-light dark:text-dark-text-light">Description</p>
</div>

// ✅ After (เปลี่ยนอัตโนมัติ)
<div className="bg-surface">
  <h1 className="text-primary">Title</h1>
  <p className="text-secondary">Description</p>
</div>
```

### Mapping Table

| Legacy (Light) | Legacy (Dark) | Semantic |
|----------------|---------------|----------|
| `bg-brand-bg` | `bg-dark-bg` | `bg-main` |
| `bg-brand-surface` | `bg-dark-surface` | `bg-surface` |
| `text-brand-text-dark` | `text-dark-text-dark` | `text-primary` |
| `text-brand-text-light` | `text-dark-text-light` | `text-secondary` |
| `bg-brand-primary` | `bg-dark-primary` | `bg-brand` |
| `border-brand-border` | `border-dark-border` | `border-default` |

---

## 🎨 Color Palette Preview

### Light Theme
```
Background:  ████████ #FFFAF5 (Cream)
Surface:     ████████ #FFFFFF (White)
Primary:     ████████ #937058 (Brown)
Secondary:   ████████ #FCD77F (Yellow)
Accent:      ████████ #F892A2 (Pink)
Border:      ████████ #EAE5E0 (Light Gray)
```

### Dark Theme
```
Background:  ████████ #211D1A (Dark Brown)
Surface:     ████████ #2C2825 (Dark Gray)
Primary:     ████████ #FCD77F (Yellow)
Secondary:   ████████ #937058 (Brown)
Accent:      ████████ #F892A2 (Pink)
Border:      ████████ #3A3532 (Dark Gray)
```

