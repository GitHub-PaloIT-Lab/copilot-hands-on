# Phase 2, Task 1: Socket.io Server Implementation

## 🎯 Objective
Add real-time communication capabilities to the server using Socket.io with user management.

## 📋 Task Description

```
Add real-time communication to the server:

1. Add Socket.io setup to server.js with CORS configuration
2. Implement user connection/disconnection handling
3. Add user storage (Map) to track connected users
4. Implement join event handler with username validation
5. Add user list broadcasting
6. Test connections with Socket.io client test tool

Focus: Core Socket.io functionality for user management.
```

## 📄 Updated Server Implementation (server.js)

```javascript
require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();
const server = http.createServer(app);
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

// Socket.io setup with CORS
const io = socketIo(server, {
  cors: corsOptions
});

// Store connected users
const users = new Map();

// Socket connection handling
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Handle user joining
  socket.on('join', (data) => {
    const { username } = data;
    
    // Validate username
    if (!username || username.trim().length < 2) {
      socket.emit('error', { message: 'Username must be at least 2 characters long' });
      return;
    }

    // Check if username is already taken
    const existingUser = Array.from(users.values()).find(user => user.username === username.trim());
    if (existingUser) {
      socket.emit('error', { message: 'Username already taken' });
      return;
    }

    // Store user info
    const user = {
      id: socket.id,
      username: username.trim(),
      joinedAt: new Date()
    };
    users.set(socket.id, user);

    // Join the main room
    socket.join('main');

    // Send welcome message to user
    socket.emit('welcome', {
      message: 'Welcome to the chat!',
      user: user
    });

    // Notify others about new user
    socket.to('main').emit('userJoined', {
      message: `${user.username} joined the chat`,
      user: user,
      timestamp: new Date()
    });

    // Send updated user list to all clients
    const userList = Array.from(users.values());
    io.to('main').emit('userList', userList);

    console.log(`${user.username} joined the chat`);
  });

  // Handle user disconnection
  socket.on('disconnect', () => {
    const user = users.get(socket.id);
    if (user) {
      // Remove user from users list
      users.delete(socket.id);

      // Notify others about user leaving
      socket.to('main').emit('userLeft', {
        message: `${user.username} left the chat`,
        user: user,
        timestamp: new Date()
      });

      // Send updated user list
      const userList = Array.from(users.values());
      io.to('main').emit('userList', userList);

      console.log(`${user.username} disconnected`);
    }
  });
});

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date(),
    environment: process.env.NODE_ENV || 'development',
    port: PORT,
    connectedUsers: users.size
  });
});

// API info endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Chat Server API',
    version: '1.0.0',
    features: ['Socket.io', 'Real-time messaging', 'User management'],
    connectedUsers: users.size,
    endpoints: {
      health: '/health',
      socketio: '/socket.io/'
    }
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 CORS enabled for: ${corsOptions.origin}`);
  console.log(`💬 Socket.io enabled for real-time communication`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
});
```

## 🧪 Testing Instructions

### Option 1: Using Browser Console
1. **Start the server:**
   ```bash
   cd server
   npm run dev
   ```

2. **Open browser developer tools** and test Socket.io connection:
   ```javascript
   // In browser console (at http://localhost:3000)
   const socket = io('http://localhost:8000');
   
   socket.on('connect', () => {
     console.log('Connected to server');
     socket.emit('join', { username: 'TestUser' });
   });
   
   socket.on('welcome', (data) => {
     console.log('Welcome:', data);
   });
   
   socket.on('userList', (users) => {
     console.log('Users online:', users);
   });
   ```

### Option 2: Using Socket.io Client Test Tool
1. **Install Socket.io client globally:**
   ```bash
   npm install -g socket.io-client
   ```

2. **Test connection from command line:**
   ```bash
   node -e "
   const io = require('socket.io-client');
   const socket = io('http://localhost:8000');
   socket.on('connect', () => {
     console.log('Connected!');
     socket.emit('join', { username: 'TestUser' });
   });
   socket.on('welcome', (data) => console.log('Welcome:', data));
   "
   ```

## ✅ Acceptance Criteria

After completing this task, you should have:

- [ ] Socket.io server properly configured with CORS
- [ ] User connection/disconnection handling works
- [ ] User storage (Map) tracks connected users
- [ ] Join event validates usernames (2+ characters, no duplicates)
- [ ] Welcome message sent to new users
- [ ] User join/leave notifications broadcast to others
- [ ] User list updates broadcast to all clients
- [ ] Health endpoint shows connected user count
- [ ] Console logs show user join/leave events

## 🧪 Expected Socket.io Events

### Client → Server:
- `join` - User joins with username
- `disconnect` - User disconnects

### Server → Client:
- `welcome` - Welcome message for new user
- `userJoined` - Notification when someone joins
- `userLeft` - Notification when someone leaves
- `userList` - Updated list of online users
- `error` - Error messages (invalid username, etc.)

## 📁 Expected Console Output

```
🚀 Server running on port 8000
📱 Environment: development
🌐 CORS enabled for: http://localhost:3000
💬 Socket.io enabled for real-time communication
🏥 Health check: http://localhost:8000/health

User connected: abc123
TestUser joined the chat
User connected: def456
TestUser2 joined the chat
TestUser disconnected
```

## 🔄 Next Task

After completing this task, proceed to:
**Phase 2, Task 2: Message Broadcasting System**
