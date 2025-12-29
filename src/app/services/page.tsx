// src/app/services/page.tsx
"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import ServiceDetailsModal from '@/app/components/ServiceDetailsModal';
import CategoryDropdown, { filterCategories, Category } from '@/app/components/CategoryDropdown';
import Table from '@/app/components/Table';
import ServiceRatingBadge from '@/app/components/ServiceRatingBadge';
import { allServices, type Service } from '@/app/data/services'; // Import centralized data

// --- Icons ---
const FacebookIcon = () => <svg className="w-5 h-5 mr-3 text-[#1877F2] flex-shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/></svg>;
const InstagramIcon = () => <svg className="w-5 h-5 mr-3 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><defs><radialGradient id="instaGradient" r="150%" cx="30%" cy="107%"><stop stopColor="#fdf497" offset="0" /><stop stopColor="#fdf497" offset="0.05" /><stop stopColor="#fd5949" offset="0.45" /><stop stopColor="#d6249f" offset="0.6" /><stop stopColor="#285AEB" offset="0.9" /></radialGradient></defs><rect width="20" height="20" x="2" y="2" rx="5" ry="5" stroke="url(#instaGradient)"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" stroke="url(#instaGradient)"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="url(#instaGradient)"></line></svg>;
const TikTokIcon = () => <svg className="w-5 h-5 mr-3 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-2.43.05-4.84-.95-6.43-2.82-1.5-1.76-2.31-4.09-2.09-6.35.23-2.44 1.52-4.63 3.4-6.02C8.21 6.5 10.36 5.8 12.53 5.85v4.02c-1.44-.02-2.85.31-4.08.93-.65.34-1.25.77-1.78 1.28-.52.51-.87 1.15-1.04 1.84-.17.68-.13 1.42.06 2.11.19.69.54 1.32 1.02 1.83.48.51 1.05.9 1.68 1.17.63.27 1.3.41 1.98.41.68 0 1.35-.14 1.98-.41.63-.27 1.2-.66 1.68-1.17.48-.51.83-1.14 1.02-1.83.19-.69.23-1.43.06-2.11-.17-.69-.52-1.33-1.04-1.84-.53-.51-1.13-.94-1.78-1.28-1.23-.62-2.64-.95-4.08-.93v-4.02c2.17-.05 4.32.65 5.92 2.15 1.57 1.48 2.45 3.58 2.48 5.72.05 2.52-.95 4.97-2.82 6.46-1.78 1.4-4.06 2.18-6.31 2.05-2.22-.13-4.33-1.08-5.88-2.67-1.57-1.61-2.45-3.8-2.32-5.99.13-2.23 1.14-4.37 2.72-5.93 1.6-1.56 3.73-2.42 5.91-2.45.02-3.87.01-7.73.02-11.6z"/></svg>;
const YouTubeIcon = () => <svg className="w-5 h-5 mr-3 text-[#FF0000] flex-shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M21.582 7.243c-.24-.89-1.01-1.57-1.92-1.76-2.52-.48-6.66-.48-6.66-.48s-4.14 0-6.66.48c-.91.19-1.68.87-1.92 1.76C4 9.043 4 12 4 12s0 2.957.42 4.757c.24.89 1.01 1.57 1.92 1.76 2.52.48 6.66.48 6.66.48s4.14 0 6.66-.48c.91-.19 1.68-.87 1.92-1.76C22 14.957 22 12 22 12s0-2.957-.418-4.757zM9.82 14.507V9.493l4.57 2.507-4.57 2.507z"/></svg>;
const SearchIcon = () => <svg className="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>;
const ChevronLeftIcon = () => <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" /></svg>;
const ChevronRightIcon = () => <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" /></svg>;

// --- Icon Mapping ---
const categoryIconMap: { [key: string]: React.ReactNode } = {
    facebook: <FacebookIcon />,
    instagram: <InstagramIcon />,
    tiktok: <TikTokIcon />,
    youtube: <YouTubeIcon />,
};

