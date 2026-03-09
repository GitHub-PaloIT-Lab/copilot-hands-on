import React from 'react';
import './Message.css';

function Message({ message, isOwn, isFirstInGroup, isLastInGroup }) {
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
      return <span key={index}>{part}</span>;
    });
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
        <div className="system-message-content">{message.message}</div>
      </div>
    );
  }

  return (
    <div className={getMessageClass()}>
      {/* User avatar (only for first message in group, non-own messages) */}
      {isFirstInGroup && !isOwn ? (
        <div className="message-avatar">
          {message.username.charAt(0).toUpperCase()}
        </div>
      ) : (
        !isOwn && <div className="message-avatar-placeholder" />
      )}

      <div className="message-content">
        {/* Username and timestamp (only for first message in group) */}
        {isFirstInGroup && (
          <div className="message-header">
            {!isOwn && (
              <span className="message-username">{message.username}</span>
            )}
            <span className="message-timestamp">
              {formatTimestamp(message.timestamp)}
            </span>
          </div>
        )}

        {/* Message bubble */}
        <div className="message-bubble">
          <div className="message-text">{formatMessage(message.message)}</div>
        </div>
      </div>
    </div>
  );
}

export default Message;
