import { AppItem, ApiResponse } from '@/types/app';
import { INITIAL_MOCK_APPS } from './mock-data';

// Store in-memory for dev/demo when GAS_API_URL is not set
let inMemoryMockApps: AppItem[] = [...INITIAL_MOCK_APPS];

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
    const response = await fetch(gasUrl!, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store', // Always get fresh data
    });

    if (!response.ok) {
      console.warn(`[GAS] HTTP error ${response.status}. Falling back to mock data.`);
      return { apps: [...inMemoryMockApps], isMock: true };
    }

    const json = await response.json();
    if (json.status === 'success' && Array.isArray(json.data)) {
      // Map and sanitize raw rows
      const items: AppItem[] = json.data.map((item: any) => ({
        id: String(item.id || item.ID || ''),
        name: String(item.name || item.Name || ''),
        description: String(item.description || item.Description || ''),
        url: String(item.url || item.Url || item.URL || '#'),
        category: String(item.category || item.Category || 'ทั่วไป'),
        icon: String(item.icon || item.Icon || 'Globe'),
        status: (item.status || item.Status || 'active').toLowerCase() === 'maintenance' ? 'maintenance' : 'active',
        order: Number(item.order || item.Order || 0),
        tags: item.tags ? (typeof item.tags === 'string' ? item.tags.split(',').map((s: string) => s.trim()) : item.tags) : [],
        department: String(item.department || item.Department || ''),
        createdAt: item.createdAt || item.CreatedAt || '',
        updatedAt: item.updatedAt || item.UpdatedAt || '',
      }));

      // Sort by order ascending
      items.sort((a, b) => (a.order || 999) - (b.order || 999));
      return { apps: items, isMock: false };
    }

    console.warn('[GAS] Unexpected JSON format from GAS. Falling back to mock data.');
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
