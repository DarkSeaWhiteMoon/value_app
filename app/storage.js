import { STORAGE_KEYS } from './constants.js';

function safeJsonParse(str) {
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
}

export function loadPvqResult() {
  const raw = localStorage.getItem(STORAGE_KEYS.pvqResult);
  if (!raw) return null;
  const parsed = safeJsonParse(raw);
  if (!parsed || typeof parsed !== 'object') return null;
  if (!Array.isArray(parsed.w_i) || parsed.w_i.length !== 10) return null;
  return parsed;
}

export function savePvqResult(result) {
  localStorage.setItem(STORAGE_KEYS.pvqResult, JSON.stringify(result));
}

export function clearPvqResult() {
  localStorage.removeItem(STORAGE_KEYS.pvqResult);
}

export function loadSettings() {
  const raw = localStorage.getItem(STORAGE_KEYS.settings);
  return raw ? safeJsonParse(raw) : null;
}

export function saveSettings(settings) {
  localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings));
}

