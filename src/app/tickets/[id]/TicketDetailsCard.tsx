// src/app/tickets/[id]/TicketDetailsCard.tsx

import React from 'react';
import { Ticket } from '../data';

interface TicketDetailsCardProps {
  ticket: Ticket;
}

const DetailItem = ({ label, value }: { label: string, value?: string | null }) => {
  if (!value) return null;
  return (
    <div>
      <p className="text-xs text-brand-text-light dark:text-dark-text-light">{label}</p>
      <p className="text-sm font-semibold text-brand-text-dark dark:text-dark-text-dark">{value}</p>
    </div>
  );
};

export default function TicketDetailsCard({ ticket }: TicketDetailsCardProps) {
  // In a real app, you would get this data from the form submission
  // Here we are mocking it based on category
  const getMockedDetails = (ticket: Ticket) => {
    switch (ticket.category) {
      case 'คำสั่งซื้อ':
        return {
          requestType: 'ขอเติมยอดลด',
          orderId: 'ORD-2025-000018',
        };
      case 'เติมเงินไม่เข้า':
        return {
          transactionId: '88X-123-4567',
          amount: '300.00',
        };
       case 'เช่าเว็บปั้มไลค์':
        return {
          requestTypeRent: 'สนใจเปิดเว็บไซค์',
        };
      case 'สมัครตัวแทน':
        return {
          username: 'saruth_bear',
        };
      default:
        return {};
    }
  };

  const details = getMockedDetails(ticket);

  return (
    <div className="p-5 bg-brand-secondary-light/50 dark:bg-dark-surface/50 border-l-4 border-brand-primary dark:border-dark-primary rounded-r-lg mb-6">
      <h3 className="text-md font-bold text-brand-text-dark dark:text-dark-text-dark mb-4">รายละเอียดที่แจ้งเข้ามา</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <DetailItem label="หัวข้อ" value={ticket.category} />
        {'requestType' in details && <DetailItem label="คำขอ" value={details.requestType} />}
        {'orderId' in details && <DetailItem label="Order ID" value={details.orderId} />}
        {'transactionId' in details && <DetailItem label="เลขธุรกรรม" value={details.transactionId} />}
        {'amount' in details && <DetailItem label="จำนวนเงิน" value={details.amount} />}
        {'requestTypeRent' in details && <DetailItem label="คำขอ (เช่าเว็บ)" value={details.requestTypeRent} />}
        {'username' in details && <DetailItem label="Username" value={details.username} />}
      </div>
      {ticket.messages[0]?.isUser && (
        <div className="mt-4 pt-4 border-t border-brand-border/50 dark:border-dark-border/50">
          <p className="text-xs text-brand-text-light dark:text-dark-text-light mb-1">ข้อความ:</p>
          <p className="text-sm text-brand-text-dark dark:text-dark-text-light whitespace-pre-wrap">
            {ticket.messages[0].text}
          </p>
        </div>
      )}
    </div>
  );
}
