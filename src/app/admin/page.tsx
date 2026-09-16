'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { AppItem, CategoryItem, DEFAULT_CATEGORIES } from '@/types/app';
import { DynamicIcon, POPULAR_ICONS, CATEGORY_POPULAR_ICONS } from '@/components/DynamicIcon';
import Link from 'next/link';
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  Database,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  Save,
  X,
  Lock,
  Layers,
  HelpCircle,
  FileCode,
  FolderPlus,
  LayoutGrid,
  FolderTree,
} from 'lucide-react';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'apps' | 'categories'>('apps');

  // Apps State
  const [apps, setApps] = useState<AppItem[]>([]);
  const [editingApp, setEditingApp] = useState<Partial<AppItem> | null>(null);
  const [isAppModalOpen, setIsAppModalOpen] = useState(false);

  // Categories State
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [editingCategory, setEditingCategory] = useState<Partial<CategoryItem> | null>(null);
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);

  // General State
  const [loading, setLoading] = useState(true);
  const [isMock, setIsMock] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showGuide, setShowGuide] = useState(false);

  // Load all data
  const loadData = async () => {
    setLoading(true);
    try {
      const [appsRes, catsRes] = await Promise.all([
        fetch('/api/apps', { cache: 'no-store' }),
        fetch('/api/categories', { cache: 'no-store' }),
      ]);

      const appsData = await appsRes.json();
      const catsData = await catsRes.json();

      if (appsData.status === 'success') {
        setApps(appsData.data || []);
        setIsMock(Boolean(appsData.isMock));
      }

      if (catsData.status === 'success' && Array.isArray(catsData.data)) {
        setCategories(catsData.data);
      }
    } catch (err) {
      showToast('error', 'ไม่สามารถโหลดข้อมูลได้');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // -------------------------------------------------------------
  // APP HANDLERS
  // -------------------------------------------------------------
  const handleAddNewApp = () => {
    const defaultCategory = categories.length > 0 ? categories[0].name : 'งานประชาสัมพันธ์และข่าวสาร';
    setEditingApp({
      name: '',
      description: '',
      url: '',
      category: defaultCategory,
      icon: 'Megaphone',
      status: 'active',
      order: apps.length + 1,
      department: 'ฝ่ายประชาสัมพันธ์',
      tags: [],
    });
    setIsAppModalOpen(true);
  };

  const handleEditApp = (app: AppItem) => {
    setEditingApp({ ...app });
    setIsAppModalOpen(true);
  };

  const handleSaveApp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingApp || !editingApp.name || !editingApp.url) {
      showToast('error', 'กรุณากรอกชื่อแอปและลิงก์ (URL)');
      return;
    }

    setSaving(true);
    try {
      const isUpdating = Boolean(editingApp.id);
      const url = isUpdating ? `/api/apps/${editingApp.id}` : '/api/apps';
      const method = isUpdating ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingApp),
      });

      const result = await res.json();
      if (res.ok && result.status === 'success') {
        showToast('success', isUpdating ? 'อัปเดตข้อมูลแอปสำเร็จ' : 'เพิ่มแอปพลิเคชันสำเร็จ');
        setIsAppModalOpen(false);
        setEditingApp(null);
        await loadData();
      } else {
        showToast('error', result.message || 'บันทึกข้อมูลไม่สำเร็จ');
      }
    } catch (err: any) {
      showToast('error', 'เกิดข้อผิดพลาด: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteApp = async (id: string, name: string) => {
    const confirmDelete = window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบระบบ "${name}"?`);
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/apps/${id}`, { method: 'DELETE' });
      const result = await res.json();
      if (res.ok && result.status === 'success') {
        showToast('success', 'ลบข้อมูลสำเร็จ');
        await loadData();
      } else {
        showToast('error', result.message || 'ลบข้อมูลไม่สำเร็จ');
      }
    } catch (err: any) {
      showToast('error', 'เกิดข้อผิดพลาด: ' + err.message);
    }
  };

  // -------------------------------------------------------------
  // CATEGORY HANDLERS
  // -------------------------------------------------------------
  const handleAddNewCategory = () => {
    setEditingCategory({
      name: '',
      description: '',
      icon: 'Folder',
      order: categories.length + 1,
    });
    setIsCatModalOpen(true);
  };

  const handleEditCategory = (cat: CategoryItem) => {
    setEditingCategory({ ...cat });
    setIsCatModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !editingCategory.name || !editingCategory.name.trim()) {
      showToast('error', 'กรุณากรอกชื่อหมวดหมู่');
      return;
    }

    setSaving(true);
    try {
      const isUpdating = Boolean(editingCategory.id);
      const url = isUpdating ? `/api/categories/${editingCategory.id}` : '/api/categories';
      const method = isUpdating ? 'PUT' : 'POST';

      // Find original name if updating
      const oldName = isUpdating ? categories.find((c) => c.id === editingCategory.id)?.name : undefined;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: editingCategory,
          name: editingCategory.name,
          description: editingCategory.description,
          icon: editingCategory.icon,
          order: editingCategory.order,
          oldName,
        }),
      });

      const result = await res.json();
      if (res.ok && result.status === 'success') {
        showToast('success', isUpdating ? 'อัปเดตหมวดหมู่สำเร็จ' : 'เพิ่มหมวดหมู่ใหม่สำเร็จ');
        setIsCatModalOpen(false);
        setEditingCategory(null);
        await loadData();
      } else {
        showToast('error', result.message || 'บันทึกหมวดหมู่ไม่สำเร็จ');
      }
    } catch (err: any) {
      showToast('error', 'เกิดข้อผิดพลาด: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    const appsInCat = apps.filter((a) => a.category === name).length;
    let message = `คุณแน่ใจหรือไม่ว่าต้องการลบหมวดหมู่ "${name}"?`;
    if (appsInCat > 0) {
      message += `\n\nคำเตือน: มีแอปพลิเคชัน ${appsInCat} รายการที่อยู่ในหมวดหมู่นี้ แอปเหล่านี้จะถูกเปลี่ยนไปอยู่หมวดหมู่ "ทั่วไป" อัตโนมัติ`;
    }

    const confirmDelete = window.confirm(message);
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/categories/${id}?name=${encodeURIComponent(name)}`, {
        method: 'DELETE',
      });
      const result = await res.json();
      if (res.ok && result.status === 'success') {
        showToast('success', 'ลบหมวดหมู่สำเร็จ');
        await loadData();
      } else {
        showToast('error', result.message || 'ลบหมวดหมู่ไม่สำเร็จ');
      }
    } catch (err: any) {
      showToast('error', 'เกิดข้อผิดพลาด: ' + err.message);
    }
  };

  // Filtered Apps
  const filteredApps = apps.filter((app) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      app.name.toLowerCase().includes(q) ||
      app.category.toLowerCase().includes(q) ||
      app.department?.toLowerCase().includes(q) ||
      app.url.toLowerCase().includes(q)
    );
  });

  // Filtered Categories
  const filteredCategories = categories.filter((cat) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return cat.name.toLowerCase().includes(q) || cat.description?.toLowerCase().includes(q);
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Top Navbar */}
      <nav className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-3.5 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>กลับสู่หน้าหลัก</span>
            </Link>
            <div className="h-4 w-px bg-slate-200"></div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-sm sm:text-base">ระบบจัดการ PRPPAO APP HUB</span>
              <span className="rounded bg-sky-100 text-sky-800 text-[10px] font-semibold px-2 py-0.5">Admin</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowGuide(!showGuide)}
              className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
            >
              <HelpCircle className="h-4 w-4 text-sky-600" />
              <span className="hidden sm:inline">วิธีเชื่อม Google Sheet</span>
            </button>
            {activeTab === 'apps' ? (
              <button
                onClick={handleAddNewApp}
                className="inline-flex items-center gap-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition-all"
              >
                <Plus className="h-4 w-4" />
                <span>เพิ่มแอปใหม่</span>
              </button>
            ) : (
              <button
                onClick={handleAddNewCategory}
                className="inline-flex items-center gap-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition-all"
              >
                <FolderPlus className="h-4 w-4" />
                <span>เพิ่มหมวดหมู่ใหม่</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium shadow-lg border transition-all ${
            notification.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-red-50 text-red-800 border-red-200'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertTriangle className="h-4 w-4 text-red-600 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Status / Notice Bar */}
        <div
          className={`rounded-2xl border p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
            isMock
              ? 'bg-amber-50/70 border-amber-200 text-amber-900'
              : 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
          }`}
        >
          <div className="flex items-start gap-3">
            <div
              className={`p-2 rounded-xl shrink-0 ${
                isMock ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
              }`}
            >
              <Database className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold">
                {isMock ? 'สถานะ: โหมดข้อมูลจำลอง (Mock Data Mode)' : 'สถานะ: เชื่อมต่อ Google Sheet เรียบร้อย'}
              </h3>
              <p className="text-xs mt-0.5 opacity-90 leading-relaxed">
                {isMock
                  ? 'ยังไม่ได้ตั้งค่าตัวแปร GAS_API_URL ในระบบ ข้อมูลและหมวดหมู่จะถูกจัดเก็บในหน่วยความจำชั่วคราว นำ URL เว็บแอปของ Google Apps Script ไปใส่ใน .env.local หรือ Vercel เพื่อใช้งานจริง'
                  : 'ระบบเชื่อมต่อกับ Google Apps Script (ชีต Apps และ Categories) และอัปเดตข้อมูลลงชีตโดยอัตโนมัติ'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowGuide(!showGuide)}
            className="text-xs font-semibold underline shrink-0 hover:opacity-80"
          >
            {showGuide ? 'ซ่อนคำแนะนำ' : 'ดูขั้นตอนการตั้งค่า Google Sheet'}
          </button>
        </div>

        {/* Collapsible Setup Guide */}
        {showGuide && (
          <div className="rounded-2xl border border-sky-200 bg-sky-50/60 p-5 text-xs text-slate-700 space-y-3">
            <div className="flex items-center gap-2 font-bold text-sky-900 text-sm">
              <FileCode className="h-4 w-4" />
              <span>ขั้นตอนเชื่อมต่อ Google Sheet ด้วย Google Apps Script (รองรับทั้ง Apps และ Categories)</span>
            </div>
            <ol className="list-decimal list-inside space-y-2 leading-relaxed">
              <li>เปิด Google Sheets ที่ต้องการใช้เก็บข้อมูล</li>
              <li>ไปที่เมนู <strong>ส่วนขยาย (Extensions) &gt; Apps Script</strong></li>
              <li>
                คัดลอกโค้ดจากไฟล์ในโปรเจกต์นี้ <code className="bg-white px-1.5 py-0.5 rounded border">gas/Code.gs</code> ไปวางแทนที่โค้ดเดิม
              </li>
              <li>
                กดเลือกฟังก์ชัน <strong>setupSheet</strong> แล้วกด <strong>เรียกใช้ (Run)</strong> เพื่อสร้างแท็บ <code>Apps</code> และ <code>Categories</code> พร้อมตัวอย่างข้อมูลอัตโนมัติ
              </li>
              <li>
                กดปุ่มสีน้ำเงินมุมขวาบน <strong>ทำให้ใช้งานได้ (Deploy) &gt; การทำให้ใช้งานได้ใหม่ (New deployment)</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-0.5 text-slate-600">
                  <li>เลือกประเภท: <strong>เว็บแอป (Web app)</strong></li>
                  <li>เรียกใช้ในฐานะ: <strong>ฉัน (Me)</strong></li>
                  <li>ผู้ที่มีสิทธิ์เข้าถึง: <strong>ทุกคน (Anyone)</strong> *(สำคัญมาก)*</li>
                </ul>
              </li>
              <li>คัดลอก <strong>URL เว็บแอป</strong> ที่ลงท้ายด้วย <code className="bg-white px-1 py-0.5 rounded">/exec</code></li>
              <li>นำไปใส่ในไฟล์ <code className="bg-white px-1 py-0.5 rounded">.env.local</code>: <code className="bg-white px-1 py-0.5 rounded">GAS_API_URL=URL_ของคุณ</code> (หรือใส่ใน Vercel Environment Variables)</li>
            </ol>
          </div>
        )}

        {/* Tab Navigation: Apps vs Categories */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setActiveTab('apps');
                setSearchQuery('');
              }}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'apps'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
              <span>จัดการแอปพลิเคชัน ({apps.length})</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('categories');
                setSearchQuery('');
              }}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'categories'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <FolderTree className="h-4 w-4" />
              <span>จัดการหมวดหมู่ ({categories.length})</span>
            </button>
          </div>

          <button
            onClick={loadData}
            disabled={loading}
            className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            title="รีเฟรชข้อมูลทั้งหมด"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={activeTab === 'apps' ? 'ค้นหาแอปพลิเคชัน...' : 'ค้นหาหมวดหมู่...'}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
            />
          </div>

          <div className="text-xs text-slate-500">
            {activeTab === 'apps' ? `ทั้งหมด ${filteredApps.length} แอป` : `ทั้งหมด ${filteredCategories.length} หมวดหมู่`}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: APPS TABLE */}
        {/* ========================================================================= */}
        {activeTab === 'apps' && (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">ลำดับ</th>
                    <th className="py-3.5 px-4">ไอคอน / ชื่อแอปพลิเคชัน</th>
                    <th className="py-3.5 px-4">หมวดหมู่</th>
                    <th className="py-3.5 px-4">หน่วยงานรับผิดชอบ</th>
                    <th className="py-3.5 px-4">สถานะ</th>
                    <th className="py-3.5 px-4 text-center">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-normal">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="py-10 text-center text-slate-400">
                        กำลังโหลดข้อมูล...
                      </td>
                    </tr>
                  ) : filteredApps.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-10 text-center text-slate-400">
                        ไม่พบข้อมูลแอปพลิเคชัน
                      </td>
                    </tr>
                  ) : (
                    filteredApps.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-mono text-slate-400">
                          {app.order ?? '-'}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-100 text-sky-700 shrink-0">
                              <DynamicIcon name={app.icon} className="h-5 w-5" />
                            </div>
                            <div>
                              <div className="font-semibold text-slate-900">{app.name}</div>
                              <div className="flex items-center gap-1 text-[11px] text-slate-600 truncate max-w-xs">
                                <span>{app.url}</span>
                                <a
                                  href={app.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-sky-600 hover:text-sky-800"
                                >
                                  <ExternalLink className="h-3 w-3 inline" />
                                </a>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-700">
                            {app.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          {app.department || '-'}
                        </td>
                        <td className="py-3 px-4">
                          {app.status === 'active' ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 border border-emerald-200">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                              เปิดใช้งาน
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700 border border-amber-200">
                              ปิดปรับปรุง
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleEditApp(app)}
                              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-sky-600 transition-colors"
                              title="แก้ไข"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteApp(app.id, app.name)}
                              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                              title="ลบ"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: CATEGORIES TABLE */}
        {/* ========================================================================= */}
        {activeTab === 'categories' && (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">ลำดับ</th>
                    <th className="py-3.5 px-4">ไอคอน / ชื่อหมวดหมู่</th>
                    <th className="py-3.5 px-4">คำอธิบาย</th>
                    <th className="py-3.5 px-4 text-center">จำนวนแอปในหมวดนี้</th>
                    <th className="py-3.5 px-4 text-center">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-normal">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="py-10 text-center text-slate-400">
                        กำลังโหลดข้อมูลหมวดหมู่...
                      </td>
                    </tr>
                  ) : filteredCategories.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-10 text-center text-slate-400">
                        ไม่พบข้อมูลหมวดหมู่
                      </td>
                    </tr>
                  ) : (
                    filteredCategories.map((cat) => {
                      const appCount = apps.filter((a) => a.category === cat.name).length;
                      return (
                        <tr key={cat.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4 font-mono text-slate-400">
                            {cat.order ?? '-'}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-100 text-sky-700 shrink-0">
                                <DynamicIcon name={cat.icon || 'Folder'} className="h-5 w-5" />
                              </div>
                              <span className="font-semibold text-slate-900 text-sm">{cat.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-slate-500 max-w-sm truncate">
                            {cat.description || '-'}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
                              {appCount} แอป
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => handleEditCategory(cat)}
                                className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-sky-600 transition-colors"
                                title="แก้ไขหมวดหมู่"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteCategory(cat.id, cat.name)}
                                className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                                title="ลบหมวดหมู่"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* MODAL 1: ADD / EDIT APP */}
      {/* ========================================================================= */}
      {isAppModalOpen && editingApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 my-8">
            <button
              onClick={() => setIsAppModalOpen(false)}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
                <Layers className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {editingApp.id ? 'แก้ไขข้อมูลแอปพลิเคชัน' : 'เพิ่มแอปพลิเคชันใหม่'}
                </h3>
                <p className="text-xs text-slate-500">ข้อมูลจะถูกซิงก์ไปยัง Google Sheet โดยอัตโนมัติ</p>
              </div>
            </div>

            <form onSubmit={handleSaveApp} className="space-y-4 text-xs">
              {/* Name */}
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  ชื่อแอปพลิเคชัน / ระบบ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editingApp.name || ''}
                  onChange={(e) => setEditingApp({ ...editingApp, name: e.target.value })}
                  placeholder="เช่น ระบบเผยแพร่ข่าวและประกาศ อบจ."
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block font-medium text-slate-700 mb-1">รายละเอียดสั้นๆ</label>
                <textarea
                  rows={2}
                  value={editingApp.description || ''}
                  onChange={(e) => setEditingApp({ ...editingApp, description: e.target.value })}
                  placeholder="คำอธิบายฟังก์ชัน หรือวัตถุประสงค์การใช้งาน..."
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                />
              </div>

              {/* URL */}
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  ลิงก์เข้าใช้งาน (URL) <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  required
                  value={editingApp.url || ''}
                  onChange={(e) => setEditingApp({ ...editingApp, url: e.target.value })}
                  placeholder="https://..."
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Category Dropdown (Dynamically from categories state!) */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-medium text-slate-700">หมวดหมู่</label>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAppModalOpen(false);
                        setActiveTab('categories');
                        handleAddNewCategory();
                      }}
                      className="text-[10px] text-sky-600 hover:underline"
                    >
                      + เพิ่มหมวดใหม่
                    </button>
                  </div>
                  <select
                    value={editingApp.category || (categories[0]?.name ?? 'ทั่วไป')}
                    onChange={(e) => setEditingApp({ ...editingApp, category: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                    {categories.length === 0 && <option value="ทั่วไป">ทั่วไป</option>}
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block font-medium text-slate-700 mb-1">สถานะระบบ</label>
                  <select
                    value={editingApp.status || 'active'}
                    onChange={(e) => setEditingApp({ ...editingApp, status: e.target.value as any })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  >
                    <option value="active">เปิดใช้งานปกติ (Active)</option>
                    <option value="maintenance">ปิดปรับปรุงชั่วคราว (Maintenance)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Department */}
                <div>
                  <label className="block font-medium text-slate-700 mb-1">ฝ่าย / หน่วยงานรับผิดชอบ</label>
                  <input
                    type="text"
                    value={editingApp.department || ''}
                    onChange={(e) => setEditingApp({ ...editingApp, department: e.target.value })}
                    placeholder="เช่น ฝ่ายประชาสัมพันธ์"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>

                {/* Order */}
                <div>
                  <label className="block font-medium text-slate-700 mb-1">ลำดับการแสดงผล (Order)</label>
                  <input
                    type="number"
                    value={editingApp.order ?? 1}
                    onChange={(e) => setEditingApp({ ...editingApp, order: parseInt(e.target.value, 10) || 1 })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>
              </div>

              {/* Icon selection */}
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  ไอคอน (ชื่อไอคอน Lucide หรือ URL รูปภาพ)
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-700 shrink-0">
                    <DynamicIcon name={editingApp.icon || 'Globe'} className="h-5 w-5" />
                  </div>
                  <input
                    type="text"
                    value={editingApp.icon || ''}
                    onChange={(e) => setEditingApp({ ...editingApp, icon: e.target.value })}
                    placeholder="เช่น Megaphone, Camera หรือ https://..."
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-sky-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  <span className="text-[10px] text-slate-400 mr-1">ไอคอนยอดนิยม:</span>
                  {POPULAR_ICONS.slice(0, 10).map((iconName) => (
                    <button
                      key={iconName}
                      type="button"
                      onClick={() => setEditingApp({ ...editingApp, icon: iconName })}
                      className={`px-2 py-0.5 rounded border text-[10px] transition-colors ${
                        editingApp.icon === iconName
                          ? 'bg-sky-500 text-white border-sky-500'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {iconName}
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAppModalOpen(false)}
                  className="flex-1 rounded-xl border border-slate-200 py-2.5 font-medium text-slate-600 hover:bg-slate-50"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-sky-600 py-2.5 font-medium text-white shadow-sm hover:bg-sky-700 disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  <span>{saving ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: ADD / EDIT CATEGORY */}
      {/* ========================================================================= */}
      {isCatModalOpen && editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 my-8">
            <button
              onClick={() => setIsCatModalOpen(false)}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
                <FolderTree className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {editingCategory.id ? 'แก้ไขหมวดหมู่' : 'เพิ่มหมวดหมู่ใหม่'}
                </h3>
                <p className="text-xs text-slate-500">จัดการชื่อและลำดับการแสดงผลของหมวดหมู่</p>
              </div>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
              {/* Category Name */}
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  ชื่อหมวดหมู่ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editingCategory.name || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  placeholder="เช่น งานประชาสัมพันธ์และข่าวสาร"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block font-medium text-slate-700 mb-1">คำอธิบายหมวดหมู่</label>
                <textarea
                  rows={2}
                  value={editingCategory.description || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  placeholder="รายละเอียดสั้นๆ ของหมวดหมู่นี้..."
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                />
              </div>

              {/* Order */}
              <div>
                <label className="block font-medium text-slate-700 mb-1">ลำดับการแสดงผล (Order)</label>
                <input
                  type="number"
                  value={editingCategory.order ?? 1}
                  onChange={(e) =>
                    setEditingCategory({ ...editingCategory, order: parseInt(e.target.value, 10) || 1 })
                  }
                  className="w-full sm:w-48 rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                />
              </div>

              {/* Icon Picker */}
              <div className="pt-1">
                <div className="flex items-center justify-between mb-2">
                  <label className="block font-medium text-slate-700">
                    เลือกไอคอนหมวดหมู่ <span className="text-slate-400 font-normal">({CATEGORY_POPULAR_ICONS.length} ตัวเลือกยอดนิยม)</span>
                  </label>
                  <div className="flex items-center gap-1.5 bg-sky-50 text-sky-700 px-2.5 py-1 rounded-lg border border-sky-200/60 text-[11px] font-medium">
                    <DynamicIcon name={editingCategory.icon || 'Folder'} className="h-4 w-4" />
                    <span>ไอคอนที่เลือก: <strong>{editingCategory.icon || 'Folder'}</strong></span>
                  </div>
                </div>

                {/* Interactive Icon Grid */}
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 max-h-52 overflow-y-auto p-2.5 bg-slate-50 border border-slate-200 rounded-xl scrollbar-thin">
                  {CATEGORY_POPULAR_ICONS.map((iconName) => {
                    const isSelected = (editingCategory.icon || 'Folder') === iconName;
                    return (
                      <button
                        key={iconName}
                        type="button"
                        onClick={() => setEditingCategory({ ...editingCategory, icon: iconName })}
                        className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${
                          isSelected
                            ? 'bg-sky-500 text-white border-sky-600 shadow-sm ring-2 ring-sky-300 scale-95 font-semibold'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                        }`}
                        title={iconName}
                      >
                        <DynamicIcon name={iconName} className="h-5 w-5 mb-1 shrink-0" />
                        <span className="truncate w-full text-center text-[10px]">{iconName}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Custom icon or image URL fallback */}
                <div className="mt-2.5 flex items-center gap-2">
                  <span className="text-[11px] text-slate-500 shrink-0">หรือระบุชื่อไอคอน / URL เอง:</span>
                  <input
                    type="text"
                    value={editingCategory.icon || ''}
                    onChange={(e) => setEditingCategory({ ...editingCategory, icon: e.target.value })}
                    placeholder="เช่น Folder, Newspaper หรือ https://..."
                    className="flex-1 rounded-xl border border-slate-200 px-3 py-1.5 text-xs focus:border-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCatModalOpen(false)}
                  className="flex-1 rounded-xl border border-slate-200 py-2.5 font-medium text-slate-600 hover:bg-slate-50"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-sky-600 py-2.5 font-medium text-white shadow-sm hover:bg-sky-700 disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  <span>{saving ? 'กำลังบันทึก...' : 'บันทึกหมวดหมู่'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
