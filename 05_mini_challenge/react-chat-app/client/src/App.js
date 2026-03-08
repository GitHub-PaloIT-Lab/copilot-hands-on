import React, { useState, useEffect, useCallback } from 'react';
import io from 'socket.io-client';
import './App.css';
import JoinForm from './components/JoinForm';
import ChatRoom from './components/ChatRoom';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:8000';

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
    const newSocket = io(SOCKET_URL, {
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
    });

    newSocket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      setConnectionError('Failed to connect to server. Please make sure the server is running.');
      setIsConnected(false);
    });

    // Chat event handlers
    newSocket.on('welcome', (data) => {
      console.log('Joined successfully:', data);
      setIsJoined(true);
      setIsJoining(false);
    });

    newSocket.on('error', (error) => {
      console.error('Socket error:', error);
      setIsJoining(false);
      alert(error.message || error);
    });

    newSocket.on('userList', (userList) => {
      setUsers(userList);
    });

    newSocket.on('message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    newSocket.on('messageHistory', (history) => {
      setMessages(history);
    });

    newSocket.on('typing_start', (data) => {
      setTypingUsers((prev) => {
        if (!prev.includes(data.username)) {
          return [...prev, data.username];
        }
        return prev;
      });
    });

    newSocket.on('typing_stop', (data) => {
      setTypingUsers((prev) => prev.filter((u) => u !== data.username));
    });

    // Cleanup on unmount
    return () => {
      newSocket.close();
    };
  }, []);

  // Join chat room
  const joinChat = useCallback(
    (enteredUsername) => {
      if (socket && enteredUsername.trim()) {
        setIsJoining(true);
        setUsername(enteredUsername.trim());
        socket.emit('join', { username: enteredUsername.trim() });
        socket.emit('requestHistory');
      }
    },
    [socket]
  );

  // Leave chat room
  const leaveChat = useCallback(() => {
    if (socket) {
      socket.disconnect();
    }
    setIsJoined(false);
    setUsername('');
    setMessages([]);
    setUsers([]);
    setTypingUsers([]);
    window.location.reload();
  }, [socket]);

  // Send message
  const sendMessage = useCallback(
    (messageText) => {
      if (socket && messageText.trim() && username) {
        socket.emit('message', {
          username: username,
          message: messageText.trim()
        });
      }
    },
    [socket, username]
  );

  // Typing indicators
  const startTyping = useCallback(() => {
    if (socket && username) {
      socket.emit('typing_start', { username });
    }
  }, [socket, username]);

  const stopTyping = useCallback(() => {
    if (socket && username) {
      socket.emit('typing_stop', { username });
    }
  }, [socket, username]);

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-content">
          <h1>💬 React Chat App</h1>
          <div className="connection-status">
            <span className={`status-dot ${isConnected ? 'connected' : 'disconnected'}`} />
            {isConnected ? 'Connected' : 'Disconnected'}
          </div>
        </div>
        {connectionError && <div className="connection-error">{connectionError}</div>}
      </header>

      <main className="App-main">
        {!isJoined ? (
          <JoinForm onJoin={joinChat} isConnected={isConnected} isJoining={isJoining} />
        ) : (
          <ChatRoom
            username={username}
            users={users}
            messages={messages}
            typingUsers={typingUsers}
            onSendMessage={sendMessage}
            onStartTyping={startTyping}
            onStopTyping={stopTyping}
            onLeaveChat={leaveChat}
          />
        )}
      </main>
    </div>
  );
}

export default App;
