import React, { useState, useEffect } from 'react';
import axios from 'axios';

// User Dashboard Component - Multiple Security and Best Practice Issues
const UserDashboard = () => {
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [newUser, setNewUser] = useState({
        username: '',
        email: '',
        password: '',
        role: 'user'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Hardcoded API URL - should use environment variables
    const API_BASE_URL = 'http://localhost:3000/api';

    // Insecure token storage - localStorage is vulnerable to XSS
    const getToken = () => localStorage.getItem('authToken');

    // No proper error handling for token retrieval
    const getCurrentUser = () => {
        const token = getToken();
        if (token) {
            // Decoding JWT on client side without verification - security issue
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                return payload;
            } catch (error) {
                console.log('Error decoding token:', error); // Exposing errors
                return null;
            }
        }
        return null;
    };

    // Insecure API calls without proper authentication headers
    const fetchUsers = async () => {
        try {
            setLoading(true);
            // No authentication token sent
            const response = await axios.get(`${API_BASE_URL}/users`);
            setUsers(response.data);
            console.log('Fetched users:', response.data); // Logging sensitive data
        } catch (error) {
            setError('Failed to fetch users: ' + error.message);
            console.error('API Error:', error); // Exposing full error details
        } finally {
            setLoading(false);
        }
    };

    // Insecure user creation
    const createUser = async () => {
        try {
            setLoading(true);
            
            // No input validation on frontend
            // No password strength requirements
            const response = await axios.post(`${API_BASE_URL}/register`, newUser);
            
            console.log('User created:', response.data); // Logging sensitive data
            alert('User created successfully!'); // Using alert instead of proper UI feedback
            
            // Reset form
            setNewUser({
                username: '',
                email: '',
                password: '',
                role: 'user'
            });
            
            fetchUsers(); // Refetch all users
        } catch (error) {
            setError('Failed to create user: ' + error.message);
            console.error('Creation error:', error);
        } finally {
            setLoading(false);
        }
    };

    // Insecure user deletion
    const deleteUser = async (userId) => {
        // No confirmation dialog
        // No authorization check
        try {
            await axios.delete(`${API_BASE_URL}/users/${userId}`);
            alert('User deleted!'); // Poor UX
            fetchUsers();
        } catch (error) {
            alert('Failed to delete user: ' + error.message);
        }
    };

    // Insecure user update
    const updateUser = async (userId, userData) => {
        try {
            // No input validation
            // No authorization check (users can modify other users)
            await axios.put(`${API_BASE_URL}/users/${userId}`, userData);
            fetchUsers();
        } catch (error) {
            console.error('Update error:', error);
        }
    };

    // Effect with missing dependencies and no cleanup
    useEffect(() => {
        setCurrentUser(getCurrentUser());
        fetchUsers();
        
        // Missing cleanup function
        // No error handling
    }, []); // Missing dependencies

    // Inline event handlers - performance issue
    const handleInputChange = (field, value) => {
        setNewUser(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // No input sanitization or validation
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // No form validation
        if (!newUser.username || !newUser.email || !newUser.password) {
            alert('Please fill all fields'); // Poor error handling
            return;
        }
        
        createUser();
    };

    // Component rendering with security issues
    return (
        <div style={{ padding: '20px' }}> {/* Inline styles instead of CSS classes */}
            <h1>User Management Dashboard</h1>
            
            {/* Displaying sensitive user information */}
            {currentUser && (
                <div style={{ backgroundColor: '#f0f0f0', padding: '10px', marginBottom: '20px' }}>
                    <h3>Current User Info:</h3>
                    <p>User ID: {currentUser.userId}</p>
                    <p>Role: {currentUser.role}</p>
                    {/* Potentially exposing JWT payload */}
                    <pre>{JSON.stringify(currentUser, null, 2)}</pre>
                </div>
            )}

            {/* Form with security issues */}
            <div style={{ marginBottom: '30px' }}>
                <h3>Create New User</h3>
                <form onSubmit={handleSubmit}>
                    <div>
                        <input
                            type="text"
                            placeholder="Username"
                            value={newUser.username}
                            onChange={(e) => handleInputChange('username', e.target.value)}
                            style={{ margin: '5px', padding: '8px' }}
                            // No input validation
                            // No XSS protection
                        />
                    </div>
                    <div>
                        <input
                            type="email"
                            placeholder="Email"
                            value={newUser.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            style={{ margin: '5px', padding: '8px' }}
                            // Basic email validation only
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            value={newUser.password}
                            onChange={(e) => handleInputChange('password', e.target.value)}
                            style={{ margin: '5px', padding: '8px' }}
                            // No password strength indicator
                            // No password requirements shown
                        />
                    </div>
                    <div>
                        <select
                            value={newUser.role}
                            onChange={(e) => handleInputChange('role', e.target.value)}
                            style={{ margin: '5px', padding: '8px' }}
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option> {/* Anyone can create admin users */}
                        </select>
                    </div>
                    <button 
                        type="submit" 
                        disabled={loading}
                        style={{ margin: '5px', padding: '8px 15px' }}
                    >
                        {loading ? 'Creating...' : 'Create User'}
                    </button>
                </form>
            </div>

            {/* Error display - potential information disclosure */}
            {error && (
                <div style={{ color: 'red', marginBottom: '20px' }}>
                    Error: {error} {/* Displaying full error messages */}
                </div>
            )}

            {/* Users list with security issues */}
            <div>
                <h3>All Users</h3>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f5f5f5' }}>
                                <th style={{ border: '1px solid #ddd', padding: '8px' }}>ID</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Username</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Email</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Password</th> {/* Displaying passwords */}
                                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Role</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px' }}>API Key</th> {/* Displaying API keys */}
                                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.id}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.username}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.email}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.password}</td> {/* Showing passwords */}
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.role}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.api_key}</td> {/* Showing API keys */}
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                        <button 
                                            onClick={() => deleteUser(user.id)}
                                            style={{ marginRight: '5px', backgroundColor: 'red', color: 'white', border: 'none', padding: '4px 8px' }}
                                        >
                                            Delete
                                        </button>
                                        <button 
                                            onClick={() => {
                                                // Inline function - performance issue
                                                const newUsername = prompt('Enter new username:'); // Using prompt
                                                if (newUsername) {
                                                    updateUser(user.id, { ...user, username: newUsername });
                                                }
                                            }}
                                            style={{ backgroundColor: 'blue', color: 'white', border: 'none', padding: '4px 8px' }}
                                        >
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Debug information - should not be in production */}
            <div style={{ marginTop: '30px', backgroundColor: '#ffffcc', padding: '10px' }}>
                <h4>Debug Info (Remove in production):</h4>
                <p>Current Token: {getToken()}</p> {/* Exposing token */}
                <p>API Base URL: {API_BASE_URL}</p>
                <p>Environment: {process.env.NODE_ENV}</p>
                <pre>{JSON.stringify({ users, currentUser, newUser }, null, 2)}</pre>
            </div>
        </div>
    );
};

export default UserDashboard;
