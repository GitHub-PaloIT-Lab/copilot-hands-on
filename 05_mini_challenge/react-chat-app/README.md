# React Live Chat Application

A real-time chat application built with React.js frontend and Node.js backend.

## Features
- Real-time messaging
- Multiple users support
- Typing indicators
- Online users list
- Join/Leave notifications
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

## Project Structure

```
react-chat-app/
├── package.json          # Root package with concurrently scripts
├── README.md
├── .gitignore
├── server/               # Backend Node.js server
│   ├── package.json
│   ├── .env
│   └── server.js         # Express + Socket.io server
└── client/               # Frontend React app
    ├── package.json
    ├── public/
    │   └── index.html
    └── src/
        ├── index.js
        ├── index.css
        ├── App.js
        ├── App.css
        └── components/
            ├── JoinForm.js
            ├── JoinForm.css
            ├── ChatRoom.js
            ├── ChatRoom.css
            ├── MessageList.js
            ├── MessageList.css
            ├── Message.js
            └── Message.css
```
