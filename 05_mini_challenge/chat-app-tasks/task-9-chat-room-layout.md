# Phase 3, Task 3: Chat Room Layout Component

## 🎯 Objective

Create a dedicated ChatRoom component with improved layout and user experience.

## 📋 Task Description

```text
Create a comprehensive ChatRoom component:

1. Create ChatRoom component with proper layout structure
2. Add header with user info and controls
3. Implement responsive three-panel layout (messages, users, input)
4. Add message scrolling and auto-scroll to bottom
5. Integrate typing indicators display
6. Add loading states and empty states
7. Improve overall UX with better styling

Focus: Clean layout, responsive design, and smooth user interactions.
```

## 📄 ChatRoom Component (client/src/components/ChatRoom.js)

```javascript
import React, { useState, useEffect, useRef } from 'react';
import './ChatRoom.css';

function ChatRoom({ 
  username, 
  users, 
  messages, 
  onSendMessage, 
  onLeaveChat,
  onStartTyping,
  onStopTyping,
  typingUsers 
}) {
  const [messageInput, setMessageInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const messageInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus message input on mount
  useEffect(() => {
    if (messageInputRef.current) {
      messageInputRef.current.focus();
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (messageInput.trim()) {
      onSendMessage(messageInput.trim());
      setMessageInput('');
      
      // Stop typing indicator immediately after sending
      if (isTyping) {
        onStopTyping();
        setIsTyping(false);
      }
    }
  };

  const handleInputChange = (e) => {
    setMessageInput(e.target.value);
  };

  const handleInputKeyDown = (e) => {
    // Send on Enter (but not Shift+Enter)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
      return;
    }

    // Handle typing indicators
    if (!isTyping && messageInput.trim() !== '') {
      setIsTyping(true);
      onStartTyping();
    }

    // Reset typing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      if (isTyping) {
        setIsTyping(false);
        onStopTyping();
      }
    }, 1000);
  };

  const handleInputKeyUp = (e) => {
    // Stop typing if input is empty
    if (e.target.value.trim() === '' && isTyping) {
      setIsTyping(false);
      onStopTyping();
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    if (messageDate.getTime() === today.getTime()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };

  const getMessageClass = (message) => {
    let className = 'message';
    if (message.type === 'system') className += ' system';
    if (message.username === username) className += ' own-message';
    return className;
  };

  return (
    <div className="chat-room">
      {/* Header */}
      <div className="chat-header">
        <div className="chat-title">
          <h2>React Chat Room</h2>
          <span className="online-count">{users.length} online</span>
        </div>
        
        <div className="user-controls">
          <div className="current-user">
            <span className="user-icon">👤</span>
            <span className="username">{username}</span>
          </div>
          <button onClick={onLeaveChat} className="leave-button">
            Leave Chat
          </button>
        </div>
      </div>

      {/* Main content area */}
      <div className="chat-content">
        {/* Messages area */}
        <div className="messages-panel">
          <div className="messages-container">
            {messages.length === 0 ? (
              <div className="empty-messages">
                <div className="empty-icon">💬</div>
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              messages.map((message) => (
                <div key={message.id} className={getMessageClass(message)}>
                  <div className="message-content">
                    {message.type !== 'system' && (
                      <div className="message-header">
                        <span className="message-username">{message.username}</span>
                        <span className="message-timestamp">
                          {formatTimestamp(message.timestamp)}
                        </span>
                      </div>
                    )}
                    <div className="message-text">
                      {message.message}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Typing indicators */}
          {typingUsers && typingUsers.length > 0 && (
            <div className="typing-indicators">
              <div className="typing-animation">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <span className="typing-text">
                {typingUsers.length === 1 
                  ? `${typingUsers[0]} is typing...`
                  : typingUsers.length === 2
                  ? `${typingUsers[0]} and ${typingUsers[1]} are typing...`
                  : `${typingUsers[0]} and ${typingUsers.length - 1} others are typing...`
                }
              </span>
            </div>
          )}
        </div>

        {/* Users sidebar */}
        <div className="users-panel">
          <div className="users-header">
            <h3>Online Users</h3>
            <span className="users-count">({users.length})</span>
          </div>
          
          <div className="users-list">
            {users.map((user) => (
              <div 
                key={user.id} 
                className={`user-item ${user.username === username ? 'current-user' : ''}`}
              >
                <div className="user-avatar">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div className="user-info">
                  <span className="user-name">{user.username}</span>
                  {user.username === username && (
                    <span className="you-label">(you)</span>
                  )}
                </div>
                <div className="user-status online"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Message input */}
      <div className="message-input-panel">
        <form onSubmit={handleSendMessage} className="message-form">
          <div className="input-group">
            <input
              ref={messageInputRef}
              type="text"
              value={messageInput}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
              onKeyUp={handleInputKeyUp}
              placeholder="Type your message... (Press Enter to send)"
              className="message-input"
              maxLength={500}
              autoComplete="off"
            />
            <button 
              type="submit" 
              disabled={!messageInput.trim()}
              className="send-button"
            >
              Send
            </button>
          </div>
          
          <div className="input-footer">
            <div className="character-count">
              {messageInput.length}/500
            </div>
            <div className="input-hint">
              Press Enter to send, Shift+Enter for new line
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChatRoom;
```

