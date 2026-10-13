import { useEffect, useState } from 'react'
import { ApiError, createTodo, deleteTodo, getTodos, updateTodo } from '../api/todos'
import type { Todo } from '../types/todo'

// แปลง error เป็นข้อความภาษาไทยสำหรับแสดงบนหน้าจอ ตาม HTTP status
// ส่วนข้อความจริงจาก server (ภาษาอังกฤษ) พิมพ์ไว้ใน Console ของ DevTools เพื่อใช้ debug
function getErrorMessage(error: unknown): string {
  console.error(error)
  if (!(error instanceof ApiError)) return 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ'
  if (error.status === 0) return 'เชื่อมต่อ API Server ไม่ได้ กรุณาตรวจสอบว่าเปิด server แล้ว'
  if (error.status === 400) return 'ข้อมูลไม่ถูกต้อง'
  if (error.status === 404) return 'ไม่พบ API ปลายทาง กรุณาตรวจสอบค่า VITE_API_URL'
  if (error.status >= 500) return 'เซิร์ฟเวอร์ขัดข้อง กรุณาลองใหม่อีกครั้ง'
  return `เกิดข้อผิดพลาด (รหัส ${error.status})`
}

// Custom hook ที่รวม state และ action ทั้งหมดของ todo ไว้ที่เดียว
// ทุก action จะเรียก API ก่อน แล้วค่อยอัปเดต state ด้วยข้อมูลที่ server ส่งกลับมา
export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  // id ของรายการที่กำลังรอ API ตอบกลับ (ใช้ปิดปุ่มของรายการนั้นเพื่อกันการกดซ้ำ)
  const [pendingIds, setPendingIds] = useState<ReadonlySet<number>>(() => new Set())
  // เพิ่มค่านี้เมื่อต้องการโหลดข้อมูลใหม่ (ปุ่ม "ลองอีกครั้ง") เพื่อให้ useEffect ด้านล่างทำงานอีกรอบ
  const [reloadKey, setReloadKey] = useState(0)

  // โหลดรายการจาก API ตอนเปิดหน้าเว็บ ข้อมูลจึงยังอยู่หลังรีเฟรช เพราะดึงจากฐานข้อมูลทุกครั้ง
  useEffect(() => {
    // ignore กันการ set state จาก request เก่า (เช่นตอน StrictMode เรียก effect ซ้ำในโหมด dev)
    let ignore = false

    getTodos()
      .then((data) => {
        if (!ignore) setTodos(data)
      })
      .catch((error: unknown) => {
        if (!ignore) setLoadError(getErrorMessage(error))
      })
      .finally(() => {
        if (!ignore) setIsLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [reloadKey])

  function reload() {
    setIsLoading(true)
    setLoadError(null)
    setReloadKey((key) => key + 1)
  }

  // แทนที่รายการเดิมด้วยข้อมูลล่าสุดจาก server
  function replaceTodo(updated: Todo) {
    setTodos((prev) => prev.map((todo) => (todo.id === updated.id ? updated : todo)))
  }

  // เอารายการออกจากหน้าจอ
  function removeFromList(id: number) {
    setTodos((prev) => prev.filter((todo) => todo.id !== id))
  }

  // ตัวช่วยสำหรับ action ของแต่ละรายการ: ตั้งสถานะ pending -> เรียก API -> ถ้าพังให้เก็บข้อความ error
  // คืนค่า true ถ้าสำเร็จ เพื่อให้ component รู้ว่าควรทำอะไรต่อ
  async function runItemAction(id: number, errorTitle: string, action: () => Promise<void>) {
    setActionError(null)
    setPendingIds((prev) => new Set(prev).add(id))
    try {
      await action()
      return true
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        // ไม่มีรายการนี้ในฐานข้อมูลแล้ว (เช่น ถูกลบจากอีกแท็บ) จึงเอาออกจากหน้าจอด้วย ไม่ให้กดแล้วพังซ้ำ
        removeFromList(id)
        setActionError(`${errorTitle}: ไม่พบรายการนี้ อาจถูกลบไปแล้ว`)
      } else {
        setActionError(`${errorTitle}: ${getErrorMessage(error)}`)
      }
      return false
    } finally {
      setPendingIds((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }
  }

  async function addTodo(title: string) {
    setActionError(null)
    try {
      const created = await createTodo(title)
      setTodos((prev) => [created, ...prev]) // รายการใหม่อยู่บนสุด ตรงกับลำดับที่ API ส่งมา
      return true
    } catch (error) {
      setActionError(`เพิ่มรายการไม่สำเร็จ: ${getErrorMessage(error)}`)
      return false
    }
  }

  function toggleTodo(id: number, completed: boolean) {
    return runItemAction(id, 'อัปเดตสถานะไม่สำเร็จ', async () => {
      replaceTodo(await updateTodo(id, { completed }))
    })
  }

  function renameTodo(id: number, title: string) {
    return runItemAction(id, 'แก้ไขรายการไม่สำเร็จ', async () => {
      replaceTodo(await updateTodo(id, { title }))
    })
  }

  function removeTodo(id: number) {
    return runItemAction(id, 'ลบรายการไม่สำเร็จ', async () => {
      await deleteTodo(id)
      removeFromList(id)
    })
  }

  function clearActionError() {
    setActionError(null)
  }

  return {
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
  }
}
