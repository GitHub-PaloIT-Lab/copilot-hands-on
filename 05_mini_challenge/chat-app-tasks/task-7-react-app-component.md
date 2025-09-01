# Phase 3, Task 1: React App Component with Socket.io Client

## 🎯 Objective

Create the main React App component with Socket.io client connection and state management.

## 📋 Task Description

```text
Implement the main React App component:

1. Set up Socket.io client connection in App.js
2. Add state management for connection, username, and current view
3. Implement join/leave functionality
4. Add basic error handling and connection status
5. Create component structure for different views
6. Test Socket.io connection from React frontend

Focus: Core app structure and Socket.io client integration.
```

## 📄 App Component Implementation (client/src/App.js)

```javascript
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';

// Import components (we'll create these in next tasks)
// import JoinForm from './components/JoinForm';
// import ChatRoom from './components/ChatRoom';

function App() {
  // State management
  const [socket, setSocket] = useState(null);
  const [username, setUsername] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [connectionError, setConnectionError] = useState('');
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io('http://localhost:8000', {
      transports: ['websocket', 'polling']
    });

    setSocket(newSocket);

    // Connection event handlers
    newSocket.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
      setConnectionError('');
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
      setIsJoined(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      setConnectionError('Failed to connect to server');
      setIsConnected(false);
    });

    // Chat event handlers
    newSocket.on('joinSuccess', (data) => {
      console.log('Join successful:', data);
      setIsJoined(true);
    });

    newSocket.on('joinError', (error) => {
      console.error('Join error:', error);
      alert(error);
    });

    newSocket.on('userList', (userList) => {
      console.log('Updated user list:', userList);
      setUsers(userList);
    });

    newSocket.on('message', (message) => {
      console.log('Received message:', message);
      setMessages(prevMessages => [...prevMessages, message]);
    });

    newSocket.on('messageHistory', (history) => {
      console.log('Received message history:', history);
      setMessages(history);
    });

    newSocket.on('error', (error) => {
      console.error('Socket error:', error);
      alert('Error: ' + error);
    });

    // Cleanup on unmount
    return () => {
      newSocket.close();
    };
  }, []);

  // Join chat room
  const joinChat = (enteredUsername) => {
    if (socket && enteredUsername.trim()) {
      setUsername(enteredUsername.trim());
      socket.emit('join', { username: enteredUsername.trim() });
      socket.emit('requestHistory'); // Request message history
    }
  };

  // Leave chat room
  const leaveChat = () => {
    if (socket) {
      socket.disconnect();
      setIsJoined(false);
      setUsername('');
      setMessages([]);
      setUsers([]);
      // Reconnect
      window.location.reload();
    }
  };

  // Send message
  const sendMessage = (messageText) => {
    if (socket && messageText.trim() && username) {
      socket.emit('message', {
        username: username,
        message: messageText.trim()
      });
    }
  };

  // Typing indicators
  const startTyping = () => {
    if (socket && username) {
      socket.emit('typing_start', { username });
    }
  };

  const stopTyping = () => {
    if (socket && username) {
      socket.emit('typing_stop', { username });
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>React Chat App</h1>
        
        {/* Connection status */}
        <div className="connection-status">
          Status: {isConnected ? (
            <span className="connected">Connected</span>
          ) : (
            <span className="disconnected">Disconnected</span>
          )}
          {connectionError && (
            <div className="error">{connectionError}</div>
          )}
        </div>
      </header>

      <main className="App-main">
        {!isJoined ? (
          // Join form (placeholder for now)
          <div className="join-container">
            <h2>Join Chat</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const input = e.target.username;
              joinChat(input.value);
            }}>
              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                required
                disabled={!isConnected}
              />
              <button type="submit" disabled={!isConnected}>
                Join Chat
              </button>
            </form>
          </div>
        ) : (
          // Chat room (placeholder for now)
          <div className="chat-container">
            <div className="chat-header">
              <h2>Chat Room</h2>
              <div className="user-info">
                Welcome, {username}!
                <button onClick={leaveChat} className="leave-btn">
                  Leave Chat
                </button>
              </div>
            </div>
            
            <div className="chat-content">
              <div className="messages-container">
                <h3>Messages ({messages.length})</h3>
                {messages.map((msg) => (
                  <div key={msg.id} className={`message ${msg.type}`}>
                    <span className="username">{msg.username}:</span>
                    <span className="text">{msg.message}</span>
                    <span className="timestamp">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="users-container">
                <h3>Online Users ({users.length})</h3>
                {users.map((user) => (
                  <div key={user.id} className="user">
                    {user.username}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="message-input-container">
              <form onSubmit={(e) => {
                e.preventDefault();
                const input = e.target.message;
                sendMessage(input.value);
                input.value = '';
              }}>
                <input
                  type="text"
                  name="message"
                  placeholder="Type your message..."
                  onKeyDown={startTyping}
                  onKeyUp={stopTyping}
                  required
                />
                <button type="submit">Send</button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
```

