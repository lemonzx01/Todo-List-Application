# Todo List Application (Frontend)

เว็บแอปจัดการรายการสิ่งที่ต้องทำ (Todo List) ส่วน **Frontend** เขียนด้วย React + TypeScript + Tailwind CSS
ทุกการกระทำ (เพิ่ม / แก้ไข / ติ๊กว่าเสร็จ / ลบ) จะส่ง request ไปที่ **RESTful API Server**
(repo [Todo-List-Application-backend](https://github.com/lemonzx01/Todo-List-Application-backend))
ซึ่งเก็บข้อมูลไว้ในฐานข้อมูล PostgreSQL ดังนั้นรีเฟรชหน้าเว็บแล้วข้อมูลยังอยู่ครบ

> โปรเจกต์นี้เป็นแบบทดสอบก่อนฝึกงาน (รายละเอียดโจทย์อยู่ในหัวข้อ [โจทย์](#โจทย์) ด้านล่างสุด)

## ฟีเจอร์ (เทียบกับข้อกำหนดของโจทย์)

| ข้อ | ข้อกำหนด | สิ่งที่ทำในโปรเจกต์นี้ |
| --- | --- | --- |
| 1 | เพิ่มรายการ todo | ฟอร์มด้านบน พิมพ์แล้วกด Enter หรือปุ่ม "เพิ่ม" → `POST /api/todos` (ตัดช่องว่างหัวท้าย, ห้ามว่าง, ยาวไม่เกิน 255 ตัวอักษร) |
| 2 | ลบรายการ todo | ปุ่มถังขยะท้ายแต่ละรายการ → กลายเป็นปุ่ม "ลบ" สีแดงให้กดยืนยันอีกครั้ง → `DELETE /api/todos/:id` |
| 3 | ทำเครื่องหมายว่าเสร็จสิ้น | checkbox หน้ารายการ → `PATCH /api/todos/:id` (`completed`) รายการที่เสร็จแล้วจะมีเครื่องหมายถูก ขีดฆ่า และสีจางลง |
| 4 | ออกแบบด้วย CSS ให้สวยงาม ใช้งานง่าย | ใช้ **Tailwind CSS v4** ดีไซน์แบบ Flat Design โทนขาว-ดำมินิมอล รองรับโหมดมืด, ฟอนต์ภาษาไทย IBM Plex Sans Thai, มีสถานะกำลังโหลด (skeleton) / error / ไม่มีรายการ (ดูหัวข้อ [การออกแบบ (UI/UX)](#การออกแบบ-uiux)) |
| 5 | Responsive ทั้ง Mobile และ Web | ออกแบบแบบ mobile-first ใช้งานได้ตั้งแต่จอกว้าง 360px ถึง desktop ไม่มี scroll แนวนอน, ปุ่มกดขนาดอย่างน้อย 44px ห่างกันอย่างน้อย 8px, ปุ่มแก้ไข/ลบแสดงตลอด (ไม่ต้อง hover), ชื่อรายการยาวๆ จะขึ้นบรรทัดใหม่, มือถือแนวนอน (จอเตี้ย) ลดระยะห่างให้เห็นรายการแรกโดยไม่ต้องเลื่อน |
| 6 | API แบบ CRUD | อยู่ใน repo [Todo-List-Application-backend](https://github.com/lemonzx01/Todo-List-Application-backend) (Express + TypeScript) ฝั่งนี้เรียกใช้ครบทั้ง Create / Read / Update / Delete |
| 7 | ทุกการกระทำต้องส่ง request ไปที่ API และเก็บในฐานข้อมูล | ทุก action เรียก API ก่อน แล้วค่อยอัปเดตหน้าจอด้วยข้อมูลที่ server ส่งกลับมา (ไม่มีการเก็บข้อมูลไว้ในเบราว์เซอร์) |
| 8 | รีเฟรชแล้วรายการต้องยังอยู่ | ทุกครั้งที่เปิดหน้าเว็บจะดึงรายการจาก `GET /api/todos` มาแสดง |
| 9 | ทดสอบ API ด้วย Postman | อยู่ใน repo [Todo-List-Application-backend](https://github.com/lemonzx01/Todo-List-Application-backend) (โฟลเดอร์ `postman/`) |

ฟีเจอร์เพิ่มเติม

- แก้ไขชื่อรายการได้ (กดปุ่มดินสอ หรือดับเบิลคลิกที่ชื่อ → Enter / ปุ่ม ✓ / คลิกที่อื่นเพื่อบันทึก, Esc / ปุ่ม ✕ เพื่อยกเลิก)
  ถ้าบันทึกไม่สำเร็จ ข้อความที่พิมพ์ไว้จะไม่หาย กดบันทึกใหม่ได้เลย
- กรองรายการ: ทั้งหมด / ยังไม่เสร็จ / เสร็จแล้ว แต่ละปุ่มมีตัวเลขจำนวนรายการ
  และตัวกรองถูกเก็บไว้ใน URL (เช่น `/?filter=active`) ส่งลิงก์ให้คนอื่นหรือรีเฟรชหน้าแล้วยังอยู่ที่แท็บเดิม
- สรุปความคืบหน้า "เสร็จแล้ว X จาก Y รายการ" พร้อมแถบความคืบหน้า
- ยืนยันก่อนลบ: กดถังขยะแล้วปุ่มจะกลายเป็นปุ่ม "ลบ" สีแดง (ขนาดเท่าเดิม หน้าจอจึงไม่ขยับ) ต้องกดอีกครั้งถึงจะลบจริง
  ยกเลิกได้ด้วยการกด Esc, คลิกที่อื่น หรือรอ 4 วินาที (จับเวลาเฉพาะตอนกดด้วยเมาส์/นิ้ว คนใช้คีย์บอร์ดไม่ถูกเร่งเวลา)
- ตัวนับตัวอักษร "N/255" จะแสดงเมื่อพิมพ์ชื่อรายการยาวใกล้ถึงขีดจำกัด
- กันการกดซ้ำ: ระหว่างรอ API ตอบกลับ ปุ่มของรายการนั้นจะถูกปิดไว้ชั่วคราว (ตัวอักษรไม่จางลง ยังอ่านได้ชัด)
- ถ้าเชื่อมต่อ API ไม่ได้ จะแสดงข้อความแจ้งพร้อมปุ่ม "ลองอีกครั้ง" (ระหว่างนั้นฟอร์มเพิ่มรายการจะถูกปิดไว้)
- ข้อความ error แสดงเป็นภาษาไทยตาม HTTP status ส่วนข้อความจริงจาก server ดูได้ใน Console ของ DevTools
- ถ้ารายการถูกลบไปแล้วจากที่อื่น (API ตอบ `404`) รายการนั้นจะถูกเอาออกจากหน้าจอให้อัตโนมัติ
- เพิ่มรายการตอนอยู่แท็บ "เสร็จแล้ว" จะสลับไปแท็บ "ทั้งหมด" ให้ เพื่อให้เห็นรายการที่เพิ่งเพิ่ม
- รองรับการใช้งานด้วยคีย์บอร์ดและ screen reader (focus ring ชัดเจน, `aria-label` บนปุ่มไอคอน)
  และโฟกัสไม่หลุดไปอยู่ต้นหน้า: แก้ชื่อเสร็จ → กลับไปที่ปุ่มแก้ไข, ลบรายการ หรือติ๊กแล้วรายการหายจากตัวกรอง →
  ไปที่รายการถัดไป, เพิ่มรายการ / ปิดกล่อง error / กด "ลองอีกครั้ง" → กลับไปที่ช่องเพิ่มรายการ
- รองรับโหมดมืด (dark mode) อัตโนมัติตามการตั้งค่าของเครื่อง

## การออกแบบ (UI/UX)

ระบบการออกแบบ (design system) ของหน้านี้สร้างด้วย skill **UI UX Pro Max** (ค้นหาด้วยคำว่า
"productivity task manager todo minimal") แล้วนำมาตรวจและปรับให้เหมาะกับแอปภาษาไทย
จากนั้นเปลี่ยนชุดสีเป็น **ขาว-ดำมินิมอล** (อ้างอิง palette "Minimal black" และสไตล์ Minimalism จาก skill เดียวกัน)
ใช้ดำนวล `#171717` แทนดำสนิท และเทาหลายระดับ เพื่อให้สบายตา

- **สไตล์: Flat Design** — เรียบ เน้นตัวอักษร ไม่มี gradient และไม่ใช้เงา ใช้เส้นขอบ 1px แยกส่วนต่างๆ แทน
  เอาเมาส์ชี้แล้วเปลี่ยนแค่สี/ความทึบ (transition 150–200ms)
- **ฟอนต์: IBM Plex Sans Thai** น้ำหนัก 400/500/600/700 ขนาดพื้นฐาน 16px
  ระยะบรรทัด 1.6 (ภาษาไทยมีวรรณยุกต์และสระบน/ล่าง จึงต้องเว้นบรรทัดมากกว่าปกติ)
  ใช้ขนาดตัวอักษร 12/14/16/18/24/32px
- **Design tokens**: สีทุกสีประกาศเป็นตัวแปร CSS ใน `src/index.css` ที่เดียว แล้วเชื่อมกับ Tailwind ด้วย `@theme inline`
  component จึงใช้ class อย่าง `bg-primary`, `text-muted-foreground`, `border-border` ได้เลย ไม่มีค่าสี hex ใน component
  (ปิดชุดสีสำเร็จรูปของ Tailwind ไว้ด้วย จึงเผลอใช้ `bg-red-500` ไม่ได้)

| Token | โหมดสว่าง | โหมดมืด | ใช้กับ |
| --- | --- | --- | --- |
| `background` | `#FFFFFF` | `#121212` | พื้นหลังหน้าเว็บ |
| `surface` | `#FFFFFF` | `#1A1A1A` | พื้นการ์ด (โหมดสว่างแยกจากพื้นหลังด้วยเส้นขอบ) |
| `foreground` | `#262626` | `#EDEDED` | ตัวอักษรหลัก |
| `muted` / `muted-foreground` | `#F5F5F5` / `#666666` | `#262626` / `#A3A3A3` | พื้นรอง / ตัวอักษรรอง (วันที่, คำอธิบาย) |
| `border` | `#E5E5E5` | `#2E2E2E` | เส้นขอบและเส้นคั่น |
| `control-border` | `#8A8A8A` | `#737373` | ขอบช่องกรอกและ checkbox |
| `primary` / `on-primary` | `#171717` / `#FFFFFF` | `#EDEDED` / `#171717` | ปุ่มหลัก ("เพิ่ม"), checkbox ที่ติ๊กแล้ว, แถบความคืบหน้า |
| `primary-hover` | `#404040` | `#D4D4D4` | ปุ่มหลักตอนชี้/กด |
| `primary-soft` | `#EBEBEB` | `#333333` | พื้นของตัวกรองที่ถูกเลือก และพื้นตอนชี้ปุ่มไอคอน |
| `ring` | `#404040` | `#D4D4D4` | วงแหวน focus |
| `destructive` / `on-destructive` | `#B91C1C` / `#FFFFFF` | `#F87171` / `#450A0A` | ปุ่มยืนยันการลบ |
| `destructive-hover` | `#991B1B` | `#FCA5A5` | ปุ่มยืนยันการลบตอนชี้/กด (ตัวอักษรยังผ่าน 4.5:1) |
| `destructive-soft` / `on-destructive-soft` | `#FEF2F2` / `#991B1B` | `#2A1414` / `#FECACA` | กล่องแจ้ง error |

- **โหมดมืด**: ออกแบบคู่กับโหมดสว่าง (ไม่ใช่การกลับสี) เปลี่ยนแค่ค่าตัวแปรใน `@media (prefers-color-scheme: dark)`
  และตั้ง `<meta name="theme-color">` ให้แถบเบราว์เซอร์บนมือถือเป็นสีเดียวกับพื้นหลังทั้งสองโหมด
- **Accessibility**
  - ตัวอักษรทุกคู่สีผ่านเกณฑ์ contrast 4.5:1 ทั้งสองโหมด (รวมตอน hover) ขอบช่องกรอก/checkbox และขอบแถบความคืบหน้าผ่าน 3:1
  - ปุ่มและพื้นที่กดทุกจุดมีขนาดอย่างน้อย 44×44px ห่างกันอย่างน้อย 8px, ช่องกรอกสูง 48px ตัวอักษร 16px (iOS จะไม่ซูมหน้าเว็บ)
  - กดแล้วมีสีตอบสนอง (`active:`) บนจอสัมผัสด้วย ไม่ได้มีแค่ hover ที่มือถือมองไม่เห็น
  - ทุกอย่างที่กดได้มี focus ring (class `focus-ring` ใน `index.css`), เคอร์เซอร์รูปมือ และสถานะปิดใช้งานที่ชัดเจน
  - ช่องกรอกมี label ที่มองเห็นได้ ไม่ได้ใช้ placeholder แทน label
  - ไม่ใช้สีอย่างเดียวในการสื่อความหมาย เช่น รายการที่เสร็จแล้วมีทั้งเครื่องหมายถูกและขีดฆ่า, error มีไอคอนและข้อความ
  - ตัวกรองใช้ `aria-pressed`, แถบความคืบหน้าใช้ `role="progressbar"`, ข้อความสถานะใช้ `aria-live` / `role="alert"`
  - ระหว่างรอ API checkbox และปุ่มยืนยันการลบใช้ `aria-disabled` แทน `disabled` เพื่อไม่ให้โฟกัสของคีย์บอร์ดหลุด
  - ผู้ที่ตั้งค่า "ลดการเคลื่อนไหว" (`prefers-reduced-motion`) จะไม่เห็น animation
- **Deep link ตัวกรอง**: เก็บตัวกรองไว้ใน URL ด้วย `history.replaceState` (`?filter=active` หรือ `?filter=completed`,
  แท็บ "ทั้งหมด" ไม่มี query) ค่าที่ไม่ถูกต้องจะถูกละไว้และกลับไปที่ "ทั้งหมด"
- **ยืนยันก่อนลบ (destructive action)**: กดถังขยะ → ปุ่ม "ลบ" สีแดงพร้อมโฟกัสให้ทันที กดอีกครั้งจึงส่ง `DELETE`
  ยกเลิกได้ด้วย Esc / คลิกที่อื่น / รอ 4 วินาที (เฉพาะตอนกดด้วยเมาส์หรือนิ้ว) และ screen reader จะอ่านชื่อปุ่ม
  พร้อมคำอธิบาย "กด Enter เพื่อยืนยัน หรือกด Esc เพื่อยกเลิก" (`aria-describedby`)
- **ระหว่างโหลด**: แสดง skeleton 3 แถวแทน spinner เพื่อจองพื้นที่ไว้ หน้าจอจึงไม่กระโดดตอนข้อมูลมาถึง

## Tech Stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) (strict mode)
- [Vite 8](https://vite.dev/) — dev server และ build tool
- [Tailwind CSS v4](https://tailwindcss.com/) ผ่าน plugin `@tailwindcss/vite`
- [lucide-react](https://lucide.dev/) — ไอคอน
- [Oxlint](https://oxc.rs/docs/guide/usage/linter) — ตรวจโค้ด (lint) ตามที่ template ของ Vite ตั้งมาให้
- เรียก API ด้วย `fetch` ของเบราว์เซอร์ (ไม่ต้องติดตั้ง library เพิ่ม)

## วิธีรันโปรเจกต์

### สิ่งที่ต้องมี

- [Node.js](https://nodejs.org/) เวอร์ชัน 20.19 ขึ้นไป (หรือ 22.12 ขึ้นไป)
- **Backend ต้องรันอยู่ก่อน** — repo [Todo-List-Application-backend](https://github.com/lemonzx01/Todo-List-Application-backend)
  (ถ้าโคลนไว้ข้างกัน จะอยู่ที่ `../Todo-List-Application-backend`) ทำตามขั้นตอนใน README ของ repo นั้น
  จนเปิด <http://localhost:3000/api/todos> ในเบราว์เซอร์แล้วเห็นข้อมูล JSON

### ขั้นตอน

1. ติดตั้ง dependencies

   ```bash
   npm install
   ```

2. สร้างไฟล์ `.env` จากไฟล์ตัวอย่าง (ถ้า API รันที่ `http://localhost:3000/api` อยู่แล้ว ข้ามขั้นนี้ได้)

   ```bash
   # PowerShell
   Copy-Item .env.example .env
   # Git Bash / macOS / Linux
   cp .env.example .env
   ```

3. รัน dev server

   ```bash
   npm run dev
   ```

4. เปิด <http://localhost:5173> ในเบราว์เซอร์

> ถ้าหน้าเว็บขึ้นว่า "เชื่อมต่อ API Server ไม่ได้" ให้ตรวจว่า backend รันอยู่ และค่า `CORS_ORIGIN` ของ backend
> ตรงกับ URL ของหน้าเว็บ (ค่าเริ่มต้นคือ `http://localhost:5173`)

## Environment Variables

| ชื่อ | ค่าเริ่มต้น | คำอธิบาย |
| --- | --- | --- |
| `VITE_API_URL` | `http://localhost:3000/api` | URL ของ RESTful API Server (ไม่ต้องมี `/` ปิดท้าย) ถ้าไม่ได้ตั้งหรือเว้นว่างจะใช้ค่าเริ่มต้น |

- ตัวแปรที่ฝั่ง frontend ใช้ได้ต้องขึ้นต้นด้วย `VITE_` เท่านั้น และค่าจะถูกฝังลงในไฟล์ตอน build จึง**ห้ามใส่ข้อมูลลับ**
- แก้ไฟล์ `.env` แล้วต้องหยุดและรัน `npm run dev` ใหม่ ค่าใหม่ถึงจะมีผล
- ไฟล์ `.env` ไม่ถูกอัปโหลดขึ้น GitHub (อยู่ใน `.gitignore`) ส่วน `.env.example` ใช้เป็นตัวอย่าง

## npm Scripts

| คำสั่ง | ทำอะไร |
| --- | --- |
| `npm run dev` | รัน dev server ที่ <http://localhost:5173> (แก้โค้ดแล้วหน้าเว็บอัปเดตทันที) |
| `npm run build` | ตรวจ type ด้วย TypeScript แล้ว build ไฟล์สำหรับ production ไว้ในโฟลเดอร์ `dist/` |
| `npm run preview` | เปิดดูผลลัพธ์จาก `npm run build` ในเครื่อง |
| `npm run lint` | ตรวจโค้ดด้วย Oxlint |

## API ที่ Frontend เรียกใช้

| Method | Path | ใช้ตอน |
| --- | --- | --- |
| `GET` | `/api/todos` | เปิดหน้าเว็บ / กด "ลองอีกครั้ง" |
| `POST` | `/api/todos` | เพิ่มรายการ (body: `{ "title": "..." }`) |
| `PATCH` | `/api/todos/:id` | ติ๊กว่าเสร็จ (`{ "completed": true }`) หรือแก้ชื่อ (`{ "title": "..." }`) |
| `DELETE` | `/api/todos/:id` | ลบรายการ (server ตอบ `204 No Content`) |

ข้อมูล Todo ที่ได้จาก API มีหน้าตาแบบนี้

```json
{
  "id": 1,
  "title": "ซื้อนม",
  "completed": false,
  "createdAt": "2026-10-13T05:30:00.000Z",
  "updatedAt": "2026-10-13T05:30:00.000Z"
}
```

## โครงสร้างโปรเจกต์

```text
Todo-List-Application/
├── public/
│   └── favicon.svg           # ไอคอนแท็บเบราว์เซอร์ (รายการพร้อมเครื่องหมายถูก)
├── src/
│   ├── api/
│   │   └── todos.ts          # ฟังก์ชันเรียก API ด้วย fetch (GET / POST / PATCH / DELETE)
│   ├── components/
│   │   ├── DeleteButton.tsx    # ปุ่มลบแบบ 2 ขั้น (ถังขยะ → ปุ่ม "ลบ" สีแดงให้ยืนยัน)
│   │   ├── EmptyState.tsx      # ข้อความตอนไม่มีรายการ (แยกตามตัวกรอง)
│   │   ├── ErrorBanner.tsx     # กล่องแจ้ง error พร้อมปุ่ม (ลองอีกครั้ง / ปิด)
│   │   ├── IconButton.tsx      # ปุ่มไอคอนขนาด 44x44px (แก้ไข / ลบ / บันทึก / ยกเลิก)
│   │   ├── ProgressSummary.tsx # สรุป "เสร็จแล้ว X จาก Y รายการ" + แถบความคืบหน้า
│   │   ├── SkeletonList.tsx    # โครงรายการจำลองระหว่างโหลด
│   │   ├── TodoFilter.tsx      # ปุ่มกรอง ทั้งหมด / ยังไม่เสร็จ / เสร็จแล้ว พร้อมจำนวน
│   │   ├── TodoForm.tsx        # ฟอร์มเพิ่มรายการใหม่
│   │   ├── TodoItem.tsx        # 1 รายการ: checkbox, แก้ไขชื่อ, ปุ่มแก้ไข/ลบ
│   │   └── TodoList.tsx        # กรอบของรายการ (ใช้ร่วมกับ SkeletonList ขนาดจึงตรงกัน)
│   ├── hooks/
│   │   ├── useFilterFromUrl.ts # เก็บตัวกรองที่เลือกไว้ใน URL (?filter=...)
│   │   ├── useFocusAfterRender.ts # ย้ายโฟกัสหลังปุ่มที่ถูกโฟกัสหายไปจากหน้าจอ
│   │   └── useTodos.ts         # state ของรายการทั้งหมด + action ที่เรียก API
│   ├── types/
│   │   └── todo.ts           # type ของข้อมูล Todo + ความยาวชื่อสูงสุด (255)
│   ├── utils/
│   │   └── elementIds.ts     # id ของ element ที่ใช้ย้ายโฟกัส (ช่องเพิ่มรายการ, checkbox แต่ละรายการ)
│   ├── App.tsx               # หน้าหลัก: ประกอบ component ทั้งหมด + ตัวกรอง/ตัวนับ
│   ├── index.css             # import Tailwind, design tokens (สีโหมดสว่าง/มืด), ฟอนต์ และ style พื้นฐาน
│   ├── main.tsx              # จุดเริ่มต้นของแอป (render <App /> ลงใน index.html)
│   └── vite-env.d.ts         # type ของตัวแปร env (VITE_API_URL)
├── .env.example              # ตัวอย่างไฟล์ตั้งค่า
├── index.html
├── package.json
├── tsconfig*.json            # ตั้งค่า TypeScript
└── vite.config.ts            # ตั้งค่า Vite + plugin React และ Tailwind
```

ลำดับการทำงานโดยย่อ: `App.tsx` เรียก `useTodos()` → hook เรียกฟังก์ชันใน `api/todos.ts` → `fetch` ไปที่ API Server →
ได้ข้อมูลกลับมาแล้วเก็บใน state → React แสดงผลผ่าน `TodoForm`, `TodoFilter`, `TodoItem` และ component อื่นๆ

## โจทย์

โจทย์ข้อที่ 1 Todo List Application 
รายละเอียด: สร้างแอปพลิเคชัน Todo List โดยใช้ HTML, CSS และ TypeScript พร้อมทั้ง Frontend Framework ที่คุณถนัด (เช่น React, Angular หรือ Vue.js ถ้าใช้ Vue.js 3 จะพิจารณาเป็นพิเศษ) และสร้าง
RESTful API Server โดยใช้ JS Backend Framework(เช่น Express.js, AdonisJS เป็นต้น ถ้าใช้ AdonisJS 5 จะพิจารณาเป็นพิเศษ)
ข้อกำหนด:
1. ผู้ใช้สามารถเพิ่มรายการ todo ได้
2. ผู้ใช้สามารถลบรายการ todo ได้
3. ผู้ใช้สามารถทำเครื่องหมายรายการว่าเสร็จสิ้นแล้วได้
4. ใช้ CSS ในการออกแบบให้ดูสวยงามและใช้งานง่าย (สามารถใช้ CSS Framework เช่น Bootstrap หรือ Tailwind ได้)
5. หน้าเว็บจะต้องสามารถ Responsive ใน Mobile และ Web(ถ้าสามารถทำได้ให้ทำมาด้วย)
6. สร้าง API สำหรับการจัดการรายการ Todo ซึ่งต้องมีฟังก์ชัน CRUD (Create, Read, Update, Delete)
7. การกระทำที่เกิดกับรายการ todo ต้องถูกส่ง Request ไปยัง RESTful API Server เพื่อสร้าง, บันทึก, ลบ, ปรับสถานะและเก็บข้อมูลในฐานข้อมูล MariaDB หรือ PostgreSQL
8. เมื่อมีการรีเฟรชหน้าเว็บรายการ todo ต้องคงอยู่ โดยเรียกข้อมูลจาก RESTful API Server มาแสดง
9. สร้างการทดสอบ API ด้วย Postman(ถ้าสามารถทำได้ให้ทำมาด้วย)
วิธีการส่งแบบทดสอบ: ให้อัปโหลด Source Code ของ Frontend และ RESTful API Server ขึ้นบน GitHub โดยเปิด Repository เป็น Public และแนบลิงก์ของ Repository ทั้งสองมาด้วย
