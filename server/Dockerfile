# Use Node.js 20 as base image
FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy server source code
COPY . .

# Expose port
EXPOSE 5000

# Start command
CMD ["node", "server.js"]
