/**
 * ==============================================================================
 * PRPPAO APP HUB - Google Apps Script Backend
 * สคริปต์เชื่อมต่อฐานข้อมูล Google Sheets สำหรับระบบศูนย์รวมแอปพลิเคชัน ฝ่ายประชาสัมพันธ์
 * ==============================================================================
 * 
 * วิธีติดตั้ง:
 * 1. เปิด Google Sheet ที่ต้องการใช้เป็นฐานข้อมูล
 * 2. ไปที่เมนู "ส่วนขยาย" (Extensions) -> "Apps Script"
 * 3. วางโค้ดนี้แทนที่โค้ดเดิมทั้งหมด
 * 4. (ไม่บังคับ) กดเลือกฟังก์ชัน "setupSheet" แล้วกด "เรียกใช้" (Run) เพื่อสร้างหัวตารางและข้อมูลตัวอย่างอัตโนมัติ
 * 5. กดปุ่มสีน้ำเงินมุมขวาบน "ทำให้ใช้งานได้" (Deploy) -> "การทำให้ใช้งานได้ใหม่" (New deployment)
 * 6. เลือกประเภทเป็น "เว็บแอป" (Web app)
 *    - คำอธิบาย: PRPPAO App Hub API v1
 *    - เรียกใช้ในฐานะ (Execute as): ฉัน (Me)
 *    - ผู้ที่มีสิทธิ์เข้าถึง (Who has access): ทุกคน (Anyone)  <-- สำคัญมาก!
 * 7. กด "ทำให้ใช้งานได้" (Deploy) แล้วคัดลอก "URL เว็บแอป" ไปใส่ในโปรเจกต์ (GAS_API_URL)
 */

const SHEET_NAME = "Apps";

// ลำดับคอลัมน์มาตรฐาน
const HEADERS = [
  "id",
  "name",
  "description",
  "url",
  "category",
  "icon",
  "status",
  "order",
  "tags",
  "department",
  "createdAt",
  "updatedAt"
];

function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    // จัดรูปแบบ Header สวยงาม
    const headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
    headerRange.setBackground("#0284c7");
    headerRange.setFontColor("#ffffff");
    headerRange.setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

/**
 * ฟังก์ชันสร้างหัวตารางและข้อมูลเริ่มต้น (รันครั้งแรกใน Apps Script ได้เลย)
 */
function setupSheet() {
  const sheet = getOrCreateSheet();
  if (sheet.getLastRow() <= 1) {
    sheet.appendRow([
      "app-001",
      "ระบบเผยแพร่ข่าวและประกาศ อบจ.",
      "ศูนย์จัดการและโพสต์ข่าวสาร กิจกรรม งานแถลงข่าว และประกาศทางการของ อบจ.",
      "https://www.facebook.com",
      "งานประชาสัมพันธ์และข่าวสาร",
      "Megaphone",
      "active",
      1,
      "ข่าวสาร,ประกาศ,แถลงข่าว",
      "ฝ่ายประชาสัมพันธ์",
      new Date().toISOString(),
      new Date().toISOString()
    ]);
    sheet.appendRow([
      "app-002",
      "คลังภาพและวิดีโอกิจกรรม (Media Cloud)",
      "ศูนย์รวมภาพถ่ายความละเอียดสูงและคลิปวิดีโองานกิจกรรม สำหรับสื่อมวลชนและบุคลากร",
      "https://photos.google.com",
      "สื่อ กราฟิก และคลังภาพ",
      "Camera",
      "active",
      2,
      "รูปภาพ,วิดีโอ,คลังภาพ",
      "กลุ่มงานผลิตสื่อ",
      new Date().toISOString(),
      new Date().toISOString()
    ]);
  }
  Logger.log("Setup completed successfully!");
}

/**
 * GET Handler: ดึงข้อมูลรายการแอปทั้งหมด
 */
