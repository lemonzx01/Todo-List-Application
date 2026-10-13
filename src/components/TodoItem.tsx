import { Check, Pencil, X } from 'lucide-react'
import { useEffect, useRef, useState, type ChangeEvent, type KeyboardEvent, type MouseEvent } from 'react'
import { TITLE_MAX_LENGTH, type Todo } from '../types/todo'
import { getToggleId } from '../utils/elementIds'
import { DeleteButton } from './DeleteButton'
import { IconButton } from './IconButton'
import { ROW_CLASSES } from './TodoList'

interface TodoItemProps {
  todo: Todo
  isPending: boolean // true = กำลังรอ API ตอบกลับ ปิดปุ่มทั้งหมดของรายการนี้ไว้ก่อน
  onToggle: (id: number, completed: boolean) => void
  onRename: (id: number, title: string) => Promise<boolean>
  onDelete: (id: number) => Promise<boolean>
}

// แสดงวันที่แบบไทยแบบสั้น เช่น "13 ต.ค. 69 12:30" (ปี พ.ศ. 2 หลัก จะได้อยู่บรรทัดเดียวบนจอแคบ)
const dateFormatter = new Intl.DateTimeFormat('th-TH', {
  day: 'numeric',
  month: 'short',
  year: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
})

// ใช้กับปุ่มบันทึก/ยกเลิก: กันไม่ให้ช่องกรอกหลุดโฟกัสตอนกดปุ่ม
// (ถ้าหลุดโฟกัส onBlur จะบันทึกทันที ก่อนที่ปุ่มจะได้ทำงาน)
function keepInputFocused(event: MouseEvent<HTMLButtonElement>) {
  event.preventDefault()
}

