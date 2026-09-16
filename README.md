# 🚀 PRPPAO APP HUB (ศูนย์รวมแอปพลิเคชัน ฝ่ายประชาสัมพันธ์ อบจ.)

เว็บพอร์ทัลศูนย์รวมแอปพลิเคชันและระบบงานของฝ่ายประชาสัมพันธ์ องค์การบริหารส่วนจังหวัด พัฒนาด้วย **Next.js (App Router)**, **Tailwind CSS** และใช้ **Google Sheets เป็นฐานข้อมูลผ่าน Google Apps Script** พร้อมสำหรับการนำขึ้น **GitHub** และ Deploy อัตโนมัติบน **Vercel**

---

## ✨ ฟังก์ชันเด่นของระบบ

- 🔍 **ค้นหาและกรองข้อมูลแบบเรียลไทม์:** ค้นหาชื่อระบบ คำอธิบาย แผนก หรือแท็กได้ทันที พร้อมตัวกรองแยกตามหมวดหมู่
- 🎨 **UI ทันสมัย & รองรับทุกหน้าจอ:** ออกแบบด้วยโทนสีหน่วยงานราชการ/บริการสาธารณะ ใช้งานได้ลื่นไหลทั้งบนมือถือและคอมพิวเตอร์
- 🛡️ **ระบบจัดการข้อมูล (Admin Panel):** มีหน้า Admin พร้อมระบบล็อกรหัสผ่าน (Password/PIN) เพื่อเพิ่ม แก้ไข และลบแอปพลิเคชัน
- 📊 **Google Sheets Database:** ใช้ Google Sheets เก็บข้อมูล ทำให้เจ้าหน้าที่เปิดดูและแก้ไขข้อมูลตารางได้โดยตรง
- ⚡ **โหมดจำลองข้อมูล (Mock Data Mode):** ระบบเปิดทดสอบได้ทันทีแม้ยังไม่ได้เชื่อมต่อกับ Google Apps Script

---

## 🛠️ โครงสร้างเทคโนโลยี (Tech Stack)

- **Frontend & Backend Framework:** Next.js 15 (TypeScript, App Router, React 19)
- **Styling:** Tailwind CSS + Prompt Font (Google Font ภาษาไทย)
- **Icons:** Lucide React
- **Database & Backend API:** Google Sheets + Google Apps Script (Web App)
- **Version Control & Hosting:** GitHub + Vercel

---

## 📋 ขั้นตอนการติดตั้งและใช้งาน

### 1. การเตรียม Google Sheet & Google Apps Script

1. เปิด [Google Sheets](https://sheets.google.com) แล้วสร้างสเปรดชีตใหม่ (ตั้งชื่อชีต เช่น `PRPPAO App Database`)
2. ไปที่เมนู **ส่วนขยาย (Extensions)** &rarr; **Apps Script**
3. คัดลอกโค้ดทั้งหมดจากไฟล์ [`gas/Code.gs`](./gas/Code.gs) ในโปรเจกต์นี้ ไปวางแทนที่โค้ดเดิมใน Apps Script
4. ด้านบนของ Apps Script เลือกฟังก์ชัน **`setupSheet`** แล้วกดปุ่ม **เรียกใช้ (Run)** เพื่อสร้างหัวตารางและตัวอย่างข้อมูลอัตโนมัติ (กดยินยอมสิทธิ์เมื่อมีหน้าต่างถาม)
5. กดปุ่มสีน้ำเงินมุมขวาบน **ทำให้ใช้งานได้ (Deploy)** &rarr; **การทำให้ใช้งานได้ใหม่ (New deployment)**
6. ตั้งค่าดังนี้:
   - **เลือกประเภท (Select type):** คลิกรูปฟันเฟือง เลือก **เว็บแอป (Web app)**
   - **คำอธิบาย (Description):** เช่น `PRPPAO Hub API v1`
   - **เรียกใช้ในฐานะ (Execute as):** **ฉัน (Me)**
   - **ผู้ที่มีสิทธิ์เข้าถึง (Who has access):** **ทุกคน (Anyone)** *(สำคัญมาก! เพื่อให้เว็บแอพดึงข้อมูลได้)*
7. กด **ทำให้ใช้งานได้ (Deploy)**
8. คัดลอก **URL เว็บแอป (Web App URL)** ที่ลงท้ายด้วย `/exec` เก็บไว้

---

### 2. การรันและทดสอบในเครื่องคอมพิวเตอร์ (Local)

1. คัดลอกไฟล์ `.env.example` เป็น `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
2. แก้ไขไฟล์ `.env.local` แล้วนำ URL จาก Apps Script มาวาง:
   ```env
   GAS_API_URL="https://script.google.com/macros/s/AKfycb.../exec"
   ADMIN_PASSWORD="admin1234"
   ```
   *(หากยังไม่ใส่ URL ระบบจะรันในโหมดจำลอง Mock Data ให้ทดสอบได้ทันที)*

3. ติดตั้ง Dependencies และเปิดใช้งาน:
   ```bash
   npm install
   npm run dev
   ```
4. เปิดเบราว์เซอร์ไปที่ [http://localhost:3000](http://localhost:3000)

---

### 3. การนำขึ้น GitHub

เปิด Terminal ในโฟลเดอร์โปรเจกต์ แล้วรันคำสั่งตามลำดับ:

```bash
# 1. สร้าง Git Repository
git init

# 2. เพิ่มไฟล์ทั้งหมด
git add .

# 3. บันทึก Commit แรก
git commit -m "feat: initial commit for PRPPAO App Hub"

# 4. เปลี่ยนชื่อ Branch เป็น main
git branch -M main

# 5. เชื่อมต่อกับ GitHub Repo ของคุณ (แทนที่ด้วย URL Repo บน GitHub ของคุณ)
git remote add origin https://github.com/YOUR_USERNAME/prppao-app-hub.git

# 6. Push โค้ดขึ้น GitHub
git push -u origin main
```

---

### 4. การ Deploy บน Vercel

1. เข้าสู่ระบบที่ [vercel.com](https://vercel.com)
2. กดปุ่ม **"Add New..."** &rarr; **"Project"**
3. เลือก Repository `prppao-app-hub` จาก GitHub ที่เพิ่ง Push ขึ้นไป แล้วกด **Import**
4. ในหน้าการตั้งค่าก่อน Deploy ให้เปิดหัวข้อ **Environment Variables** แล้วเพิ่ม 2 ค่านี้:
   - **Name:** `GAS_API_URL`
     - **Value:** `https://script.google.com/macros/s/.../exec` (URL จาก Google Apps Script)
   - **Name:** `ADMIN_PASSWORD`
     - **Value:** รหัสผ่านสำหรับ Admin ที่ต้องการ (เช่น `yourSecurePin1234`)
5. กดปุ่ม **Deploy**
6. เมื่อ Vercel ทำการ Build เสร็จเรียบร้อย คุณจะได้ Domain เว็บไซต์ (เช่น `https://prppao-app-hub.vercel.app`) พร้อมใช้งานทันที 🚀
7. ในอนาคต เมื่อคุณแก้ไขโค้ดและ `git push` ขึ้น GitHub ทาง Vercel จะอัปเดตเวอร์ชันใหม่ให้อัตโนมัติ

---

## 🔒 การเข้าสู่ระบบจัดการ (Admin)

- เข้าหน้า Admin ได้ที่เมนู **จัดการระบบ (Admin)** มุมขวาบน หรือเข้าผ่าน URL `/admin`
- รหัสผ่านเริ่มต้นคือ: `admin1234` (สามารถเปลี่ยนได้ในตัวแปร `ADMIN_PASSWORD`)
