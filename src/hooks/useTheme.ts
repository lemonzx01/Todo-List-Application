import { useEffect, useState } from 'react'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'theme'

// สีแถบเบราว์เซอร์บนมือถือ ต้องตรงกับ --background ใน index.css
const THEME_COLORS: Record<Theme, string> = { light: '#FFFFFF', dark: '#121212' }

// โหมดสี: เริ่มจากค่าที่สคริปต์ใน index.html ใส่ไว้ (ค่าเริ่มต้นคือโหมดสว่าง)
// สลับแล้วจะใส่ data-theme ที่ <html> ให้ CSS เปลี่ยนสี และจำค่าไว้ใน localStorage สำหรับครั้งหน้า
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() =>
    document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light',
  )

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.dataset.theme = 'dark'
    } else {
      delete root.dataset.theme
    }
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLORS[theme])

    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      // บันทึกไม่ได้ (เช่น โหมดไม่ระบุตัวตน) ก็ไม่เป็นไร แค่ครั้งหน้าจะกลับมาเป็นโหมดสว่าง
    }
  }, [theme])

  function toggleTheme() {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
  }

  return { theme, toggleTheme }
}
