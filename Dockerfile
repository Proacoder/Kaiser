# Use Node.js LTS (v20) as the base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json* bun.lock* ./

# Install dependencies (preferring npm but allowing fallback if it was bun)
RUN npm install

# Copy all source files
COPY . .

# Build the frontend and backend bundle
RUN npm run build

# Expose port 8080 (Google Cloud Run default port)
ENV PORT=8080
EXPOSE 8080

# Start the application using the built server
CMD ["npm", "start"]
