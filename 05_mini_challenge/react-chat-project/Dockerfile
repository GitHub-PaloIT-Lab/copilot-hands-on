# Use Node.js 18 Alpine for smaller image size
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json files first for better caching
COPY package*.json ./
COPY frontend/package*.json ./frontend/
COPY backend/package*.json ./backend/

# Install dependencies
RUN npm install
RUN cd frontend && npm install --only=production
RUN cd backend && npm install --only=production

# Copy source code
COPY . .

# Build frontend for production
RUN cd frontend && npm run build

# Remove frontend node_modules to reduce image size
RUN rm -rf frontend/node_modules

# Set working directory to backend
WORKDIR /app/backend

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1

# Start the application
CMD ["npm", "start"]
