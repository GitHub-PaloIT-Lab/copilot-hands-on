// Frontend code with security and performance issues
import React, { useState, useEffect } from 'react';

// Poor Practice: Storing sensitive data in localStorage
const UserDashboard = () => {
  const [users, setUsers] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [userInput, setUserInput] = useState('');

  // Security Issue: No input sanitization
  const handleSearch = () => {
    // XSS vulnerability - directly rendering user input
    document.getElementById('searchResults').innerHTML = `<h3>Results for: ${userInput}</h3>`;
  };

  // Poor Practice: No error handling, exposing API endpoints
  useEffect(() => {
    fetch('http://localhost:3000/users', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => response.json())
    .then(data => {
      setUsers(data);
      // Security Issue: Logging sensitive data
      console.log('User data:', data);
    });
  }, [token]);

  // Poor Practice: Inline event handlers, no validation
  const deleteUser = (userId) => {
    // No confirmation dialog
    fetch(`http://localhost:3000/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(() => {
      // Poor Practice: Direct DOM manipulation in React
      location.reload();
    });
  };

  return (
    <div>
      <h1>User Dashboard</h1>
      
      {/* Security Issue: No CSRF protection */}
      <form onSubmit={(e) => {
        e.preventDefault();
        handleSearch();
      }}>
        <input 
          type="text" 
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Search users..."
        />
        <button type="submit">Search</button>
      </form>
      
      <div id="searchResults"></div>
      
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Password</th> {/* Security Issue: Displaying passwords */}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.password}</td> {/* Security Issue: Showing passwords */}
              <td>
                {/* Poor Practice: Inline functions in render */}
                <button onClick={() => deleteUser(user.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserDashboard;
