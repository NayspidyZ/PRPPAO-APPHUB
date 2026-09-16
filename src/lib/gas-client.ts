import { AppItem, CategoryItem, ApiResponse } from '@/types/app';
import { INITIAL_MOCK_APPS, INITIAL_MOCK_CATEGORIES } from './mock-data';

// Store in-memory for dev/demo when GAS_API_URL is not set
let inMemoryMockApps: AppItem[] = [...INITIAL_MOCK_APPS];
let inMemoryMockCategories: CategoryItem[] = [...INITIAL_MOCK_CATEGORIES];

export function getGasUrl(): string | undefined {
  return process.env.GAS_API_URL;
}

export function isUsingMock(): boolean {
  const url = getGasUrl();
  return !url || url.trim() === '' || url.includes('YOUR_APPS_SCRIPT_URL_HERE');
}

/**
 * ดึงรายการแอปพลิเคชันทั้งหมดจาก Google Apps Script (หรือ Mock Data หากยังไม่ตั้งค่า)
 */
export async function fetchAllApps(): Promise<{ apps: AppItem[]; isMock: boolean }> {
  const gasUrl = getGasUrl();

  if (isUsingMock()) {
    return { apps: [...inMemoryMockApps], isMock: true };
  }

  try {
    const response = await fetch(`${gasUrl!}?type=apps`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      console.warn(`[GAS] HTTP error ${response.status}. Falling back to mock data.`);
      return { apps: [...inMemoryMockApps], isMock: true };
    }

    const json = await response.json();
    const rawApps = Array.isArray(json.data) ? json.data : (json.apps || []);

    if (Array.isArray(rawApps)) {
      const items: AppItem[] = rawApps.map((item: any) => ({
        id: String(item.id || item.ID || ''),
        name: String(item.name || item.Name || ''),
        description: String(item.description || item.Description || ''),
        url: String(item.url || item.Url || item.URL || '#'),
        category: String(item.category || item.Category || 'ทั่วไป'),
        icon: String(item.icon || item.Icon || 'Globe'),
        color: String(item.color || item.Color || 'sky'),
        status: (item.status || item.Status || 'active').toLowerCase() === 'maintenance' ? 'maintenance' : 'active',
        order: Number(item.order || item.Order || 0),
        tags: item.tags ? (typeof item.tags === 'string' ? item.tags.split(',').map((s: string) => s.trim()) : item.tags) : [],
        department: String(item.department || item.Department || ''),
        clicks: Number(item.clicks || item.Clicks || 0),
        createdAt: item.createdAt || item.CreatedAt || '',
        updatedAt: item.updatedAt || item.UpdatedAt || '',
      }));

      items.sort((a, b) => (a.order || 999) - (b.order || 999));
      return { apps: items, isMock: false };
    }

    return { apps: [...inMemoryMockApps], isMock: true };
  } catch (error) {
    console.error('[GAS] Error connecting to Google Apps Script:', error);
    return { apps: [...inMemoryMockApps], isMock: true };
  }
}

/**
 * เพิ่มแอปพลิเคชันใหม่ลงใน Google Sheet
 */
