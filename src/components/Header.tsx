'use client';

import React from 'react';
import { Search, X, ShieldCheck, Database, Layers, CheckCircle2, AlertCircle } from 'lucide-react';
import { DEFAULT_CATEGORIES } from '@/types/app';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  categories: string[];
  totalApps: number;
  activeApps: number;
  isMock: boolean;
  onOpenAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categories,
  totalApps,
  activeApps,
  isMock,
  onOpenAdmin,
}) => {
  return (
    <header className="relative overflow-hidden bg-gradient-to-b from-sky-900 via-sky-800 to-slate-900 text-white pt-8 pb-10 px-4 sm:px-6 lg:px-8 border-b border-sky-700/40">
      {/* Decorative background glows */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 -right-24 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Top bar: Brand & Admin Button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-400 to-cyan-300 text-sky-950 font-black text-xl shadow-lg shadow-sky-500/20">
              PR
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-white">PR-PPAO APP HUB</span>
                {isMock ? (
                  <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/20 px-2 py-0.5 text-[11px] font-medium text-amber-300 border border-amber-400/30">
                    <AlertCircle className="h-3 w-3" />
                    Mock Data
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/20 px-2 py-0.5 text-[11px] font-medium text-emerald-300 border border-emerald-400/30">
                    <Database className="h-3 w-3" />
                    Google Sheets Sync
                  </span>
                )}
              </div>
              <p className="text-xs text-sky-200/80">ศูนย์รวมแอปพลิเคชันและระบบงาน ฝ่ายการประชาสัมพันธ์ องค์การบริหารส่วนจังหวัดภูเก็ต</p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 px-3.5 py-2 text-xs font-medium text-white border border-white/15 backdrop-blur-sm transition-all shadow-sm"
            >
              <ShieldCheck className="h-4 w-4 text-sky-300" />
              <span>จัดการระบบ (Admin)</span>
            </button>
          </div>
        </div>

        {/* Hero title & quick stats */}
        <div className="pt-8 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
              พอร์ทัลศูนย์รวมแอปพลิเคชัน
            </h1>
            <p className="mt-2 text-sm sm:text-base text-sky-100/80 max-w-2xl leading-relaxed">
              เข้าถึงทุกระบบงาน เครื่องมือผลิตสื่อ คลังภาพ และบริการประชาสัมพันธ์ของ อบจ.ภูเก็ต ได้สะดวกรวดเร็วในจุดเดียว
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-3 backdrop-blur-md self-start md:self-auto">
            <div className="px-3 border-r border-white/10 text-center">
              <span className="block text-xl font-bold text-white">{totalApps}</span>
              <span className="text-[11px] text-sky-200/70">ระบบทั้งหมด</span>
            </div>
            <div className="px-3 border-r border-white/10 text-center">
              <span className="block text-xl font-bold text-emerald-300">{activeApps}</span>
              <span className="text-[11px] text-sky-200/70">เปิดพร้อมใช้</span>
            </div>
            <div className="px-3 text-center">
              <span className="block text-xl font-bold text-cyan-300">{categories.length - 1}</span>
              <span className="text-[11px] text-sky-200/70">หมวดหมู่</span>
            </div>
          </div>
        </div>

        {/* Search input */}
        <div className="mt-2 relative max-w-3xl">
          <div className="relative flex items-center">
            <Search className="absolute left-4 h-5 w-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาชื่อระบบ, บริการ, คีย์เวิร์ด หรือแท็ก..."
              className="w-full rounded-2xl bg-white text-slate-900 placeholder:text-slate-400 pl-12 pr-10 py-3.5 text-sm sm:text-base shadow-xl border-2 border-transparent focus:border-sky-400 focus:outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Categories Bar */}
        <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap rounded-xl px-3.5 py-1.5 text-xs sm:text-sm font-medium transition-all ${
                  isSelected
                    ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30'
                    : 'bg-white/10 text-sky-100/90 hover:bg-white/15 border border-white/10'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