## 📄 ChatRoom Styles (client/src/components/ChatRoom.css)

```css
.chat-room {
  display: flex;
  flex-direction: column;
  height: 80vh;
  max-height: 800px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  border: 1px solid #e1e5e9;
}

/* Header */
.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-bottom: 1px solid #e1e5e9;
}

.chat-title h2 {
  margin: 0 0 4px 0;
  font-size: 20px;
  font-weight: 600;
}

.online-count {
  font-size: 13px;
  opacity: 0.9;
}

.user-controls {
  display: flex;
  align-items: center;
  gap: 16px;
}

.current-user {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  font-size: 14px;
}

.user-icon {
  font-size: 16px;
}

.leave-button {
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
}

.leave-button:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* Main content */
.chat-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* Messages panel */
.messages-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #f8f9fa;
}

.messages-container {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  scroll-behavior: smooth;
}

.empty-messages {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #6c757d;
  text-align: center;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.message {
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
}

.message.own-message {
  align-items: flex-end;
}

.message-content {
  max-width: 70%;
  background: white;
  border-radius: 12px;
  padding: 12px 16px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  border: 1px solid #e9ecef;
}

.message.own-message .message-content {
  background: #007bff;
  color: white;
}

.message.system .message-content {
  background: #e9ecef;
  color: #6c757d;
  font-style: italic;
  text-align: center;
  max-width: 90%;
  align-self: center;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
  font-size: 12px;
}

.message-username {
  font-weight: 600;
  color: #495057;
}

.message.own-message .message-username {
  color: rgba(255, 255, 255, 0.9);
}

.message-timestamp {
  color: #6c757d;
  font-size: 11px;
}

.message.own-message .message-timestamp {
  color: rgba(255, 255, 255, 0.7);
}

.message-text {
  line-height: 1.4;
  word-wrap: break-word;
}

/* Typing indicators */
.typing-indicators {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  background: rgba(108, 117, 125, 0.1);
  border-top: 1px solid #e9ecef;
  font-size: 13px;
  color: #6c757d;
}

.typing-animation {
  display: flex;
  gap: 2px;
}

.typing-animation span {
  width: 4px;
  height: 4px;
  background: #6c757d;
  border-radius: 50%;
  animation: typing-bounce 1.4s infinite ease-in-out;
}

.typing-animation span:nth-child(1) { animation-delay: 0s; }
.typing-animation span:nth-child(2) { animation-delay: 0.2s; }
.typing-animation span:nth-child(3) { animation-delay: 0.4s; }

@keyframes typing-bounce {
  0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
  40% { transform: scale(1); opacity: 1; }
}

/* Users panel */
.users-panel {
  width: 280px;
  background: white;
  border-left: 1px solid #e9ecef;
  display: flex;
  flex-direction: column;
}

.users-header {
  padding: 20px;
  border-bottom: 1px solid #e9ecef;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  gap: 8px;
}

.users-header h3 {
  margin: 0;
  font-size: 16px;
  color: #495057;
}

.users-count {
  font-size: 14px;
  color: #6c757d;
}

.users-list {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
}

.user-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 8px;
  transition: background-color 0.2s;
}

.user-item:hover {
  background: #f8f9fa;
}

.user-item.current-user {
  background: #e3f2fd;
  border: 1px solid #bbdefb;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
}

.user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 500;
  color: #495057;
  font-size: 14px;
}

.you-label {
  font-size: 12px;
  color: #007bff;
  font-weight: 500;
}

.user-status {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #28a745;
}

/* Message input panel */
.message-input-panel {
  border-top: 1px solid #e9ecef;
  background: white;
  padding: 20px;
}

.message-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-group {
  display: flex;
  gap: 12px;
  align-items: flex-end;
}

.message-input {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.4;
  resize: none;
  transition: border-color 0.2s;
  font-family: inherit;
}

.message-input:focus {
  outline: none;
  border-color: #007bff;
}

.send-button {
  padding: 12px 24px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.send-button:hover:not(:disabled) {
  background: #0056b3;
}

.send-button:disabled {
  background: #e9ecef;
  color: #6c757d;
  cursor: not-allowed;
}

.input-footer {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #6c757d;
  padding-top: 4px;
}

/* Responsive design */
@media (max-width: 768px) {
  .chat-room {
    height: 100vh;
    border-radius: 0;
  }
  
  .chat-content {
    flex-direction: column;
  }
  
  .users-panel {
    width: 100%;
    max-height: 200px;
    order: -1;
  }
  
  .chat-header {
    padding: 16px;
  }
  
  .user-controls {
    flex-direction: column;
    gap: 8px;
  }
  
  .message-content {
    max-width: 85%;
  }
}
```

