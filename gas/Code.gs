/**
 * ==============================================================================
 * PR-PPAO APP HUB - Google Apps Script Backend (v2 with Categories support)
 * สคริปต์เชื่อมต่อฐานข้อมูล Google Sheets สำหรับศูนย์รวมแอปพลิเคชันและระบบงาน ฝ่ายการประชาสัมพันธ์ องค์การบริหารส่วนจังหวัดภูเก็ต
 * ==============================================================================
 * 
 * วิธีติดตั้ง:
 * 1. เปิด Google Sheet ที่ต้องการใช้เป็นฐานข้อมูล
 * 2. ไปที่เมนู "ส่วนขยาย" (Extensions) -> "Apps Script"
 * 3. วางโค้ดนี้แทนที่โค้ดเดิมทั้งหมด
 * 4. กดเลือกฟังก์ชัน "setupSheet" แล้วกด "เรียกใช้" (Run) เพื่อสร้างหัวตารางและข้อมูลเริ่มต้นทั้ง 2 แท็บ (Apps และ Categories)
 * 5. กดปุ่มสีน้ำเงินมุมขวาบน "ทำให้ใช้งานได้" (Deploy) -> "การทำให้ใช้งานได้ใหม่" (New deployment)
 *    - เลือกประเภทเป็น "เว็บแอป" (Web app)
 *    - คำอธิบาย: PR-PPAO App Hub API v2
 *    - เรียกใช้ในฐานะ (Execute as): ฉัน (Me)
 *    - ผู้ที่มีสิทธิ์เข้าถึง (Who has access): ทุกคน (Anyone)  <-- สำคัญมาก!
 * 6. กด "ทำให้ใช้งานได้" (Deploy) แล้วคัดลอก "URL เว็บแอป" ไปใส่ในโปรเจกต์ (GAS_API_URL)
 */

const SHEET_APPS = "Apps";
const SHEET_CATEGORIES = "Categories";

const APPS_HEADERS = [
  "id",
  "name",
  "description",
  "url",
  "category",
  "icon",
  "color",
  "status",
  "order",
  "tags",
  "department",
  "clicks",
  "createdAt",
  "updatedAt"
];

const CATEGORIES_HEADERS = [
  "id",
  "name",
  "description",
  "icon",
  "order",
  "createdAt",
  "updatedAt"
];

function getOrCreateSheet(sheetName, headers) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    sheet.appendRow(headers);
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground("#0284c7");
    headerRange.setFontColor("#ffffff");
    headerRange.setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

/**
 * ฟังก์ชันสร้างหัวตารางและข้อมูลเริ่มต้น (Apps และ Categories)
 */
function setupSheet() {
  // 1. Setup Apps
  const appsSheet = getOrCreateSheet(SHEET_APPS, APPS_HEADERS);
  if (appsSheet.getLastRow() <= 1) {
    appsSheet.appendRow([
      "app-001",
      "ระบบเผยแพร่ข่าวและประกาศ อบจ.",
      "ศูนย์จัดการและโพสต์ข่าวสาร กิจกรรม งานแถลงข่าว และประกาศทางการของ อบจ.",
      "https://www.facebook.com",
      "งานประชาสัมพันธ์และข่าวสาร",
      "Megaphone",
      "sky",
      "active",
      1,
      "ข่าวสาร,ประกาศ,แถลงข่าว",
      "ฝ่ายการประชาสัมพันธ์",
      342,
      new Date().toISOString(),
      new Date().toISOString()
    ]);
    appsSheet.appendRow([
      "app-002",
      "คลังภาพและวิดีโอกิจกรรม (Media Cloud)",
      "ศูนย์รวมภาพถ่ายความละเอียดสูงและคลิปวิดีโองานกิจกรรม สำหรับสื่อมวลชนและบุคลากร",
      "https://photos.google.com",
      "สื่อ กราฟิก และคลังภาพ",
      "Camera",
      "purple",
      "active",
      2,
      "รูปภาพ,วิดีโอ,คลังภาพ",
      "กลุ่มงานผลิตสื่อ",
      285,
      new Date().toISOString(),
      new Date().toISOString()
    ]);
  }

  // 2. Setup Categories
  const catSheet = getOrCreateSheet(SHEET_CATEGORIES, CATEGORIES_HEADERS);
  if (catSheet.getLastRow() <= 1) {
    const defaultCats = [
      ["cat-001", "งานประชาสัมพันธ์และข่าวสาร", "ระบบข่าว ประกาศ แถลงข่าว และงานเผยแพร่", "Megaphone", 1],
      ["cat-002", "สื่อ กราฟิก และคลังภาพ", "คลังภาพ วิดีโอ เทมเพลต CI และงานสตูดิโอ", "Camera", 2],
      ["cat-003", "โซเชียลมีเดียและการตลาด", "Facebook, YouTube, TikTok และช่องทางโซเชียล", "Share2", 3],
      ["cat-004", "ระบบงานภายในองค์กร", "ระบบสารบรรณและงานราชการภายใน", "FileText", 4],
      ["cat-005", "สถิติ รายงาน และแบบฟอร์ม", "แดชบอร์ดสรุปผล สถิติ และแบบประเมิน", "BarChart3", 5],
      ["cat-006", "เครื่องมือและบริการออนไลน์", "สายตรงผู้บริหารและบริการออนไลน์", "Headphones", 6],
    ];
    const now = new Date().toISOString();
    defaultCats.forEach(row => {
      catSheet.appendRow([...row, now, now]);
    });
  }

  Logger.log("Setup completed successfully!");
}

