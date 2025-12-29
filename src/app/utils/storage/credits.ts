// ==============================================
// CREDITS STORAGE
// Functions for managing credit balance in localStorage
// ==============================================

import { STORAGE_KEYS } from '../../constants';
import { isBrowser } from './base';

const DEFAULT_BALANCE = 1250;

// Get credit balance
export const getCreditBalance = (): number => {
  if (!isBrowser()) return DEFAULT_BALANCE;
  try {
    const balance = localStorage.getItem(STORAGE_KEYS.CREDIT_BALANCE);
    return balance ? parseFloat(balance) : DEFAULT_BALANCE;
  } catch (error) {
    console.error('Error getting credit balance:', error);
    return DEFAULT_BALANCE;
  }
};

// Update credit balance (add or subtract)
export const updateCreditBalance = (amount: number): void => {
  if (!isBrowser()) return;
  try {
    const currentBalance = getCreditBalance();
    const newBalance = currentBalance + amount;
    localStorage.setItem(STORAGE_KEYS.CREDIT_BALANCE, newBalance.toString());
  } catch (error) {
    console.error('Error updating credit balance:', error);
  }
};

// Set credit balance to specific value
export const setCreditBalance = (amount: number): void => {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(STORAGE_KEYS.CREDIT_BALANCE, amount.toString());
  } catch (error) {
    console.error('Error setting credit balance:', error);
  }
};

// Reset credit balance to default
export const resetCreditBalance = (): void => {
  setCreditBalance(DEFAULT_BALANCE);
};



