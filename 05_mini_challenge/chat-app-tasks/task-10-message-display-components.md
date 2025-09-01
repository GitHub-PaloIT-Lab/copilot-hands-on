# Phase 4, Task 1: Message Display Components

## 🎯 Objective

Create dedicated components for message rendering with advanced features like message reactions, link previews, and better formatting.

## 📋 Task Description

```text
Create specialized message display components:

1. Create MessageList component for message container
2. Create Message component for individual messages
3. Add message reactions (like/emoji responses)
4. Implement link detection and basic previews
5. Add message actions (copy, reply, delete for own messages)
6. Improve message formatting (bold, italic, code blocks)
7. Add message status indicators (sent, delivered, read)

Focus: Rich message display with interactive features.
```

## 📄 MessageList Component (client/src/components/MessageList.js)

```javascript
import React, { useEffect, useRef } from 'react';
import Message from './Message';
import './MessageList.css';

function MessageList({ 
  messages, 
  currentUsername, 
  onReactToMessage, 
  onReplyToMessage,
  onDeleteMessage,
  typingUsers 
}) {
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div className="message-list" ref={messagesContainerRef}>
      {Object.keys(groupedMessages).length === 0 ? (
        <div className="empty-messages">
          <div className="empty-icon">💬</div>
          <h3>No messages yet</h3>
          <p>Start the conversation by sending a message!</p>
        </div>
      ) : (
        Object.entries(groupedMessages).map(([date, dayMessages]) => (
          <div key={date} className="message-day-group">
            <div className="date-separator">
              <span className="date-label">{formatDateLabel(date)}</span>
            </div>
            
            {dayMessages.map((message, index) => (
              <Message
                key={message.id}
                message={message}
                isOwn={message.username === currentUsername}
                isFirstInGroup={isFirstInGroup(dayMessages, index)}
                isLastInGroup={isLastInGroup(dayMessages, index)}
                onReact={onReactToMessage}
                onReply={onReplyToMessage}
                onDelete={onDeleteMessage}
                showActions={message.username === currentUsername}
              />
            ))}
          </div>
        ))
      )}

      {/* Typing indicators */}
      {typingUsers && typingUsers.length > 0 && (
        <div className="typing-indicators">
          <div className="typing-message">
            <div className="typing-avatar">
              <div className="typing-animation">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
            <div className="typing-content">
              <span className="typing-text">
                {typingUsers.length === 1 
                  ? `${typingUsers[0]} is typing...`
                  : typingUsers.length === 2
                  ? `${typingUsers[0]} and ${typingUsers[1]} are typing...`
                  : `${typingUsers[0]} and ${typingUsers.length - 1} others are typing...`
                }
              </span>
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}

// Helper functions
function groupMessagesByDate(messages) {
  return messages.reduce((groups, message) => {
    const date = new Date(message.timestamp).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});
}

function formatDateLabel(dateString) {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString([], { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }
}

function isFirstInGroup(messages, index) {
  if (index === 0) return true;
  
  const current = messages[index];
  const previous = messages[index - 1];
  
  return current.username !== previous.username || 
         (new Date(current.timestamp) - new Date(previous.timestamp)) > 300000; // 5 minutes
}

function isLastInGroup(messages, index) {
  if (index === messages.length - 1) return true;
  
  const current = messages[index];
  const next = messages[index + 1];
  
  return current.username !== next.username || 
         (new Date(next.timestamp) - new Date(current.timestamp)) > 300000; // 5 minutes
}

export default MessageList;
```

## 📄 Message Component (client/src/components/Message.js)

