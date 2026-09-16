'use client';

import React, { useState, useEffect } from 'react';
import { AppItem, getAppColorClasses } from '@/types/app';
import { DynamicIcon } from './DynamicIcon';
import { ExternalLink, AlertTriangle, CheckCircle2, Building2, MousePointerClick } from 'lucide-react';

interface AppCardProps {
  app: AppItem;
  onEdit?: (app: AppItem) => void;
  isAdmin?: boolean;
}

export const AppCard: React.FC<AppCardProps> = ({ app, onEdit, isAdmin = false }) => {
  const isMaintenance = app.status === 'maintenance';
  const [clickCount, setClickCount] = useState<number>(app.clicks || 0);
  const colorClasses = getAppColorClasses(app.color);

  useEffect(() => {
    setClickCount(app.clicks || 0);
  }, [app.clicks]);

  const handleClick = (e: React.MouseEvent) => {
    if (isMaintenance) {
      const confirmOpen = window.confirm(
        `ระบบ "${app.name}" กำลังอยู่ระหว่างปิดปรับปรุงชั่วคราว คุณยังต้องการเปิดหน้าเว็บอยู่หรือไม่?`
      );
      if (!confirmOpen) {
        e.preventDefault();
        return;
      }
    }

    // Optimistically increment click count
    setClickCount((prev) => prev + 1);

    // Track click via API
    fetch(`/api/apps/${app.id}/click`, {
      method: 'POST',
    }).catch((err) => {
      console.error('Failed to track click:', err);
    });
  };

  return (
    <div
      className={`group relative flex flex-col justify-between rounded-2xl border bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${
        isMaintenance
          ? 'border-amber-200 bg-gradient-to-b from-amber-50/40 to-white'
          : 'border-slate-200/80 hover:border-sky-300'
      }`}
    >
      <div>
        {/* Card Header: Icon + Status */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div
            style={isMaintenance ? undefined : { backgroundColor: colorClasses.bgHex }}
            className={`flex h-13 w-13 items-center justify-center rounded-xl p-3 shadow-inner transition-transform duration-200 group-hover:scale-105 ${
              isMaintenance
                ? 'bg-amber-100 text-amber-700'
                : `${colorClasses.gradient} text-white ${colorClasses.shadow}`
            }`}
          >
            <DynamicIcon name={app.icon} className="h-7 w-7" />
          </div>

          <div className="flex flex-col items-end gap-1">
            {isMaintenance ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800 border border-amber-300/50">
                <AlertTriangle className="h-3 w-3" />
                ปิดปรับปรุง
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 border border-emerald-200/60">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                เปิดใช้งาน
              </span>
            )}

            <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
              {app.category}
            </span>
          </div>
        </div>

        {/* Title & Description */}
        <h3 className="text-lg font-semibold text-slate-900 group-hover:text-sky-600 transition-colors line-clamp-1">
          {app.name}
        </h3>

        {app.department && (
          <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-1 mb-2">
            <Building2 className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{app.department}</span>
          </div>
        )}

        <p className="text-sm text-slate-600 line-clamp-2 mt-1 leading-relaxed">
          {app.description || 'ไม่มีคำอธิบายเพิ่มเติม'}
        </p>

        {/* Tags & Click Stats */}
        <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-100/90 text-xs">
          <div
            className="inline-flex items-center gap-1.5 font-medium text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/60 transition-colors group-hover:border-sky-200"
            title="สถิติจำนวนครั้งที่มีการคลิกเข้าใช้งานระบบนี้"
          >
            <MousePointerClick className="h-3.5 w-3.5 text-sky-600 shrink-0" />
            <span>เข้าใช้ <strong className="text-slate-800 font-semibold">{clickCount.toLocaleString()}</strong> ครั้ง</span>
          </div>

          {app.tags && app.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 justify-end">
              {app.tags.slice(0, 2).map((tag, idx) => (
                <span
                  key={idx}
                  className="text-[10px] text-slate-500 bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Card Footer: Buttons */}
      <div className="mt-3 flex items-center gap-2">
        <a
          href={app.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
          className={`flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
            isMaintenance
              ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
              : 'bg-sky-600 text-white shadow-sm hover:bg-sky-700 hover:shadow shadow-sky-200'
          }`}
        >
          <span>เข้าใช้งานระบบ</span>
          <ExternalLink className="h-4 w-4 shrink-0" />
        </a>

        {isAdmin && onEdit && (
          <button
            type="button"
            onClick={() => onEdit(app)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-100 hover:border-slate-300 transition-colors"
          >
            แก้ไข
          </button>
        )}
      </div>
    </div>
  );
};
