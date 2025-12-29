'use client';

import { useEffect } from 'react';
import { initializeMockData } from '@/app/utils/mockData';

export default function MockDataInitializer() {
  useEffect(() => {
    // Initialize mock data on client side only
    initializeMockData();
  }, []);

  return null;
}
