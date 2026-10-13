import { CircleCheckBig, ClipboardList, ListChecks, type LucideIcon } from 'lucide-react'
import type { TodoFilterValue } from '../types/todo'

// ไอคอน ข้อความ และคำแนะนำ เมื่อไม่มีรายการให้แสดง แยกตามตัวกรองที่เลือก
const EMPTY_CONTENT: Record<TodoFilterValue, { icon: LucideIcon; message: string; hint: string }> = {
  all: {
    icon: ClipboardList,
    message: 'ยังไม่มีรายการ',
    hint: 'ลองเพิ่มรายการแรกด้านบน',
  },
  active: {
    icon: CircleCheckBig,
    message: 'ไม่มีรายการค้าง',
    hint: 'ทำครบทุกรายการแล้ว เยี่ยมมาก!',
  },
  completed: {
    icon: ListChecks,
    message: 'ยังไม่มีรายการที่ทำเสร็จ',
    hint: 'ติ๊กช่องหน้ารายการเมื่อทำเสร็จ รายการจะมาอยู่ที่นี่',
  },
}

interface EmptyStateProps {
  filter: TodoFilterValue
}

export function EmptyState({ filter }: EmptyStateProps) {
  const { icon: Icon, message, hint } = EMPTY_CONTENT[filter]
  return (
    <div className="flex flex-col items-center gap-1 rounded-xl border border-dashed border-border px-4 py-10 text-center">
      <Icon className="mb-2 size-10 text-primary" aria-hidden="true" />
      <p className="font-semibold">{message}</p>
      <p className="text-sm text-muted-foreground">{hint}</p>
    </div>
  )
}
