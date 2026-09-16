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
  title: 'PRPPAO APP HUB | ศูนย์รวมแอปพลิเคชัน ฝ่ายประชาสัมพันธ์ อบจ.',
  description: 'ศูนย์รวมแอปพลิเคชันและระบบงานของฝ่ายประชาสัมพันธ์ องค์การบริหารส่วนจังหวัด เข้าถึงเครื่องมือ คลังภาพ และระบบงานได้ในที่เดียว',
  keywords: ['PRPPAO', 'App Hub', 'ประชาสัมพันธ์', 'อบจ', 'พอร์ทัลแอปพลิเคชัน'],
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
