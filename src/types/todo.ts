// รูปแบบข้อมูล Todo ที่ได้รับจาก API (ตรงกับ JSON ที่ server ส่งกลับมา)
export interface Todo {
  id: number
  title: string
  completed: boolean
  createdAt: string // ISO date string เช่น "2026-10-13T05:30:00.000Z"
  updatedAt: string
}

// ข้อมูลที่ส่งไปแก้ไขรายการ (PATCH) ส่งแค่ field ที่ต้องการเปลี่ยน
export interface TodoChanges {
  title?: string
  completed?: boolean
}

// ตัวเลือกการกรองรายการบนหน้าจอ
export type TodoFilterValue = 'all' | 'active' | 'completed'

// ความยาวสูงสุดของชื่อรายการ (ตรงกับที่ API กำหนด) ใช้ทั้งตอนเพิ่มและตอนแก้ไขชื่อ
export const TITLE_MAX_LENGTH = 255
