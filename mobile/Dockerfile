# Use Node 20 as base
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies for Expo and Native builds (if needed)
RUN apk add --no-cache bash

# Copy package files
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy project files
COPY . .

# Expo tunnel uses port 8081 usually, but tunnel makes it public
EXPOSE 8081

# Command to start expo with tunnel
# Note: You might need EXPO_TOKEN for non-interactive tunnel in CI
CMD ["npx", "expo", "start", "--tunnel"]
