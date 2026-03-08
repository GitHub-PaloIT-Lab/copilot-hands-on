import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';

function App() {
  // State management
  const [socket, setSocket] = useState(null);
  const [username, setUsername] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [connectionError, setConnectionError] = useState('');
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io('http://localhost:8000', {
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
      setConnectionError('Failed to connect to server');
      setIsConnected(false);
    });

    // Chat event handlers
    newSocket.on('welcome', (data) => {
      console.log('Welcome:', data);
      setIsJoined(true);
    });

    newSocket.on('error', (error) => {
      console.error('Socket error:', error);
      alert('Error: ' + (error.message || error));
    });

    newSocket.on('userList', (userList) => {
      console.log('Updated user list:', userList);
      setUsers(userList);
    });

    newSocket.on('message', (message) => {
      console.log('Received message:', message);
      setMessages(prevMessages => [...prevMessages, message]);
    });

    newSocket.on('messageHistory', (history) => {
      console.log('Received message history:', history);
      setMessages(history);
    });

    newSocket.on('userJoined', (data) => {
      console.log('User joined:', data);
    });

    newSocket.on('userLeft', (data) => {
      console.log('User left:', data);
    });

    // Cleanup on unmount
    return () => {
      newSocket.close();
    };
  }, []);

  // Join chat room
  const joinChat = (enteredUsername) => {
    if (socket && enteredUsername.trim()) {
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

        {/* Connection status */}
        <div className="connection-status">
          {isConnected ? (
            <span className="connected">● Connected</span>
          ) : (
            <span className="disconnected">● Disconnected</span>
          )}
          {connectionError && (
            <div className="error">{connectionError}</div>
          )}
        </div>
      </header>

      <main className="App-main">
        {!isJoined ? (
          // Join form
          <div className="join-container">
            <h2>Join Chat</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const input = e.target.username;
              joinChat(input.value);
            }}>
              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                required
                minLength="2"
                disabled={!isConnected}
              />
              <button type="submit" disabled={!isConnected}>
                Join Chat
              </button>
            </form>
          </div>
        ) : (
          // Chat room
          <div className="chat-container">
            <div className="chat-header">
              <h2>Chat Room</h2>
              <div className="user-info">
                Welcome, <strong>{username}</strong>!
                <button onClick={leaveChat} className="leave-btn">
                  Leave Chat
                </button>
              </div>
            </div>

            <div className="chat-content">
              <div className="messages-container">
                <h3>Messages ({messages.length})</h3>
                <div className="messages-list">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`message ${msg.type || 'message'}`}>
                      <span className="username">{msg.username}:</span>
                      <span className="text" dangerouslySetInnerHTML={{ __html: msg.message }} />
                      <span className="timestamp">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="users-container">
                <h3>Online Users ({users.length})</h3>
                <div className="users-list">
                  {users.map((user) => (
                    <div key={user.id} className="user">
                      ● {user.username}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="message-input-container">
              <form onSubmit={(e) => {
                e.preventDefault();
                const input = e.target.message;
                sendMessage(input.value);
                input.value = '';
                stopTyping();
              }}>
                <input
                  type="text"
                  name="message"
                  placeholder="Type your message..."
                  onKeyDown={startTyping}
                  onBlur={stopTyping}
                  required
                />
                <button type="submit">Send</button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
