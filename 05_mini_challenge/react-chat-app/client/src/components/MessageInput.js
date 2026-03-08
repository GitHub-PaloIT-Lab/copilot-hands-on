import React, { useState, useRef, useCallback } from 'react';
import './MessageInput.css';

function MessageInput({ onSendMessage, onStartTyping, onStopTyping }) {
  const [message, setMessage] = useState('');
  const typingTimeoutRef = useRef(null);
  const isTypingRef = useRef(false);

  const handleTyping = useCallback(() => {
    if (!isTypingRef.current) {
      isTypingRef.current = true;
      onStartTyping();
    }

    // Reset timeout on each keystroke
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      isTypingRef.current = false;
      onStopTyping();
    }, 1500);
  }, [onStartTyping, onStopTyping]);

  const handleChange = (e) => {
    setMessage(e.target.value);
    if (e.target.value.trim()) {
      handleTyping();
    } else {
      // Cleared input - stop typing immediately
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (isTypingRef.current) {
        isTypingRef.current = false;
        onStopTyping();
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      // Stop typing indicator before sending
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (isTypingRef.current) {
        isTypingRef.current = false;
        onStopTyping();
      }

      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="message-input-form">
      <div className="message-input-wrapper">
        <input
          type="text"
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a message... (Enter to send)"
          className="message-input"
          maxLength={500}
          autoComplete="off"
        />
        <button
          type="submit"
          disabled={!message.trim()}
          className="send-button"
          aria-label="Send message"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </div>
    </form>
  );
}

export default MessageInput;
