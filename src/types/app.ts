export type AppStatus = 'active' | 'maintenance' | 'draft';

export interface AppItem {
  id: string;
  name: string;
  description: string;
  url: string;
  category: string;
  icon: string; // Lucide icon name (e.g. 'Megaphone', 'Camera', 'Share2') or image URL (https://...)
  color?: string; // Color preset id ('sky', 'blue', 'purple', etc.)
  status: AppStatus;
  order?: number;
  tags?: string[];
  department?: string;
  contactPerson?: string;
  clicks?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
  isMock?: boolean;
}

export interface CategoryItem {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export const DEFAULT_CATEGORIES = [
  'ทั้งหมด',
  'งานประชาสัมพันธ์และข่าวสาร',
  'สื่อ กราฟิก และคลังภาพ',
  'โซเชียลมีเดียและการตลาด',
  'ระบบงานภายในองค์กร',
  'สถิติ รายงาน และแบบฟอร์ม',
  'เครื่องมือและบริการออนไลน์',
] as const;

export interface AppColorPreset {
  id: string;
  name: string;
  gradient: string;
  shadow: string;
  bgHex: string;
}

export const APP_COLOR_PRESETS: AppColorPreset[] = [
  { id: 'sky', name: 'ฟ้าอันดามัน (Sky)', gradient: 'bg-gradient-to-tr from-sky-500 to-cyan-500', shadow: 'shadow-sky-200', bgHex: '#0ea5e9' },
  { id: 'blue', name: 'น้ำเงิน (Blue)', gradient: 'bg-gradient-to-tr from-blue-600 to-indigo-600', shadow: 'shadow-blue-200', bgHex: '#2563eb' },
  { id: 'indigo', name: 'คราม (Indigo)', gradient: 'bg-gradient-to-tr from-indigo-500 to-violet-600', shadow: 'shadow-indigo-200', bgHex: '#6366f1' },
  { id: 'purple', name: 'ม่วง (Purple)', gradient: 'bg-gradient-to-tr from-purple-500 to-pink-500', shadow: 'shadow-purple-200', bgHex: '#a855f7' },
  { id: 'pink', name: 'ชมพู (Pink)', gradient: 'bg-gradient-to-tr from-pink-500 to-rose-500', shadow: 'shadow-pink-200', bgHex: '#ec4899' },
  { id: 'rose', name: 'แดงกุหลาบ (Rose)', gradient: 'bg-gradient-to-tr from-rose-500 to-red-600', shadow: 'shadow-rose-200', bgHex: '#f43f5e' },
  { id: 'orange', name: 'ส้มสดใส (Orange)', gradient: 'bg-gradient-to-tr from-orange-500 to-amber-500', shadow: 'shadow-orange-200', bgHex: '#f97316' },
  { id: 'amber', name: 'เหลืองทอง (Amber)', gradient: 'bg-gradient-to-tr from-amber-500 to-yellow-500', shadow: 'shadow-amber-200', bgHex: '#f59e0b' },
  { id: 'emerald', name: 'เขียวมรกต (Emerald)', gradient: 'bg-gradient-to-tr from-emerald-500 to-teal-500', shadow: 'shadow-emerald-200', bgHex: '#10b981' },
  { id: 'teal', name: 'เขียวน้ำทะเล (Teal)', gradient: 'bg-gradient-to-tr from-teal-500 to-cyan-600', shadow: 'shadow-teal-200', bgHex: '#14b8a6' },
  { id: 'slate', name: 'เทาสุขุม (Slate)', gradient: 'bg-gradient-to-tr from-slate-600 to-slate-800', shadow: 'shadow-slate-300', bgHex: '#475569' },
];

export function getAppColorPreset(colorId?: string): AppColorPreset {
  const found = APP_COLOR_PRESETS.find((c) => c.id === colorId);
  return found || APP_COLOR_PRESETS[0];
}

export function getAppColorClasses(colorId?: string): { gradient: string; shadow: string; bgHex: string } {
  const preset = getAppColorPreset(colorId);
  return {
    gradient: preset.gradient,
    shadow: preset.shadow,
    bgHex: preset.bgHex,
  };
}

export function getAppColorName(colorId?: string): string {
  const preset = getAppColorPreset(colorId);
  return preset.name;
}

