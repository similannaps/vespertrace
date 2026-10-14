# VESPERTRACE

**VESPERTRACE — A Shadow-Based 2D Puzzle Game**

*Every step leaves something behind.*

🌐 **Play Online:** [Play VESPERTRACE](https://celadon-baklava-af0762.netlify.app/)

📦 **Source Code:** [GitHub Repository](https://github.com/similannaps/vespertrace)

---

ทุกก้าวทิ้งร่องรอยไว้บนกระดาน ผู้เล่นต้องใช้เงาและตำแหน่งที่ผ่านมาเพื่อแก้ปริศนาและผ่านด่าน

## About the Game

VESPERTRACE เป็นเกมปริศนา 2D ที่ผู้เล่นต้องใช้เงาและตำแหน่งที่เคยเดินผ่านมาเพื่อวางแผนการเคลื่อนที่ แก้ปริศนา และหาทางผ่านแต่ละด่าน

## Game Features

- Title Screen
- Character Selection
- Level Selection and Unlock Progression
- 3 Playable Puzzle Levels
- Grid-Based Movement and Shadow Mechanics
- Switches, Doors, and Exits

รายละเอียดกลไกอาจแตกต่างกันตามเวอร์ชันของโปรเจกต์

## Technologies

- Phaser 3
- TypeScript
- Vite

## Play the Game

เล่นเกมผ่านเว็บไซต์ได้ที่:

**https://celadon-baklava-af0762.netlify.app/**

ไม่จำเป็นต้องติดตั้งโปรเจกต์ลงในเครื่องเพื่อเข้าเล่นผ่านเว็บไซต์

## Run Locally

ต้องติดตั้ง Node.js ก่อน

1. Clone โปรเจกต์จาก GitHub

   ```bash
   git clone https://github.com/similannaps/vespertrace.git
   ```

2. เข้าไปยังโฟลเดอร์โปรเจกต์

   ```bash
   cd vespertrace
   ```

3. ติดตั้ง Dependencies

   ```bash
   npm install
   ```

4. เปิด Development Server

   ```bash
   npm run dev
   ```

5. เปิด URL ที่แสดงใน Terminal โดยปกติคือ `http://localhost:5173`

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | เปิดเกมในโหมดพัฒนา |
| `npm run build` | ตรวจสอบ TypeScript และ Build สำหรับ Production |
| `npm run preview` | Preview ผลลัพธ์หลัง Build |

ไฟล์สำหรับ Production จะถูกสร้างไว้ในโฟลเดอร์ `dist/`

## Project Structure

```text
vespertrace/
├── docs/
│   └── ORIGINALITY.md
├── public/
├── src/
│   ├── main.ts
│   └── game/
├── package.json
└── README.md
```

โครงสร้างด้านบนเป็นภาพรวม ไฟล์ย่อยภายใน `src/game/` อาจแตกต่างกันตามเวอร์ชันของโปรเจกต์

## Originality

อ่านรายละเอียดแนวคิดเกมและการพิจารณาชื่อได้ที่ [docs/ORIGINALITY.md](https://github.com/similannaps/vespertrace/blob/main/docs/ORIGINALITY.md)

## Project Information

- **Name:** VESPERTRACE
- **Genre:** 2D Puzzle Game
- **Tagline:** Every step leaves something behind.
- **Technology:** Phaser 3, TypeScript, Vite
- **Deployment:** Netlify
- **Purpose:** Personal Portfolio Project