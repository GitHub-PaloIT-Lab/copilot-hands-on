import React, { useState, useEffect } from 'react';

// SECURITY ISSUE: No proper authentication check
const UserDashboard = () => {
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadUsers();
        loadCurrentUser();
    }, []);

    const loadUsers = async () => {
        try {
            // SECURITY ISSUE: No authorization token
            const response = await fetch('/api/users/all');
            const userData = await response.json();
            
            // SECURITY ISSUE: Console logging sensitive data
            console.log('All users data:', userData);
            
            setUsers(userData);
        } catch (error) {
            // BAD PRACTICE: No proper error handling
            console.error('Error:', error);
        }
    };

    const loadCurrentUser = () => {
        // SECURITY ISSUE: Using localStorage for sensitive data
        const token = localStorage.getItem('authToken');
        const user = localStorage.getItem('userData');
        
        if (user) {
            setCurrentUser(JSON.parse(user));
        }
    };

    const handleLogin = async (username, password) => {
        try {
            const response = await fetch('/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            
            const data = await response.json();
            
            if (data.token) {
                // SECURITY ISSUE: Storing sensitive data in localStorage
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('userData', JSON.stringify(data.user));
                
                setCurrentUser(data.user);
            }
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        
        // VULNERABILITY: XSS attack via innerHTML
        document.getElementById('search-results').innerHTML = `
            <h3>Search results for: ${event.target.value}</h3>
        `;
    };

    const deleteUser = async (userId) => {
        // BAD PRACTICE: No confirmation dialog
        try {
            const response = await fetch(`/api/users/${userId}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                loadUsers(); // Reload the list
            }
        } catch (error) {
            console.error('Delete error:', error);
        }
    };

    const resetPassword = async (username) => {
        // SECURITY ISSUE: Predictable new password
        const newPassword = 'password123';
        
        try {
            const response = await fetch('/api/users/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, newPassword })
            });
            
            const data = await response.json();
            alert(`Password reset to: ${newPassword}`); // SECURITY ISSUE: Exposing password
        } catch (error) {
            console.error('Reset error:', error);
        }
    };

    // BAD PRACTICE: Inline event handlers and direct DOM manipulation
    return (
        <div className="dashboard">
            <h1>User Dashboard</h1>
            
            {currentUser && (
                <div className="user-info">
                    <h2>Welcome, {currentUser.username}</h2>
                    {/* SECURITY ISSUE: Displaying sensitive information */}
                    <p>Password: {currentUser.password}</p>
                    <p>SSN: {currentUser.ssn}</p>
                    <p>Email: {currentUser.email}</p>
                </div>
            )}
            
            <div className="search-section">
                <input 
                    type="text" 
                    placeholder="Search users..."
                    onChange={handleSearch}
                    value={searchTerm}
                />
                <div id="search-results"></div>
            </div>
            
            <div className="users-list">
                <h3>All Users</h3>
                {users.map(user => (
                    <div key={user.id} className="user-card">
                        <h4>{user.username}</h4>
                        {/* SECURITY ISSUE: Exposing sensitive data */}
                        <p>Password: {user.password}</p>
                        <p>Email: {user.email}</p>
                        <p>SSN: {user.ssn}</p>
                        
                        {/* BAD PRACTICE: Inline event handlers */}
                        <button onClick={() => deleteUser(user.id)}>
                            Delete User
                        </button>
                        <button onClick={() => resetPassword(user.username)}>
                            Reset Password
                        </button>
                        
                        {/* VULNERABILITY: XSS via dangerouslySetInnerHTML */}
                        <div dangerouslySetInnerHTML={{
                            __html: `<p>Bio: ${user.bio || 'No bio available'}</p>`
                        }} />
                    </div>
                ))}
            </div>
            
            {/* SECURITY ISSUE: Dangerous admin functions exposed */}
            <div className="admin-section">
                <h3>Admin Functions</h3>
                <button 
                    onClick={() => {
                        // BAD PRACTICE: No confirmation for destructive action
                        fetch('/api/users/delete-all', { method: 'DELETE' })
                            .then(() => loadUsers());
                    }}
                >
                    Delete All Users
                </button>
            </div>
        </div>
    );
};

export default UserDashboard;
