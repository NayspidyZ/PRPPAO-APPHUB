'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { AppItem, CategoryItem, DEFAULT_CATEGORIES } from '@/types/app';
import { Header } from '@/components/Header';
import { AppGrid } from '@/components/AppGrid';
import { Footer } from '@/components/Footer';
import { AdminLoginModal } from '@/components/AdminLoginModal';
import { Loader2, RefreshCw, AlertCircle, ArrowUpRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const [apps, setApps] = useState<AppItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMock, setIsMock] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด');
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // Fetch apps & categories from API
  const loadData = async () => {
    setLoading(true);
    try {
      const [appsRes, catsRes] = await Promise.all([
        fetch('/api/apps', { cache: 'no-store' }),
        fetch('/api/categories', { cache: 'no-store' }),
      ]);

      const appsJson = await appsRes.json();
      const catsJson = await catsRes.json();

      if (appsJson.status === 'success' && Array.isArray(appsJson.data)) {
        setApps(appsJson.data);
        setIsMock(Boolean(appsJson.isMock));
      }

      if (catsJson.status === 'success' && Array.isArray(catsJson.data)) {
        setCategories(catsJson.data);
      }
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Compute unique categories dynamically from DB categories list
  const displayCategories = useMemo(() => {
    const list = ['ทั้งหมด'];
    // Add from dynamic categories in sorted order
    categories.forEach((cat) => {
      if (cat.name && !list.includes(cat.name)) {
        list.push(cat.name);
      }
    });
    // Add any category used by apps if not in list
    apps.forEach((a) => {
      if (a.category && !list.includes(a.category)) {
        list.push(a.category);
      }
    });
    return list;
  }, [categories, apps]);

  // Filter apps by search query and category
  const filteredApps = useMemo(() => {
    return apps.filter((app) => {
      // Category filter
      if (selectedCategory !== 'ทั้งหมด' && app.category !== selectedCategory) {
        return false;
      }

      // Search query
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const inName = app.name.toLowerCase().includes(q);
      const inDesc = app.description?.toLowerCase().includes(q);
      const inCategory = app.category?.toLowerCase().includes(q);
      const inDept = app.department?.toLowerCase().includes(q);
      const inTags = app.tags?.some((t) => t.toLowerCase().includes(q));

      return inName || inDesc || inCategory || inDept || inTags;
    });
  }, [apps, searchQuery, selectedCategory]);

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
        {/* Results summary bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-800">
              {selectedCategory === 'ทั้งหมด' ? 'แอปพลิเคชันทั้งหมด' : `หมวดหมู่: ${selectedCategory}`}
            </h2>
            <span className="rounded-full bg-sky-100 text-sky-800 text-xs font-semibold px-2.5 py-0.5">
              {filteredApps.length} รายการ
            </span>
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

        {/* Apps Grid or Loading Skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-56 rounded-2xl border border-slate-200 bg-white p-5 animate-pulse flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <div className="h-12 w-12 rounded-xl bg-slate-200" />
                    <div className="h-6 w-20 rounded-full bg-slate-200" />
                  </div>
                  <div className="h-4 w-3/4 rounded bg-slate-200" />
                  <div className="h-3 w-full rounded bg-slate-200" />
                  <div className="h-3 w-5/6 rounded bg-slate-200" />
                </div>
                <div className="h-10 w-full rounded-xl bg-slate-200" />
              </div>
            ))}
          </div>
        ) : (
          <AppGrid
            apps={filteredApps}
            onClearFilters={() => {
              setSearchQuery('');
              setSelectedCategory('ทั้งหมด');
            }}
          />
        )}
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
}
