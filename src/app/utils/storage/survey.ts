// ==============================================
// SURVEY STORAGE
// Functions for managing survey data in localStorage
// ==============================================

import type { SurveyData } from '../../types';
import { STORAGE_KEYS } from '../../constants';
import { getItem, setItem, isBrowser } from './base';

export const saveSurvey = (data: SurveyData): void => {
  setItem(STORAGE_KEYS.SURVEY, data);
};

export const getSurvey = (): SurveyData | null => {
  return getItem<SurveyData | null>(STORAGE_KEYS.SURVEY, null);
};

export const hasSurvey = (): boolean => {
  if (!isBrowser()) return true; // Return true on server to prevent modal flash
  return getSurvey() !== null;
};

export const clearSurvey = (): void => {
  if (!isBrowser()) return;
  localStorage.removeItem(STORAGE_KEYS.SURVEY);
};







