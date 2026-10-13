import { LoaderCircle, Plus } from 'lucide-react'
import { useRef, useState, type FormEvent } from 'react'
import { TITLE_MAX_LENGTH } from '../types/todo'
import { NEW_TODO_INPUT_ID } from '../utils/elementIds'

const COUNTER_FROM = 200 // เริ่มแสดงตัวนับตัวอักษรเมื่อพิมพ์ถึงจำนวนนี้

interface TodoFormProps {
  // คืนค่า true เมื่อเพิ่มสำเร็จ (ฟอร์มจะล้างช่องกรอกให้)
  onAdd: (title: string) => Promise<boolean>
  // true = ยังเพิ่มรายการไม่ได้ (เช่น กำลังโหลดรายการ หรือโหลดไม่สำเร็จ)
  disabled: boolean
}

export function TodoForm({ onAdd, disabled }: TodoFormProps) {
  const [title, setTitle] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const trimmedTitle = title.trim()
  const canSubmit = !disabled && trimmedTitle.length > 0 && !isSubmitting
  const showCounter = title.length >= COUNTER_FROM
  let limitMessage = '' // ข้อความเตือนเรื่องความยาว (ว่าง = ยังไม่ต้องเตือน)
  if (title.length >= TITLE_MAX_LENGTH) limitMessage = 'ครบจำนวนตัวอักษรสูงสุดแล้ว'
  else if (showCounter) limitMessage = 'ใกล้ถึงจำนวนตัวอักษรสูงสุด'

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault() // กันไม่ให้ browser รีโหลดหน้าเมื่อกด submit
    if (!canSubmit) return

    setIsSubmitting(true)
    const success = await onAdd(trimmedTitle)
    setIsSubmitting(false)
    if (success) setTitle('')
    // ถ้ากดปุ่ม "เพิ่ม" ปุ่มจะถูกปิดระหว่างรอ ทำให้หลุดโฟกัส จึงย้ายโฟกัสกลับมาที่ช่องกรอก
    // (พิมพ์รายการถัดไปต่อได้ทันที หรือกด Enter ลองใหม่ถ้าเพิ่มไม่สำเร็จ)
    inputRef.current?.focus()
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* label ที่มองเห็นได้ ผูกกับช่องกรอกด้วย htmlFor (ไม่ใช้ placeholder แทน label) */}
      <label htmlFor={NEW_TODO_INPUT_ID} className="mb-2 block text-sm font-medium">
        เพิ่มรายการใหม่
      </label>
      <div className="flex gap-2">
        <input
          ref={inputRef}
          id={NEW_TODO_INPUT_ID}
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          readOnly={isSubmitting}
          disabled={disabled}
          maxLength={TITLE_MAX_LENGTH}
          placeholder="วันนี้ต้องทำอะไรบ้าง?"
          autoComplete="off"
          aria-describedby={showCounter ? 'new-todo-counter' : undefined}
          className="focus-ring h-12 min-w-0 flex-1 rounded-lg border border-control-border bg-surface px-4 text-base text-foreground placeholder:text-muted-foreground disabled:bg-muted disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!canSubmit}
          className="focus-ring inline-flex h-12 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-primary px-4 font-semibold text-on-primary transition-colors enabled:hover:bg-primary-hover enabled:active:bg-primary-hover disabled:bg-muted disabled:text-muted-foreground disabled:inset-ring disabled:inset-ring-border sm:px-5"
        >
          {isSubmitting ? (
            // LoaderCircle คือไอคอน Loader2 (ชื่อใหม่ใน lucide) หมุนระหว่างรอ แต่ไม่หมุนถ้าผู้ใช้ตั้งค่าลดการเคลื่อนไหว
            <LoaderCircle className="size-5 animate-spin motion-reduce:animate-none" aria-hidden="true" />
          ) : (
            <Plus className="size-5" aria-hidden="true" />
          )}
          <span>เพิ่ม</span>
        </button>
      </div>

      {/* ตัวนับตัวอักษร แสดงเฉพาะตอนใกล้ถึงจำนวนสูงสุด
          aria-live อยู่ที่ข้อความเตือนเท่านั้น (มีอยู่ตลอดแม้ยังว่าง screen reader จึงอ่านทันทีที่ข้อความขึ้น)
          ส่วนตัวเลข N/255 ไม่ได้อยู่ใน aria-live จะได้ไม่ถูกอ่านทุกครั้งที่พิมพ์ */}
      <p
        id="new-todo-counter"
        className={`flex justify-between gap-2 text-sm text-muted-foreground ${showCounter ? 'mt-2' : ''}`}
      >
        <span aria-live="polite">{limitMessage}</span>
        {showCounter && (
          <span className="tabular-nums">
            {title.length}/{TITLE_MAX_LENGTH}
          </span>
        )}
      </p>
    </form>
  )
}
