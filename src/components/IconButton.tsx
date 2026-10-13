import type { ComponentProps } from 'react'

// สีของปุ่มแยกตามความหมาย: สีปกติ, ตอนเอาเมาส์ชี้ (hover) และตอนกดค้าง (active)
// active ทำให้จอสัมผัสเห็นว่ากดโดนแล้ว เพราะมือถือไม่มี hover (เขียน class เต็มๆ ไว้ให้ Tailwind หาเจอ)
const TONE_CLASSES = {
  // ปุ่มทั่วไป เช่น ยกเลิกการแก้ไข
  neutral:
    'text-muted-foreground enabled:hover:bg-muted enabled:hover:text-foreground enabled:active:bg-muted enabled:active:text-foreground',
  // ปุ่มแก้ไข
  primary:
    'text-muted-foreground enabled:hover:bg-primary-soft enabled:hover:text-foreground enabled:active:bg-primary-soft enabled:active:text-foreground',
  // ปุ่มยืนยัน เช่น บันทึกชื่อ: ไอคอนสีหลักตั้งแต่แรก จึงเด่นกว่าปุ่มยกเลิกแม้ไม่มี hover
  confirm:
    'text-primary enabled:hover:bg-primary-soft enabled:hover:text-foreground enabled:active:bg-primary-soft enabled:active:text-foreground',
  // ปุ่มลบ
  destructive:
    'text-muted-foreground enabled:hover:bg-destructive-soft enabled:hover:text-on-destructive-soft enabled:active:bg-destructive-soft enabled:active:text-on-destructive-soft',
}

interface IconButtonProps extends ComponentProps<'button'> {
  label: string // ชื่อปุ่มสำหรับ screen reader และ tooltip (ปุ่มมีแค่ไอคอน จึงต้องมีชื่อเสมอ)
  tone?: keyof typeof TONE_CLASSES
}

// ปุ่มไอคอนขนาด 44x44px (ขนาดขั้นต่ำที่กดด้วยนิ้วได้สะดวก) แสดงตลอด ไม่ซ่อนไว้รอ hover
export function IconButton({ label, tone = 'neutral', className = '', children, ...props }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`focus-ring inline-flex size-11 shrink-0 items-center justify-center rounded-lg transition-colors disabled:opacity-50 ${TONE_CLASSES[tone]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
