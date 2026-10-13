import { CircleAlert } from 'lucide-react'

interface ErrorBannerProps {
  title: string
  message: string
  actionLabel: string // ข้อความบนปุ่ม เช่น "ลองอีกครั้ง" หรือ "ปิด"
  onAction: () => void
}

// กล่องแจ้งข้อผิดพลาด role="alert" ทำให้ screen reader อ่านออกเสียงทันทีที่แสดง
// มีทั้งไอคอนและข้อความ (ไม่ได้ใช้แค่สีแดงบอกว่าเป็น error)
export function ErrorBanner({ title, message, actionLabel, onAction }: ErrorBannerProps) {
  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-xl border border-destructive bg-destructive-soft p-4 text-on-destructive-soft"
    >
      {/* CircleAlert คือไอคอน AlertCircle (ชื่อใหม่ใน lucide) */}
      <CircleAlert className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
      <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="font-semibold">{title}</p>
          <p className="mt-0.5 text-sm wrap-anywhere">{message}</p>
        </div>
        <button
          type="button"
          onClick={onAction}
          className="focus-ring min-h-11 shrink-0 self-start rounded-lg border border-destructive bg-surface px-4 text-sm font-semibold text-on-destructive-soft transition-colors hover:bg-destructive hover:text-on-destructive active:bg-destructive active:text-on-destructive sm:self-auto"
        >
          {actionLabel}
        </button>
      </div>
    </div>
  )
}
