// id ของ element ที่ไฟล์อื่นต้องอ้างถึง (เช่น ใช้ย้ายโฟกัสด้วย document.getElementById)
// เก็บไว้ที่เดียว ถ้าเปลี่ยนชื่อ id จะได้ไม่ต้องตามแก้หลายไฟล์

// ช่องกรอก "เพิ่มรายการใหม่"
export const NEW_TODO_INPUT_ID = 'new-todo'

// checkbox ของแต่ละรายการ เช่น "todo-3-toggle"
export function getToggleId(todoId: number) {
  return `todo-${todoId}-toggle`
}
