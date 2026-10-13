import { Trash2 } from 'lucide-react'
import { useRef, useState } from 'react'
import { ConfirmDialog } from './ConfirmDialog'
import { IconButton } from './IconButton'

interface DeleteButtonProps {
  title: string // ชื่อรายการ ใช้ในชื่อปุ่มและข้อความถามย้ำ
  isPending: boolean // true = รายการนี้กำลังรอ API ตอบกลับ
  onConfirm: () => Promise<boolean> // ส่ง DELETE ไปที่ API คืนค่า true เมื่อลบสำเร็จ
}

// ปุ่มถังขยะ: กดแล้วขึ้นหน้าต่างถามย้ำ "ลบรายการนี้?" ต้องกด "ลบ" ในหน้าต่างอีกครั้งถึงจะลบจริง
export function DeleteButton({ title, isPending, onConfirm }: DeleteButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const trashRef = useRef<HTMLButtonElement>(null)

  // ยกเลิก: ปิดหน้าต่าง แล้วให้โฟกัสกลับมาที่ปุ่มถังขยะ (คนใช้คีย์บอร์ดจะได้ไม่หลงตำแหน่ง)
  function closeDialog() {
    setIsDialogOpen(false)
    trashRef.current?.focus()
  }

  async function handleConfirm() {
    const success = await onConfirm()
    // ลบสำเร็จ: รายการนี้ (และหน้าต่างนี้) หายไปจากหน้าจอ แล้ว App จะย้ายโฟกัสไปที่รายการข้างเคียงให้
    // ลบไม่สำเร็จ: ปิดหน้าต่าง กลับมาที่ปุ่มถังขยะ (ข้อความ error แสดงด้านบน)
    if (!success) closeDialog()
  }

  return (
    <>
      <IconButton
        ref={trashRef}
        label={`ลบรายการ: ${title}`}
        tone="destructive"
        onClick={() => setIsDialogOpen(true)}
        disabled={isPending}
      >
        <Trash2 className="size-5" aria-hidden="true" />
      </IconButton>

      <ConfirmDialog
        open={isDialogOpen}
        title="ลบรายการนี้?"
        description={
          <>
            <span className="font-medium text-foreground">“{title}”</span> จะถูกลบถาวร ย้อนกลับไม่ได้
          </>
        }
        confirmLabel="ลบ"
        isPending={isPending}
        onConfirm={() => void handleConfirm()}
        onCancel={closeDialog}
      />
    </>
  )
}
