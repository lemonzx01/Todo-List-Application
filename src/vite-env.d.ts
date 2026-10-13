// บอก TypeScript ว่ามีตัวแปร env อะไรบ้าง (เฉพาะตัวที่ขึ้นต้นด้วย VITE_ เท่านั้นที่ใช้ในฝั่ง browser ได้)
interface ImportMetaEnv {
  readonly VITE_API_URL?: string
}

// เปิดโหมด strict: ถ้าเรียก import.meta.env.VITE_xxx ที่ไม่ได้ประกาศไว้ข้างบน TypeScript จะแจ้ง error (กันพิมพ์ชื่อผิด)
interface ViteTypeOptions {
  strictImportMetaEnv: unknown
}
