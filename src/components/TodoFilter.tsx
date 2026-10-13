import type { TodoFilterValue } from '../types/todo'

const FILTER_OPTIONS: { value: TodoFilterValue; label: string }[] = [
  { value: 'all', label: 'ทั้งหมด' },
  { value: 'active', label: 'ยังไม่เสร็จ' },
  { value: 'completed', label: 'เสร็จแล้ว' },
]

interface TodoFilterProps {
  value: TodoFilterValue
  counts: Record<TodoFilterValue, number> // จำนวนรายการของแต่ละแท็บ
  onChange: (value: TodoFilterValue) => void
}

// ปุ่มกรองรายการแบบ segmented control (aria-pressed บอก screen reader ว่าปุ่มไหนถูกเลือกอยู่)
// ปุ่มที่เลือกใช้ทั้งสีพื้น เส้นขอบ และตัวหนา จึงไม่ได้พึ่งสีอย่างเดียว
// จอมือถือ: ตัวเลขอยู่ใต้ชื่อเสมอ (flex-col) ทุกปุ่มจึงหน้าตาเหมือนกันแม้ตัวเลขจะมีหลายหลัก
// จอ sm ขึ้นไป: ชื่อกับตัวเลขอยู่บรรทัดเดียวกัน
export function TodoFilter({ value, counts, onChange }: TodoFilterProps) {
  return (
    <div role="group" aria-label="กรองรายการ" className="grid grid-cols-3 gap-1 rounded-xl bg-muted p-1">
      {FILTER_OPTIONS.map((option) => {
        const isActive = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={isActive}
            aria-label={`${option.label} ${counts[option.value]} รายการ`}
            className={`focus-ring flex min-h-11 flex-col items-center justify-center rounded-lg border px-2 py-1 text-sm whitespace-nowrap transition-colors sm:flex-row sm:gap-1.5 ${
              isActive
                ? 'border-primary bg-primary-soft font-semibold text-foreground'
                : 'border-transparent font-medium text-muted-foreground hover:bg-surface hover:text-foreground active:bg-surface active:text-foreground'
            }`}
          >
            <span>{option.label}</span>
            <span className="tabular-nums">{counts[option.value]}</span>
          </button>
        )
      })}
    </div>
  )
}
