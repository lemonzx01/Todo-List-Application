import { LoaderCircle, Trash2 } from 'lucide-react'
import { useEffect, useId, useRef, useState, type KeyboardEvent, type MouseEvent } from 'react'
import { IconButton } from './IconButton'

// ปุ่มยืนยันการลบจะกลับเป็นปุ่มถังขยะเองถ้าไม่กดภายในเวลานี้ (มิลลิวินาที)
const CONFIRM_TIMEOUT = 4000

interface DeleteButtonProps {
  title: string // ชื่อรายการ ใช้เป็นส่วนหนึ่งของชื่อปุ่มสำหรับ screen reader
  isPending: boolean // true = รายการนี้กำลังรอ API ตอบกลับ
  onConfirm: () => Promise<boolean> // ส่ง DELETE ไปที่ API คืนค่า true เมื่อลบสำเร็จ
}

// ปุ่มลบแบบ 2 ขั้น: กดถังขยะ -> กลายเป็นปุ่ม "ลบ" สีแดง -> กดอีกครั้งถึงจะลบจริง
// ยกเลิกได้ด้วย Esc, คลิก/กด Tab ไปที่อื่น หรือรอ 4 วินาที (จับเวลาเฉพาะตอนกดด้วยเมาส์/นิ้ว)
// ปุ่มทั้งสองแบบกว้าง 44px เท่ากัน ชื่อรายการและปุ่มข้างๆ จึงไม่ขยับตอนสลับแบบ
export function DeleteButton({ title, isPending, onConfirm }: DeleteButtonProps) {
  // true = กดถังขยะแล้ว กำลังรอผู้ใช้กดยืนยัน
  const [isConfirming, setIsConfirming] = useState(false)
  const trashRef = useRef<HTMLButtonElement>(null)
  const confirmRef = useRef<HTMLButtonElement>(null)
  // true = ออกจากโหมดยืนยันแล้วให้ย้ายโฟกัสกลับไปที่ปุ่มถังขยะ
  const returnFocusToTrash = useRef(false)
  // true = เข้าโหมดยืนยันด้วยเมาส์/นิ้ว จึงยกเลิกเองเมื่อหมดเวลา
  // คนใช้คีย์บอร์ด/screen reader ไม่จับเวลา เพราะอาจยังฟังชื่อปุ่มไม่จบ (ยกเลิกเองได้ด้วย Esc หรือ Tab)
  const startedByPointer = useRef(false)
  const hintId = useId()

  // เข้าโหมดยืนยัน = โฟกัสปุ่ม "ลบ" สีแดง, ยกเลิกด้วย Esc / หมดเวลา / ลบไม่สำเร็จ = กลับไปที่ปุ่มถังขยะ
  useEffect(() => {
    if (isConfirming) {
      confirmRef.current?.focus()
    } else if (returnFocusToTrash.current) {
      returnFocusToTrash.current = false
      trashRef.current?.focus()
    }
  }, [isConfirming])

  // จับเวลายกเลิกเอง (หยุดนับระหว่างรอ API)
  useEffect(() => {
    if (!isConfirming || isPending || !startedByPointer.current) return
    const timer = window.setTimeout(() => cancel(), CONFIRM_TIMEOUT)
    return () => window.clearTimeout(timer)
  }, [isConfirming, isPending])

  function startConfirm(event: MouseEvent<HTMLButtonElement>) {
    // event.detail = จำนวนครั้งที่คลิก ถ้ากดด้วยคีย์บอร์ด (Enter / Space) จะเป็น 0
    startedByPointer.current = event.detail > 0
    setIsConfirming(true)
  }

  // ออกจากโหมดยืนยัน ถ้าโฟกัสยังอยู่ที่ปุ่ม "ลบ" ให้ย้ายกลับไปที่ปุ่มถังขยะ (ไม่ให้โฟกัสหลุดไปอยู่ต้นหน้า)
  function cancel() {
    returnFocusToTrash.current = document.activeElement === confirmRef.current
    setIsConfirming(false)
  }

  async function handleConfirm() {
    // ระหว่างรอ API ปุ่มใช้ aria-disabled (ยังรับโฟกัสได้) จึงยังกดได้อยู่ ต้องกันการกดซ้ำเอง
    if (isPending) return
    const success = await onConfirm()
    // ลบไม่สำเร็จ: กลับเป็นปุ่มถังขยะ (ข้อความ error แสดงด้านบน)
    // ลบสำเร็จ: รายการนี้หายไปจากหน้าจอ และ App จะย้ายโฟกัสไปที่รายการข้างเคียงให้
    if (!success) cancel()
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === 'Escape' && !isPending) {
      event.preventDefault()
      cancel()
    }
  }

  // คลิก/แตะที่อื่น หรือกด Tab ออกจากปุ่ม = ยกเลิก (โฟกัสอยู่ที่ใหม่แล้ว จึงไม่ย้ายกลับ)
  function handleBlur() {
    if (!isPending) setIsConfirming(false)
  }

  if (!isConfirming) {
    return (
      <IconButton
        ref={trashRef}
        label={`ลบรายการ: ${title}`}
        tone="destructive"
        onClick={startConfirm}
        disabled={isPending}
      >
        <Trash2 className="size-5" aria-hidden="true" />
      </IconButton>
    )
  }

  return (
    <>
      {/* ขั้นที่ 2: ปุ่มสีแดงมีข้อความ "ลบ" ต้องกดอีกครั้งถึงจะลบจริง
          ระหว่างรอ API ใช้ aria-disabled แทน disabled เพราะ disabled จะทำให้ปุ่มหลุดโฟกัส */}
      <button
        ref={confirmRef}
        type="button"
        onClick={() => void handleConfirm()}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        aria-disabled={isPending}
        aria-label={`ยืนยันการลบ: ${title}`}
        aria-describedby={hintId}
        className="focus-ring inline-flex size-11 shrink-0 items-center justify-center gap-0.5 rounded-lg bg-destructive text-sm font-semibold text-on-destructive transition-colors hover:bg-destructive-hover active:bg-destructive-hover aria-disabled:opacity-50"
      >
        {isPending ? (
          <LoaderCircle className="size-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />
        ) : (
          <Trash2 className="size-4" aria-hidden="true" />
        )}
        ลบ
      </button>
      {/* คำอธิบายเพิ่มเติมของปุ่ม screen reader อ่านต่อจากชื่อปุ่มครั้งเดียวตอนโฟกัส */}
      <span id={hintId} className="sr-only">
        กด Enter เพื่อยืนยัน หรือกด Esc เพื่อยกเลิก
      </span>
    </>
  )
}
