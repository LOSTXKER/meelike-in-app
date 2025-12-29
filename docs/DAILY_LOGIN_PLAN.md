# 🎁 Daily Login System Plan

## Overview
ระบบ Daily Login สำหรับ Meelike เพื่อจูงใจให้ผู้ใช้เข้าใช้งานทุกวัน พร้อม Streak Bonus สำหรับการ Login ติดต่อกัน

---

## 1. โครงสร้างรางวัล (Reward Structure)

### รางวัลรายวัน
| รางวัล | จำนวน |
|--------|--------|
| **ทุกวัน** | **0.5 เครดิต** |

### Streak Bonus (วันติดต่อกัน)
| Streak | Bonus | Badge |
|--------|-------|-------|
| 🔥 **7 วันติด** | +3 เครดิต | - |
| 🔥 **14 วันติด** | +5 เครดิต | - |
| 🔥 **30 วันติด** | +15 เครดิต | 🏅 "นักล่ารางวัล" |
| 🔥 **60 วันติด** | +30 เครดิต | 🏅 "ขยันเป็นเลิศ" |
| 🔥 **100 วันติด** | +50 เครดิต | 🏅 "ตำนานหมี" |

### ตัวอย่างการคำนวณรายเดือน (30 วัน)
```
รางวัลรายวัน: 30 × 0.5 = 15 เครดิต
Streak 7 วัน: +3 เครดิต
Streak 14 วัน: +5 เครดิต
Streak 30 วัน: +15 เครดิต
────────────────────────────
รวมทั้งเดือน: 38 เครดิต + Badge
```

### งบประมาณโดยประมาณ (3,000-4,000 Active Users)
- **Realistic Case**: ~25,000 - 35,000 ฿/เดือน

---

## 2. กฎและเงื่อนไข

### ⏰ Reset Time
- **เวลารีเซ็ต**: 00:00 น. เวลาไทย (UTC+7)
- ทุกวันใหม่จะสามารถ Claim รางวัลได้ 1 ครั้ง

### ❌ Streak Rules (เข้มงวด)
- **ไม่มี Grace Period** - ขาด Login 1 วัน = Streak รีเซ็ตทันที
- เริ่มนับ Streak ใหม่จากวันที่ 1
- Longest Streak จะถูกบันทึกไว้ตลอด

### ✅ Claim Conditions
- ต้อง Login เข้าระบบ
- Claim ได้ 1 ครั้ง/วัน เท่านั้น
- รางวัลจะถูกเพิ่มเข้า Credit Balance ทันที

---

## 3. UI/UX Design

### 3.1 Auto Popup Modal (เปิดอัตโนมัติ)
แสดงเมื่อ: Login ครั้งแรกของวัน และยังไม่ได้ Claim

```
┌─────────────────────────────────────────────┐
│                                             │
│           🎁 รางวัลประจำวัน                  │
│                                             │
│         ┌─────────────────────┐             │
│         │                     │             │
│         │     +1 เครดิต       │             │
│         │                     │             │
│         └─────────────────────┘             │
│                                             │
│          🔥 Streak: 5 วันติดต่อกัน          │
│                                             │
│   ┌─────────────────────────────────────┐   │
│   │ ○ ○ ○ ○ ● ○ ○   →   7 วัน = +5฿     │   │
│   │ 1 2 3 4 5 6 7                       │   │
│   └─────────────────────────────────────┘   │
│                                             │
│         อีก 2 วัน รับ Streak Bonus!         │
│                                             │
│       ┌─────────────────────────┐           │
│       │    🎁 รับรางวัลวันนี้    │           │
│       └─────────────────────────┘           │
│                                             │
└─────────────────────────────────────────────┘
```

### 3.2 Success Modal (หลัง Claim)
```
┌─────────────────────────────────────────────┐
│                                             │
│              🎉 สำเร็จ!                      │
│                                             │
│            ได้รับ +1 เครดิต                 │
│                                             │
│          🔥 Streak: 6 วันติดต่อกัน          │
│                                             │
│     💡 พรุ่งนี้อย่าลืมกลับมารับรางวัล!       │
│        อีก 1 วัน รับ Bonus +5 เครดิต        │
│                                             │
│             [ ✓ เข้าใจแล้ว ]                │
│                                             │
└─────────────────────────────────────────────┘
```

