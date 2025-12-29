// ==============================================
// BASE STORAGE UTILITIES
// Helper functions for localStorage operations
// ==============================================

// Check if we're in browser environment
export const isBrowser = (): boolean => typeof window !== 'undefined';

// Safe localStorage get
export const getItem = <T>(key: string, defaultValue: T): T => {
  if (!isBrowser()) return defaultValue;
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.error(`Error getting ${key}:`, error);
    return defaultValue;
  }
};

// Safe localStorage set
export const setItem = <T>(key: string, value: T): void => {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting ${key}:`, error);
  }
};

// Safe localStorage remove
export const removeItem = (key: string): void => {
  if (!isBrowser()) return;
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing ${key}:`, error);
  }
};

// Check if key exists
export const hasItem = (key: string): boolean => {
  if (!isBrowser()) return false;
  return localStorage.getItem(key) !== null;
};

// Get raw string value
export const getRawItem = (key: string): string | null => {
  if (!isBrowser()) return null;
  return localStorage.getItem(key);
};

// Set raw string value
export const setRawItem = (key: string, value: string): void => {
  if (!isBrowser()) return;
  localStorage.setItem(key, value);
};

// ==============================================
// AGENT SYSTEM UTILITIES
// ==============================================

// Alias for getItem (used in agent system)
export const getFromStorage = <T>(key: string, defaultValue: T): T => {
  return getItem<T>(key, defaultValue);
};

// Alias for setItem (used in agent system)
export const saveToStorage = <T>(key: string, value: T): void => {
  setItem<T>(key, value);
};

// Generate random ID
export const generateId = (length: number = 6): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};



