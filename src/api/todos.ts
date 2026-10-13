import type { Todo, TodoChanges } from '../types/todo'

// URL ของ API อ่านจากไฟล์ .env (VITE_API_URL) ถ้าไม่ได้ตั้งไว้ หรือตั้งไว้แต่เว้นว่าง จะใช้ค่า default
// (ใช้ || ไม่ใช่ ?? เพราะ ?? จะยอมรับค่าว่าง "" ทำให้ยิง request ผิดที่)
// ตัด "/" ท้าย URL ออก เพื่อไม่ให้ได้ path แบบ ".../api//todos"
const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace(/\/+$/, '')

// Error ที่มี HTTP status code ติดมาด้วย เพื่อให้ผู้เรียกเลือกข้อความแจ้งผู้ใช้ตาม status ได้
// - status = 0 แปลว่าเชื่อมต่อ server ไม่ได้เลย (เช่น ยังไม่ได้เปิด API)
// - message คือข้อความจริงจาก server (ภาษาอังกฤษ) ใช้สำหรับ debug
export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

// ตรวจว่า body ที่ได้มีรูปแบบ { message: string } หรือไม่ (รูปแบบ error ของ server)
function hasMessage(data: unknown): data is { message: string } {
  return typeof data === 'object' && data !== null && 'message' in data && typeof data.message === 'string'
}

// ฟังก์ชันกลางสำหรับยิง request ทุกตัว
// - ถ้าเชื่อมต่อ server ไม่ได้ หรือ server ตอบกลับไม่ใช่ 2xx จะ throw ApiError ออกไปให้ผู้เรียกจัดการ
async function request(path: string, init: RequestInit = {}): Promise<Response> {
  let response: Response
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...init,
      // ใส่ Content-Type เฉพาะตอนที่มี body (POST / PATCH)
      headers: init.body ? { 'Content-Type': 'application/json' } : undefined,
    })
  } catch {
    // fetch จะ throw เฉพาะตอนต่อ server ไม่ได้ (เช่น API ยังไม่ได้เปิด) ไม่ใช่ตอนได้ 4xx/5xx
    throw new ApiError(0, `Cannot connect to ${API_URL}`)
  }

  if (!response.ok) {
    // พยายามอ่านข้อความ error จาก body { message } ที่ server ส่งมา
    const data: unknown = await response.json().catch(() => null)
    throw new ApiError(response.status, hasMessage(data) ? data.message : `Request failed with status ${response.status}`)
  }

  return response
}

// ยิง request แล้วแปลง body ที่ได้เป็น JSON
async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await request(path, init)
  return (await response.json()) as T
}

// GET /api/todos - ดึงรายการทั้งหมด (ใหม่สุดอยู่บน)
export function getTodos(): Promise<Todo[]> {
  return requestJson<Todo[]>('/todos')
}

// POST /api/todos - เพิ่มรายการใหม่
export function createTodo(title: string): Promise<Todo> {
  return requestJson<Todo>('/todos', {
    method: 'POST',
    body: JSON.stringify({ title }),
  })
}

// PATCH /api/todos/:id - แก้ไขชื่อ และ/หรือ สถานะเสร็จ
export function updateTodo(id: number, changes: TodoChanges): Promise<Todo> {
  return requestJson<Todo>(`/todos/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(changes),
  })
}

// DELETE /api/todos/:id - ลบรายการ
// server ตอบ 204 No Content (ไม่มี body) จึงไม่ต้องอ่าน JSON
export async function deleteTodo(id: number): Promise<void> {
  await request(`/todos/${id}`, { method: 'DELETE' })
}
