import React, { useEffect, useRef } from 'react';
import './MessageList.css';

function Message({ message, currentUsername }) {
  const isOwn = message.username === currentUsername;
  const isSystem = message.type === 'system';

  if (isSystem) {
    return (
      <div className="message-system">
        <span>{message.message}</span>
      </div>
    );
  }

  return (
    <div className={`message-wrapper ${isOwn ? 'own' : 'other'}`}>
      {!isOwn && <div className="message-avatar">{message.username.charAt(0).toUpperCase()}</div>}
      <div className="message-bubble-group">
        {!isOwn && <div className="message-username">{message.username}</div>}
        <div className={`message-bubble ${isOwn ? 'own' : 'other'}`}>
          <span className="message-text">{message.message}</span>
          <span className="message-time">
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        </div>
      </div>
    </div>
  );
}

function MessageList({ messages, currentUsername }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="message-list empty">
        <div className="empty-state">
          <div className="empty-icon">💬</div>
          <p>No messages yet. Say hello!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="message-list">
      {messages.map((message) => (
        <Message
          key={message.id || `${message.timestamp}-${message.username}`}
          message={message}
          currentUsername={currentUsername}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}

export default MessageList;
