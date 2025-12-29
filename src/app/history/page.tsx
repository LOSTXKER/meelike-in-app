// src/app/history/page.tsx
"use client";

import React, { useState, useMemo, useEffect } from 'react';
import StatusFilter, { OrderStatus } from '@/app/components/StatusFilter';
import CategoryDropdown, { filterCategories, Category } from '@/app/components/CategoryDropdown';
import Table from '@/app/components/Table';
import ReviewButton from '@/app/components/ReviewButton';
import ReviewModal from '@/app/components/ReviewModal';
import ReviewSuccessModal from '@/app/components/ReviewSuccessModal';
import ViewReviewModal from '@/app/components/ViewReviewModal';
import { 
    hasReviewForOrder, 
    saveReview, 
    updateCreditBalance,
    getCreditBalance,
    getReviewByOrderId,
    type ReviewData 
} from '@/app/utils/localStorage';

// --- Icons ---
const FilterIcon = () => <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>;
const SearchIcon = () => <svg className="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>;

// --- Type Definitions ---
interface Order {
    id: string;
    orderDate: string;
    serviceName: string;
    serviceId: number;
    link: string;
    dripFeed: boolean;
    quantity: number;
    charge: number; // เพิ่ม: มูลค่า order (บาท)
    progress: number;
    status: OrderStatus;
    completionDate: string | null;
}

