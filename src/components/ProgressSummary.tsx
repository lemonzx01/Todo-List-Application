interface ProgressSummaryProps {
  completed: number // จำนวนรายการที่เสร็จแล้ว
  total: number // จำนวนรายการทั้งหมด
}

// สรุปความคืบหน้า "เสร็จแล้ว X จาก Y รายการ" พร้อมแถบความคืบหน้า
export function ProgressSummary({ completed, total }: ProgressSummaryProps) {
  // ยังไม่มีรายการ = 0% (กันการหารด้วย 0)
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100)
  const summary = total === 0 ? 'ยังไม่มีรายการ' : `เสร็จแล้ว ${completed} จาก ${total} รายการ`

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-2 text-sm">
        {/* aria-live: screen reader อ่านสรุปใหม่ให้ฟังทุกครั้งที่ติ๊ก/เพิ่ม/ลบรายการ */}
        <p aria-live="polite" className="text-muted-foreground">
          {summary}
        </p>
        <span className="font-semibold tabular-nums" aria-hidden="true">
          {percent}%
        </span>
      </div>
      <div
        role="progressbar"
        aria-label="ความคืบหน้า"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-valuetext={summary}
        // inset-ring = เส้นขอบด้านในสี control-border (contrast >= 3:1 กับพื้นหลัง) ทำให้เห็นความยาวเต็มของแถบ
        // แม้ยังไม่มีรายการไหนเสร็จ (0%) ส่วนแถบสีหลักที่วาดทับจะบังเส้นนี้ไปตามความคืบหน้า
        className="h-2 overflow-hidden rounded-full bg-border inset-ring inset-ring-control-border"
      >
        {/* ใช้ scaleX แทนการเปลี่ยนความกว้าง เพื่อให้ animation ลื่นและไม่ทำให้ layout ขยับ */}
        <div
          className="h-full origin-left bg-primary transition-transform duration-200 ease-out"
          style={{ transform: `scaleX(${percent / 100})` }}
        />
      </div>
    </div>
  )
}
