import React, { useState } from 'react';
import './JoinForm.css';

function JoinForm({ onJoin, isConnected, isJoining }) {
  const [username, setUsername] = useState('');
  const [errors, setErrors] = useState([]);

  const validateUsername = (name) => {
    const validationErrors = [];

    if (!name.trim()) {
      validationErrors.push('Username is required');
    } else if (name.trim().length < 2) {
      validationErrors.push('Username must be at least 2 characters');
    } else if (name.trim().length > 20) {
      validationErrors.push('Username must be no more than 20 characters');
    }

    if (name.trim() && !/^[a-zA-Z0-9_-]+$/.test(name.trim())) {
      validationErrors.push('Username can only contain letters, numbers, underscores, and hyphens');
    }

    if (/^[_-]/.test(name.trim()) || /[_-]$/.test(name.trim())) {
      validationErrors.push('Username cannot start or end with underscore or hyphen');
    }

    return validationErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validateUsername(username);

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors([]);
    onJoin(username.trim());
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  return (
    <div className="join-form-container">
      <div className="join-form-card">
        <div className="join-form-header">
          <div className="join-form-icon">💬</div>
          <h2>Welcome to React Chat</h2>
          <p>Enter a username to join the conversation</p>
        </div>

        <form onSubmit={handleSubmit} className="join-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={handleUsernameChange}
              placeholder="Enter your username"
              disabled={!isConnected || isJoining}
              className={errors.length > 0 ? 'error' : ''}
              maxLength={20}
              autoComplete="off"
              autoFocus
            />

            {errors.length > 0 && (
              <div className="error-list">
                {errors.map((error, index) => (
                  <div key={index} className="error-message">
                    ⚠️ {error}
                  </div>
                ))}
              </div>
            )}

            <div className="username-help">
              <small>2-20 characters, letters, numbers, underscores, and hyphens only</small>
            </div>
          </div>

          <button
            type="submit"
            disabled={!isConnected || isJoining || !username.trim()}
            className="join-button"
          >
            {isJoining ? (
              <>
                <span className="loading-spinner" />
                Joining...
              </>
            ) : (
              'Join Chat'
            )}
          </button>

          {!isConnected && (
            <div className="connection-warning">⚠️ Connecting to server...</div>
          )}
        </form>

        <div className="join-form-footer">
          <div className="features-list">
            <h4>✨ Features:</h4>
            <ul>
              <li>✅ Real-time messaging</li>
              <li>✅ Online users list</li>
              <li>✅ Typing indicators</li>
              <li>✅ Join/Leave notifications</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JoinForm;
