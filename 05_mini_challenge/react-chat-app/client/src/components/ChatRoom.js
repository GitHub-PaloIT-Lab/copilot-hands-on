import React, { useState, useRef, useEffect } from 'react';
import MessageList from './MessageList';
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
  const messageInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Focus message input on mount
  useEffect(() => {
    if (messageInputRef.current) {
      messageInputRef.current.focus();
    }
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (messageInput.trim()) {
      onSendMessage(messageInput.trim());
      setMessageInput('');

      // Stop typing indicator immediately after sending
      if (isTyping) {
        onStopTyping();
        setIsTyping(false);
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
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
    if (!isTyping && e.target.value.trim() !== '') {
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
    }, 1500);
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
            <span className="username-display">{username}</span>
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
          <MessageList
            messages={messages}
            currentUsername={username}
            typingUsers={typingUsers}
          />
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
                className={`user-item ${user.username === username ? 'current-user-item' : ''}`}
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
                <div className="user-status-dot"></div>
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
              Press Enter to send
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChatRoom;
