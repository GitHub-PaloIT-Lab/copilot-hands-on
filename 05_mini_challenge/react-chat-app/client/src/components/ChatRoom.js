import React from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import UserList from './UserList';
import TypingIndicator from './TypingIndicator';
import './ChatRoom.css';

function ChatRoom({
  username,
  users,
  messages,
  typingUsers,
  onSendMessage,
  onStartTyping,
  onStopTyping,
  onLeaveChat
}) {
  return (
    <div className="chat-room">
      {/* Sidebar: Online Users */}
      <aside className="chat-sidebar">
        <UserList users={users} currentUsername={username} />
      </aside>

      {/* Main chat area */}
      <div className="chat-main">
        {/* Chat header */}
        <div className="chat-header">
          <div className="chat-header-info">
            <h2>General Chat</h2>
            <span className="user-count">{users.length} online</span>
          </div>
          <div className="chat-header-actions">
            <span className="current-user">👤 {username}</span>
            <button onClick={onLeaveChat} className="leave-button">
              Leave Chat
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="chat-messages-wrapper">
          <MessageList messages={messages} currentUsername={username} />
          <TypingIndicator typingUsers={typingUsers} />
        </div>

        {/* Message Input */}
        <MessageInput
          onSendMessage={onSendMessage}
          onStartTyping={onStartTyping}
          onStopTyping={onStopTyping}
          username={username}
        />
      </div>
    </div>
  );
}

export default ChatRoom;
