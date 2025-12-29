// src/app/components/ChartComponent.tsx
"use client";

import React, { useEffect, useState, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartData,
  ChartOptions,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Define props type to accept a filter
interface ChartComponentProps {
  filter: '7d' | '30d' | '1y';
}

export default function ChartComponent({ filter }: ChartComponentProps) {
    const [chartData, setChartData] = useState<ChartData<'line'>>({ datasets: [] });
    const [chartOptions, setChartOptions] = useState<ChartOptions<'line'>>({});
    const chartRef = useRef<ChartJS<'line'>>(null);

    useEffect(() => {
        const updateChart = () => {
            const isDark = document.documentElement.classList.contains('dark');
            const gridColor = isDark ? '#3a3532' : '#EAE5E0';
            const tickColor = isDark ? '#C9B7AB' : '#473B30';
            const primaryColor = isDark ? '#FCD77F' : '#F892A2';

            // Dummy data based on filter
            let labels: string[] = [];
            let dataPoints: number[] = [];

            if (filter === '7d') {
                labels = ['จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส', 'อา'];
                dataPoints = [120, 150, 110, 180, 200, 250, 230];
            } else if (filter === '30d') {
                labels = ['สัปดาห์ 1', 'สัปดาห์ 2', 'สัปดาห์ 3', 'สัปดาห์ 4'];
                dataPoints = [500, 650, 580, 720];
            } else { // 1y
                labels = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
                dataPoints = [1200, 1500, 1300, 1800, 2100, 2000, 2400, 2300, 2500, 2800, 3000, 2900];
            }
            
            const data: ChartData<'line'> = {
                labels,
                datasets: [
                    {
                        label: 'ยอดใช้จ่าย',
                        data: dataPoints,
                        fill: true,
                        backgroundColor: (context) => {
                          const ctx = context.chart.ctx;
                          const gradient = ctx.createLinearGradient(0, 0, 0, 200);
                          gradient.addColorStop(0, isDark ? 'rgba(252, 215, 127, 0.4)' : 'rgba(248, 146, 162, 0.4)');
                          gradient.addColorStop(1, isDark ? 'rgba(252, 215, 127, 0)' : 'rgba(248, 146, 162, 0)');
                          return gradient;
                        },
                        borderColor: primaryColor,
                        pointBackgroundColor: primaryColor,
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: primaryColor,
                        tension: 0.4,
                    },
                ],
            };

            const options: ChartOptions<'line'> = {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false,
                    },
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: gridColor,
                        },
                        border: {
                            display: false,
                        },
                        ticks: {
                            color: tickColor,
                        },
                    },
                    x: {
                        grid: {
                            display: false,
                        },
                        ticks: {
                            color: tickColor,
                        },
                    },
                },
            };

            setChartData(data);
            setChartOptions(options);
        };
        
        updateChart(); // Initial call based on the prop
        
        const observer = new MutationObserver(updateChart);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

        return () => observer.disconnect();
    }, [filter]); // Re-run effect when filter changes

    return <Line ref={chartRef} options={chartOptions} data={chartData} />;
}