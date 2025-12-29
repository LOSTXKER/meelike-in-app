// src/app/cart/page.tsx
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Table from '@/app/components/Table'; // Import Table

// --- Icons ---
const TrashIcon = () => (
    <svg className="w-5 h-5 text-gray-400 hover:text-red-500 transition-colors" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);
const CartIconLarge = () => (
     <svg className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

// --- Type Definition for Cart Item ---
interface CartItem {
    id: number;
    serviceName: string;
    serviceId: number;
    link: string;
    quantity: number;
    pricePerThousand: number;
}

// --- Dummy Data ---
const initialCartItems: CartItem[] = [
    { id: 1, serviceName: 'Facebook ถูกใจโพสต์ [คนไทย]', serviceId: 45, link: 'https://facebook.com/posts/123456789012345', quantity: 2500, pricePerThousand: 75.00, },
];

export default function CartPage() {
    const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);

    const removeItem = (id: number) => {
        setCartItems(currentItems => currentItems.filter(item => item.id !== id));
    };

    const subtotal = cartItems.reduce((acc, item) => acc + (item.quantity / 1000) * item.pricePerThousand, 0);
    const total = subtotal;

    const tableHeaders = [
        { label: 'บริการ', align: 'left' as const },
        { label: 'ลิงก์', align: 'left' as const },
        { label: 'จำนวน', align: 'center' as const },
        { label: 'ราคา', align: 'right' as const },
        { label: '', align: 'center' as const }
    ];

    if (cartItems.length === 0) {
        return (
            <main className="flex-1 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
                <div className="text-center">
                    <CartIconLarge />
                    <h1 className="mt-4 text-2xl font-bold text-brand-text-dark dark:text-dark-text-dark">ตะกร้าของคุณว่างเปล่า</h1>
                    <p className="mt-2 text-brand-text-light dark:text-dark-text-light">ลองเพิ่มบริการที่น่าสนใจลงในตะกร้าสิ!</p>
                    <Link href="/order">
                        <span className="mt-6 inline-block bg-brand-primary text-white dark:bg-dark-primary dark:text-brand-text-dark font-semibold py-3 px-6 rounded-full hover:opacity-90 transition-opacity">
                            กลับไปหน้าสั่งซื้อ
                        </span>
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-8">
                <h1 className="text-3xl font-bold text-brand-text-dark dark:text-dark-text-dark">ตะกร้าสินค้า ({cartItems.length} รายการ)</h1>
                <button onClick={() => setCartItems([])} className="text-sm text-red-500 hover:underline mt-2 md:mt-0">
                    ล้างตะกร้าทั้งหมด
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 bg-brand-surface dark:bg-dark-surface p-6 rounded-xl shadow-md border border-brand-border dark:border-dark-border">
                    <Table headers={tableHeaders}>
                        {cartItems.map(item => (
                            <tr key={item.id} className="border-t border-brand-border dark:border-dark-border">
                                <td className="p-3">
                                    <p className="font-bold text-brand-text-dark dark:text-dark-text-dark">{item.serviceName}</p>
                                    <p className="text-xs text-brand-text-light dark:text-dark-text-light mt-1">Service ID: {item.serviceId}</p>
                                </td>
                                <td className="p-3 text-brand-primary dark:text-dark-primary hover:underline cursor-pointer truncate max-w-xs" title={item.link}>
                                    {item.link}
                                </td>
                                <td className="p-3 text-center font-semibold">
                                    {item.quantity.toLocaleString()}
                                </td>
                                <td className="p-3 text-right font-bold text-brand-text-dark dark:text-dark-text-dark whitespace-nowrap">
                                    ฿{((item.quantity / 1000) * item.pricePerThousand).toFixed(2)}
                                </td>
                                <td className="p-3 text-center">
                                     <button onClick={() => removeItem(item.id)} className="p-1">
                                        <TrashIcon />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </Table>
                </div>

                <div className="lg:col-span-1 sticky top-8">
                    <div className="bg-brand-surface dark:bg-dark-surface p-6 rounded-xl shadow-md border border-brand-border dark:border-dark-border space-y-4">
                        <h2 className="text-xl font-bold">สรุปคำสั่งซื้อ</h2>
                        <div className="space-y-2 text-md">
                            <div className="flex justify-between">
                                <span className="text-brand-text-light dark:text-dark-text-light">ยอดรวม</span>
                                <span className="font-semibold">฿{subtotal.toFixed(2)}</span>
                            </div>
                        </div>
                        <hr className="border-brand-border dark:border-dark-border" />
                        <div className="flex justify-between font-bold text-xl">
                            <span>ยอดสุทธิ</span>
                            <span>฿{total.toFixed(2)}</span>
                        </div>
                        <button className="w-full bg-brand-primary text-white dark:bg-dark-primary dark:text-brand-text-dark font-bold py-3 px-4 rounded-full hover:opacity-90 transition-opacity text-lg">
                            ดำเนินการชำระเงิน
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}