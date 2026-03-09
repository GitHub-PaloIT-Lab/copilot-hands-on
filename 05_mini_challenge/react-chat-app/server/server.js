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
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  methods: ['GET', 'POST'],
  credentials: true
};
app.use(cors(corsOptions));

// Socket.io setup with CORS
const io = socketIo(server, {
  cors: corsOptions
});

// Store connected users and message history
const users = new Map();
const messageHistory = [];
const typingUsers = new Map(); // socketId -> { username, timeout }
let messageIdCounter = 0;

const generateMessageId = () => {
  messageIdCounter += 1;
  return `msg_${Date.now()}_${messageIdCounter}`;
};

// Socket connection handling
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Handle user joining
  socket.on('join', (data) => {
    const { username } = data;

    // Validate username
    if (!username || username.trim().length < 2) {
      socket.emit('error', 'Username must be at least 2 characters long');
      return;
    }

    // Check if username is already taken
    const existingUser = Array.from(users.values()).find(
      (user) => user.username === username.trim()
    );
    if (existingUser) {
      socket.emit('error', 'Username already taken');
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

    // Notify others about new user (system message)
    const joinMessage = {
      id: generateMessageId(),
      username: 'System',
      message: `${user.username} joined the chat`,
      timestamp: new Date().toISOString(),
      type: 'system'
    };
    messageHistory.push(joinMessage);
    if (messageHistory.length > 100) messageHistory.shift();
    socket.to('main').emit('message', joinMessage);

    // Send updated user list to all clients
    const userList = Array.from(users.values());
    io.to('main').emit('userList', userList);

    console.log(`${user.username} joined the chat`);
  });

  // Handle incoming messages
  socket.on('message', (messageData) => {
    const user = users.get(socket.id);
    if (!user) {
      socket.emit('error', 'You must join the chat first');
      return;
    }

    if (!messageData.message || !messageData.message.trim()) {
      socket.emit('error', 'Invalid message data');
      return;
    }

    // Sanitize message (basic HTML escape)
    const sanitizedMessage = messageData.message
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

    // Create message object
    const message = {
      id: generateMessageId(),
      username: user.username,
      message: sanitizedMessage,
      timestamp: new Date().toISOString(),
      type: 'message'
    };

    // Store message in history (limit to last 100)
    messageHistory.push(message);
    if (messageHistory.length > 100) messageHistory.shift();

    // Broadcast message to all connected clients in main room
    io.to('main').emit('message', message);

    console.log(`Message from ${user.username}: ${sanitizedMessage}`);
  });

  // Send message history to requesting client
  socket.on('requestHistory', () => {
    socket.emit('messageHistory', messageHistory);
  });

  // Handle typing start
  socket.on('typing_start', (data) => {
    const user = users.get(socket.id);
    if (!user) return;

    const username = user.username;

    // Clear existing timeout
    if (typingUsers.has(socket.id)) {
      clearTimeout(typingUsers.get(socket.id).timeout);
    }

    // Set typing status with auto-stop timeout
    const timeout = setTimeout(() => {
      typingUsers.delete(socket.id);
      socket.broadcast.emit('typing_stop', { username });
    }, 3000);

    typingUsers.set(socket.id, { username, timeout });

    // Broadcast to all other users (not the sender)
    socket.broadcast.emit('typing_start', { username });
  });

  // Handle typing stop
  socket.on('typing_stop', () => {
    const user = users.get(socket.id);
    if (!user) return;

    const username = user.username;

    if (typingUsers.has(socket.id)) {
      clearTimeout(typingUsers.get(socket.id).timeout);
      typingUsers.delete(socket.id);
    }

    socket.broadcast.emit('typing_stop', { username });
  });

  // Handle user disconnection
  socket.on('disconnect', () => {
    const user = users.get(socket.id);
    if (user) {
      // Clean up typing state
      if (typingUsers.has(socket.id)) {
        clearTimeout(typingUsers.get(socket.id).timeout);
        typingUsers.delete(socket.id);
        socket.broadcast.emit('typing_stop', { username: user.username });
      }

      // Remove user from users list
      users.delete(socket.id);

      // Broadcast system message about user leaving
      const leaveMessage = {
        id: generateMessageId(),
        username: 'System',
        message: `${user.username} left the chat`,
        timestamp: new Date().toISOString(),
        type: 'system'
      };
      messageHistory.push(leaveMessage);
      if (messageHistory.length > 100) messageHistory.shift();
      socket.to('main').emit('message', leaveMessage);

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
    features: ['Socket.io', 'Real-time messaging', 'User management', 'Typing indicators'],
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
