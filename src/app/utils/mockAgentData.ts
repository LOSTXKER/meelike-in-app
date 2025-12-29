// src/app/utils/mockAgentData.ts
// ═══════════════════════════════════════════════════════════════════════════
// 🎭 MOCK AGENT DATA - สำหรับทดสอบระบบ Agent
// ═══════════════════════════════════════════════════════════════════════════

import { 
  createStore, 
  addStoreService,
  createClient,
  createBill,
  updateBillStatus,
  getStoreByAgentId,
} from '@/app/utils/storage';

export const initializeMockAgentData = () => {
  const agentId = 'agent-001';
  const agentUsername = 'mystore';
  
  // Check if already initialized
  const existingStore = getStoreByAgentId(agentId);
  if (existingStore) {
    console.log('Mock agent data already exists');
    return;
  }
  
  try {
    // 1. Create Agent Store
    const store = createStore(agentId, {
      name: 'Social Media Pro',
      username: agentUsername,
      description: 'ผู้ให้บริการโซเชียลมีเดียคุณภาพสูง มีประสบการณ์กว่า 5 ปี รับประกันความพึงพอใจ 100%',
      contactLine: 'socialmediapro',
      contactFacebook: 'https://facebook.com/socialmediapro',
      contactPhone: '081-234-5678',
      contactEmail: 'contact@socialmediapro.com',
      paymentInfo: {
        promptPayNumber: '0812345678',
        promptPayName: 'นาย สมชาย ใจดี',
        bankAccount: '1234567890',
        bankName: 'ธนาคารกสิกรไทย',
        accountName: 'นาย สมชาย ใจดี',
      },
    });
    
    // 2. Add Services to Store
    const services = [
      { serviceId: 1, salePrice: 150, description: 'เพิ่มผู้ติดตามคุณภาพสูง คนไทยแท้' },
      { serviceId: 3, salePrice: 200, description: 'ถูกใจโพสต์เร็ว ปลอดภัย ไม่ดรอป' },
      { serviceId: 5, salePrice: 180, description: 'วิวจากคนไทย รับประกันไม่ดรอป' },
      { serviceId: 10, salePrice: 250, description: 'เพิ่มยอดขายสินค้าบน Shopee' },
    ];
    
    services.forEach(service => {
      addStoreService(agentId, {
        serviceId: service.serviceId,
        salePrice: service.salePrice,
        description: service.description,
        isActive: true,
      });
    });
    
    // 3. Create Clients
    const client1 = createClient(agentId, {
      name: 'ร้านเสื้อผ้าแฟชั่น A',
      contactPerson: 'คุณสมหญิง',
      phone: '081-111-2222',
      email: 'fashion-a@example.com',
      socialMedia: {
        facebook: 'https://facebook.com/fashion-a',
        instagram: 'fashion_a_shop',
      },
      tags: ['ลูกค้าประจำ', 'แฟชั่น'],
      notes: 'ซื้อบ่อย ชอบโปรโมชั่น',
    });
    
    const client2 = createClient(agentId, {
      name: 'ร้านกาแฟ Coffee House',
      contactPerson: 'คุณมานะ',
      phone: '082-333-4444',
      email: 'coffee@example.com',
      socialMedia: {
        facebook: 'https://facebook.com/coffeehouse',
        line: 'coffeehouse_th',
      },
      tags: ['คาเฟ่', 'VIP'],
      notes: 'ยอดใหญ่ ส่วนลดพิเศษ',
    });
    
    const client3 = createClient(agentId, {
      name: 'ร้านขายของออนไลน์ B',
      phone: '089-555-6666',
      tags: ['ออนไลน์'],
    });
    
    // 4. Create Bills
    // Bill 1: Completed
    const bill1 = createBill(agentId, agentUsername, {
      clientId: client1.id,
      clientName: client1.name,
      clientContact: client1.phone!,
      serviceId: 1,
      serviceName: 'ผู้ติดตาม Instagram (คนไทย)',
      category: 'Instagram',
      link: 'https://instagram.com/fashion_a_shop',
      quantity: 500,
      salePrice: 750,
      customerNote: 'ต้องการผู้ติดตามคุณภาพดี',
    });
    updateBillStatus(bill1.id, 'confirmed');
    updateBillStatus(bill1.id, 'processing');
    updateBillStatus(bill1.id, 'completed');
    
    // Bill 2: Processing
    const bill2 = createBill(agentId, agentUsername, {
      clientId: client2.id,
      clientName: client2.name,
      clientContact: client2.phone!,
      serviceId: 3,
      serviceName: 'ถูกใจโพสต์ [❤️ Love]',
      category: 'Facebook',
      link: 'https://facebook.com/coffeehouse/posts/123',
      quantity: 1000,
      salePrice: 1000,
      agentNote: 'ลูกค้า VIP',
    });
    updateBillStatus(bill2.id, 'confirmed');
    updateBillStatus(bill2.id, 'processing');
    
    // Bill 3: Confirmed
    const bill3 = createBill(agentId, agentUsername, {
      clientId: client1.id,
      clientName: client1.name,
      clientContact: client1.phone!,
      serviceId: 5,
      serviceName: 'วิว TikTok',
      category: 'TikTok',
      link: 'https://tiktok.com/@fashion_a/video/123',
      quantity: 5000,
      salePrice: 900,
    });
    updateBillStatus(bill3.id, 'confirmed');
    
    // Bill 4: Pending
    createBill(agentId, agentUsername, {
      clientId: client3.id,
      clientName: client3.name,
      clientContact: client3.phone!,
      serviceId: 10,
      serviceName: 'ยอดขาย Shopee',
      category: 'Shopee',
      link: 'https://shopee.co.th/shop/123',
      quantity: 50,
      salePrice: 500,
      customerNote: 'สั่งจากหน้าร้าน',
    });
    
    // Bill 5: Completed (from store)
    const bill5 = createBill(agentId, agentUsername, {
      clientName: 'คุณลูกค้าใหม่',
      clientContact: '091-777-8888',
      serviceId: 1,
      serviceName: 'ผู้ติดตาม Instagram (คนไทย)',
      category: 'Instagram',
      link: 'https://instagram.com/new_customer',
      quantity: 100,
      salePrice: 150,
      customerNote: 'สั่งผ่านหน้าร้าน',
    });
    updateBillStatus(bill5.id, 'confirmed');
    updateBillStatus(bill5.id, 'processing');
    updateBillStatus(bill5.id, 'completed');
    
    console.log('✅ Mock agent data initialized successfully');
    console.log(`📦 Store: ${store.name} (@${store.username})`);
    console.log(`👥 Clients: 3`);
    console.log(`📋 Bills: 5`);
  } catch (error) {
    console.error('❌ Failed to initialize mock agent data:', error);
  }
};

// Auto-initialize on import (for development)
if (typeof window !== 'undefined') {
  // Run only once per session
  const INIT_KEY = 'agent_mock_data_initialized';
  if (!sessionStorage.getItem(INIT_KEY)) {
    initializeMockAgentData();
    sessionStorage.setItem(INIT_KEY, 'true');
  }
}