// --- Dummy Data ---
const dummyOrders: Order[] = [
    // Recent Completed Orders (for review testing)
    { id: 'ORD-2025-000030', orderDate: '29/12/2025 14:30', serviceName: 'Instagram ผู้ติดตาม (คนไทย)', serviceId: 3, link: 'https://instagram.com/user1', dripFeed: false, quantity: 1000, charge: 120.00, progress: 100, status: 'Completed', completionDate: '29/12/2025 15:45' },
    { id: 'ORD-2025-000029', orderDate: '28/12/2025 10:15', serviceName: 'TikTok เพิ่มไลค์วิดีโอ', serviceId: 7, link: 'https://tiktok.com/video/11111', dripFeed: false, quantity: 5000, charge: 60.00, progress: 100, status: 'Completed', completionDate: '28/12/2025 12:00' },
    { id: 'ORD-2025-000028', orderDate: '27/12/2025 16:20', serviceName: 'Facebook ถูกใจโพสต์', serviceId: 1, link: 'https://facebook.com/posts/22222', dripFeed: false, quantity: 500, charge: 34.30, progress: 100, status: 'Completed', completionDate: '27/12/2025 17:30' },
    { id: 'ORD-2025-000027', orderDate: '26/12/2025 09:45', serviceName: 'YouTube Subscribe', serviceId: 10, link: 'https://youtube.com/channel/abc', dripFeed: true, quantity: 200, charge: 50.00, progress: 100, status: 'Completed', completionDate: '26/12/2025 14:00' },
    { id: 'ORD-2025-000026', orderDate: '25/12/2025 11:30', serviceName: 'Instagram Views รูปภาพ', serviceId: 4, link: 'https://instagram.com/post/456', dripFeed: false, quantity: 10000, charge: 305.00, progress: 100, status: 'Completed', completionDate: '25/12/2025 13:45' },
    { id: 'ORD-2025-000025', orderDate: '24/12/2025 15:00', serviceName: 'TikTok ผู้ติดตาม (คนไทย)', serviceId: 6, link: 'https://tiktok.com/@user123', dripFeed: false, quantity: 800, charge: 76.00, progress: 100, status: 'Completed', completionDate: '24/12/2025 16:20' },
    { id: 'ORD-2025-000024', orderDate: '23/12/2025 08:20', serviceName: 'Facebook คอมเมนต์ (คนไทย)', serviceId: 2, link: 'https://facebook.com/posts/33333', dripFeed: false, quantity: 50, charge: 7.50, progress: 100, status: 'Completed', completionDate: '23/12/2025 09:30' }, // < 10 บาท
    { id: 'ORD-2025-000023', orderDate: '22/12/2025 13:10', serviceName: 'Instagram ถูกใจโพสต์', serviceId: 8, link: 'https://instagram.com/post/789', dripFeed: false, quantity: 2000, charge: 61.00, progress: 100, status: 'Completed', completionDate: '22/12/2025 14:45' },
    { id: 'ORD-2025-000022', orderDate: '21/12/2025 10:50', serviceName: 'TikTok เพิ่มวิววิดีโอ', serviceId: 5, link: 'https://tiktok.com/video/55555', dripFeed: false, quantity: 15000, charge: 75.00, progress: 100, status: 'Completed', completionDate: '21/12/2025 13:20' },
    { id: 'ORD-2025-000021', orderDate: '20/12/2025 15:53', serviceName: 'Facebook ถูกใจโพสอีโมจิ [😢 Sad]', serviceId: 45, link: 'https://facebook.com/posts/12345', dripFeed: false, quantity: 100, charge: 6.86, progress: 100, status: 'Completed', completionDate: '20/12/2025 16:30' }, // < 10 บาท
    
    // In Progress Orders
    { id: 'ORD-2025-000020', orderDate: '29/12/2025 16:00', serviceName: 'YouTube Views', serviceId: 11, link: 'https://youtube.com/watch?v=xyz', dripFeed: false, quantity: 50000, charge: 7500.00, progress: 45, status: 'In Progress', completionDate: null },
    { id: 'ORD-2025-000019', orderDate: '29/12/2025 12:05', serviceName: 'Instagram ผู้ติดตาม (Global)', serviceId: 9, link: 'https://instagram.com/user999', dripFeed: true, quantity: 5000, charge: 425.00, progress: 65, status: 'In Progress', completionDate: null },
    
    // Pending Orders
    { id: 'ORD-2025-000018', orderDate: '29/12/2025 17:10', serviceName: 'TikTok คอมเมนต์', serviceId: 12, link: 'https://tiktok.com/video/66666', dripFeed: false, quantity: 30, charge: 24.00, progress: 0, status: 'Pending', completionDate: null },
    
    // Other Status Orders
    { id: 'ORD-2025-000017', orderDate: '19/12/2025 14:30', serviceName: 'Facebook แชร์โพสต์', serviceId: 15, link: 'https://facebook.com/posts/44444', dripFeed: false, quantity: 100, charge: 12.00, progress: 100, status: 'Completed', completionDate: '19/12/2025 15:00' },
    { id: 'ORD-2025-000016', orderDate: '18/12/2025 11:20', serviceName: 'Instagram Likes - Real', serviceId: 2, link: 'https://instagram.com/post/111', dripFeed: false, quantity: 1500, charge: 45.75, progress: 80, status: 'Partially Completed', completionDate: null },
    { id: 'ORD-2025-000015', orderDate: '17/12/2025 09:15', serviceName: 'TikTok แชร์วิดีโอ', serviceId: 13, link: 'https://tiktok.com/video/77777', dripFeed: false, quantity: 200, charge: 7.00, progress: 0, status: 'Canceled', completionDate: null }, // < 10 บาท
];

const statusStyles: { [key in OrderStatus]: string } = {
    Completed: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
    'In Progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    Canceled: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    'Partially Completed': 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
    Error: 'bg-red-200 text-red-900 dark:bg-red-800/50 dark:text-red-200 font-bold',
    Awaiting: 'bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200',
    Processing: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300',
    'On Refill': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/50 dark:text-cyan-300',
    Refilled: 'bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-300',
    Fail: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
};


