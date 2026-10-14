# VESPERTRACE

**VESPERTRACE — A Shadow-Based 2D Puzzle Game**

เครื่องมือที่ใช้: **Phaser 3 + TypeScript + Vite**

*Every step leaves something behind.*

ทุกก้าวทิ้งร่องรอยไว้บนกระดาน ผู้เล่นต้องใช้เงาและตำแหน่งที่ผ่านมาเพื่อแก้ปริศนาและผ่านด่าน

## สถานะของโปรเจกต์

เกมมีระบบหลักที่พัฒนาแล้ว ได้แก่

- หน้าเริ่มเกม (Title Screen)
- ระบบเลือกตัวละคร
- ระบบเลือกด่านและความคืบหน้าการปลดล็อกด่าน
- ด่านปริศนาที่เล่นได้ 3 ด่าน
- ระบบเดินบนกริดและกลไกเงา
- ระบบสวิตช์ ประตู และทางออก

รายละเอียดกลไกอาจแตกต่างกันตามการพัฒนาแต่ละเวอร์ชัน

## เทคโนโลยี

- Phaser 3
- TypeScript
- Vite

## วิธีติดตั้งและเปิดเกม

ต้องติดตั้ง Node.js ก่อน

1. เปิด Terminal ใน VS Code
2. เข้าไปยังโฟลเดอร์โปรเจกต์
3. ติดตั้ง dependencies

```bash
npm install
```

4. เปิดเซิร์ฟเวอร์สำหรับพัฒนา

```bash
npm run dev
```

5. เปิด URL ที่แสดงใน Terminal โดยปกติคือ `http://localhost:5173`

## คำสั่งที่ใช้บ่อย

```bash
npm run dev
```

เปิดเกมในโหมดพัฒนา

```bash
npm run build
```

ตรวจสอบ TypeScript และสร้างไฟล์สำหรับ Production ไว้ใน `dist/`

```bash
npm run preview
```

เปิดดูผลลัพธ์หลัง Build

## โครงสร้างโปรเจกต์

```text
vespertrace/
├── docs/
│   └── ORIGINALITY.md
├── public/
├── src/
│   ├── main.ts
│   └── game/
└── package.json
```

โครงสร้างด้านบนเป็นภาพรวม ส่วนไฟล์ย่อยภายใน `src/game/` อาจแตกต่างกันตามเวอร์ชันของโปรเจกต์

## Originality

อ่านรายละเอียดแนวคิดเกมและการพิจารณาชื่อได้ที่ [`docs/ORIGINALITY.md`](docs/ORIGINALITY.md)

## Project Information

**Name:** VESPERTRACE  
**Genre:** 2D Puzzle Game  
**Tagline:** Every step leaves something behind.  
**Purpose:** Personal portfolio project
