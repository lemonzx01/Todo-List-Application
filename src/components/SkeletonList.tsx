import { ROW_CLASSES, TodoList } from './TodoList'

// โครงรายการจำลอง 3 แถว แสดงระหว่างโหลด จองพื้นที่ไว้ก่อน หน้าจอจึงไม่กระโดดตอนข้อมูลมาถึง
export function SkeletonList() {
  return (
    <div role="status">
      <span className="sr-only">กำลังโหลด...</span>
      <TodoList aria-hidden="true">
        {[1, 2, 3].map((row) => (
          <li key={row} className={`${ROW_CLASSES} items-center`}>
            <span className="flex size-11 shrink-0 items-center justify-center">
              <span className="size-6 animate-pulse rounded-md bg-muted motion-reduce:animate-none" />
            </span>
            <span className="flex flex-1 flex-col gap-2 py-3">
              <span className="h-4 w-3/4 animate-pulse rounded bg-muted motion-reduce:animate-none" />
              <span className="h-3 w-1/3 animate-pulse rounded bg-muted motion-reduce:animate-none" />
            </span>
            {/* ที่ว่างแทนปุ่มแก้ไขและปุ่มลบ (ห่างกัน 8px เท่าของจริง) */}
            <span className="flex shrink-0 gap-2">
              <span className="size-11" />
              <span className="size-11" />
            </span>
          </li>
        ))}
      </TodoList>
    </div>
  )
}