export async function createGasApp(appData: Omit<AppItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<AppItem>> {
  const newApp: AppItem = {
    ...appData,
    id: 'app-' + Date.now(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (isUsingMock()) {
    inMemoryMockApps.unshift(newApp);
    return {
      status: 'success',
      data: newApp,
      message: 'บันทึกข้อมูลเรียบร้อย (โหมดจำลอง Mock Data)',
      isMock: true,
    };
  }

  try {
    const response = await fetch(getGasUrl()!, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({
        action: 'CREATE',
        data: newApp,
      }),
    });

    const result = await response.json();
    return {
      status: result.status === 'success' ? 'success' : 'error',
      data: result.data || newApp,
      message: result.message || 'บันทึกข้อมูลสำเร็จ',
      isMock: false,
    };
  } catch (error: any) {
    console.error('[GAS] Error creating app in GAS:', error);
    return {
      status: 'error',
      message: 'ไม่สามารถเชื่อมต่อ Google Apps Script ได้: ' + (error.message || 'Unknown error'),
    };
  }
}

/**
 * แก้ไขแอปพลิเคชันใน Google Sheet
 */
export async function updateGasApp(id: string, appData: Partial<AppItem>): Promise<ApiResponse<AppItem>> {
  if (isUsingMock()) {
    const index = inMemoryMockApps.findIndex((a) => a.id === id);
    if (index !== -1) {
      inMemoryMockApps[index] = {
        ...inMemoryMockApps[index],
        ...appData,
        updatedAt: new Date().toISOString(),
      };
      return {
        status: 'success',
        data: inMemoryMockApps[index],
        message: 'อัปเดตข้อมูลสำเร็จ (โหมดจำลอง Mock Data)',
        isMock: true,
      };
    }
    return { status: 'error', message: 'ไม่พบรหัสแอปที่ต้องการแก้ไข' };
  }

  try {
    const response = await fetch(getGasUrl()!, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({
        action: 'UPDATE',
        id,
        data: {
          ...appData,
          updatedAt: new Date().toISOString(),
        },
      }),
    });

    const result = await response.json();
    return {
      status: result.status === 'success' ? 'success' : 'error',
      data: result.data,
      message: result.message || 'อัปเดตข้อมูลสำเร็จ',
      isMock: false,
    };
  } catch (error: any) {
    return {
      status: 'error',
      message: 'เกิดข้อผิดพลาดในการอัปเดต: ' + error.message,
    };
  }
}

/**
 * ลบแอปพลิเคชันจาก Google Sheet
 */
export async function deleteGasApp(id: string): Promise<ApiResponse<null>> {
  if (isUsingMock()) {
    inMemoryMockApps = inMemoryMockApps.filter((a) => a.id !== id);
    return {
      status: 'success',
      message: 'ลบข้อมูลสำเร็จ (โหมดจำลอง Mock Data)',
      isMock: true,
    };
  }

  try {
    const response = await fetch(getGasUrl()!, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({
        action: 'DELETE',
        id,
      }),
    });

    const result = await response.json();
    return {
      status: result.status === 'success' ? 'success' : 'error',
      message: result.message || 'ลบข้อมูลสำเร็จ',
      isMock: false,
    };
  } catch (error: any) {
    return {
      status: 'error',
      message: 'เกิดข้อผิดพลาดในการลบ: ' + error.message,
    };
  }
}

/**
 * เพิ่มสถิติการคลิกเข้าใช้งานแอปพลิเคชัน (+1 Click)
 */
export async function incrementAppClick(id: string): Promise<{ success: boolean; clicks: number }> {
  if (isUsingMock()) {
    const app = inMemoryMockApps.find((a) => a.id === id);
    if (app) {
      app.clicks = (app.clicks || 0) + 1;
      return { success: true, clicks: app.clicks };
    }
    return { success: false, clicks: 0 };
  }

  try {
    const response = await fetch(getGasUrl()!, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        action: 'INCREMENT_CLICK',
        id,
      }),
    });

    const result = await response.json();
    return {
      success: result.status === 'success',
      clicks: Number(result.clicks || 0),
    };
  } catch (error) {
    console.error('[GAS] Error incrementing click:', error);
    return { success: false, clicks: 0 };
  }
}

// =============================================================================
// CATEGORIES CRUD
// =============================================================================

/**
 * ดึงรายการหมวดหมู่ทั้งหมด
 */
export async function fetchAllCategories(): Promise<{ categories: CategoryItem[]; isMock: boolean }> {
  const gasUrl = getGasUrl();

  if (isUsingMock()) {
    return { categories: [...inMemoryMockCategories], isMock: true };
  }

  try {
    const response = await fetch(`${gasUrl!}?type=categories`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      cache: 'no-store',
    });

    if (!response.ok) {
      return { categories: [...inMemoryMockCategories], isMock: true };
    }

    const json = await response.json();
    const rawCategories = json.categories || json.data || [];

    if (Array.isArray(rawCategories) && rawCategories.length > 0) {
      const items: CategoryItem[] = rawCategories.map((item: any) => ({
        id: String(item.id || item.ID || ''),
        name: String(item.name || item.Name || ''),
        description: String(item.description || item.Description || ''),
        icon: String(item.icon || item.Icon || 'Folder'),
        order: Number(item.order || item.Order || 1),
        createdAt: item.createdAt || item.CreatedAt || '',
        updatedAt: item.updatedAt || item.UpdatedAt || '',
      }));

      items.sort((a, b) => (a.order || 999) - (b.order || 999));
      return { categories: items, isMock: false };
    }

    return { categories: [...inMemoryMockCategories], isMock: true };
  } catch (error) {
    console.error('[GAS] Error fetching categories from GAS:', error);
    return { categories: [...inMemoryMockCategories], isMock: true };
  }
}

