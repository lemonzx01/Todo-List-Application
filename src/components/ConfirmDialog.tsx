import { LoaderCircle, Trash2 } from 'lucide-react'
import { useEffect, useId, useRef, type MouseEvent, type ReactNode, type SyntheticEvent } from 'react'

interface ConfirmDialogProps {
  open: boolean
  title: string // หัวข้อคำถาม เช่น "ลบรายการนี้?"
  description: ReactNode // รายละเอียดว่าจะเกิดอะไรขึ้น
  confirmLabel: string // ข้อความบนปุ่มยืนยัน เช่น "ลบ"
  isPending: boolean // true = กำลังรอ API ตอบกลับ (ปิดหน้าต่างไม่ได้ชั่วคราว)
  onConfirm: () => void
  onCancel: () => void
}

// หน้าต่างถามย้ำก่อนทำสิ่งที่ย้อนกลับไม่ได้ ใช้แท็ก <dialog> ของ HTML ซึ่งเบราว์เซอร์จัดการให้เอง:
// ล็อกโฟกัสไว้ในหน้าต่าง, กด Esc เพื่อปิด, มีพื้นหลังทึบคลุมหน้าเว็บ และ screen reader รู้ว่าเป็นหน้าต่างถาม
export function ConfirmDialog({ open, title, description, confirmLabel, isPending, onConfirm, onCancel }: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const cancelRef = useRef<HTMLButtonElement>(null)
  const titleId = useId()
  const descriptionId = useId()

  // เปิด/ปิดหน้าต่างตาม prop open (showModal = เปิดแบบบังหน้าเว็บด้านหลัง)
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) {
      dialog.showModal()
      // โฟกัสปุ่ม "ยกเลิก" ก่อน กัน Enter โดยไม่ตั้งใจแล้วลบทันที
      cancelRef.current?.focus()
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  // กด Esc: เบราว์เซอร์จะปิดหน้าต่างเอง เราแค่บอก parent (ระหว่างรอ API ห้ามปิด)
  function handleCancelEvent(event: SyntheticEvent<HTMLDialogElement>) {
    event.preventDefault()
    if (!isPending) onCancel()
  }

  // คลิกที่พื้นหลังทึบ (นอกกล่อง) = ยกเลิก
  // คลิกโดนพื้นหลังเมื่อ target คือตัว <dialog> เอง เพราะเนื้อหาข้างในอยู่ใน <div> อีกชั้น
  function handleBackdropClick(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget && !isPending) onCancel()
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onCancel={handleCancelEvent}
      onClick={handleBackdropClick}
      className="m-auto w-[calc(100%-2rem)] max-w-sm rounded-2xl border border-border bg-surface p-0 text-foreground backdrop:bg-scrim/50"
    >
      <div className="p-6">
        <span className="mb-4 flex size-12 items-center justify-center rounded-full bg-destructive-soft text-on-destructive-soft">
          <Trash2 className="size-6" aria-hidden="true" />
        </span>
        <h2 id={titleId} className="text-lg font-semibold">
          {title}
        </h2>
        <div id={descriptionId} className="mt-1 text-muted-foreground wrap-anywhere">
          {description}
        </div>

        {/* มือถือ: ปุ่มเรียงแนวตั้งเต็มความกว้าง (ปุ่มลบอยู่บน), จอใหญ่: เรียงแนวนอนชิดขวา */}
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            disabled={isPending}
            className="focus-ring inline-flex h-11 items-center justify-center rounded-lg border border-control-border bg-surface px-5 font-medium transition-colors enabled:hover:bg-muted enabled:active:bg-muted disabled:opacity-50"
          >
            ยกเลิก
          </button>
          {/* ระหว่างรอ API ใช้ aria-disabled แทน disabled เพราะ disabled จะทำให้ปุ่มหลุดโฟกัส */}
          <button
            type="button"
            onClick={() => {
              if (!isPending) onConfirm()
            }}
            aria-disabled={isPending}
            className="focus-ring inline-flex h-11 items-center justify-center gap-1.5 rounded-lg bg-destructive px-5 font-semibold text-on-destructive transition-colors hover:bg-destructive-hover active:bg-destructive-hover aria-disabled:opacity-50"
          >
            {isPending ? (
              <LoaderCircle className="size-5 animate-spin motion-reduce:animate-none" aria-hidden="true" />
            ) : (
              <Trash2 className="size-5" aria-hidden="true" />
            )}
            {confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  )
}
