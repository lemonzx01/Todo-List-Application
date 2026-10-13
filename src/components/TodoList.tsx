import type { ComponentProps } from 'react'

// ระยะห่างของแต่ละแถว ใช้ร่วมกันระหว่าง TodoItem และ SkeletonList แถวจำลองตอนโหลดจึงสูงเท่าแถวจริง
export const ROW_CLASSES = 'flex gap-1 px-1 py-2 sm:px-3'

// กรอบของรายการ ใช้ร่วมกันระหว่างรายการจริง (App) และโครงรายการตอนโหลด (SkeletonList)
// - จอมือถือ: -mx-4 -mb-4 หักล้าง padding p-4 ของการ์ดใน App.tsx ให้รายการกว้างเต็มการ์ดและชิดขอบล่าง
//   (ชื่อรายการจะได้มีที่มากขึ้น) มีแค่เส้นบน เพราะขอบล่างใช้เส้นขอบของการ์ดแทน
// - จอ sm ขึ้นไป: เป็นกล่องมีเส้นขอบรอบและมุมโค้ง
export function TodoList({ children, ...props }: ComponentProps<'ul'>) {
  return (
    <ul
      className="-mx-4 -mb-4 divide-y divide-border border-t border-border sm:mx-0 sm:mb-0 sm:rounded-xl sm:border"
      {...props}
    >
      {children}
    </ul>
  )
}
