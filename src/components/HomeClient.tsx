'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { AppItem, CategoryItem } from '@/types/app';
import { Header } from '@/components/Header';
import { AppGrid } from '@/components/AppGrid';
import { Footer } from '@/components/Footer';
import { AdminLoginModal } from '@/components/AdminLoginModal';
import { RefreshCw, AlertCircle, ArrowUpRight, Flame } from 'lucide-react';
import Link from 'next/link';

interface HomeClientProps {
  initialApps: AppItem[];
  initialCategories: CategoryItem[];
  initialIsMock: boolean;
}

export const HomeClient: React.FC<HomeClientProps> = ({
  initialApps,
  initialCategories,
  initialIsMock,
}) => {
  const [apps, setApps] = useState<AppItem[]>(initialApps);
  const [categories, setCategories] = useState<CategoryItem[]>(initialCategories);
  const [loading, setLoading] = useState(false);
  const [isMock, setIsMock] = useState(initialIsMock);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด');
  const [sortBy, setSortBy] = useState<'default' | 'popular'>('default');
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // Fetch fresh apps & categories in a single request when user clicks refresh
  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/hub?fresh=1', { cache: 'no-store' });
      const data = await res.json();

      if (data.status === 'success') {
        if (Array.isArray(data.apps)) {
          setApps(data.apps);
        }
        if (Array.isArray(data.categories)) {
          setCategories(data.categories);
        }
        setIsMock(Boolean(data.isMock));
      }
    } catch (err) {
      console.error('Failed to refresh data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('login') === 'true') {
        setIsAdminModalOpen(true);
      }
    }
  }, []);

  // Compute unique categories dynamically from DB categories list
  const displayCategories = useMemo(() => {
    const list = ['ทั้งหมด'];
    categories.forEach((cat) => {
      if (cat.name && !list.includes(cat.name)) {
        list.push(cat.name);
      }
    });
    apps.forEach((a) => {
      if (a.category && !list.includes(a.category)) {
        list.push(a.category);
      }
    });
    return list;
  }, [categories, apps]);

  // Filter apps by search query and category, then sort
  const filteredApps = useMemo(() => {
    const list = apps.filter((app) => {
      if (selectedCategory !== 'ทั้งหมด' && app.category !== selectedCategory) {
        return false;
      }

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const inName = app.name.toLowerCase().includes(q);
      const inDesc = app.description?.toLowerCase().includes(q);
      const inCategory = app.category?.toLowerCase().includes(q);
      const inDept = app.department?.toLowerCase().includes(q);
      const inTags = app.tags?.some((t) => t.toLowerCase().includes(q));

      return inName || inDesc || inCategory || inDept || inTags;
    });

    if (sortBy === 'popular') {
      return [...list].sort((a, b) => (b.clicks || 0) - (a.clicks || 0));
    }

    return list;
  }, [apps, searchQuery, selectedCategory, sortBy]);

  const totalApps = apps.length;
  const activeApps = apps.filter((a) => a.status === 'active').length;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Banner if in Mock Mode */}
      {isMock && (
        <div className="bg-amber-500 text-amber-950 px-4 py-2.5 text-xs sm:text-sm font-medium border-b border-amber-600/30 flex items-center justify-between">
          <div className="max-w-7xl mx-auto flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-amber-950" />
              <span>
                <strong>โหมดข้อมูลจำลอง (Mock Data):</strong> ระบบกำลังแสดงข้อมูลตัวอย่าง เชื่อมต่อ Google Apps Script เพื่อใช้งานจริงกับ Google Sheet
              </span>
            </div>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1 font-bold underline hover:text-white transition-colors ml-3 shrink-0"
            >
              <span>ตั้งค่าที่หน้า Admin</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Header & Hero */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={displayCategories}
        totalApps={totalApps}
        activeApps={activeApps}
        isMock={isMock}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results summary bar & Sort Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-800">
              {selectedCategory === 'ทั้งหมด' ? 'แอปพลิเคชันทั้งหมด' : `หมวดหมู่: ${selectedCategory}`}
            </h2>
            <span className="rounded-full bg-sky-100 text-sky-800 text-xs font-semibold px-2.5 py-0.5">
              {filteredApps.length} รายการ
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Popular / Default Sort Toggle */}
            <div className="inline-flex rounded-xl border border-slate-200 bg-slate-100/90 p-0.5 text-xs font-medium text-slate-600">
              <button
                type="button"
                onClick={() => setSortBy('default')}
                className={`rounded-lg px-2.5 py-1.5 transition-all ${
                  sortBy === 'default'
                    ? 'bg-white text-slate-900 font-semibold shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                ลำดับปกติ
              </button>
              <button
                type="button"
                onClick={() => setSortBy('popular')}
                className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 transition-all ${
                  sortBy === 'popular'
                    ? 'bg-white text-amber-600 font-semibold shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Flame className={`h-3.5 w-3.5 ${sortBy === 'popular' ? 'text-amber-500 fill-amber-500' : 'text-slate-400'}`} />
                <span>ยอดนิยม</span>
              </button>
            </div>

            <button
              onClick={loadData}
              disabled={loading}
              title="รีเฟรชข้อมูล"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-2xs disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">อัปเดตข้อมูล</span>
            </button>
          </div>
        </div>

        {/* Apps Grid */}
        <AppGrid
          apps={filteredApps}
          onClearFilters={() => {
            setSearchQuery('');
            setSelectedCategory('ทั้งหมด');
          }}
        />
      </main>

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
};
