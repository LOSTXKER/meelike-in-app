// src/app/tickets/data.ts

export type TicketStatus = 'Open' | 'Answered' | 'Closed';
export type TicketCategory = 'คำสั่งซื้อ' | 'เติมเงินไม่เข้า' | 'เช่าเว็บปั้มไลค์' | 'สมัครตัวแทน' | 'แจ้งเรื่องใบเสร็จ/ใบกำกับภาษี' | 'สอบถามทั่วไป-อื่นๆ';

export interface TicketMessage {
  id: number;
  author: string;
  avatar: string;
  text: string;
  timestamp: string;
  isUser: boolean;
}

export interface Ticket {
    id: string;
    subject: string;
    status: TicketStatus;
    category: TicketCategory;
    lastUpdated: string;
    createdAt: string;
    messages: TicketMessage[];
}

export const dummyTickets: Ticket[] = [
    { 
        id: 'TICKET-0012', 
        subject: 'เติมเงินแล้วยอดไม่เข้าครับ', 
        status: 'Answered', 
        category: 'เติมเงินไม่เข้า', 
        lastUpdated: '20/08/2025 11:30',
        createdAt: '20/08/2025 11:00',
        messages: [
            { id: 1, author: 'Saruth', avatar: 'https://placehold.co/100x100/FCD77F/473B30?text=S', text: 'เติมเงินผ่าน QR Code ไป 300 บาท แต่ยอดเงินยังไม่เข้าเลยครับ', timestamp: '20/08/2025 11:00', isUser: true },
            { id: 2, author: 'Support Team', avatar: 'https://placehold.co/100x100/77C6FC/FFFFFF?text=ST', text: 'ขอทราบเวลาที่ทำรายการและขอสลิปการโอนเงินเพื่อตรวจสอบครับ', timestamp: '20/08/2025 11:05', isUser: false },
            { id: 3, author: 'Saruth', avatar: 'https://placehold.co/100x100/FCD77F/473B30?text=S', text: 'ประมาณ 10:58 ครับ นี่สลิปครับ [ไฟล์แนบ]', timestamp: '20/08/2025 11:10', isUser: true },
            { id: 4, author: 'Support Team', avatar: 'https://placehold.co/100x100/77C6FC/FFFFFF?text=ST', text: 'ได้รับข้อมูลแล้วครับ กำลังดำเนินการตรวจสอบและปรับยอดให้ครับ', timestamp: '20/08/2025 11:30', isUser: false },
        ]
    },
    { 
        id: 'TICKET-0011', 
        subject: 'สอบถามเรื่องการเชื่อมต่อ API', 
        status: 'Closed', 
        category: 'เช่าเว็บปั้มไลค์', 
        lastUpdated: '18/08/2025 15:00',
        createdAt: '18/08/2025 14:00',
        messages: [
             { id: 1, author: 'Saruth', avatar: 'https://placehold.co/100x100/FCD77F/473B30?text=S', text: 'API key เอาจากตรงไหนครับ', timestamp: '18/08/2025 14:00', isUser: true },
             { id: 2, author: 'Support Team', avatar: 'https://placehold.co/100x100/77C6FC/FFFFFF?text=ST', text: 'สามารถดูได้ที่หน้าตั้งค่า > API ครับ', timestamp: '18/08/2025 15:00', isUser: false },
        ]
    },
    { 
        id: 'TICKET-0010', 
        subject: 'คำสั่งซื้อ #ORD-2025-000018 มีปัญหา', 
        status: 'Open', 
        category: 'คำสั่งซื้อ', 
        lastUpdated: '15/08/2025 09:12',
        createdAt: '15/08/2025 09:12',
        messages: [
            { id: 1, author: 'Saruth', avatar: 'https://placehold.co/100x100/FCD77F/473B30?text=S', text: 'สั่งซื้อไปแล้วแต่สถานะยังไม่เปลี่ยนเลยครับ', timestamp: '15/08/2025 09:12', isUser: true },
        ]
    },
    { 
        id: 'TICKET-0009', 
        subject: 'ต้องการใบกำกับภาษี', 
        status: 'Closed', 
        category: 'แจ้งเรื่องใบเสร็จ/ใบกำกับภาษี', 
        lastUpdated: '14/08/2025 17:00',
        createdAt: '14/08/2025 16:00',
        messages: []
    },
    { 
        id: 'TICKET-0008', 
        subject: 'สนใจสมัครเป็นตัวแทน', 
        status: 'Answered', 
        category: 'สมัครตัวแทน', 
        lastUpdated: '12/08/2025 10:00',
        createdAt: '12/08/2025 09:00',
        messages: []
    },
];
