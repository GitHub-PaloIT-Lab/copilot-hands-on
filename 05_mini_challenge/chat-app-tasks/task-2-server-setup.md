# Phase 1, Task 2: Server Setup & Dependencies

## 🎯 Objective
Set up the Node.js backend server with Express and all required dependencies.

## 📋 Task Description

```
Set up the Node.js backend server:

1. Create server/package.json with all required dependencies:
   - express, socket.io, cors, helmet, morgan, dotenv, nodemon
2. Create server/.env file with environment variables
3. Create basic server/server.js with Express setup (no Socket.io yet)
4. Add health check endpoint (/health)
5. Test server starts on port 8000

Focus: Basic Express server setup without real-time features.
```

## 📄 Server package.json

```json
{
  "name": "chat-server",
  "version": "1.0.0",
  "description": "Node.js Socket.io chat server",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "socket.io": "^4.7.2",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "morgan": "^1.10.0",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

## 📄 Environment Variables (.env)

```env
NODE_ENV=development
PORT=8000
CLIENT_URL=http://localhost:3000
```

## 📄 Basic Server Implementation (server.js)

```javascript
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 8000;

// Security and logging middleware
app.use(helmet());
app.use(morgan('combined'));

// CORS configuration
const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  methods: ["GET", "POST"],
  credentials: true
};
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date(),
    environment: process.env.NODE_ENV || 'development',
    port: PORT
  });
});

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Chat Server API',
    version: '1.0.0',
    endpoints: {
      health: '/health'
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 CORS enabled for: ${corsOptions.origin}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
});
```

## 🧪 Testing Instructions

After implementing this task:

1. **Install dependencies:**
   ```bash
   cd server
   npm install
   ```

2. **Start the server:**
   ```bash
   npm run dev
   ```

3. **Test endpoints:**
   - Visit `http://localhost:8000` - Should show API info
   - Visit `http://localhost:8000/health` - Should show health status

4. **Expected console output:**
   ```
   🚀 Server running on port 8000
   📱 Environment: development
   🌐 CORS enabled for: http://localhost:3000
   🏥 Health check: http://localhost:8000/health
   ```

## ✅ Acceptance Criteria

After completing this task, you should have:

- [ ] `server/package.json` with all required dependencies
- [ ] `server/.env` file with environment variables
- [ ] `server/server.js` with basic Express setup
- [ ] Health check endpoint working at `/health`
- [ ] Server starts successfully on port 8000
- [ ] CORS configured for frontend communication
- [ ] Security middleware (helmet) enabled
- [ ] Request logging (morgan) enabled

## 📁 Expected Project Structure

```
react-chat-app/
├── package.json
├── README.md
├── .gitignore
├── server/
│   ├── package.json      # ✅ Created
│   ├── .env             # ✅ Created
│   └── server.js        # ✅ Created
└── client/              # (still empty)
```

## 🔄 Next Task

After completing this task, proceed to:
**Phase 1, Task 3: React Client Setup**
