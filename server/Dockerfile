# Use official Node.js image as a base
FROM node:18-alpine AS base

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy application source code
COPY . .

# Expose the application port
EXPOSE 4000

# Start the server
CMD ["npm", "start"]