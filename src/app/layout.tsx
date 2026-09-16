import type { Metadata } from 'next';
import { Prompt } from 'next/font/google';
import './globals.css';

const prompt = Prompt({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin', 'thai'],
  display: 'swap',
  variable: '--font-kanit',
});

export const metadata: Metadata = {
  title: 'PR-PPAO APP HUB | ศูนย์รวมแอปพลิเคชันและระบบงาน ฝ่ายประชาสัมพันธ์ องค์การบริหารส่วนจังหวัดภูเก็ต',
  description: 'ศูนย์รวมแอปพลิเคชันและระบบงาน ฝ่ายประชาสัมพันธ์ องค์การบริหารส่วนจังหวัดภูเก็ต เข้าถึงเครื่องมือ คลังภาพ และระบบงานได้ในที่เดียว',
  keywords: ['PR-PPAO', 'PRPPAO', 'App Hub', 'ประชาสัมพันธ์', 'อบจ.ภูเก็ต', 'องค์การบริหารส่วนจังหวัดภูเก็ต', 'พอร์ทัลแอปพลิเคชัน'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" className={`${prompt.variable} scroll-smooth`}>
      <body className="min-h-screen flex flex-col antialiased bg-slate-50 text-slate-900 font-sans">
        {children}
      </body>
    </html>
  );
}
