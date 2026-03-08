import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import JoinForm from './components/JoinForm';
import ChatRoom from './components/ChatRoom';
import './App.css';

const SERVER_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:8000';

function App() {
  const [socket, setSocket] = useState(null);
  const [username, setUsername] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [connectionError, setConnectionError] = useState('');
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io(SERVER_URL, {
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
      setIsJoining(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      setConnectionError('Failed to connect to server. Please make sure the server is running.');
      setIsConnected(false);
    });

    // Chat event handlers
    newSocket.on('welcome', (data) => {
      console.log('Welcome:', data);
      setIsJoined(true);
      setIsJoining(false);
    });

    newSocket.on('error', (error) => {
      console.error('Socket error:', error);
      setIsJoining(false);
      alert('Error: ' + error);
    });

    newSocket.on('userList', (userList) => {
      setUsers(userList);
    });

    newSocket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    newSocket.on('messageHistory', (history) => {
      setMessages(history);
    });

    // Typing indicators
    newSocket.on('typing_start', (data) => {
      setTypingUsers((prev) => {
        if (!prev.includes(data.username)) {
          return [...prev, data.username];
        }
        return prev;
      });
    });

    newSocket.on('typing_stop', (data) => {
      setTypingUsers((prev) => prev.filter((user) => user !== data.username));
    });

    // Cleanup on unmount
    return () => {
      newSocket.close();
    };
  }, []);

  // Join chat room
  const joinChat = (enteredUsername) => {
    if (socket && enteredUsername.trim()) {
      setIsJoining(true);
      setUsername(enteredUsername.trim());
      socket.emit('join', { username: enteredUsername.trim() });
      socket.emit('requestHistory');
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
      setTypingUsers([]);
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
        <h1>💬 React Live Chat</h1>
        <div className="connection-status">
          {isConnected ? (
            <span className="status-badge connected">🟢 Connected</span>
          ) : (
            <span className="status-badge disconnected">🔴 Disconnected</span>
          )}
        </div>
        {connectionError && (
          <div className="connection-error">{connectionError}</div>
        )}
      </header>

      <main className="App-main">
        {!isJoined ? (
          <JoinForm
            onJoin={joinChat}
            isConnected={isConnected}
            isJoining={isJoining}
          />
        ) : (
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
      </main>
    </div>
  );
}

export default App;