function doGet(e) {
  try {
    const sheet = getOrCreateSheet();
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();

    if (values.length <= 1) {
      return responseJson({ status: "success", data: [] });
    }

    const headers = values[0];
    const data = [];

    for (let i = 1; i < values.length; i++) {
      const row = values[i];
      if (!row[0]) continue; // ข้ามแถวที่ไม่มี ID

      const item = {};
      headers.forEach((header, colIndex) => {
        item[header] = row[colIndex];
      });
      data.push(item);
    }

    return responseJson({
      status: "success",
      count: data.length,
      data: data
    });
  } catch (err) {
    return responseJson({ status: "error", message: err.toString() });
  }
}

/**
 * POST Handler: เพิ่ม, แก้ไข หรือ ลบข้อมูล
 */
function doPost(e) {
  try {
    const sheet = getOrCreateSheet();
    const rawContent = e.postData.contents;
    const body = JSON.parse(rawContent);
    const action = (body.action || "CREATE").toUpperCase();

    if (action === "CREATE") {
      const app = body.data || {};
      const newId = app.id || ("app-" + Utilities.getUuid().substring(0, 8));
      const now = new Date().toISOString();

      sheet.appendRow([
        newId,
        app.name || "",
        app.description || "",
        app.url || "",
        app.category || "ทั่วไป",
        app.icon || "Globe",
        app.status || "active",
        app.order || sheet.getLastRow(),
        Array.isArray(app.tags) ? app.tags.join(",") : (app.tags || ""),
        app.department || "",
        now,
        now
      ]);

      return responseJson({
        status: "success",
        message: "บันทึกข้อมูลเรียบร้อย",
        data: { ...app, id: newId, createdAt: now, updatedAt: now }
      });
    }

    if (action === "UPDATE") {
      const targetId = body.id;
      const app = body.data || {};
      const values = sheet.getDataRange().getValues();
      const headers = values[0];
      const idColIndex = headers.indexOf("id");

      let targetRowIndex = -1;
      for (let i = 1; i < values.length; i++) {
        if (String(values[i][idColIndex]) === String(targetId)) {
          targetRowIndex = i + 1; // 1-based row index
          break;
        }
      }

      if (targetRowIndex === -1) {
        return responseJson({ status: "error", message: "ไม่พบรหัสแอปพลิเคชัน: " + targetId });
      }

      // อัปเดตข้อมูลตาม Header
      headers.forEach((header, colIdx) => {
        if (header !== "id" && header !== "createdAt" && app[header] !== undefined) {
          let val = app[header];
          if (header === "tags" && Array.isArray(val)) {
            val = val.join(",");
          }
          sheet.getRange(targetRowIndex, colIdx + 1).setValue(val);
        }
      });
      // อัปเดต updatedAt
      const updatedIndex = headers.indexOf("updatedAt");
      if (updatedIndex !== -1) {
        sheet.getRange(targetRowIndex, updatedIndex + 1).setValue(new Date().toISOString());
      }

      return responseJson({
        status: "success",
        message: "อัปเดตข้อมูลสำเร็จ",
        data: { id: targetId, ...app }
      });
    }

    if (action === "DELETE") {
      const targetId = body.id;
      const values = sheet.getDataRange().getValues();
      const headers = values[0];
      const idColIndex = headers.indexOf("id");

      let targetRowIndex = -1;
      for (let i = 1; i < values.length; i++) {
        if (String(values[i][idColIndex]) === String(targetId)) {
          targetRowIndex = i + 1;
          break;
        }
      }

      if (targetRowIndex === -1) {
        return responseJson({ status: "error", message: "ไม่พบรหัสแอปที่ต้องการลบ" });
      }

      sheet.deleteRow(targetRowIndex);
      return responseJson({
        status: "success",
        message: "ลบข้อมูลสำเร็จ",
        deletedId: targetId
      });
    }

    return responseJson({ status: "error", message: "Action ไม่ถูกต้อง" });
  } catch (err) {
    return responseJson({ status: "error", message: err.toString() });
  }
}

function responseJson(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
