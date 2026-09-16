'use client';

import React from 'react';
import { AppItem } from '@/types/app';
import { AppCard } from './AppCard';
import { SearchX, Sparkles } from 'lucide-react';

interface AppGridProps {
  apps: AppItem[];
  onClearFilters: () => void;
  isAdmin?: boolean;
  onEditApp?: (app: AppItem) => void;
}

export const AppGrid: React.FC<AppGridProps> = ({
  apps,
  onClearFilters,
  isAdmin = false,
  onEditApp,
}) => {
  if (apps.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-50 text-sky-500 mb-4 border border-sky-100">
          <SearchX className="h-8 w-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-800">ไม่พบแอปพลิเคชันที่ตรงกับเงื่อนไข</h3>
        <p className="mt-1 text-sm text-slate-500 max-w-sm">
          ลองค้นหาด้วยคำอื่น หรือเลือกหมวดหมู่อื่นเพื่อค้นหาแอปที่คุณต้องการ
        </p>
        <button
          onClick={onClearFilters}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2 text-xs font-semibold text-white hover:bg-sky-700 transition-colors shadow-sm"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>ล้างคำค้นหา / แสดงทั้งหมด</span>
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {apps.map((app) => (
        <AppCard
          key={app.id}
          app={app}
          isAdmin={isAdmin}
          onEdit={onEditApp}
        />
      ))}
    </div>
  );
};
