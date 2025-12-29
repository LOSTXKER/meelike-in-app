// src/app/utils/mockData.ts

/**
 * Mock data generator for testing the review system and leaderboard
 * This file only exports functions - no auto-execution
 */

import { 
  saveReview, 
  isMockDataInitialized, 
  setMockDataInitialized, 
  saveLeaderboardData,
  isLeaderboardInitialized,
  getRankLevel,
  type ReviewData,
  type LeaderboardUser,
  type LeaderboardData
} from './localStorage';

export function generateMockReviews(): ReviewData[] {
  const mockReviews: ReviewData[] = [
    // Reviews for actual orders in history page
    // ORD-2025-000029 - TikTok ไลค์ (Completed)
    {
      id: 'REV-REAL-001',
      orderId: 'ORD-2025-000029',
      userId: 'user123',
      serviceId: '302', // TikTok ถูกใจวิดีโอ (Fast)
      serviceName: 'TikTok ถูกใจวิดีโอ (Fast)',
      qualityRating: 5,
      speedRating: 5,
      valueRating: 5,
      reviewText: 'บริการดีมากครับ ไลค์เข้าเร็วมาก ภายใน 2 ชั่วโมง คุณภาพดีเยี่ยม คุ้มค่าเงินสุดๆ',
      reviewLength: 72,
      isAnonymous: false,
      creditGiven: 0.25,
      createdAt: new Date('2025-12-28T12:00:00').toISOString(),
      isFlagged: false,
    },
    
    // ORD-2025-000028 - Facebook ถูกใจ (Completed)
    {
      id: 'REV-REAL-002',
      orderId: 'ORD-2025-000028',
      userId: 'user123',
      serviceId: '1',
      serviceName: 'Facebook ถูกใจโพสต์',
      qualityRating: 4,
      speedRating: 5,
      valueRating: 4,
      reviewText: 'ดีครับ ถูกใจเข้าไวมาก บริการรวดเร็ว แต่มีบางส่วนดร็อปไปนิดหน่อย โดยรวมโอเค',
      reviewLength: 75,
      isAnonymous: false,
      creditGiven: 0.25,
      createdAt: new Date('2025-12-27T17:30:00').toISOString(),
      isFlagged: false,
    },
  ];

  // Helper arrays for generating variations
  const services = [
    { id: '3', name: 'Instagram ผู้ติดตาม (คนไทย)' },
    { id: '5', name: 'TikTok เพิ่มวิววิดีโอ' },
    { id: '1', name: 'Facebook ถูกใจโพสต์' }
  ];

  const reviewTemplates = [
    'บริการดีมากครับ งานไว ได้ครบตามจำนวนที่สั่ง',
    'ยอดเยี่ยมครับ จะกลับมาใช้บริการอีกแน่นอน',
    'งานดี ราคาถูก คุ้มค่ามากครับ',
    'รวดเร็วทันใจมากครับ แนะนำเลย',
    'ชอบมากครับ บริการดี แอดมินตอบไว',
    'งานไวมากครับ ไม่ผิดหวังเลย',
    'ราคาดี คุณภาพดี สั่งประจำครับ',
    'ดีมากครับ ระบบใช้งานง่าย สะดวก',
    'ได้รับยอดครบถ้วน รวดเร็วมากครับ',
    'ใช้บริการตลอดครับ ไม่เคยมีปัญหา'
  ];

  // Generate 50 mock reviews for each service
  services.forEach(service => {
    for (let i = 1; i <= 50; i++) {
      // Random rating mostly 4 or 5
      const baseRating = Math.random() > 0.3 ? 5 : 4;
      const quality = Math.random() > 0.2 ? baseRating : baseRating - 1;
      const speed = Math.random() > 0.2 ? baseRating : baseRating - 1;
      const value = Math.random() > 0.2 ? baseRating : baseRating - 1;

      // Random date within last 30 days
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 30));

      mockReviews.push({
        id: `REV-MOCK-${service.id}-${i}`,
        orderId: `ORD-MOCK-${service.id}-${i}`,
        userId: `user${1000 + i}`,
        serviceId: service.id,
        serviceName: service.name,
        qualityRating: Math.max(1, quality),
        speedRating: Math.max(1, speed),
        valueRating: Math.max(1, value),
        reviewText: reviewTemplates[Math.floor(Math.random() * reviewTemplates.length)],
        reviewLength: 50,
        isAnonymous: Math.random() > 0.5,
        creditGiven: 0.25,
        createdAt: date.toISOString(),
        isFlagged: false,
      });
    }
  });

  return mockReviews;
}

