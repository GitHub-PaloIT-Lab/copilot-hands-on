# Phase 1, Task 1: Initialize Project Structure

## 🎯 Objective
Create the basic project structure with root configuration files.

## 📋 Task Description

```
Create the basic project structure with root configuration:

1. Create folder: react-chat-app/
2. Create root package.json with concurrently scripts
3. Create .gitignore file for Node.js and React
4. Create README.md with basic project description
5. Create server/ and client/ directories

Focus: Basic folder structure and root-level configuration only.
```

## 📁 Expected Project Structure After This Task

```
react-chat-app/
├── package.json        # Root package with concurrently scripts
├── README.md          # Basic project description
├── .gitignore         # Node.js and React ignore patterns
├── server/            # Backend directory (empty for now)
└── client/            # Frontend directory (empty for now)
```

## 📄 Root package.json Content

```json
{
  "name": "react-chat-app",
  "version": "1.0.0",
  "description": "Real-time chat application with React frontend and Node.js backend",
  "main": "server/server.js",
  "scripts": {
    "dev": "concurrently \"npm run server\" \"npm run client\"",
    "server": "cd server && npm run dev",
    "client": "cd client && npm start",
    "build": "cd client && npm run build",
    "install-all": "npm install && cd server && npm install && cd ../client && npm install",
    "start": "cd server && npm start"
  },
  "keywords": ["chat", "real-time", "react", "socket.io", "websocket"],
  "author": "Developer",
  "license": "MIT",
  "devDependencies": {
    "concurrently": "^8.2.0"
  }
}
```

## 📄 .gitignore Content

```
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Production builds
/client/build
/server/dist

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS files
.DS_Store
Thumbs.db

# Logs
logs
*.log

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# Temporary folders
tmp/
temp/
```

## 📄 Basic README.md Content

```markdown
# React Live Chat Application

A real-time chat application built with React.js frontend and Node.js backend.

## Features
- Real-time messaging
- Multiple users support
- Typing indicators
- Online users list
- Responsive design

## Tech Stack
- Frontend: React.js, Socket.io-client
- Backend: Node.js, Express.js, Socket.io
- Real-time: WebSockets

## Development
```bash
# Install all dependencies
npm run install-all

# Start development servers (both frontend and backend)
npm run dev

# Start only backend server
npm run server

# Start only frontend
npm run client
```

## Ports
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
```

## ✅ Acceptance Criteria

After completing this task, you should have:

- [ ] A `react-chat-app/` folder created
- [ ] Root `package.json` with concurrently scripts
- [ ] Proper `.gitignore` file
- [ ] Basic `README.md` with project info
- [ ] Empty `server/` directory
- [ ] Empty `client/` directory
- [ ] Ability to run `npm install` in the root directory

## 🔄 Next Task

After completing this task, proceed to:
**Phase 1, Task 2: Server Setup & Dependencies**
