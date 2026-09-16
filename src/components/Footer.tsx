import React from 'react';
import { Heart, Building2, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 py-8 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2 text-slate-700 font-semibold">
            <Building2 className="h-4 w-4 text-sky-600" />
            <span>PR-PPAO APP HUB &bull; ฝ่ายประชาสัมพันธ์ องค์การบริหารส่วนจังหวัดภูเก็ต</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-slate-500">
            <span>ฐานข้อมูล: Google Sheets</span>
            <span>&bull;</span>
            <span>ระบบรันบน: Vercel Cloud</span>
            <span>&bull;</span>
            <Link href="/admin" className="text-sky-600 hover:underline">
              ระบบจัดการ (Admin)
            </Link>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-200/60 text-center text-slate-600 text-[11px]">
          &copy; {new Date().getFullYear()} PR-PPAO องค์การบริหารส่วนจังหวัดภูเก็ต. All rights reserved. พัฒนาขึ้นเพื่อเพิ่มประสิทธิภาพการทำงานและประสานงานภายในฝ่ายประชาสัมพันธ์
        </div>
      </div>
    </footer>
  );
};
