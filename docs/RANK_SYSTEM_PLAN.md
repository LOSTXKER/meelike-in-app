# 🏆 แผนระบบ Rank - Meelike

> ระบบ Rank สำหรับจูงใจลูกค้าให้ใช้บริการต่อเนื่อง (อ้างอิงจาก Fastwork)

---

## 📋 สารบัญ

1. [ภาพรวมระบบ](#1-ภาพรวมระบบ)
2. [ระดับ Rank และสิทธิประโยชน์](#2-ระดับ-rank-และสิทธิประโยชน์)
3. [เกณฑ์การคำนวณ Rank](#3-เกณฑ์การคำนวณ-rank)
4. [Leaderboard (กระดานอันดับ)](#4-leaderboard-กระดานอันดับ)
5. [องค์ประกอบ Gamification](#5-องค์ประกอบ-gamification)
6. [UI/UX Design](#6-uiux-design)
7. [Database Schema](#7-database-schema)
8. [แผนการพัฒนา](#8-แผนการพัฒนา)

---

## 1. ภาพรวมระบบ

### 🎯 วัตถุประสงค์
- **เพิ่ม Retention**: จูงใจลูกค้าให้กลับมาใช้บริการซ้ำ
- **เพิ่มยอดซื้อ**: กระตุ้นให้ซื้อเยอะขึ้นเพื่อขึ้น Rank
- **สร้าง Community**: ให้ลูกค้ารู้สึกเป็นส่วนหนึ่งของกลุ่ม VIP
- **เพิ่ม Engagement**: ทำให้เว็บไซต์น่าสนใจมากขึ้น

### 📊 หลักการทำงาน
```
ยอดซื้อสะสม (เดือน) → คำนวณ Points → กำหนด Rank → รับสิทธิประโยชน์
```

---

## 2. ระดับ Rank และสิทธิประโยชน์

### 🥉 Tier 1: Bronze Member
| รายละเอียด | ค่า |
|------------|-----|
| **ไอคอน** | 🥉 |
| **สี** | #CD7F32 (Bronze) |
| **เกณฑ์** | ยอดซื้อ 0 - 999 บาท/เดือน |
| **ส่วนลด** | - |
| **สิทธิพิเศษ** | เข้าถึงบริการพื้นฐาน |

### 🥈 Tier 2: Silver Member
| รายละเอียด | ค่า |
|------------|-----|
| **ไอคอน** | 🥈 |
| **สี** | #C0C0C0 (Silver) |
| **เกณฑ์** | ยอดซื้อ 1,000 - 4,999 บาท/เดือน |
| **ส่วนลด** | 2% ทุกบริการ |
| **สิทธิพิเศษ** | Priority Support |

### 🥇 Tier 3: Gold Member
| รายละเอียด | ค่า |
|------------|-----|
| **ไอคอน** | 🥇 |
| **สี** | #FFD700 (Gold) |
| **เกณฑ์** | ยอดซื้อ 5,000 - 14,999 บาท/เดือน |
| **ส่วนลด** | 5% ทุกบริการ |
| **สิทธิพิเศษ** | Priority Support, Early Access บริการใหม่ |

### 💎 Tier 4: Platinum Member
| รายละเอียด | ค่า |
|------------|-----|
| **ไอคอน** | 💎 |
| **สี** | #E5E4E2 (Platinum) |
| **เกณฑ์** | ยอดซื้อ 15,000 - 49,999 บาท/เดือน |
| **ส่วนลด** | 8% ทุกบริการ |
| **สิทธิพิเศษ** | VIP Support 24/7, Early Access, ของขวัญรายเดือน |

### 👑 Tier 5: Diamond Member
| รายละเอียด | ค่า |
|------------|-----|
| **ไอคอน** | 👑 |
| **สี** | #B9F2FF (Diamond) |
| **เกณฑ์** | ยอดซื้อ 50,000+ บาท/เดือน |
| **ส่วนลด** | 12% ทุกบริการ |
| **สิทธิพิเศษ** | VIP Support 24/7, ราคาพิเศษเฉพาะ Diamond, Account Manager, เครดิตฟรีรายเดือน |

### 📋 สรุปตาราง Rank

| Rank | ยอด/เดือน | ส่วนลด | Badge | สิทธิพิเศษหลัก |
|------|-----------|--------|-------|----------------|
| Bronze | 0-999฿ | 0% | 🥉 | - |
| Silver | 1K-4.9K฿ | 2% | 🥈 | Priority Support |
| Gold | 5K-14.9K฿ | 5% | 🥇 | Early Access |
| Platinum | 15K-49.9K฿ | 8% | 💎 | VIP Support |
| Diamond | 50K+฿ | 12% | 👑 | Account Manager |

---

## 3. เกณฑ์การคำนวณ Rank

### 📅 รอบการคำนวณ
- **รอบเดือน**: 1-สิ้นเดือน
- **รีเซ็ต**: ทุกวันที่ 1 ของเดือน
- **Grace Period**: รักษา Rank เดิมได้ 1 เดือนถ้ายอดไม่ถึง (ลดไม่เกิน 1 ระดับ)

### 📊 การคำนวณ Points
```
Points = ยอดซื้อที่ชำระแล้ว (บาท)

หมายเหตุ:
- นับเฉพาะ Order ที่ Status = Completed หรือ Partially Completed
- ไม่นับ Order ที่ Refund หรือ Cancelled
- 1 บาท = 1 Point
```

### 🔄 Rank Up / Rank Down Rules
```
Rank Up:
- อัปเดตทันทีเมื่อยอดสะสมถึงเกณฑ์
- แสดง Animation ฉลองเมื่อขึ้น Rank

Rank Down:
- เช็คทุกวันที่ 1 ของเดือน
- ถ้ายอดเดือนก่อนไม่ถึงเกณฑ์ → ลด 1 ระดับ
- Grace Period: ถ้ายอดขาดไม่เกิน 20% → รักษา Rank เดิม
```

### 🎁 Bonus Points (เพิ่มเติม)
- รีวิวบริการ: +5 Points/รีวิว
- เติมเงินครั้งแรกของเดือน: +50 Points
- ชวนเพื่อน (Referral): +100 Points/คน
- ซื้อบริการใหม่ (ไม่เคยซื้อมาก่อน): +20 Points

---

## 4. Leaderboard (กระดานอันดับ)

### 🏅 ประเภท Leaderboard

#### 4.1 Monthly Leaderboard (รายเดือน)
- แสดง Top 100 ยอดซื้อสูงสุดของเดือน
- รีเซ็ตทุกวันที่ 1
- รางวัลสำหรับ Top 10:
  - 🥇 อันดับ 1: เครดิต 500 บาท + Badge พิเศษ
  - 🥈 อันดับ 2: เครดิต 300 บาท
  - 🥉 อันดับ 3: เครดิต 200 บาท
  - อันดับ 4-10: เครดิต 50 บาท

#### 4.2 All-Time Leaderboard (ตลอดกาล)
- แสดง Top 100 ยอดซื้อสะสมตั้งแต่เริ่มใช้
- ไม่รีเซ็ต
- Badge พิเศษสำหรับ Top 3

### 📊 ข้อมูลที่แสดง
```
- อันดับ (#1, #2, ...)
- Avatar/Initials
- ชื่อผู้ใช้ (ซ่อนบางส่วน: us***123)
- Rank Badge
- ยอดซื้อ/Points
- Progress Bar (เทียบกับอันดับ 1)
```

### 🔒 Privacy Options
- ผู้ใช้เลือกได้ว่าจะแสดงใน Leaderboard หรือไม่
- ซ่อนชื่อผู้ใช้บางส่วนโดยอัตโนมัติ

---

## 5. องค์ประกอบ Gamification

### 🎯 5.1 Progress Tracking
```
┌─────────────────────────────────────────────────┐
│  💎 Platinum Member                              │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━░░░░░░░░  78%        │
│  ฿38,500 / ฿50,000 เพื่อขึ้น Diamond             │
│  เหลืออีก ฿11,500                                │
└─────────────────────────────────────────────────┘
```

### ⏰ 5.2 Countdown Timer
- แสดงเวลาที่เหลือก่อนสิ้นเดือน
- กระตุ้นให้รีบซื้อเพื่อขึ้น Rank หรือรักษา Rank

### 🎉 5.3 Milestone Celebrations
- แสดง Confetti/Animation เมื่อ:
  - ขึ้น Rank ใหม่
  - เข้า Top 10 Leaderboard
  - ซื้อครบ milestone (1K, 5K, 10K, ...)

### 📧 5.4 Notifications
- แจ้งเตือนเมื่อใกล้ขึ้น/ตก Rank
- แจ้งเตือนรายสัปดาห์: สรุปยอดและอันดับ
- แจ้งเตือนสิ้นเดือน: โอกาสสุดท้ายในการขึ้น Rank

### 🎁 5.5 Monthly Challenges
```
Challenge ประจำเดือน:
□ ซื้อบริการครบ 5 ครั้ง → +50 Points
□ รีวิวบริการ 3 รายการ → +30 Points  
□ เติมเงินครบ 3,000 บาท → +100 Points
□ ชวนเพื่อน 1 คน → +100 Points
```

---

## 6. UI/UX Design

### 📍 6.1 ตำแหน่งการแสดงผล

#### Header/Navbar
```
┌──────────────────────────────────────────────────────┐
│ [Logo]  Dashboard  Order  ...   [🥇 Gold] [฿1,250] [👤]│
└──────────────────────────────────────────────────────┘
                                    ↑
                              Badge แสดงตรงนี้
```

#### Sidebar (User Profile Section)
```
┌─────────────────────┐
│   👤 Username       │
│   🥇 Gold Member    │
│   ━━━━━━━━━░░ 78%   │
│   เหลือ ฿2,200      │
│   [ดูอันดับ]         │
└─────────────────────┘
```

#### Dashboard
- Card แสดง Rank ปัจจุบัน
- Progress ไปยัง Rank ถัดไป
- สิทธิประโยชน์ที่ได้รับ
- Mini Leaderboard (Top 5)

#### Dedicated Rank Page (/rank)
- Full Leaderboard
- Rank Benefits
- My Progress
- History
- Challenges

### 🎨 6.2 Design Elements

#### Rank Badges (แบบ Fastwork)
```
Bronze:  ┌──────┐
         │ 🥉   │ เรียบง่าย, สีบรอนซ์
         └──────┘

Silver:  ┌──────┐
         │ 🥈 ✦ │ มีประกาย, สีเงิน
         └──────┘

Gold:    ┌──────┐
         │ 🥇 ✦✦│ ประกายมากขึ้น, สีทอง
         └──────┘

Platinum:┌──────┐
         │ 💎 ✦✦│ ขอบเพชร, สีแพลตินัม
         └──────┘

Diamond: ┌──────┐
         │ 👑 ✦✦✦│ มงกุฎ, สีรุ้ง/gradient
         └──────┘
```

#### Color Scheme
```css
--rank-bronze: #CD7F32;
--rank-bronze-bg: #FFF5EB;
--rank-silver: #C0C0C0;
--rank-silver-bg: #F5F5F5;
--rank-gold: #FFD700;
--rank-gold-bg: #FFFBEB;
--rank-platinum: #E5E4E2;
--rank-platinum-bg: #F8F8FF;
--rank-diamond: linear-gradient(135deg, #B9F2FF, #FFB6C1, #DDA0DD);
--rank-diamond-bg: #F0FFFF;
```

### 📱 6.3 Responsive Design
- Mobile: Badge เล็กลง, Leaderboard แบบ simplified
- Tablet: เต็มรูปแบบ
- Desktop: เพิ่ม animations และ effects

---

## 7. Database Schema

### 📊 Tables (Conceptual)

#### user_ranks
```sql
CREATE TABLE user_ranks (
  id INT PRIMARY KEY,
  user_id INT NOT NULL,
  current_rank ENUM('bronze','silver','gold','platinum','diamond'),
  monthly_spend DECIMAL(10,2) DEFAULT 0,
  total_spend DECIMAL(10,2) DEFAULT 0,
  bonus_points INT DEFAULT 0,
  rank_updated_at TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

#### rank_history
```sql
CREATE TABLE rank_history (
  id INT PRIMARY KEY,
  user_id INT NOT NULL,
  from_rank VARCHAR(20),
  to_rank VARCHAR(20),
  reason VARCHAR(50), -- 'monthly_spend', 'bonus', 'grace_period'
  month_year VARCHAR(7), -- '2025-12'
  created_at TIMESTAMP
);
```

#### leaderboard_snapshots
```sql
CREATE TABLE leaderboard_snapshots (
  id INT PRIMARY KEY,
  user_id INT NOT NULL,
  rank_position INT,
  total_spend DECIMAL(10,2),
  month_year VARCHAR(7),
  leaderboard_type ENUM('monthly','alltime'),
  created_at TIMESTAMP
);
```

### 💾 LocalStorage (สำหรับ Demo)
```javascript
// Key: meelike_user_rank
{
  currentRank: 'gold',
  monthlySpend: 8500,
  totalSpend: 45000,
  bonusPoints: 250,
  rankHistory: [...],
  leaderboardPosition: 15,
  lastUpdated: '2025-12-29T10:00:00Z'
}
```

---

## 8. แผนการพัฒนา

### 📅 Phase 1: Core System (Week 1)
- [ ] สร้าง Rank utility functions
- [ ] สร้าง RankBadge component
- [ ] เพิ่ม Rank badge ใน Header/Navbar
- [ ] สร้างหน้า /rank (basic)
- [ ] Mock data สำหรับทดสอบ

### 📅 Phase 2: Dashboard Integration (Week 2)
- [ ] Rank Card บน Dashboard
- [ ] Progress Bar to next rank
- [ ] Mini Leaderboard widget
- [ ] Benefits section

### 📅 Phase 3: Full Leaderboard (Week 3)
- [ ] หน้า Leaderboard เต็มรูปแบบ
- [ ] Filter: Monthly / All-time
- [ ] Search ตำแหน่งตัวเอง
- [ ] Privacy settings

### 📅 Phase 4: Gamification (Week 4)
- [ ] Countdown timer
- [ ] Rank up/down animations
- [ ] Monthly challenges
- [ ] Notification system

### 📅 Phase 5: Polish & Rewards (Week 5)
- [ ] Auto-apply discount by rank
- [ ] Reward distribution system
- [ ] Email notifications
- [ ] Testing & bug fixes

---

## 9. Mockup Wireframes

### 9.1 Rank Card (Dashboard)
```
┌─────────────────────────────────────────────────────────┐
│                    🥇 GOLD MEMBER                        │
│  ┌─────────┐                                            │
│  │  👤     │   Username                                 │
│  │ Avatar  │   อันดับ #15 ประจำเดือน ธันวาคม 2025        │
│  └─────────┘                                            │
│                                                         │
│  ยอดซื้อเดือนนี้                                         │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━░░░░░░░░░░  65%             │
│  ฿8,500 / ฿15,000                                       │
│                                                         │
│  ⏰ เหลือเวลาอีก 2 วัน 20 ชม. 15 นาที                    │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐                     │
│  │ 🎁 สิทธิพิเศษ  │  │ 📊 ดูอันดับ   │                     │
│  └──────────────┘  └──────────────┘                     │
└─────────────────────────────────────────────────────────┘
```

### 9.2 Leaderboard Page
```
┌─────────────────────────────────────────────────────────┐
│  🏆 Leaderboard                                         │
│                                                         │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐       │
│  │ Bronze  │ │ Silver  │ │  Gold   │ │Platinum │       │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘       │
│                                                         │
│  ⏰ เหลือเวลาร่วมสนุกอีก: 2d 20h 15m 30s                 │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 1  🥇  us***23   👑 Diamond    ฿125,000  ━━━━━━━│   │
│  │ 2  🥈  jo***45   💎 Platinum   ฿98,000   ━━━━━━ │   │
│  │ 3  🥉  ma***67   💎 Platinum   ฿75,000   ━━━━━  │   │
│  │ 4      te***89   🥇 Gold       ฿45,000   ━━━━   │   │
│  │ 5      sa***12   🥇 Gold       ฿38,000   ━━━    │   │
│  │ ...                                             │   │
│  │ 15 ⭐  YOU       🥇 Gold       ฿8,500    ━      │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 🎁 รางวัล Top 10 ประจำเดือน                       │   │
│  │ 🥇 อันดับ 1: เครดิต 500฿ + Badge พิเศษ           │   │
│  │ 🥈 อันดับ 2: เครดิต 300฿                         │   │
│  │ 🥉 อันดับ 3: เครดิต 200฿                         │   │
│  │ อันดับ 4-10: เครดิต 50฿                          │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### 9.3 Profile Card (Sidebar)
```
┌───────────────────────────┐
│      ┌─────────────┐      │
│      │    👤       │      │
│      │   Avatar    │      │
│      └─────────────┘      │
│                           │
│      Saruth Borisuth      │
│      🥇 Gold Member       │
│                           │
│         #15               │
│   อันดับของคุณในช่วง       │
│   ธันวาคม 2025            │
│                           │
│       ฿8.5K               │
│    ยอดค่างานที่ขายได้       │
│                           │
│   ┌─────────────────┐     │
│   │ 🎁 ดูสิทธิพิเศษ   │     │
│   └─────────────────┘     │
└───────────────────────────┘
```

---

## 10. Success Metrics (KPIs)

### 📈 วัดผลสำเร็จ
- **Retention Rate**: % ลูกค้าที่กลับมาใช้ซ้ำ
- **Average Order Value**: ยอดซื้อเฉลี่ยต่อครั้ง
- **Monthly Active Users**: จำนวนผู้ใช้ต่อเดือน
- **Rank Distribution**: สัดส่วนลูกค้าในแต่ละ Rank
- **Upgrade Rate**: % ลูกค้าที่ขึ้น Rank

### 🎯 เป้าหมาย
- เพิ่ม Retention Rate 20%
- เพิ่ม Average Order Value 15%
- มีลูกค้า Gold+ อย่างน้อย 10% ของ Active Users

---

## 11. คำถามสำหรับตัดสินใจ

1. **ต้องการให้ Rank รีเซ็ตทุกเดือนหรือสะสมตลอดไป?**
   - แนะนำ: รีเซ็ตทุกเดือน แต่มี Grace Period

2. **ส่วนลดจะ Apply อัตโนมัติหรือต้องใส่โค้ด?**
   - แนะนำ: Apply อัตโนมัติ ให้รู้สึกพิเศษ

3. **จะเปิด Leaderboard ให้ทุกคนเห็นหรือเฉพาะสมาชิก?**
   - แนะนำ: เปิดให้ทุกคนเห็น เพื่อจูงใจ

4. **จะมีรางวัลพิเศษสำหรับ Top 10 หรือไม่?**
   - แนะนำ: มี เพื่อสร้างการแข่งขัน

---

*สร้างเมื่อ: 29 ธันวาคม 2025*
*อัปเดตล่าสุด: 29 ธันวาคม 2025*


