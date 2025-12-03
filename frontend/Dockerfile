# Build stage
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy application source code and build
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files to Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Expose the default Nginx port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]