# Phase 2, Task 2: Message Broadcasting System

## 🎯 Objective
Implement message broadcasting functionality to handle chat messages between users.

## 📋 Task Description

```
Add message broadcasting to the Socket.io server:

1. Add message event handler in server.js
2. Implement message validation and sanitization
3. Add timestamp to messages
4. Broadcast messages to all connected users
5. Add message history storage (in-memory for now)
6. Implement message retrieval for new users joining
7. Test message sending and receiving

Focus: Core messaging functionality with basic validation.
```

## 📄 Updated Server Implementation (server.js)

```javascript
// Add to your existing server.js after the join event handler

// Store message history (in production, use a database)
const messageHistory = [];

// Handle incoming messages
socket.on('message', (messageData) => {
    console.log('Message received:', messageData);
    
    // Validate message data
    if (!messageData.message || !messageData.username) {
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
        id: Date.now() + Math.random(), // Simple ID generation
        username: messageData.username,
        message: sanitizedMessage,
        timestamp: new Date().toISOString(),
        type: 'message'
    };
    
    // Store message in history
    messageHistory.push(message);
    
    // Keep only last 100 messages in memory
    if (messageHistory.length > 100) {
        messageHistory.shift();
    }
    
    // Broadcast message to all connected clients
    io.emit('message', message);
});

// Send message history to newly joined users
socket.on('requestHistory', () => {
    socket.emit('messageHistory', messageHistory);
});
```

## 🧪 Testing Instructions

### 1. Test with Socket.io Client
Create or update `test-socket.js`:

```javascript
const io = require('socket.io-client');

const socket1 = io('http://localhost:8000');
const socket2 = io('http://localhost:8000');

socket1.on('connect', () => {
    console.log('Socket 1 connected');
    socket1.emit('join', { username: 'TestUser1' });
    
    // Send a test message after joining
    setTimeout(() => {
        socket1.emit('message', {
            username: 'TestUser1',
            message: 'Hello from user 1!'
        });
    }, 1000);
});

socket2.on('connect', () => {
    console.log('Socket 2 connected');
    socket2.emit('join', { username: 'TestUser2' });
    
    // Request message history
    socket2.emit('requestHistory');
});

// Listen for messages on both sockets
socket1.on('message', (data) => {
    console.log('Socket 1 received message:', data);
});

socket2.on('message', (data) => {
    console.log('Socket 2 received message:', data);
});

socket2.on('messageHistory', (history) => {
    console.log('Socket 2 received history:', history);
});

// Test sending from socket 2 after delay
setTimeout(() => {
    socket2.emit('message', {
        username: 'TestUser2',
        message: 'Hello from user 2!'
    });
}, 2000);
```

### 2. Run Tests

```bash
# Terminal 1: Start server
cd server
npm start

# Terminal 2: Run test
node test-socket.js
```

## ✅ Expected Behavior

1. Users can send messages that are broadcast to all connected clients
2. Messages include username, content, and timestamp
3. HTML content is sanitized for security
4. New users can request and receive message history
5. Message history is limited to last 100 messages
6. Invalid messages are rejected with error response

## 🔍 Verification Checklist

- [ ] Messages are broadcast to all connected users
- [ ] Message validation prevents empty/invalid messages
- [ ] HTML content is properly sanitized
- [ ] Timestamps are added to all messages
- [ ] Message history is stored and retrievable
- [ ] Error handling for invalid message data
- [ ] Console logs show message flow

## 🚀 Next Step
Proceed to Task 6: Typing Indicators Backend Implementation