// Generate mock leaderboard data - TOP 100
export function generateMockLeaderboard(): LeaderboardData {
  // Generate 100 mock usernames
  const firstParts = ['ta', 'to', 'LA', 'mi', 'so', 'ba', 'ki', 'na', 'ch', 'ar', 
                      'pe', 'vi', 'da', 'jo', 'li', 'ma', 'al', 'ro', 'sa', 'em',
                      'no', 'ka', 'yu', 'wa', 'mo', 'ke', 'su', 'ha', 'ra', 'te',
                      'ya', 'fu', 'ko', 'se', 'ni', 'hi', 'pa', 'pu', 'me', 'mu',
                      'ri', 'ne', 'ti', 'tu', 'fa', 'fe', 'ga', 'gi', 'go', 'gu'];
  const lastParts = ['a', 'y', 'k', 'n', 'p', 'r', 'o', 'z', 'm', 's',
                     't', 'e', 'l', 'h', 'x', 'b', 'c', 'd', 'f', 'g',
                     'i', 'j', 'q', 'u', 'v', 'w'];

  const mockUsernames: string[] = [];
  for (let i = 0; i < 110; i++) {
    const first = firstParts[i % firstParts.length];
    const last = lastParts[i % lastParts.length];
    mockUsernames.push(`${first}***${last}`);
  }

  // Generate monthly spending (descending order) for Top 100
  // Top 1: ~200K, gradually decreasing
  const monthlyLeaderboard: LeaderboardUser[] = mockUsernames.slice(0, 100).map((username, index) => {
    // Create a curve: top users have much higher spending
    let baseSpending: number;
    if (index < 3) {
      baseSpending = 200000 - (index * 30000); // 200K, 170K, 140K
    } else if (index < 10) {
      baseSpending = 120000 - ((index - 3) * 8000); // 120K - 64K
    } else if (index < 20) {
      baseSpending = 55000 - ((index - 10) * 3000); // 55K - 28K
    } else if (index < 50) {
      baseSpending = 25000 - ((index - 20) * 500); // 25K - 10K
    } else {
      baseSpending = 9500 - ((index - 50) * 100); // 9.5K - 4.5K
    }
    
    const monthlySpending = Math.max(1000, Math.floor(baseSpending + (Math.random() * 1000)));
    const allTimeSpending = monthlySpending * (2 + Math.random() * 6);
    
    return {
      id: `user-${index + 1}`,
      username,
      rankLevel: getRankLevel(allTimeSpending),
      monthlySpending,
      allTimeSpending: Math.floor(allTimeSpending),
      monthlyRank: index + 1
    };
  });

  // Generate all-time leaderboard (different order - reuse and sort by all-time)
  const allTimeLeaderboard: LeaderboardUser[] = [...monthlyLeaderboard]
    .sort((a, b) => b.allTimeSpending - a.allTimeSpending)
    .map((user, index) => ({
      ...user,
      allTimeRank: index + 1
    }));

  // Current user data - position around 55 (can get 20฿ reward if reaches top 100)
  const currentUser: LeaderboardUser = {
    id: 'current-user',
    username: 'Saruth',
    avatar: 'https://placehold.co/100x100/FCD77F/473B30?text=S',
    rankLevel: 'น้องหมี',
    monthlySpending: 8500,
    allTimeSpending: 25000,
    monthlyRank: 55,
    allTimeRank: 60
  };

  // Calculate month end date
  const now = new Date();
  const monthEndDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString();

  return {
    monthlyLeaderboard,
    allTimeLeaderboard,
    currentUser,
    monthEndDate
  };
}

// Function to initialize mock data (call from client component only)
export function initializeMockData(): void {
  // Always regenerate mock data for testing purposes
  // Clear old data to ensure fresh state
  if (typeof window !== 'undefined') {
    localStorage.removeItem('meelike_reviews');
    localStorage.removeItem('meelike_daily_login'); // Reset daily login for testing
  }

  const mockReviews = generateMockReviews();
  mockReviews.forEach(review => saveReview(review));
  setMockDataInitialized();
  console.log(`Mock reviews initialized: ${mockReviews.length} reviews`);

  // Initialize leaderboard data (always refresh for testing)
  const leaderboardData = generateMockLeaderboard();
  saveLeaderboardData(leaderboardData);
  console.log('Leaderboard data initialized');
  console.log('Daily login data reset for testing');
}
