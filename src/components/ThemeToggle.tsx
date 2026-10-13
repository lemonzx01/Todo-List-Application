import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'
import { IconButton } from './IconButton'

// ปุ่มสลับโหมดสว่าง/มืด: แสดงไอคอนของโหมดที่จะเปลี่ยนไป และชื่อปุ่มบอกว่ากดแล้วจะเกิดอะไร
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <IconButton label={isDark ? 'เปลี่ยนเป็นโหมดสว่าง' : 'เปลี่ยนเป็นโหมดมืด'} onClick={toggleTheme}>
      {isDark ? <Sun className="size-5" aria-hidden="true" /> : <Moon className="size-5" aria-hidden="true" />}
    </IconButton>
  )
}