```javascript
import React, { useState } from 'react';
import './Message.css';

function Message({ 
  message, 
  isOwn, 
  isFirstInGroup, 
  isLastInGroup, 
  onReact, 
  onReply, 
  onDelete,
  showActions 
}) {
  const [showReactions, setShowReactions] = useState(false);
  const [showActions, setShowActionsMenu] = useState(false);

  const handleReaction = (emoji) => {
    onReact(message.id, emoji);
    setShowReactions(false);
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(message.message);
    setShowActionsMenu(false);
  };

  const handleReply = () => {
    onReply(message);
    setShowActionsMenu(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      onDelete(message.id);
    }
    setShowActionsMenu(false);
  };

  const formatMessage = (text) => {
    // Convert URLs to links
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    
    return parts.map((part, index) => {
      if (urlRegex.test(part)) {
        return (
          <a 
            key={index} 
            href={part} 
            target="_blank" 
            rel="noopener noreferrer"
            className="message-link"
          >
            {part}
          </a>
        );
      }
      
      // Handle basic formatting
      return formatText(part, index);
    });
  };

  const formatText = (text, key) => {
    // Bold: **text**
    let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Italic: *text*
    formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
    // Code: `text`
    formatted = formatted.replace(/`(.*?)`/g, '<code>$1</code>');
    
    return (
      <span 
        key={key}
        dangerouslySetInnerHTML={{ __html: formatted }}
      />
    );
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getMessageClass = () => {
    let className = 'message';
    if (isOwn) className += ' message-own';
    if (message.type === 'system') className += ' message-system';
    if (isFirstInGroup) className += ' message-first';
    if (isLastInGroup) className += ' message-last';
    return className;
  };

  if (message.type === 'system') {
    return (
      <div className="message message-system">
        <div className="system-message-content">
          {message.message}
        </div>
      </div>
    );
  }

  return (
    <div className={getMessageClass()}>
      {/* User avatar (only for first message in group) */}
      {isFirstInGroup && !isOwn && (
        <div className="message-avatar">
          {message.username.charAt(0).toUpperCase()}
        </div>
      )}

      <div className="message-content">
        {/* Username and timestamp (only for first message in group) */}
        {isFirstInGroup && (
          <div className="message-header">
            <span className="message-username">{message.username}</span>
            <span className="message-timestamp">
              {formatTimestamp(message.timestamp)}
            </span>
          </div>
        )}

        {/* Message bubble */}
        <div className="message-bubble">
          <div className="message-text">
            {formatMessage(message.message)}
          </div>

          {/* Message reactions */}
          {message.reactions && Object.keys(message.reactions).length > 0 && (
            <div className="message-reactions">
              {Object.entries(message.reactions).map(([emoji, users]) => (
                <button
                  key={emoji}
                  className={`reaction ${users.includes(message.username) ? 'own-reaction' : ''}`}
                  onClick={() => handleReaction(emoji)}
                >
                  {emoji} {users.length}
                </button>
              ))}
            </div>
          )}

          {/* Quick reaction menu */}
          {showReactions && (
            <div className="reaction-picker">
              {['👍', '❤️', '😂', '😮', '😢', '😡'].map(emoji => (
                <button
                  key={emoji}
                  className="reaction-option"
                  onClick={() => handleReaction(emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Message actions */}
        <div className="message-actions">
          <button
            className="action-button reaction-button"
            onClick={() => setShowReactions(!showReactions)}
            title="Add reaction"
          >
            😀
          </button>

          <button
            className="action-button"
            onClick={() => setShowActionsMenu(!showActions)}
            title="More actions"
          >
            ⋯
          </button>

          {showActions && (
            <div className="actions-menu">
              <button onClick={handleCopyMessage}>📋 Copy</button>
              <button onClick={handleReply}>↩️ Reply</button>
              {showActions && (
                <button onClick={handleDelete} className="delete-action">
                  🗑️ Delete
                </button>
              )}
            </div>
          )}
        </div>

        {/* Message status (only for own messages) */}
        {isOwn && isLastInGroup && (
          <div className="message-status">
            <span className="status-indicator">✓</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default Message;
```

## 📄 MessageList Styles (client/src/components/MessageList.css)

```css
.message-list {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
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
  font-size: 64px;
  margin-bottom: 20px;
  opacity: 0.7;
}

.empty-messages h3 {
  margin: 0 0 8px 0;
  color: #495057;
  font-weight: 600;
}

.empty-messages p {
  margin: 0;
  opacity: 0.8;
}

.message-day-group {
  margin-bottom: 32px;
}

.date-separator {
  text-align: center;
  margin: 32px 0 24px 0;
  position: relative;
}

.date-separator::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #e9ecef;
}

.date-label {
  background: #f8f9fa;
  padding: 8px 16px;
  border-radius: 16px;
  font-size: 13px;
  font-weight: 500;
  color: #6c757d;
  position: relative;
  z-index: 1;
  border: 1px solid #e9ecef;
}

.typing-indicators {
  margin-top: 16px;
  margin-bottom: 8px;
}

.typing-message {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  max-width: 70%;
}

.typing-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #e9ecef;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
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
  0%, 80%, 100% { 
    transform: scale(0.8); 
    opacity: 0.5; 
  }
  40% { 
    transform: scale(1); 
    opacity: 1; 
  }
}

.typing-content {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 18px;
  padding: 12px 16px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.typing-text {
  font-size: 14px;
  color: #6c757d;
  font-style: italic;
}

/* Responsive */
@media (max-width: 768px) {
  .message-list {
    padding: 12px;
  }
  
  .message-day-group {
    margin-bottom: 24px;
  }
  
  .date-separator {
    margin: 24px 0 16px 0;
  }
}
```

## 📄 Message Styles (client/src/components/Message.css)

