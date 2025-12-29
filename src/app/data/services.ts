// src/app/data/services.ts
// Centralized Mock Service Data

export interface Service {
  id: number;
  category: 'facebook' | 'instagram' | 'tiktok' | 'youtube';
  name: string;
  price: number;
  min: number;
  max: number;
  speed: string; // e.g., "1K/วัน"
  avgTime: string; // e.g., "5 นาที"
  refill: boolean;
  unit: string; // e.g., "คน", "โพสต์"
}

export const allServices: Service[] = [
  // === Facebook Services ===
  { 
    id: 1, 
    category: "facebook", 
    name: "ถูกใจโพสอีโมจิ [😢 Sad]", 
    price: 68.59, 
    min: 50, 
    max: 100000, 
    speed: "1K/วัน",
    avgTime: "5 นาที", 
    refill: false, 
    unit: "โพสต์" 
  },
  { 
    id: 2, 
    category: "facebook", 
    name: "ถูกใจโพสอีโมจิ [❤️ Love]", 
    price: 75.00, 
    min: 100, 
    max: 50000, 
    speed: "5K/วัน",
    avgTime: "3 นาที", 
    refill: false, 
    unit: "โพสต์" 
  },
  { 
    id: 31, 
    category: "facebook", 
    name: "ถูกใจเพจ ♻️ ประกัน 30 วัน", 
    price: 110.77, 
    min: 100, 
    max: 10000, 
    speed: "5K/วัน",
    avgTime: "10 นาที", 
    refill: true, 
    unit: "เพจ" 
  },
  { 
    id: 101, 
    category: "facebook", 
    name: "ผู้ติดตามเพจ [คุณภาพสูง]", 
    price: 95.50, 
    min: 100, 
    max: 20000, 
    speed: "2K/วัน",
    avgTime: "15 นาที", 
    refill: true, 
    unit: "คน" 
  },
  { 
    id: 102, 
    category: "facebook", 
    name: "แชร์โพสต์ [ไทย 100%]", 
    price: 120.00, 
    min: 50, 
    max: 5000, 
    speed: "500/วัน",
    avgTime: "30 นาที", 
    refill: false, 
    unit: "ครั้ง" 
  },
  { 
    id: 103, 
    category: "facebook", 
    name: "คอมเมนต์แบบกำหนดเอง", 
    price: 150.00, 
    min: 10, 
    max: 1000, 
    speed: "100/วัน",
    avgTime: "1 ชั่วโมง", 
    refill: false, 
    unit: "คอมเมนต์" 
  },

  // === Instagram Services ===
  { 
    id: 3, 
    category: "instagram", 
    name: "ผู้ติดตาม (คนไทย)", 
    price: 120.00, 
    min: 100, 
    max: 10000, 
    speed: "1K/วัน",
    avgTime: "20 นาที", 
    refill: true, 
    unit: "คน" 
  },
  { 
    id: 4, 
    category: "instagram", 
    name: "ถูกใจโพสต์ (เร็ว)", 
    price: 30.50, 
    min: 20, 
    max: 20000, 
    speed: "20K/วัน",
    avgTime: "2 นาที", 
    refill: false, 
    unit: "โพสต์" 
  },
  { 
    id: 201, 
    category: "instagram", 
    name: "ผู้ติดตาม (International)", 
    price: 85.00, 
    min: 100, 
    max: 50000, 
    speed: "10K/วัน",
    avgTime: "10 นาที", 
    refill: true, 
    unit: "คน" 
  },
  { 
    id: 202, 
    category: "instagram", 
    name: "ยอดวิว Stories (24 ชม.)", 
    price: 25.00, 
    min: 100, 
    max: 100000, 
    speed: "50K/วัน",
    avgTime: "5 นาที", 
    refill: false, 
    unit: "วิว" 
  },
  { 
    id: 203, 
    category: "instagram", 
    name: "ยอดวิว Reels [จากประเทศไทย]", 
    price: 45.00, 
    min: 500, 
    max: 500000, 
    speed: "100K/วัน",
    avgTime: "8 นาที", 
    refill: false, 
    unit: "วิว" 
  },
  { 
    id: 204, 
    category: "instagram", 
    name: "บันทึกโพสต์ (Save)", 
    price: 50.00, 
    min: 50, 
    max: 10000, 
    speed: "2K/วัน",
    avgTime: "15 นาที", 
    refill: false, 
    unit: "ครั้ง" 
  },

  // === TikTok Services ===
  { 
    id: 5, 
    category: "tiktok", 
    name: "เพิ่มวิววิดีโอ", 
    price: 5.00, 
    min: 1000, 
    max: 1000000, 
    speed: "1M/วัน",
    avgTime: "2 นาที", 
    refill: false, 
    unit: "วิว" 
  },
  { 
    id: 301, 
    category: "tiktok", 
    name: "ผู้ติดตาม TikTok [ไทย]", 
    price: 95.00, 
    min: 100, 
    max: 20000, 
    speed: "5K/วัน",
    avgTime: "15 นาที", 
    refill: true, 
    unit: "คน" 
  },
  { 
    id: 302, 
    category: "tiktok", 
    name: "ถูกใจวิดีโอ (Fast)", 
    price: 12.00, 
    min: 100, 
    max: 500000, 
    speed: "100K/วัน",
    avgTime: "3 นาที", 
    refill: false, 
    unit: "ครั้ง" 
  },
  { 
    id: 303, 
    category: "tiktok", 
    name: "แชร์วิดีโอ", 
    price: 35.00, 
    min: 50, 
    max: 50000, 
    speed: "10K/วัน",
    avgTime: "10 นาที", 
    refill: false, 
    unit: "ครั้ง" 
  },
  { 
    id: 304, 
    category: "tiktok", 
    name: "คอมเมนต์ [Random]", 
    price: 80.00, 
    min: 10, 
    max: 1000, 
    speed: "500/วัน",
    avgTime: "30 นาที", 
    refill: false, 
    unit: "คอมเมนต์" 
  },
  { 
    id: 305, 
    category: "tiktok", 
    name: "Live Stream Views", 
    price: 60.00, 
    min: 100, 
    max: 10000, 
    speed: "Instant",
    avgTime: "ทันที", 
    refill: false, 
    unit: "คน" 
  },

  // === YouTube Services ===
  { 
    id: 401, 
    category: "youtube", 
    name: "ยอดวิววิดีโอ [High Retention]", 
    price: 150.00, 
    min: 500, 
    max: 100000, 
    speed: "10K/วัน",
    avgTime: "30 นาที", 
    refill: false, 
    unit: "วิว" 
  },
  { 
    id: 402, 
    category: "youtube", 
    name: "Subscribe ช่อง [มีการันตี]", 
    price: 250.00, 
    min: 100, 
    max: 5000, 
    speed: "500/วัน",
    avgTime: "1 ชั่วโมง", 
    refill: true, 
    unit: "คน" 
  },
  { 
    id: 403, 
    category: "youtube", 
    name: "ถูกใจวิดีโอ (Likes)", 
    price: 75.00, 
    min: 50, 
    max: 20000, 
    speed: "5K/วัน",
    avgTime: "20 นาที", 
    refill: false, 
    unit: "ครั้ง" 
  },
  { 
    id: 404, 
    category: "youtube", 
    name: "คอมเมนต์แบบกำหนดเอง", 
    price: 180.00, 
    min: 5, 
    max: 500, 
    speed: "50/วัน",
    avgTime: "2 ชั่วโมง", 
    refill: false, 
    unit: "คอมเมนต์" 
  },
  { 
    id: 405, 
    category: "youtube", 
    name: "Watch Time Hours", 
    price: 350.00, 
    min: 100, 
    max: 10000, 
    speed: "1K/วัน",
    avgTime: "2 ชั่วโมง", 
    refill: false, 
    unit: "ชั่วโมง" 
  },
];

// Helper Functions
export const getServiceById = (id: number): Service | undefined => {
  return allServices.find(service => service.id === id);
};

export const getServicesByCategory = (category: string): Service[] => {
  if (category === 'all') return allServices;
  return allServices.filter(service => service.category === category);
};