/**
 * เพิ่มหมวดหมู่ใหม่
 */
export async function createGasCategory(
  categoryData: Omit<CategoryItem, 'id' | 'createdAt' | 'updatedAt'>
): Promise<ApiResponse<CategoryItem>> {
  const newCat: CategoryItem = {
    ...categoryData,
    id: 'cat-' + Date.now(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (isUsingMock()) {
    inMemoryMockCategories.push(newCat);
    inMemoryMockCategories.sort((a, b) => (a.order || 999) - (b.order || 999));
    return {
      status: 'success',
      data: newCat,
      message: 'เพิ่มหมวดหมู่เรียบร้อย (โหมดจำลอง Mock Data)',
      isMock: true,
    };
  }

  try {
    const response = await fetch(getGasUrl()!, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        action: 'CREATE_CATEGORY',
        data: newCat,
      }),
    });

    const result = await response.json();
    return {
      status: result.status === 'success' ? 'success' : 'error',
      data: result.data || newCat,
      message: result.message || 'เพิ่มหมวดหมู่สำเร็จ',
      isMock: false,
    };
  } catch (error: any) {
    return {
      status: 'error',
      message: 'เกิดข้อผิดพลาดในการเพิ่มหมวดหมู่: ' + error.message,
    };
  }
}

/**
 * แก้ไขหมวดหมู่
 */
export async function updateGasCategory(
  id: string,
  categoryData: Partial<CategoryItem>,
  oldName?: string
): Promise<ApiResponse<CategoryItem>> {
  if (isUsingMock()) {
    const index = inMemoryMockCategories.findIndex((c) => c.id === id);
    if (index !== -1) {
      const prevName = inMemoryMockCategories[index].name;
      inMemoryMockCategories[index] = {
        ...inMemoryMockCategories[index],
        ...categoryData,
        updatedAt: new Date().toISOString(),
      };
      inMemoryMockCategories.sort((a, b) => (a.order || 999) - (b.order || 999));

      // Also rename category across apps if name changed
      if (categoryData.name && categoryData.name !== prevName) {
        inMemoryMockApps.forEach((app) => {
          if (app.category === prevName) {
            app.category = categoryData.name!;
          }
        });
      }

      return {
        status: 'success',
        data: inMemoryMockCategories[index],
        message: 'อัปเดตหมวดหมู่เรียบร้อย (โหมดจำลอง Mock Data)',
        isMock: true,
      };
    }
    return { status: 'error', message: 'ไม่พบรหัสหมวดหมู่ที่ต้องการแก้ไข' };
  }

  try {
    const response = await fetch(getGasUrl()!, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        action: 'UPDATE_CATEGORY',
        id,
        data: {
          ...categoryData,
          updatedAt: new Date().toISOString(),
        },
        oldName,
      }),
    });

    const result = await response.json();
    return {
      status: result.status === 'success' ? 'success' : 'error',
      data: result.data,
      message: result.message || 'อัปเดตหมวดหมู่สำเร็จ',
      isMock: false,
    };
  } catch (error: any) {
    return {
      status: 'error',
      message: 'เกิดข้อผิดพลาดในการอัปเดตหมวดหมู่: ' + error.message,
    };
  }
}

/**
 * ลบหมวดหมู่
 */
export async function deleteGasCategory(id: string, categoryName?: string): Promise<ApiResponse<null>> {
  if (isUsingMock()) {
    inMemoryMockCategories = inMemoryMockCategories.filter((c) => c.id !== id);
    // If deleted category was used in any app, fall back to "ทั่วไป"
    if (categoryName) {
      inMemoryMockApps.forEach((app) => {
        if (app.category === categoryName) {
          app.category = 'ทั่วไป';
        }
      });
    }
    return {
      status: 'success',
      message: 'ลบหมวดหมู่เรียบร้อย (โหมดจำลอง Mock Data)',
      isMock: true,
    };
  }

  try {
    const response = await fetch(getGasUrl()!, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        action: 'DELETE_CATEGORY',
        id,
        categoryName,
      }),
    });

    const result = await response.json();
    return {
      status: result.status === 'success' ? 'success' : 'error',
      message: result.message || 'ลบหมวดหมู่สำเร็จ',
      isMock: false,
    };
  } catch (error: any) {
    return {
      status: 'error',
      message: 'เกิดข้อผิดพลาดในการลบหมวดหมู่: ' + error.message,
    };
  }
}
