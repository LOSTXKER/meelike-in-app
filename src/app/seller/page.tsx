'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { StatsCard, Card, CardHeader, Badge, StatusBadge } from '@/components/ui';
import { getCurrentSeller, getOrdersBySellerId, getPendingReviewClaims } from '@/lib/storage';
import type { Seller, Order } from '@/types';

export default function SellerDashboard() {
  const [seller, setSeller] = useState<Seller | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [pendingReviews, setPendingReviews] = useState(0);

  useEffect(() => {
    const currentSeller = getCurrentSeller();
    if (currentSeller) {
      setSeller(currentSeller);
      setOrders(getOrdersBySellerId(currentSeller.id));
      setPendingReviews(getPendingReviewClaims(currentSeller.id).length);
    }
  }, []);

  if (!seller) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin text-4xl">⏳</div>
      </div>
    );
  }

  const todayOrders = orders.filter((o) => {
    const orderDate = new Date(o.createdAt).toDateString();
    const today = new Date().toDateString();
    return orderDate === today;
  });

  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const processingOrders = orders.filter((o) => o.status === 'processing');

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-text-dark">
            สวัสดี, {seller.displayName} 👋
          </h1>
          <p className="text-brand-text-light mt-1">
            ยินดีต้อนรับกลับมา! นี่คือภาพรวมร้านของคุณ
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/seller/orders/new"
            className="btn-primary"
          >
            ➕ สร้างออเดอร์
          </Link>
          <Link
            href="/seller/team/jobs/new"
            className="btn-outline"
          >
            📋 สร้างงาน
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="ออเดอร์วันนี้"
          value={todayOrders.length}
          subtitle={`฿${todayOrders.reduce((sum, o) => sum + o.total, 0).toLocaleString()}`}
          icon="📦"
          variant="primary"
        />
        <StatsCard
          title="รอดำเนินการ"
          value={pendingOrders.length}
          subtitle="ออเดอร์ใหม่"
          icon="⏳"
          variant="warning"
        />
        <StatsCard
          title="กำลังทำ"
          value={processingOrders.length}
          subtitle="อยู่ระหว่างดำเนินการ"
          icon="🔄"
          variant="info"
        />
        <StatsCard
          title="รอตรวจสอบ"
          value={pendingReviews}
          subtitle="งานจากลูกทีม"
          icon="✅"
          variant={pendingReviews > 0 ? 'error' : 'success'}
        />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader title="ยอดเงินในบัญชี" action={
            <Link href="/seller/wallet" className="text-sm text-brand-primary hover:underline">
              ดูทั้งหมด →
            </Link>
          } />
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-brand-primary">
              ฿{seller.balance.toLocaleString()}
            </span>
          </div>
          <div className="mt-4 flex gap-2">
            <Link href="/seller/wallet/deposit" className="btn-secondary text-sm flex-1 text-center">
              เติมเงิน
            </Link>
            <Link href="/seller/wallet/history" className="btn-ghost text-sm flex-1 text-center">
              ประวัติ
            </Link>
          </div>
        </Card>

        <Card>
          <CardHeader title="สถิติเดือนนี้" />
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-brand-text-light">ออเดอร์</span>
              <span className="font-semibold">{seller.totalOrders}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-brand-text-light">รายได้</span>
              <span className="font-semibold text-brand-success">
                ฿{seller.totalRevenue.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-brand-text-light">Rating</span>
              <span className="font-semibold">
                ⭐ {seller.rating} ({seller.ratingCount})
              </span>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader title="Subscription" subtitle={`หมดอายุ: ${seller.planExpiresAt || '-'}`} />
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">
              {seller.plan === 'free' && '🆓'}
              {seller.plan === 'starter' && '🌟'}
              {seller.plan === 'pro' && '💎'}
              {seller.plan === 'business' && '🏢'}
            </span>
            <div>
              <p className="font-bold text-lg capitalize">{seller.plan}</p>
              <p className="text-sm text-brand-text-light">
                {seller.plan === 'pro' && 'ทีมไม่จำกัด, Bot ไม่จำกัด'}
              </p>
            </div>
          </div>
          <Link href="/seller/settings/subscription" className="btn-outline text-sm w-full text-center">
            จัดการแพ็คเกจ
          </Link>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader
          title="ออเดอร์ล่าสุด"
          action={
            <Link href="/seller/orders" className="text-sm text-brand-primary hover:underline">
              ดูทั้งหมด →
            </Link>
          }
        />
        
        {orders.length === 0 ? (
          <div className="text-center py-8 text-brand-text-light">
            <span className="text-4xl block mb-2">📦</span>
            ยังไม่มีออเดอร์
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-brand-border text-left">
                  <th className="pb-3 text-sm font-medium text-brand-text-light">เลขออเดอร์</th>
                  <th className="pb-3 text-sm font-medium text-brand-text-light">ลูกค้า</th>
                  <th className="pb-3 text-sm font-medium text-brand-text-light">ยอดเงิน</th>
                  <th className="pb-3 text-sm font-medium text-brand-text-light">สถานะ</th>
                  <th className="pb-3 text-sm font-medium text-brand-text-light"></th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="border-b border-brand-border last:border-0">
                    <td className="py-3">
                      <span className="font-mono text-sm">{order.orderNumber}</span>
                    </td>
                    <td className="py-3">
                      <div>
                        <p className="font-medium text-brand-text-dark">{order.customer.name}</p>
                        <p className="text-xs text-brand-text-light">{order.customer.contactValue}</p>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className="font-semibold">฿{order.total.toLocaleString()}</span>
                    </td>
                    <td className="py-3">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="py-3 text-right">
                      <Link
                        href={`/seller/orders/${order.id}`}
                        className="text-brand-primary hover:underline text-sm"
                      >
                        ดูรายละเอียด
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Pending Reviews Alert */}
      {pendingReviews > 0 && (
        <Card className="border-brand-warning bg-brand-warning/5">
          <div className="flex items-center gap-4">
            <span className="text-3xl">⚠️</span>
            <div className="flex-1">
              <h3 className="font-semibold text-brand-text-dark">
                มี {pendingReviews} งานรอตรวจสอบ
              </h3>
              <p className="text-sm text-brand-text-light">
                ลูกทีมส่งงานมาแล้ว รอคุณตรวจสอบและอนุมัติ
              </p>
            </div>
            <Link href="/seller/team/review" className="btn-primary">
              ตรวจสอบเลย
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
}

