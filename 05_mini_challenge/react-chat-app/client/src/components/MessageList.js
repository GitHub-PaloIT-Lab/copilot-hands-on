import React, { useEffect, useRef } from 'react';
import Message from './Message';
import './MessageList.css';

function MessageList({ messages, currentUsername, typingUsers }) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingUsers]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div className="message-list">
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
                  : `${typingUsers[0]} and ${typingUsers.length - 1} others are typing...`}
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

  return (
    current.username !== previous.username ||
    new Date(current.timestamp) - new Date(previous.timestamp) > 300000
  );
}

function isLastInGroup(messages, index) {
  if (index === messages.length - 1) return true;

  const current = messages[index];
  const next = messages[index + 1];

  return (
    current.username !== next.username ||
    new Date(next.timestamp) - new Date(current.timestamp) > 300000
  );
}

export default MessageList;
