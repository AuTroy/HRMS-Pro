import { HRData } from '../types';
import { INITIAL_DATA } from '../constants';

const STORAGE_KEY = 'hrms_data_v1';

export const loadData = (): HRData => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error("Failed to parse local storage data", e);
      return INITIAL_DATA;
    }
  }
  // Initialize if empty
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DATA));
  return INITIAL_DATA;
};

export const saveData = (data: HRData): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};