/**
 * GET Handler: ดึงข้อมูล
 */
function doGet(e) {
  try {
    const type = (e && e.parameter && e.parameter.type) || "";

    if (type === "categories") {
      const categories = readSheetData(SHEET_CATEGORIES, CATEGORIES_HEADERS);
      return responseJson({ status: "success", data: categories, count: categories.length });
    }

    const apps = readSheetData(SHEET_APPS, APPS_HEADERS);
    const categories = readSheetData(SHEET_CATEGORIES, CATEGORIES_HEADERS);

    return responseJson({
      status: "success",
      data: apps,
      apps: apps,
      categories: categories,
      count: apps.length
    });
  } catch (err) {
    return responseJson({ status: "error", message: err.toString() });
  }
}

function readSheetData(sheetName, headers) {
  const sheet = getOrCreateSheet(sheetName, headers);
  const values = sheet.getDataRange().getValues();
  if (values.length <= 1) return [];

  const rowHeaders = values[0];
  const list = [];
  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    if (!row[0]) continue;
    const item = {};
    rowHeaders.forEach((h, idx) => {
      item[h] = row[idx];
    });
    list.push(item);
  }
  return list;
}

/**
 * POST Handler
 */
function doPost(e) {
  try {
    const rawContent = e.postData.contents;
    const body = JSON.parse(rawContent);
    const action = (body.action || "CREATE").toUpperCase();

    // ==========================================
    // APPS ACTIONS
    // ==========================================
    if (action === "CREATE") {
      const sheet = getOrCreateSheet(SHEET_APPS, APPS_HEADERS);
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
        app.color || "sky",
        app.status || "active",
        app.order || sheet.getLastRow(),
        Array.isArray(app.tags) ? app.tags.join(",") : (app.tags || ""),
        app.department || "",
        Number(app.clicks || 0),
        now,
        now
      ]);

      return responseJson({
        status: "success",
        message: "บันทึกข้อมูลเรียบร้อย",
        data: { ...app, id: newId, color: app.color || "sky", clicks: Number(app.clicks || 0), createdAt: now, updatedAt: now }
      });
    }

    if (action === "INCREMENT_CLICK") {
      const sheet = getOrCreateSheet(SHEET_APPS, APPS_HEADERS);
      const targetId = body.id;
      const rowIdx = findRowIndexById(sheet, targetId);

      if (rowIdx === -1) {
        return responseJson({ status: "error", message: "ไม่พบรหัสแอป: " + targetId });
      }

      const clickColIdx = APPS_HEADERS.indexOf("clicks") + 1;
      const currentClicks = Number(sheet.getRange(rowIdx, clickColIdx).getValue()) || 0;
      const newClicks = currentClicks + 1;
      sheet.getRange(rowIdx, clickColIdx).setValue(newClicks);

      return responseJson({
        status: "success",
        clicks: newClicks
      });
    }

    if (action === "UPDATE") {
      const sheet = getOrCreateSheet(SHEET_APPS, APPS_HEADERS);
      const targetId = body.id;
      const app = body.data || {};
      const rowIdx = findRowIndexById(sheet, targetId);

      if (rowIdx === -1) {
        return responseJson({ status: "error", message: "ไม่พบรหัสแอป: " + targetId });
      }

      updateRowCells(sheet, rowIdx, APPS_HEADERS, app);
      return responseJson({ status: "success", message: "อัปเดตข้อมูลสำเร็จ", data: { id: targetId, ...app } });
    }

    if (action === "DELETE") {
      const sheet = getOrCreateSheet(SHEET_APPS, APPS_HEADERS);
      const targetId = body.id;
      const rowIdx = findRowIndexById(sheet, targetId);

      if (rowIdx === -1) {
        return responseJson({ status: "error", message: "ไม่พบรหัสแอปที่ต้องการลบ" });
      }

      sheet.deleteRow(rowIdx);
      return responseJson({ status: "success", message: "ลบข้อมูลสำเร็จ", deletedId: targetId });
    }

    // ==========================================
    // CATEGORIES ACTIONS
    // ==========================================
    if (action === "CREATE_CATEGORY") {
      const sheet = getOrCreateSheet(SHEET_CATEGORIES, CATEGORIES_HEADERS);
      const cat = body.data || {};
      const newId = cat.id || ("cat-" + Utilities.getUuid().substring(0, 8));
      const now = new Date().toISOString();

      sheet.appendRow([
        newId,
        cat.name || "",
        cat.description || "",
        cat.icon || "Folder",
        cat.order || sheet.getLastRow(),
        now,
        now
      ]);

      return responseJson({
        status: "success",
        message: "เพิ่มหมวดหมู่เรียบร้อย",
        data: { ...cat, id: newId, createdAt: now, updatedAt: now }
      });
    }

    if (action === "UPDATE_CATEGORY") {
      const sheet = getOrCreateSheet(SHEET_CATEGORIES, CATEGORIES_HEADERS);
      const targetId = body.id;
      const cat = body.data || {};
      const oldName = body.oldName;
      const rowIdx = findRowIndexById(sheet, targetId);

      if (rowIdx === -1) {
        return responseJson({ status: "error", message: "ไม่พบรหัสหมวดหมู่: " + targetId });
      }

      updateRowCells(sheet, rowIdx, CATEGORIES_HEADERS, cat);

      // If category name changed, update Apps referencing old category name
      if (oldName && cat.name && oldName !== cat.name) {
        const appsSheet = getOrCreateSheet(SHEET_APPS, APPS_HEADERS);
        const appsValues = appsSheet.getDataRange().getValues();
        const catColIdx = APPS_HEADERS.indexOf("category");
        for (let i = 1; i < appsValues.length; i++) {
          if (appsValues[i][catColIdx] === oldName) {
            appsSheet.getRange(i + 1, catColIdx + 1).setValue(cat.name);
          }
        }
      }

      return responseJson({ status: "success", message: "อัปเดตหมวดหมู่สำเร็จ", data: { id: targetId, ...cat } });
    }

    if (action === "DELETE_CATEGORY") {
      const sheet = getOrCreateSheet(SHEET_CATEGORIES, CATEGORIES_HEADERS);
      const targetId = body.id;
      const categoryName = body.categoryName;
      const rowIdx = findRowIndexById(sheet, targetId);

      if (rowIdx === -1) {
        return responseJson({ status: "error", message: "ไม่พบหมวดหมู่ที่ต้องการลบ" });
      }

      sheet.deleteRow(rowIdx);

      // Fallback apps with this category to 'ทั่วไป'
      if (categoryName) {
        const appsSheet = getOrCreateSheet(SHEET_APPS, APPS_HEADERS);
        const appsValues = appsSheet.getDataRange().getValues();
        const catColIdx = APPS_HEADERS.indexOf("category");
        for (let i = 1; i < appsValues.length; i++) {
          if (appsValues[i][catColIdx] === categoryName) {
            appsSheet.getRange(i + 1, catColIdx + 1).setValue("ทั่วไป");
          }
        }
      }

      return responseJson({ status: "success", message: "ลบหมวดหมู่สำเร็จ", deletedId: targetId });
    }

    return responseJson({ status: "error", message: "Action ไม่ถูกต้อง" });
  } catch (err) {
    return responseJson({ status: "error", message: err.toString() });
  }
}

function findRowIndexById(sheet, targetId) {
  const values = sheet.getDataRange().getValues();
  for (let i = 1; i < values.length; i++) {
    if (String(values[i][0]) === String(targetId)) {
      return i + 1;
    }
  }
  return -1;
}

function updateRowCells(sheet, rowIdx, headers, dataObj) {
  headers.forEach((header, colIdx) => {
    if (header !== "id" && header !== "createdAt" && dataObj[header] !== undefined) {
      let val = dataObj[header];
      if (header === "tags" && Array.isArray(val)) val = val.join(",");
      sheet.getRange(rowIdx, colIdx + 1).setValue(val);
    }
  });
  const updatedIdx = headers.indexOf("updatedAt");
  if (updatedIdx !== -1) {
    sheet.getRange(rowIdx, updatedIdx + 1).setValue(new Date().toISOString());
  }
}

function responseJson(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
