import React from 'react';
import './UserList.css';

function UserList({ users, currentUsername }) {
  return (
    <div className="user-list">
      <div className="user-list-header">
        <h3>Online Users</h3>
        <span className="user-count-badge">{users.length}</span>
      </div>
      <div className="user-list-items">
        {users.length === 0 ? (
          <div className="user-list-empty">No users online</div>
        ) : (
          users.map((user) => (
            <div
              key={user.id}
              className={`user-item ${user.username === currentUsername ? 'current' : ''}`}
            >
              <div className="user-avatar">{user.username.charAt(0).toUpperCase()}</div>
              <div className="user-info">
                <span className="user-name">
                  {user.username}
                  {user.username === currentUsername && (
                    <span className="you-badge"> (You)</span>
                  )}
                </span>
              </div>
              <div className="online-dot" title="Online" />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default UserList;
