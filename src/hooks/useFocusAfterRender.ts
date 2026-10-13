import { useEffect, useState } from 'react'

// ย้ายโฟกัสของคีย์บอร์ดไปที่ element ตาม id "หลัง" React อัปเดตหน้าจอเสร็จแล้ว
// ใช้เมื่อปุ่มที่ถูกโฟกัสอยู่หายไปจากหน้าจอ (เช่น ลบรายการ, ปิดกล่อง error)
// ถ้าไม่ย้าย browser จะปล่อยโฟกัสไว้ที่ <body> คนใช้คีย์บอร์ดต้องกด Tab ใหม่ตั้งแต่ต้นหน้า
export function useFocusAfterRender() {
  // เก็บเป็น object: ขอ id เดิมซ้ำได้ (object ใหม่ทุกครั้ง = state เปลี่ยน = useEffect ทำงานอีกรอบ)
  const [request, setRequest] = useState<{ id: string } | null>(null)

  useEffect(() => {
    if (request === null) return
    // ย้ายเฉพาะตอนโฟกัสหลุดไปอยู่ที่ <body> ถ้าผู้ใช้คลิกที่อื่นไปแล้ว จะไม่แย่งโฟกัสกลับมา
    if (document.activeElement === document.body) {
      document.getElementById(request.id)?.focus()
    }
  }, [request])

  return (id: string) => setRequest({ id })
}
