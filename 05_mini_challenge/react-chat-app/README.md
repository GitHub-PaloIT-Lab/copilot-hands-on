# 💬 React Chat App

แอปแชทแบบ real-time สร้างด้วย React.js + Socket.io

## ✨ ฟีเจอร์หลัก

- **Real-time messaging** - ข้อความแสดงทันทีสำหรับทุกคน
- **รายชื่อผู้ใช้ออนไลน์** - แสดงว่าใครกำลังออนไลน์อยู่
- **Typing Indicators** - แสดงว่าใครกำลังพิมพ์ข้อความ
- **Join/Leave notifications** - แจ้งเตือนเมื่อมีคนเข้า/ออกห้องแชท
- **Message History** - ประวัติข้อความสำหรับผู้ใช้ที่เข้าร่วมใหม่

## 🛠 เทคโนโลยี

| Layer    | Technology                    |
| -------- | ----------------------------- |
| Frontend | React.js + Socket.io-client   |
| Backend  | Node.js + Express.js + Socket.io |

## 📁 โครงสร้างโปรเจกต์

```
react-chat-app/
├── package.json          # Root scripts
├── .gitignore
├── README.md
├── server/               # Backend
│   ├── package.json
│   ├── .env
│   └── server.js         # Express + Socket.io server
└── client/               # Frontend
    ├── package.json
    ├── public/
    │   └── index.html
    └── src/
        ├── index.js
        ├── index.css
        ├── App.js
        ├── App.css
        └── components/
            ├── JoinForm.js         # Username entry form
            ├── JoinForm.css
            ├── ChatRoom.js         # Main chat layout
            ├── ChatRoom.css
            ├── MessageList.js      # Message display
            ├── MessageList.css
            ├── MessageInput.js     # Message input
            ├── MessageInput.css
            ├── UserList.js         # Online users sidebar
            ├── UserList.css
            ├── TypingIndicator.js  # Typing dots
            └── TypingIndicator.css
```

## 🚀 วิธีรัน

### 1. ติดตั้ง Dependencies

```bash
# ติดตั้งทั้ง server และ client
npm run install:all

# หรือติดตั้งแยก
cd server && npm install
cd ../client && npm install
```

### 2. รัน Server

```bash
cd server
npm run dev   # development (nodemon)
# หรือ
npm start     # production
```

### 3. รัน Client

```bash
cd client
npm start
```

### 4. รันพร้อมกัน (ต้องติดตั้ง root dependencies ก่อน)

```bash
npm install          # root (concurrently)
npm run dev          # รัน server + client พร้อมกัน
```

## 🌐 URLs

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **Health Check:** http://localhost:8000/health

## 🔌 Socket.io Events

### Client → Server

| Event            | Payload                          | Description                    |
| ---------------- | -------------------------------- | ------------------------------ |
| `join`           | `{ username }`                   | เข้าร่วมห้องแชท                |
| `message`        | `{ username, message }`          | ส่งข้อความ                    |
| `typing_start`   | `{ username }`                   | เริ่มพิมพ์                    |
| `typing_stop`    | `{ username }`                   | หยุดพิมพ์                     |
| `requestHistory` | -                                | ขอประวัติข้อความ              |

### Server → Client

| Event            | Payload                          | Description                    |
| ---------------- | -------------------------------- | ------------------------------ |
| `welcome`        | `{ message, user }`              | ยืนยันการเข้าร่วม             |
| `userList`       | `[{ id, username, joinedAt }]`   | รายชื่อผู้ใช้ออนไลน์         |
| `message`        | `{ id, username, message, ... }` | ข้อความใหม่                   |
| `messageHistory` | `[messages]`                     | ประวัติข้อความ               |
| `typing_start`   | `{ username }`                   | ผู้ใช้กำลังพิมพ์              |
| `typing_stop`    | `{ username }`                   | ผู้ใช้หยุดพิมพ์               |
| `userJoined`     | `{ message, user, timestamp }`   | มีผู้ใช้เข้าร่วม             |
| `userLeft`       | `{ message, user, timestamp }`   | มีผู้ใช้ออก                  |
| `error`          | `{ message }`                    | ข้อผิดพลาด                   |
