# Phase 1, Task 3: React Client Setup

## 🎯 Objective
Set up the React frontend application with basic structure and Socket.io client dependency.

## 📋 Task Description

```
Set up the React frontend:

1. Create client/package.json with React dependencies
2. Create client/public/index.html
3. Create client/src/index.js and index.css (basic setup)
4. Create basic App.js with simple "Chat App" header
5. Create App.css with basic styling
6. Test React app starts on port 3000

Focus: Basic React app that renders without any chat functionality.
```

## 📄 Client package.json

```json
{
  "name": "chat-client",
  "version": "1.0.0",
  "description": "React chat client",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "socket.io-client": "^4.7.2"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "devDependencies": {
    "react-scripts": "^5.0.1"
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
```

## 📄 public/index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="Real-time chat application" />
    <title>React Live Chat</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
```

## 📄 src/index.js

```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

## 📄 src/index.css

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f5f5f5;
}

#root {
  height: 100vh;
  display: flex;
  flex-direction: column;
}
```

## 📄 src/App.js

```javascript
import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>💬 React Live Chat</h1>
        <p>Real-time chat application</p>
      </header>
      
      <main className="App-main">
        <div className="coming-soon">
          <h2>🚧 Under Construction</h2>
          <p>Chat functionality coming soon...</p>
        </div>
      </main>
    </div>
  );
}

export default App;
```

## 📄 src/App.css

```css
.App {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.App-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 2rem;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.App-header h1 {
  margin: 0;
  font-size: 2rem;
  font-weight: 600;
}

.App-header p {
  margin: 0.5rem 0 0 0;
  opacity: 0.9;
  font-size: 1rem;
}

.App-main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.coming-soon {
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
}

.coming-soon h2 {
  color: #333;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.coming-soon p {
  color: #666;
  font-size: 1rem;
}

/* Responsive design */
@media (max-width: 768px) {
  .App-header {
    padding: 1rem;
  }
  
  .App-header h1 {
    font-size: 1.5rem;
  }
  
  .App-main {
    padding: 1rem;
  }
}
```

## 🧪 Testing Instructions

After implementing this task:

1. **Install dependencies:**
   ```bash
   cd client
   npm install
   ```

2. **Start the React app:**
   ```bash
   npm start
   ```

3. **Test the application:**
   - App should open at `http://localhost:3000`
   - Should see "React Live Chat" header
   - Should see "Under Construction" message
   - Should be responsive on mobile

## ✅ Acceptance Criteria

After completing this task, you should have:

- [ ] `client/package.json` with React and Socket.io-client dependencies
- [ ] `client/public/index.html` with proper HTML structure
- [ ] `client/src/index.js` with React entry point
- [ ] `client/src/index.css` with global styles
- [ ] `client/src/App.js` with basic app component
- [ ] `client/src/App.css` with app styling
- [ ] React app starts successfully on port 3000
- [ ] Responsive design works on mobile and desktop

## 📁 Expected Project Structure

```
react-chat-app/
├── package.json
├── README.md
├── .gitignore
├── server/
│   ├── package.json
│   ├── .env
│   └── server.js
└── client/
    ├── package.json     # ✅ Created
    ├── public/
    │   └── index.html   # ✅ Created
    └── src/
        ├── index.js     # ✅ Created
        ├── index.css    # ✅ Created
        ├── App.js       # ✅ Created
        └── App.css      # ✅ Created
```

## 🔄 Next Task

After completing this task, proceed to:
**Phase 2, Task 1: Socket.io Server Implementation**