export function TodoItem({ todo, isPending, onToggle, onRename, onDelete }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(todo.title)
  const [showEmptyError, setShowEmptyError] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const editButtonRef = useRef<HTMLButtonElement>(null)
  // true = กำลังออกจากโหมดแก้ไขแล้ว ไม่ต้องบันทึกตอนช่องกรอกหลุดโฟกัส (เช่น กด Esc แล้วต้องไม่บันทึก)
  const skipSaveOnBlur = useRef(false)
  // true = ออกจากโหมดแก้ไขแล้วให้ย้ายโฟกัสกลับไปที่ปุ่มดินสอ (ไม่ให้โฟกัสหลุดไปอยู่ต้นหน้า)
  const returnFocusToEdit = useRef(false)

  // จัดการโฟกัสหลังสลับโหมด
  // - อยู่ในโหมดแก้ไข: โฟกัสช่องกรอก (ตอนเริ่มแก้ไข และตอนบันทึกไม่สำเร็จ เพื่อให้แก้แล้วลองใหม่ได้ทันที)
  // - ออกจากโหมดแก้ไขด้วย Enter / Esc / ปุ่ม: โฟกัสกลับไปที่ปุ่มดินสอของรายการนี้
  useEffect(() => {
    if (isEditing && !isPending) {
      inputRef.current?.focus()
    } else if (!isEditing && returnFocusToEdit.current) {
      returnFocusToEdit.current = false
      editButtonRef.current?.focus()
    }
  }, [isEditing, isPending])

  // ติ๊ก/เอาติ๊กออก
  function handleToggle(event: ChangeEvent<HTMLInputElement>) {
    // ระหว่างรอ API checkbox ใช้ aria-disabled (ยังรับโฟกัสได้) จึงยังกดได้อยู่ ต้องกันการกดซ้ำเอง
    if (isPending) return
    onToggle(todo.id, event.target.checked)
  }

  function startEditing() {
    if (isPending) return
    setDraft(todo.title)
    setShowEmptyError(false)
    skipSaveOnBlur.current = false
    setIsEditing(true)
  }

  // ออกจากโหมดแก้ไข
  // moveFocus = true เมื่อจบด้วยคีย์บอร์ดหรือปุ่ม (ถ้าจบเพราะคลิกที่อื่น ผู้ใช้เลือกที่โฟกัสใหม่เองแล้ว)
  function stopEditing(moveFocus: boolean) {
    skipSaveOnBlur.current = true
    returnFocusToEdit.current = moveFocus
    setIsEditing(false)
  }

  function cancelEditing() {
    stopEditing(true)
  }

  // บันทึกชื่อใหม่ ใช้ร่วมกันทั้งตอนกด Enter, ปุ่มบันทึก และตอนคลิกที่อื่น
  async function saveEditing(moveFocus: boolean) {
    const title = draft.trim()
    if (title === '') {
      setShowEmptyError(true) // ไม่อนุญาตให้บันทึกชื่อว่าง อยู่ในโหมดแก้ไขต่อ
      return
    }
    if (title === todo.title) {
      stopEditing(moveFocus) // ไม่ได้เปลี่ยนอะไร ไม่ต้องเรียก API
      return
    }
    const success = await onRename(todo.id, title)
    // ถ้าไม่สำเร็จ จะอยู่ในโหมดแก้ไขต่อ ข้อความที่พิมพ์ไว้ไม่หาย กดบันทึกใหม่หรือยกเลิกได้
    if (success) stopEditing(moveFocus)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (isPending) return // กำลังรอ API ตอบกลับ ยังไม่รับคำสั่งใหม่
    if (event.key === 'Enter') {
      event.preventDefault()
      void saveEditing(true)
    } else if (event.key === 'Escape') {
      cancelEditing()
    }
  }

  // คลิกที่อื่น หรือกด Tab ออกจากช่องกรอก = บันทึก
  function handleBlur() {
    if (skipSaveOnBlur.current || isPending) return
    void saveEditing(false)
  }

  const hintId = `todo-${todo.id}-hint`

  return (
    // ระหว่างรอ API ไม่ได้ทำให้ทั้งแถวจางลง (ตัวอักษรจะจางจนอ่านยาก) แต่ปิดปุ่มของแถวนี้แทน
    // และบอก screen reader ด้วย aria-busy
    <li className={`${ROW_CLASSES} items-start`} aria-busy={isPending}>
      {/* checkbox จริงของ browser (คีย์บอร์ด/screen reader ใช้ได้ตามปกติ) แต่ตกแต่งเองด้วย appearance-none
          ห่อด้วย label ขนาด 44px เพื่อให้กดง่ายบนมือถือ และมีไอคอนเครื่องหมายถูกซ้อนเมื่อติ๊กแล้ว
          ระหว่างรอ API ใช้ aria-disabled แทน disabled: ถ้าใช้ disabled browser จะดึงโฟกัสออกจาก checkbox
          คนใช้คีย์บอร์ดจะหลงตำแหน่งทุกครั้งที่ติ๊ก (disabled ใช้เฉพาะตอนกำลังแก้ไขชื่อ) */}
      <label className="relative flex size-11 shrink-0 cursor-pointer items-center justify-center has-disabled:cursor-not-allowed has-disabled:opacity-50 has-aria-disabled:cursor-not-allowed has-aria-disabled:opacity-50">
        <input
          id={getToggleId(todo.id)}
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggle}
          disabled={isEditing}
          aria-disabled={isPending}
          aria-label={`ทำเครื่องหมายว่าเสร็จแล้ว: ${todo.title}`}
          className="peer focus-ring size-6 appearance-none rounded-md border-2 border-control-border bg-surface transition-colors checked:border-primary checked:bg-primary enabled:hover:border-primary"
        />
        <Check
          className="pointer-events-none absolute size-4 text-on-primary opacity-0 peer-checked:opacity-100"
          strokeWidth={3}
          aria-hidden="true"
        />
      </label>

      <div className="min-w-0 flex-1">
        {isEditing ? (
          <>
            <input
              ref={inputRef}
              type="text"
              value={draft}
              onChange={(event) => {
                setDraft(event.target.value)
                setShowEmptyError(false)
              }}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              readOnly={isPending}
              maxLength={TITLE_MAX_LENGTH}
              aria-label="แก้ไขชื่อรายการ"
              aria-invalid={showEmptyError}
              aria-describedby={hintId}
              className="focus-ring h-11 w-full rounded-lg border border-control-border bg-surface px-3 text-base text-foreground aria-invalid:border-destructive"
            />
            {/* aria-live: screen reader จะอ่านออกเสียงเมื่อข้อความเปลี่ยน (เช่น ตอนขึ้น error ชื่อว่าง) */}
            <p
              id={hintId}
              aria-live="polite"
              className={`mt-1 text-sm ${showEmptyError ? 'font-medium text-destructive' : 'text-muted-foreground'}`}
            >
              {showEmptyError ? 'ชื่อรายการต้องไม่ว่าง' : 'กด Enter เพื่อบันทึก หรือ Esc เพื่อยกเลิก (หรือใช้ปุ่มด้านขวา)'}
            </p>
          </>
        ) : (
          <>
            {/* ดับเบิลคลิกที่ชื่อเพื่อแก้ไขได้ (wrap-anywhere ให้ชื่อยาวๆ ขึ้นบรรทัดใหม่ ไม่ล้นจอ)
                รายการที่เสร็จแล้ว: ขีดฆ่า + สีจาง + checkbox มีเครื่องหมายถูก (ไม่ได้ใช้สีอย่างเดียว) */}
            <p
              onDoubleClick={startEditing}
              className={`pt-2.5 wrap-anywhere ${todo.completed ? 'text-muted-foreground line-through' : ''}`}
            >
              {todo.title}
            </p>
            {/* whitespace-nowrap: วันที่กับเวลาอยู่ด้วยกันเสมอ ไม่ให้เวลาหล่นไปอยู่บรรทัดใหม่คนเดียว */}
            <time dateTime={todo.createdAt} className="block pb-1 text-sm text-muted-foreground">
              เพิ่มเมื่อ <span className="whitespace-nowrap">{dateFormatter.format(new Date(todo.createdAt))}</span>
            </time>
          </>
        )}
      </div>

      {/* ปุ่มด้านขวา แสดงตลอด (ไม่ซ่อนไว้ตอน hover) เพื่อให้กดได้บนมือถือ
          gap-2 = ห่างกัน 8px กันนิ้วกดโดนปุ่มข้างๆ (โดยเฉพาะปุ่มแก้ไขกับปุ่มลบ) */}
      <div className="flex shrink-0 gap-2">
        {isEditing ? (
          <>
            {/* ปุ่มบันทึก/ยกเลิก สำหรับเมาส์และจอสัมผัส (คีย์บอร์ดมือถือไม่มีปุ่ม Esc)
                tabIndex={-1}: คนใช้คีย์บอร์ดใช้ Enter / Esc แทน ถ้าให้ Tab มาหยุดที่ปุ่ม ช่องกรอกจะหลุดโฟกัสแล้วบันทึกทันที */}
            <IconButton
              label="บันทึกชื่อรายการ"
              tone="confirm"
              tabIndex={-1}
              onMouseDown={keepInputFocused}
              onClick={() => void saveEditing(true)}
              disabled={isPending}
            >
              <Check className="size-5" aria-hidden="true" />
            </IconButton>
            <IconButton
              label="ยกเลิกการแก้ไข"
              tabIndex={-1}
              onMouseDown={keepInputFocused}
              onClick={cancelEditing}
              disabled={isPending}
            >
              <X className="size-5" aria-hidden="true" />
            </IconButton>
          </>
        ) : (
          <>
            <IconButton
              ref={editButtonRef}
              label={`แก้ไขรายการ: ${todo.title}`}
              tone="primary"
              onClick={startEditing}
              disabled={isPending}
            >
              <Pencil className="size-5" aria-hidden="true" />
            </IconButton>
            <DeleteButton title={todo.title} isPending={isPending} onConfirm={() => onDelete(todo.id)} />
          </>
        )}
      </div>
    </li>
  )
}
