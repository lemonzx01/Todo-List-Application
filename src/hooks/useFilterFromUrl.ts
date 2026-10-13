import { useEffect, useState } from 'react'
import type { TodoFilterValue } from '../types/todo'

// อ่านตัวกรองจาก URL เช่น "?filter=active" ถ้าไม่มีหรือค่าไม่ถูกต้องจะใช้ "all"
function readFilterFromUrl(): TodoFilterValue {
  const value = new URLSearchParams(window.location.search).get('filter')
  return value === 'active' || value === 'completed' ? value : 'all'
}

// เก็บตัวกรองที่เลือกไว้ใน URL (deep link) ส่งลิงก์ให้คนอื่น หรือรีเฟรชหน้า ก็ยังเห็นแท็บเดิม
export function useFilterFromUrl() {
  const [filter, setFilter] = useState<TodoFilterValue>(readFilterFromUrl)

  // ทุกครั้งที่เปลี่ยนตัวกรอง อัปเดต URL ด้วย replaceState (ไม่เพิ่มประวัติ ปุ่ม Back จึงยังทำงานตามปกติ)
  useEffect(() => {
    const url = new URL(window.location.href)
    if (filter === 'all') {
      url.searchParams.delete('filter') // แท็บ "ทั้งหมด" ไม่ต้องมี query
    } else {
      url.searchParams.set('filter', filter)
    }
    window.history.replaceState(window.history.state, '', url)
  }, [filter])

  return [filter, setFilter] as const
}
