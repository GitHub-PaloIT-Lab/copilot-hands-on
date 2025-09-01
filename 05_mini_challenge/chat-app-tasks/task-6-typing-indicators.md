# Phase 2, Task 3: Typing Indicators Backend

## 🎯 Objective

Implement typing indicators to show when users are typing messages.

## 📋 Task Description

```text
Add typing indicators to the Socket.io server:

1. Add typing event handlers (typing_start, typing_stop)
2. Implement typing state management for users
3. Add automatic typing timeout (stop after inactivity)
4. Broadcast typing status to other users (excluding sender)
5. Clean up typing state on user disconnect
6. Test typing indicators functionality

Focus: Real-time typing status with proper cleanup.
```

## 📄 Updated Server Implementation (server.js)

```javascript
// Add to your existing server.js after the message handler

// Store typing users
const typingUsers = new Map(); // userId -> { username, timeout }

// Handle typing start
socket.on('typing_start', (data) => {
    if (!data.username) return;
    
    const userId = socket.id;
    
    // Clear existing timeout
    if (typingUsers.has(userId)) {
        clearTimeout(typingUsers.get(userId).timeout);
    }
    
    // Set typing status with auto-stop timeout
    const timeout = setTimeout(() => {
        typingUsers.delete(userId);
        socket.broadcast.emit('typing_stop', { username: data.username });
    }, 3000); // Stop typing after 3 seconds of inactivity
    
    typingUsers.set(userId, {
        username: data.username,
        timeout: timeout
    });
    
    // Broadcast to all other users (not the sender)
    socket.broadcast.emit('typing_start', { username: data.username });
});

// Handle typing stop
socket.on('typing_stop', (data) => {
    if (!data.username) return;
    
    const userId = socket.id;
    
    // Clear timeout and remove from typing users
    if (typingUsers.has(userId)) {
        clearTimeout(typingUsers.get(userId).timeout);
        typingUsers.delete(userId);
    }
    
    // Broadcast to all other users
    socket.broadcast.emit('typing_stop', { username: data.username });
});

// Update disconnect handler to clean up typing state
socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    const user = connectedUsers.get(socket.id);
    
    if (user) {
        // Clean up typing state
        if (typingUsers.has(socket.id)) {
            clearTimeout(typingUsers.get(socket.id).timeout);
            typingUsers.delete(socket.id);
            socket.broadcast.emit('typing_stop', { username: user.username });
        }
        
        // Remove from connected users
        connectedUsers.delete(socket.id);
        
        // Broadcast updated user list
        const userList = Array.from(connectedUsers.values());
        io.emit('userList', userList);
        
        console.log(`${user.username} left the chat`);
        io.emit('message', {
            id: Date.now(),
            username: 'System',
            message: `${user.username} left the chat`,
            timestamp: new Date().toISOString(),
            type: 'system'
        });
    }
});
```

## 🧪 Testing Instructions

### 1. Update Test File (test-socket.js)

```javascript
const io = require('socket.io-client');

const socket1 = io('http://localhost:8000');
const socket2 = io('http://localhost:8000');

socket1.on('connect', () => {
    console.log('Socket 1 connected');
    socket1.emit('join', { username: 'TestUser1' });
});

socket2.on('connect', () => {
    console.log('Socket 2 connected');
    socket2.emit('join', { username: 'TestUser2' });
});

// Listen for typing events
socket1.on('typing_start', (data) => {
    console.log('Socket 1: User started typing:', data.username);
});

socket1.on('typing_stop', (data) => {
    console.log('Socket 1: User stopped typing:', data.username);
});

socket2.on('typing_start', (data) => {
    console.log('Socket 2: User started typing:', data.username);
});

socket2.on('typing_stop', (data) => {
    console.log('Socket 2: User stopped typing:', data.username);
});

// Test typing indicators
setTimeout(() => {
    console.log('TestUser1 starts typing...');
    socket1.emit('typing_start', { username: 'TestUser1' });
    
    setTimeout(() => {
        console.log('TestUser1 stops typing');
        socket1.emit('typing_stop', { username: 'TestUser1' });
    }, 2000);
}, 1000);

setTimeout(() => {
    console.log('TestUser2 starts typing...');
    socket2.emit('typing_start', { username: 'TestUser2' });
    
    // Don't send stop - test auto-timeout
    console.log('TestUser2 typing will auto-timeout in 3 seconds');
}, 4000);
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

1. When a user starts typing, other users receive `typing_start` event
2. When a user stops typing, other users receive `typing_stop` event
3. Typing automatically stops after 3 seconds of inactivity
4. Typing state is cleaned up when user disconnects
5. Users don't receive their own typing events
6. Multiple users can be typing simultaneously

## 🔍 Verification Checklist

- [ ] Typing start events are broadcast to other users
- [ ] Typing stop events are broadcast to other users  
- [ ] Auto-timeout stops typing after 3 seconds
- [ ] Typing state is cleaned up on disconnect
- [ ] Users don't receive their own typing events
- [ ] Multiple simultaneous typers are handled correctly
- [ ] Console logs show typing event flow

## 🚀 Next Step

Proceed to Task 7: React App Component with Socket.io Client