export default function HistoryPage() {
    const [activeStatus, setActiveStatus] = useState<OrderStatus | 'All'>('All');
    const [selectedCategory, setSelectedCategory] = useState<Category>(filterCategories[0]);
    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [viewReviewModalOpen, setViewReviewModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [selectedReview, setSelectedReview] = useState<ReviewData | null>(null);
    const [successModalOpen, setSuccessModalOpen] = useState(false);
    const [reviewedOrders, setReviewedOrders] = useState<Set<string>>(new Set());
    const [creditBalance, setCreditBalance] = useState<number>(1250);
    const [mounted, setMounted] = useState(false);
    
    useEffect(() => {
        setMounted(true);
        // Check which orders have reviews and get current balance
        const reviewed = new Set<string>();
        dummyOrders.forEach(order => {
            if (hasReviewForOrder(order.id)) {
                reviewed.add(order.id);
            }
        });
        setReviewedOrders(reviewed);
        setCreditBalance(getCreditBalance());
    }, []);
    
    const filteredOrders = useMemo(() => {
        if (activeStatus === 'All') return dummyOrders;
        return dummyOrders.filter(order => order.status === activeStatus);
    }, [activeStatus]);
    
    const handleReviewClick = (order: Order) => {
        // Check if already reviewed
        if (hasReviewForOrder(order.id)) {
            // Show existing review
            const existingReview = getReviewByOrderId(order.id);
            setSelectedReview(existingReview);
            setViewReviewModalOpen(true);
        } else {
            // Open review form
            setSelectedOrder(order);
            setReviewModalOpen(true);
        }
    };

    const handleReviewSubmit = (reviewData: {
        qualityRating: number;
        speedRating: number;
        valueRating: number;
        reviewText: string;
        isAnonymous: boolean;
    }) => {
        if (!selectedOrder) return;

        const review: ReviewData = {
            id: `REV-${Date.now()}`,
            orderId: selectedOrder.id,
            userId: 'user123',
            serviceId: selectedOrder.serviceId.toString(),
            serviceName: selectedOrder.serviceName,
            qualityRating: reviewData.qualityRating,
            speedRating: reviewData.speedRating,
            valueRating: reviewData.valueRating,
            reviewText: reviewData.reviewText,
            reviewLength: reviewData.reviewText.length,
            isAnonymous: reviewData.isAnonymous,
            creditGiven: 0.25,
            createdAt: new Date().toISOString(),
            isFlagged: false
        };

        saveReview(review);
        updateCreditBalance(0.25);
        
        // Update local state
        setReviewedOrders(prev => new Set(prev).add(selectedOrder.id));
        setCreditBalance(prev => prev + 0.25);
        setReviewModalOpen(false);
        setSuccessModalOpen(true);
    };
    
    const tableHeaders = [
        { label: 'รหัสรายการสั่งซื้อ', align: 'left' as const },
        { label: 'บริการ', align: 'left' as const },
        { label: 'ลิงก์', align: 'left' as const },
        { label: 'จำนวน', align: 'center' as const },
        { label: 'ยอดรวม (฿)', align: 'right' as const },
        { label: 'ความคืบหน้า', align: 'left' as const },
        { label: 'สถานะ', align: 'center' as const },
        { label: 'วันที่สำเร็จ', align: 'left' as const },
        { label: 'รีวิว', align: 'center' as const }
    ];

    return (
        <>
            <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
                <h1 className="text-3xl font-bold text-brand-text-dark dark:text-dark-text-dark mb-6">
                    ประวัติการสั่งซื้อ
                </h1>
                
                <div className="bg-brand-surface dark:bg-dark-surface p-6 rounded-xl shadow-md border border-brand-border dark:border-dark-border mb-6">
                    <h2 className="text-lg font-semibold flex items-center mb-4"><FilterIcon /> ตัวกรอง</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                        <div>
                            <label className="text-sm font-semibold mb-1 block">ค้นหา</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3"><SearchIcon /></span>
                                <input type="text" placeholder="ID, ลิงก์, ชื่อบริการ..." className="w-full bg-brand-bg dark:bg-dark-bg border border-brand-border dark:border-dark-border rounded-lg py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-brand-primary focus:outline-none"/>
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-semibold mb-1 block">วันที่สั่งซื้อ</label>
                            <input type="text" placeholder="May 1, 2025 to August 19, 2025" className="w-full bg-brand-bg dark:bg-dark-bg border border-brand-border dark:border-dark-border rounded-lg py-2.5 px-4 focus:ring-2 focus:ring-brand-primary focus:outline-none"/>
                        </div>
                        <div>
                            <label className="text-sm font-semibold mb-1 block">หมวดหมู่</label>
                            <CategoryDropdown 
                                 categories={filterCategories}
                                 selected={selectedCategory}
                                 onSelect={setSelectedCategory}
                                 widthClass="w-full"
                            />
                        </div>
                    </div>
                    <StatusFilter activeStatus={activeStatus} setActiveStatus={setActiveStatus} />
                </div>

                <div className="bg-brand-surface dark:bg-dark-surface p-6 rounded-xl shadow-md border border-brand-border dark:border-dark-border">
                    <Table headers={tableHeaders}>
                        {filteredOrders.map(order => (
                            <tr key={order.id} className="border-t border-brand-border dark:border-dark-border">
                                <td className="p-3 font-semibold text-brand-primary dark:text-dark-primary">
                                    {order.id}
                                    <div className="text-xs font-normal text-brand-text-light dark:text-dark-text-light">{order.orderDate}</div>
                                </td>
                                <td className="p-3">
                                    {order.serviceName}
                                    <div className="text-xs text-brand-text-light dark:text-dark-text-light">Service ID: {order.serviceId}</div>
                                </td>
                                <td className="p-3 text-brand-text-light dark:text-dark-text-light truncate max-w-xs"><a href="#" className="hover:underline">{order.link}</a></td>
                                <td className="p-3 text-center font-semibold">{order.quantity.toLocaleString()}</td>
                                <td className="p-3 text-right font-semibold text-brand-text-dark dark:text-dark-text-dark">
                                    ฿{order.charge.toFixed(2)}
                                </td>
                                <td className="p-3">
                                    <div className="w-full bg-brand-bg dark:bg-dark-bg rounded-full h-2.5 border border-brand-border dark:border-dark-border">
                                        <div className="bg-brand-secondary h-2.5 rounded-full" style={{ width: `${order.progress}%` }}></div>
                                    </div>
                                </td>
                                <td className="p-3 text-center">
                                    <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${statusStyles[order.status]}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="p-3 text-brand-text-light dark:text-dark-text-light">{order.completionDate || '-'}</td>
                                <td className="p-3 text-center">
                                    {mounted ? (
                                        <ReviewButton
                                            orderId={order.id}
                                            status={order.status}
                                            hasReview={reviewedOrders.has(order.id)}
                                            completedDate={order.completionDate || undefined}
                                            orderAmount={order.charge}
                                            onClick={() => handleReviewClick(order)}
                                        />
                                    ) : (
                                        <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg"></div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </Table>
                     {filteredOrders.length === 0 && (
                        <div className="text-center py-10 text-brand-text-light dark:text-dark-text-light">
                            <p>ไม่พบรายการสั่งซื้อ</p>
                        </div>
                    )}
                </div>
            </main>

            {/* Review Modal */}
            {selectedOrder && (
                <ReviewModal
                    isOpen={reviewModalOpen}
                    onClose={() => setReviewModalOpen(false)}
                    order={{
                        id: selectedOrder.id,
                        serviceName: selectedOrder.serviceName,
                        quantity: selectedOrder.quantity
                    }}
                    onSubmit={handleReviewSubmit}
                />
            )}

            {/* Success Modal */}
            <ReviewSuccessModal
                isOpen={successModalOpen}
                onClose={() => setSuccessModalOpen(false)}
                creditEarned={0.25}
                newBalance={creditBalance}
            />

            {/* View Review Modal */}
            <ViewReviewModal
                isOpen={viewReviewModalOpen}
                onClose={() => setViewReviewModalOpen(false)}
                review={selectedReview}
            />
        </>
    );
}