## 📄 Update App.js to Use ChatRoom

```javascript
// Add this import at the top of App.js
import ChatRoom from './components/ChatRoom';

// Add state for typing users
const [typingUsers, setTypingUsers] = useState([]);

// Add typing event handlers in useEffect
useEffect(() => {
  // ... existing socket setup ...
  
  // Add these typing event handlers
  newSocket.on('typing_start', (data) => {
    setTypingUsers(prev => {
      if (!prev.includes(data.username)) {
        return [...prev, data.username];
      }
      return prev;
    });
  });

  newSocket.on('typing_stop', (data) => {
    setTypingUsers(prev => prev.filter(user => user !== data.username));
  });

  // ... rest of existing code ...
}, []);

// Replace the chat room section in App.js with:
{isJoined && (
  <ChatRoom
    username={username}
    users={users}
    messages={messages}
    onSendMessage={sendMessage}
    onLeaveChat={leaveChat}
    onStartTyping={startTyping}
    onStopTyping={stopTyping}
    typingUsers={typingUsers}
  />
)}
```

## 🧪 Testing Instructions

### 1. Test Layout

- Verify three-panel layout (messages, users, input)
- Test responsive behavior on mobile
- Check scrolling in messages and users panels

### 2. Test Messaging

- Send messages and verify auto-scroll
- Test message formatting and timestamps
- Verify own messages appear on right side

### 3. Test Typing Indicators

- Start typing and verify indicators appear for other users
- Test auto-timeout after stopping typing
- Test multiple users typing simultaneously

### 4. Run Full Test

```bash
# Terminal 1: Start server
cd server
npm start

# Terminal 2: Start React app
cd client
npm start

# Open multiple browser tabs to test multi-user functionality
```

## ✅ Expected Behavior

1. Clean three-panel layout with proper responsive design
2. Messages auto-scroll to bottom with smooth animation
3. User avatars and online status indicators
4. Real-time typing indicators with animation
5. Improved message formatting with timestamps
6. Character count and input hints
7. Mobile-friendly responsive layout

## 🔍 Verification Checklist

- [ ] ChatRoom component renders with proper layout
- [ ] Messages auto-scroll to bottom
- [ ] User list displays with avatars and status
- [ ] Typing indicators work correctly
- [ ] Responsive design works on mobile
- [ ] Message input has proper validation
- [ ] Own messages appear on right side
- [ ] Timestamps format correctly

## 🚀 Next Step

Proceed to Task 10: Message Display Components
