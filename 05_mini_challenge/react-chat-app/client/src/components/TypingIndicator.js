import React from 'react';
import './TypingIndicator.css';

function TypingIndicator({ typingUsers }) {
  if (!typingUsers || typingUsers.length === 0) {
    return <div className="typing-indicator-placeholder" />;
  }

  const getText = () => {
    if (typingUsers.length === 1) {
      return `${typingUsers[0]} is typing`;
    } else if (typingUsers.length === 2) {
      return `${typingUsers[0]} and ${typingUsers[1]} are typing`;
    } else {
      return `${typingUsers.length} people are typing`;
    }
  };

  return (
    <div className="typing-indicator">
      <div className="typing-dots">
        <span />
        <span />
        <span />
      </div>
      <span className="typing-text">{getText()}</span>
    </div>
  );
}

export default TypingIndicator;