export default function ServicesPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<Category>(filterCategories[0]);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState<Service | null>(null);

    const handleOpenModal = (service: Service) => {
        setSelectedService(service);
        setIsModalOpen(true);
    };

    const filteredServices = useMemo(() => {
        return allServices.filter(service => {
            const matchesCategory = selectedCategory.id === 'all' || service.category === selectedCategory.id;
            const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  service.id.toString().includes(searchTerm);
            return matchesCategory && matchesSearch;
        });
    }, [searchTerm, selectedCategory]);

    const paginatedServices = useMemo(() => {
        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        return filteredServices.slice(startIndex, endIndex);
    }, [filteredServices, currentPage, rowsPerPage]);

    const totalPages = Math.ceil(filteredServices.length / rowsPerPage);
    const totalResults = filteredServices.length;

    const tableHeaders = [
        { label: 'ID', align: 'left' as const },
        { label: 'บริการ', align: 'left' as const },
        { label: 'รีวิว', align: 'center' as const },
        { label: 'ราคาต่อ 1,000', align: 'right' as const },
        { label: 'ต่ำสุด/สูงสุด', align: 'center' as const },
        { label: 'เวลาเฉลี่ย', align: 'center' as const },
        { label: '', align: 'center' as const }
    ];

    const tableFooter = (
        <div className="flex flex-col sm:flex-row justify-between items-center text-sm">
            <div className="text-brand-text-light dark:text-dark-text-light mb-2 sm:mb-0">
                แสดง {paginatedServices.length > 0 ? Math.min((currentPage - 1) * rowsPerPage + 1, totalResults) : 0} - {Math.min(currentPage * rowsPerPage, totalResults)} จากทั้งหมด {totalResults} รายการ
            </div>
            <div className="flex items-center space-x-2">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-md hover:bg-brand-bg dark:hover:bg-dark-bg disabled:opacity-50 disabled:cursor-not-allowed"><ChevronLeftIcon /></button>
                <span>หน้า {currentPage} จาก {totalPages > 0 ? totalPages : 1}</span>
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || totalPages === 0} className="p-2 rounded-md hover:bg-brand-bg dark:hover:bg-dark-bg disabled:opacity-50 disabled:cursor-not-allowed"><ChevronRightIcon /></button>
            </div>
        </div>
    );

    return (
        <>
            <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
                <h1 className="text-3xl font-bold text-brand-text-dark dark:text-dark-text-dark mb-6">
                    รายการบริการทั้งหมด
                </h1>
                <div className="bg-brand-surface dark:bg-dark-surface p-6 rounded-xl shadow-md border border-brand-border dark:border-dark-border">
                    {/* ... Filter content ... */}
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <CategoryDropdown 
                            categories={filterCategories}
                            selected={selectedCategory}
                            onSelect={(category) => {
                                setSelectedCategory(category);
                                setCurrentPage(1);
                            }}
                        />
                        <div className="relative flex-1">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3"><SearchIcon /></span>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                placeholder="ค้นหาด้วย ID หรือชื่อบริการ..."
                                className="w-full bg-brand-bg dark:bg-dark-bg border border-brand-border dark:border-dark-border rounded-lg py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-brand-primary focus:outline-none"
                            />
                        </div>
                    </div>
                    
                    <Table headers={tableHeaders} footer={tableFooter}>
                        {paginatedServices.map((service) => (
                            <tr key={service.id} className="border-b border-brand-border dark:border-dark-border hover:bg-brand-bg dark:hover:bg-dark-bg">
                                <td className="px-6 py-4 font-bold text-brand-primary dark:text-dark-primary whitespace-nowrap">{service.id}</td>
                                <td className="px-6 py-4 font-medium">
                                    <div className="flex items-center">
                                        {categoryIconMap[service.category]}
                                        <span>{service.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <div className="flex justify-center">
                                        <ServiceRatingBadge serviceId={service.id.toString()} />
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right font-semibold whitespace-nowrap">฿{service.price.toFixed(2)} / {service.unit}</td>
                                <td className="px-6 py-4 text-center whitespace-nowrap">{service.min.toLocaleString()} / {service.max.toLocaleString()}</td>
                                <td className="px-6 py-4 text-center whitespace-nowrap">{service.avgTime}</td>
                                <td className="px-6 py-4 text-right whitespace-nowrap">
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => handleOpenModal(service)} className="text-xs font-semibold text-brand-text-light dark:text-dark-text-light hover:bg-brand-border dark:hover:bg-dark-border rounded-full px-3 py-1.5 transition-colors">รายละเอียด</button>
                                        <Link href={`/order?service=${service.id}`}>
                                            <span className="cursor-pointer text-xs font-semibold text-white bg-brand-primary dark:bg-dark-primary dark:text-brand-text-dark rounded-full px-4 py-1.5 hover:opacity-90 transition-opacity">สั่งซื้อ</span>
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </Table>
                    {paginatedServices.length === 0 && (
                        <div className="text-center py-10 text-brand-text-light dark:text-dark-text-light"><p>ไม่พบรายการบริการที่ตรงกับการค้นหา</p></div>
                    )}
                </div>
            </main>
            
            <ServiceDetailsModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                service={selectedService} 
            />
        </>
    );
}