### 3.3 Streak Bonus Modal (เมื่อครบ Milestone)
```
┌─────────────────────────────────────────────┐
│                                             │
│           🎊 ยินดีด้วย!                      │
│                                             │
│       🔥 Streak 7 วันติดต่อกัน!             │
│                                             │
│         ┌─────────────────────┐             │
│         │                     │             │
│         │  +1 เครดิต (วันนี้) │             │
│         │  +5 เครดิต (Bonus)  │             │
│         │  ─────────────────  │             │
│         │  รวม +6 เครดิต      │             │
│         │                     │             │
│         └─────────────────────┘             │
│                                             │
│     เป้าหมายต่อไป: 14 วัน (+10 เครดิต)      │
│                                             │
│             [ 🎁 รับรางวัล ]                │
│                                             │
└─────────────────────────────────────────────┘
```

### 3.4 Dashboard Widget
```
┌─────────────────────────────────────────────┐
│  🎁 Daily Login                    🔥 5 วัน │
├─────────────────────────────────────────────┤
│                                             │
│    [✓] [✓] [✓] [✓] [✓] [○] [🎁]            │
│     1   2   3   4   5   6   7              │
│                                             │
│    ● = Claimed  ○ = Available  🎁 = Bonus   │
│                                             │
├─────────────────────────────────────────────┤
│  วันนี้: ✅ รับรางวัลแล้ว                    │
│  พรุ่งนี้: อีก 2 วัน รับ Streak Bonus +5฿   │
└─────────────────────────────────────────────┘
```

### 3.5 Header/Navbar Indicator
```
┌──────┐
│ 🎁 5 │  ← แสดง Streak ปัจจุบัน
└──────┘

หรือถ้ายังไม่ Claim วันนี้:
┌────────┐
│ 🎁 ● 5 │  ← จุดแดงแสดงว่ามีรางวัลรอรับ
└────────┘
```

---

## 4. Data Structure

### LocalStorage Key: `meelike_daily_login`

```typescript
interface DailyLoginData {
  // วันที่ Claim ล่าสุด (format: YYYY-MM-DD)
  lastClaimDate: string | null;
  
  // Streak ปัจจุบัน
  currentStreak: number;
  
  // Streak สูงสุดที่เคยทำได้
  longestStreak: number;
  
  // จำนวนวันที่ Claim ทั้งหมด
  totalDaysClaimed: number;
  
  // จำนวนเครดิตที่ได้รับจาก Daily Login ทั้งหมด
  totalCreditsEarned: number;
  
  // Badges ที่ได้รับ
  badges: DailyLoginBadge[];
  
  // ประวัติการ Claim (เก็บ 30 วันล่าสุด)
  claimHistory: ClaimRecord[];
}

interface DailyLoginBadge {
  id: string;           // "streak_30", "streak_60", "streak_100"
  name: string;         // "นักล่ารางวัล"
  earnedAt: string;     // ISO date
  streak: number;       // Streak ที่ได้รับ Badge
}

interface ClaimRecord {
  date: string;         // "2025-12-29"
  reward: number;       // 1
  bonus: number;        // 0 or 5, 10, 25, etc.
  streak: number;       // Streak ณ วันนั้น
}
```

---

## 5. Logic Flow

### 5.1 เมื่อเปิดหน้าเว็บ (On Page Load)
```
1. ดึง DailyLoginData จาก LocalStorage
2. ตรวจสอบว่าวันนี้ Claim แล้วหรือยัง
   - ถ้า lastClaimDate === today → ไม่แสดง Popup
   - ถ้า lastClaimDate !== today → แสดง Auto Popup

3. ตรวจสอบ Streak
   - ถ้า lastClaimDate === yesterday → Streak ยังอยู่
   - ถ้า lastClaimDate < yesterday → Streak รีเซ็ต = 0
```

