import { ListChecks } from 'lucide-react'
import { useEffect, useRef, type ReactNode } from 'react'
import { EmptyState } from './components/EmptyState'
import { ErrorBanner } from './components/ErrorBanner'
import { ProgressSummary } from './components/ProgressSummary'
import { SkeletonList } from './components/SkeletonList'
import { TodoFilter } from './components/TodoFilter'
import { TodoForm } from './components/TodoForm'
import { TodoItem } from './components/TodoItem'
import { TodoList } from './components/TodoList'
import { useFilterFromUrl } from './hooks/useFilterFromUrl'
import { useFocusAfterRender } from './hooks/useFocusAfterRender'
import { useTodos } from './hooks/useTodos'
import type { Todo } from './types/todo'
import { getToggleId, NEW_TODO_INPUT_ID } from './utils/elementIds'

function App() {
  const {
    todos,
    isLoading,
    loadError,
    actionError,
    pendingIds,
    reload,
    addTodo,
    toggleTodo,
    renameTodo,
    removeTodo,
    clearActionError,
  } = useTodos()
  // ตัวกรองที่เลือก (เก็บไว้ใน URL เช่น ?filter=active)
  const [filter, setFilter] = useFilterFromUrl()
  const focusAfterRender = useFocusAfterRender()
  // true = กด "ลองอีกครั้ง" แล้ว รอโหลดเสร็จก่อนค่อยโฟกัสช่องเพิ่มรายการ (ระหว่างโหลดช่องนี้ยังถูกปิดอยู่)
  const focusFormWhenReady = useRef(false)

  const completedCount = todos.filter((todo) => todo.completed).length
  const counts = {
    all: todos.length,
    active: todos.length - completedCount,
    completed: completedCount,
  }
  const visibleTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })
  const isReady = !isLoading && !loadError // โหลดรายการสำเร็จแล้ว

  // ปุ่ม "ลองอีกครั้ง" หายไประหว่างโหลด พอโหลดสำเร็จจึงย้ายโฟกัสไปที่ช่องเพิ่มรายการ
  useEffect(() => {
    if (isReady && focusFormWhenReady.current) {
      focusFormWhenReady.current = false
      document.getElementById(NEW_TODO_INPUT_ID)?.focus()
    }
  }, [isReady])

  // หาว่าควรโฟกัสที่ไหนต่อ ถ้ารายการนี้หายไปจากหน้าจอ:
  // checkbox ของรายการถัดไป -> รายการก่อนหน้า -> ช่องเพิ่มรายการ (ถ้าไม่เหลือรายการแล้ว)
  function getNextFocusId(id: number) {
    const index = visibleTodos.findIndex((todo) => todo.id === id)
    const neighbour: Todo | undefined = visibleTodos[index + 1] ?? visibleTodos[index - 1]
    return neighbour ? getToggleId(neighbour.id) : NEW_TODO_INPUT_ID
  }

  // เพิ่มรายการใหม่ ถ้ากำลังดูแท็บ "เสร็จแล้ว" อยู่ ให้สลับไปแท็บ "ทั้งหมด"
  // เพราะรายการใหม่ยังไม่เสร็จ ถ้าไม่สลับ ผู้ใช้จะไม่เห็นรายการที่เพิ่งเพิ่ม
  async function handleAdd(title: string) {
    const success = await addTodo(title)
    if (success) setFilter((current) => (current === 'completed' ? 'all' : current))
    return success
  }

  async function handleToggle(id: number, completed: boolean) {
    const nextFocusId = getNextFocusId(id)
    const success = await toggleTodo(id, completed)
    // ตัวกรอง "ยังไม่เสร็จ" / "เสร็จแล้ว": รายการที่เพิ่งติ๊กจะหายไปจากหน้าจอ จึงย้ายโฟกัสไปรายการข้างเคียง
    if (success && filter !== 'all') focusAfterRender(nextFocusId)
  }

  async function handleDelete(id: number) {
    const nextFocusId = getNextFocusId(id)
    const success = await removeTodo(id)
    if (success) focusAfterRender(nextFocusId) // ปุ่ม "ลบ" หายไปพร้อมรายการ
    return success
  }

  function handleCloseError() {
    clearActionError()
    focusAfterRender(NEW_TODO_INPUT_ID) // ปุ่ม "ปิด" หายไปพร้อมกล่อง error
  }

  function handleRetry() {
    focusFormWhenReady.current = true
    reload()
  }

  // เลือกว่าจะแสดงอะไรในส่วนรายการ: กำลังโหลด / โหลดไม่สำเร็จ / ไม่มีรายการ / รายการ todo
  let content: ReactNode
  if (isLoading) {
    content = <SkeletonList />
  } else if (loadError) {
    content = (
      <ErrorBanner title="โหลดรายการไม่สำเร็จ" message={loadError} actionLabel="ลองอีกครั้ง" onAction={handleRetry} />
    )
  } else if (visibleTodos.length === 0) {
    // ยังไม่มีรายการเลย ให้แนะนำการเพิ่มรายการแรก ไม่ว่าจะอยู่แท็บไหน
    content = <EmptyState filter={todos.length === 0 ? 'all' : filter} />
  } else {
    content = (
      <TodoList>
        {visibleTodos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            isPending={pendingIds.has(todo.id)}
            onToggle={handleToggle}
            onRename={renameTodo}
            onDelete={handleDelete}
          />
        ))}
      </TodoList>
    )
  }

  // class ที่ขึ้นต้นด้วย short: ใช้กับจอเตี้ย (เช่น มือถือแนวนอน) ลดระยะห่างให้เห็นรายการแรกโดยไม่ต้องเลื่อน
  return (
    <div className="min-h-dvh px-4 py-8 sm:px-6 sm:py-12 short:py-3">
      <main className="mx-auto w-full max-w-xl">
        <header className="mb-6 short:mb-3">
          <div className="flex items-center gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary text-on-primary">
              <ListChecks className="size-6" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <h1 className="text-2xl font-bold sm:text-3xl short:text-2xl">รายการสิ่งที่ต้องทำ</h1>
              <p className="text-sm text-muted-foreground">จดสิ่งที่ต้องทำ แล้วติ๊กเมื่อทำเสร็จ</p>
            </div>
          </div>

          {/* ความคืบหน้า แสดงเมื่อโหลดรายการสำเร็จแล้วเท่านั้น */}
          {isReady && (
            <div className="mt-6 short:mt-3">
              <ProgressSummary completed={completedCount} total={todos.length} />
            </div>
          )}
        </header>

        {/* p-4 ของการ์ดนี้สัมพันธ์กับ -mx-4 -mb-4 ใน TodoList.tsx (รายการกว้างเต็มการ์ดบนจอมือถือ) */}
        <section aria-label="รายการ" className="rounded-2xl border border-border bg-surface p-4 sm:p-6 short:p-4">
          {/* ปิดฟอร์มไว้จนกว่าจะโหลดรายการสำเร็จ ไม่งั้นรายการที่เพิ่มอาจหายไปจากหน้าจอ */}
          <TodoForm onAdd={handleAdd} disabled={!isReady} />

          {actionError && (
            <div className="mt-4">
              <ErrorBanner title="เกิดข้อผิดพลาด" message={actionError} actionLabel="ปิด" onAction={handleCloseError} />
            </div>
          )}

          {/* ตัวกรอง แสดงเมื่อโหลดข้อมูลสำเร็จแล้วเท่านั้น */}
          {isReady && (
            <div className="mt-6 short:mt-3">
              <TodoFilter value={filter} counts={counts} onChange={setFilter} />
            </div>
          )}

          <div className="mt-4 short:mt-3">{content}</div>
        </section>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          ดับเบิลคลิกที่ชื่อรายการ หรือกดปุ่มดินสอ เพื่อแก้ไข
        </p>
      </main>
    </div>
  )
}

export default App