## 📄 Basic Styling (client/src/App.css)

```css
.App {
  text-align: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.App-header {
  background-color: #282c34;
  padding: 20px;
  color: white;
  border-radius: 8px;
  margin-bottom: 20px;
}

.connection-status {
  margin-top: 10px;
  font-size: 14px;
}

.connected {
  color: #4CAF50;
  font-weight: bold;
}

.disconnected {
  color: #f44336;
  font-weight: bold;
}

.error {
  color: #ff6b6b;
  margin-top: 5px;
}

.join-container {
  background: #f5f5f5;
  padding: 40px;
  border-radius: 8px;
  max-width: 400px;
  margin: 0 auto;
}

.join-container form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.join-container input {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.join-container button {
  padding: 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
}

.join-container button:hover:not(:disabled) {
  background-color: #0056b3;
}

.join-container button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.chat-container {
  display: flex;
  flex-direction: column;
  height: 70vh;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #ddd;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.leave-btn {
  padding: 8px 16px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.leave-btn:hover {
  background-color: #c82333;
}

.chat-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.messages-container {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  border-right: 1px solid #ddd;
}

.users-container {
  width: 200px;
  padding: 20px;
  background-color: #f8f9fa;
  overflow-y: auto;
}

.message {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
  padding: 8px;
  border-radius: 4px;
}

.message.system {
  background-color: #e9ecef;
  font-style: italic;
}

.message .username {
  font-weight: bold;
  color: #007bff;
}

.message .timestamp {
  font-size: 12px;
  color: #6c757d;
  margin-left: auto;
}

.user {
  padding: 5px 10px;
  margin-bottom: 5px;
  background-color: white;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.message-input-container {
  padding: 20px;
  border-top: 1px solid #ddd;
  background-color: #f8f9fa;
}

.message-input-container form {
  display: flex;
  gap: 10px;
}

.message-input-container input {
  flex: 1;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.message-input-container button {
  padding: 12px 24px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.message-input-container button:hover {
  background-color: #218838;
}
```

## 🧪 Testing Instructions

### 1. Install Socket.io Client

```bash
cd client
npm install socket.io-client
```

### 2. Update package.json if needed

```json
{
  "name": "react-chat-client",
  "version": "1.0.0",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "socket.io-client": "^4.7.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build"
  }
}
```

### 3. Run Tests

```bash
# Terminal 1: Start server
cd server
npm start

# Terminal 2: Start React app
cd client
npm start
```

## ✅ Expected Behavior

1. React app connects to Socket.io server on startup
2. Connection status is displayed (Connected/Disconnected)
3. Users can enter username and join chat
4. Connected users list is displayed and updated
5. Messages are sent and received in real-time
6. Message history is loaded when joining
7. Users can leave chat and reconnect
8. Basic typing events are sent (improved in next tasks)

## 🔍 Verification Checklist

- [ ] Socket.io client connects to server successfully
- [ ] Connection status indicator works
- [ ] Username entry and join functionality works
- [ ] Users list updates when users join/leave
- [ ] Messages are sent and received
- [ ] Message history loads on join
- [ ] Leave chat functionality works
- [ ] Basic styling is applied
- [ ] Error handling displays alerts

## 🚀 Next Step

Proceed to Task 8: Join Form Component