### 5.2 เมื่อกด Claim
```
1. คำนวณรางวัล
   - baseReward = 1 เครดิต
   - newStreak = currentStreak + 1
   - bonus = checkStreakBonus(newStreak)
   - totalReward = baseReward + bonus

2. อัปเดต Data
   - lastClaimDate = today
   - currentStreak = newStreak
   - longestStreak = max(longestStreak, newStreak)
   - totalDaysClaimed++
   - totalCreditsEarned += totalReward

3. เพิ่ม Credit ให้ผู้ใช้

4. แสดง Success Modal
   - ถ้ามี bonus → แสดง Streak Bonus Modal
   - ถ้าไม่มี → แสดง Success Modal ปกติ
```

### 5.3 Streak Bonus Check
```typescript
function checkStreakBonus(streak: number): number {
  if (streak === 100) return 100;
  if (streak === 60) return 50;
  if (streak === 30) return 25;
  if (streak === 14) return 10;
  if (streak === 7) return 5;
  return 0;
}

function checkNewBadge(streak: number): DailyLoginBadge | null {
  if (streak === 30) return { id: 'streak_30', name: 'นักล่ารางวัล', ... };
  if (streak === 60) return { id: 'streak_60', name: 'ขยันเป็นเลิศ', ... };
  if (streak === 100) return { id: 'streak_100', name: 'ตำนานหมี', ... };
  return null;
}
```

---

## 6. Components ที่ต้องสร้าง

| Component | หน้าที่ |
|-----------|--------|
| `DailyLoginModal.tsx` | Modal หลักสำหรับ Claim รางวัล |
| `DailyLoginSuccessModal.tsx` | Modal แสดงผลหลัง Claim |
| `DailyLoginWidget.tsx` | Widget แสดงบน Dashboard |
| `DailyLoginIndicator.tsx` | Indicator บน Header |
| `StreakBadge.tsx` | แสดง Badge ที่ได้รับ |

---

## 7. Integration

### 7.1 Credit System
- เมื่อ Claim → เพิ่ม credit ผ่าน `addCredits()` function
- แสดงใน Transaction History

### 7.2 Badge System
- Badge จาก Daily Login จะแสดงใน Profile
- อาจแสดงใน Dashboard "Badges" section

### 7.3 Notification
- Header indicator แสดงจุดแดงเมื่อมีรางวัลรอรับ
- Auto popup เมื่อ Login

---

## 8. Files to Create/Modify

### New Files
```
src/app/components/DailyLoginModal.tsx
src/app/components/DailyLoginSuccessModal.tsx  
src/app/components/DailyLoginWidget.tsx
src/app/components/DailyLoginIndicator.tsx
```

### Modify Files
```
src/app/utils/localStorage.ts    - เพิ่ม DailyLogin functions
src/app/utils/mockData.ts        - เพิ่ม mock data initialization
src/app/layout.tsx               - เพิ่ม DailyLoginModal
src/app/components/Header.tsx    - เพิ่ม DailyLoginIndicator
src/app/page.tsx                 - เพิ่ม DailyLoginWidget
```

---

## 9. Timeline

| Phase | Tasks | Priority |
|-------|-------|----------|
| **Phase 1** | Data Structure + LocalStorage | 🔴 High |
| **Phase 2** | Auto Popup Modal + Claim Logic | 🔴 High |
| **Phase 3** | Success Modal + Streak Bonus | 🔴 High |
| **Phase 4** | Dashboard Widget | 🟡 Medium |
| **Phase 5** | Header Indicator | 🟡 Medium |
| **Phase 6** | Badge Integration | 🟢 Low |

---

## 10. Mockup Summary

### Color Theme
- Primary: `brand-secondary` (ทอง/ส้ม)
- Success: `emerald` (เขียว)
- Streak Fire: `orange` → `red` (gradient)
- Badge: `purple`/`gold`

### Icons
- Gift: 🎁 หรือ SVG GiftIcon
- Fire: 🔥 หรือ SVG FireIcon  
- Check: ✓ หรือ SVG CheckIcon
- Badge: 🏅 หรือ SVG BadgeIcon

---

*Last Updated: 2025-12-29*

