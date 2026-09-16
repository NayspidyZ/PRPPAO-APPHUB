export type AppStatus = 'active' | 'maintenance' | 'draft';

export interface AppItem {
  id: string;
  name: string;
  description: string;
  url: string;
  category: string;
  icon: string; // Lucide icon name (e.g. 'Megaphone', 'Camera', 'Share2') or image URL (https://...)
  status: AppStatus;
  order?: number;
  tags?: string[];
  department?: string;
  contactPerson?: string;
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