```css
.message {
  display: flex;
  margin-bottom: 4px;
  gap: 12px;
  position: relative;
}

.message.message-own {
  flex-direction: row-reverse;
}

.message.message-system {
  justify-content: center;
  margin: 16px 0;
}

.message.message-last {
  margin-bottom: 16px;
}

.message-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  flex-shrink: 0;
  margin-top: auto;
}

.message-content {
  flex: 1;
  max-width: 70%;
  position: relative;
}

.message-own .message-content {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.message-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
  font-size: 13px;
}

.message-own .message-header {
  flex-direction: row-reverse;
}

.message-username {
  font-weight: 600;
  color: #495057;
}

.message-timestamp {
  color: #6c757d;
  font-size: 12px;
}

.message-bubble {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 18px;
  padding: 12px 16px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  position: relative;
  word-wrap: break-word;
  hyphens: auto;
}

.message-own .message-bubble {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.system-message-content {
  background: #f8f9fa;
  color: #6c757d;
  padding: 8px 16px;
  border-radius: 16px;
  font-style: italic;
  font-size: 14px;
  border: 1px solid #e9ecef;
}

.message-text {
  line-height: 1.4;
  font-size: 15px;
}

.message-link {
  color: #007bff;
  text-decoration: underline;
}

.message-own .message-link {
  color: #b3d9ff;
}

.message-text code {
  background: rgba(0, 0, 0, 0.1);
  padding: 2px 4px;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
  font-size: 13px;
}

.message-own .message-text code {
  background: rgba(255, 255, 255, 0.2);
}

.message-reactions {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 8px;
}

.reaction {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 2px 6px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.reaction:hover {
  background: #e9ecef;
}

.reaction.own-reaction {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.reaction-picker {
  position: absolute;
  bottom: 100%;
  left: 0;
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  gap: 4px;
  z-index: 10;
}

.reaction-option {
  background: none;
  border: none;
  font-size: 18px;
  padding: 4px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.reaction-option:hover {
  background: #f8f9fa;
}

.message-actions {
  position: absolute;
  top: 0;
  right: -40px;
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s;
}

.message:hover .message-actions {
  opacity: 1;
}

.message-own .message-actions {
  right: auto;
  left: -40px;
}

.action-button {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.action-button:hover {
  background: #f8f9fa;
  transform: scale(1.05);
}

.actions-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 10;
  min-width: 120px;
}

.actions-menu button {
  width: 100%;
  background: none;
  border: none;
  padding: 8px 12px;
  text-align: left;
  cursor: pointer;
  border-radius: 4px;
  font-size: 13px;
  transition: background-color 0.2s;
}

.actions-menu button:hover {
  background: #f8f9fa;
}

.delete-action {
  color: #dc3545;
}

.delete-action:hover {
  background: #fff5f5;
}

.message-status {
  margin-top: 4px;
  text-align: right;
}

.status-indicator {
  font-size: 12px;
  color: #28a745;
}

.message-own .status-indicator {
  color: rgba(255, 255, 255, 0.7);
}

/* Responsive */
@media (max-width: 768px) {
  .message-content {
    max-width: 85%;
  }
  
  .message-actions {
    position: static;
    opacity: 1;
    margin-top: 8px;
    justify-content: center;
  }
  
  .message-own .message-actions {
    left: auto;
  }
  
  .reaction-picker {
    position: fixed;
    bottom: 20px;
    left: 20px;
    right: 20px;
    justify-content: center;
  }
  
  .actions-menu {
    position: fixed;
    bottom: 20px;
    left: 20px;
    right: 20px;
  }
}
```

## 📄 Update ChatRoom.js to Use MessageList

```javascript
// Add this import at the top of ChatRoom.js
import MessageList from './MessageList';

// Add state for message reactions
const [messageReactions, setMessageReactions] = useState({});

// Add handler functions
const handleReactToMessage = (messageId, emoji) => {
  // Send reaction to server
  if (socket) {
    socket.emit('messageReaction', {
      messageId,
      emoji,
      username
    });
  }
};

const handleReplyToMessage = (message) => {
  // Set reply context and focus input
  setReplyingTo(message);
  if (messageInputRef.current) {
    messageInputRef.current.focus();
  }
};

const handleDeleteMessage = (messageId) => {
  // Send delete request to server
  if (socket) {
    socket.emit('deleteMessage', { messageId });
  }
};

// Replace the messages panel content with:
<div className="messages-panel">
  <MessageList
    messages={messages}
    currentUsername={username}
    onReactToMessage={handleReactToMessage}
    onReplyToMessage={handleReplyToMessage}
    onDeleteMessage={handleDeleteMessage}
    typingUsers={typingUsers}
  />
</div>
```

## 🧪 Testing Instructions

### 1. Test Message Display

- Send messages with different types of content
- Test URL detection and link formatting
- Try basic markdown formatting (**bold**, *italic*, `code`)

### 2. Test Message Grouping

- Send multiple messages from same user quickly
- Send messages from different users
- Test date separators

### 3. Test Interactive Features

- Hover over messages to see action buttons
- Test reaction picker and reactions
- Test copy message functionality

### 4. Run Full Test

```bash
# Terminal 1: Start server
cd server
npm start

# Terminal 2: Start React app
cd client
npm start
```

## ✅ Expected Behavior

1. Messages grouped by user and time
2. Date separators for different days
3. Rich text formatting (bold, italic, code, links)
4. Message reactions with emoji picker
5. Message actions (copy, reply, delete)
6. Improved typing indicators with avatars
7. Message status indicators for own messages

## 🔍 Verification Checklist

- [ ] MessageList component renders correctly
- [ ] Message component displays with proper formatting
- [ ] Date separators appear between days
- [ ] URL links are clickable and formatted
- [ ] Message grouping works correctly
- [ ] Reaction picker appears on hover
- [ ] Message actions menu works
- [ ] Typing indicators display properly

## 🚀 Next Step

Proceed to Task 11: Message Input Component with Advanced Features
