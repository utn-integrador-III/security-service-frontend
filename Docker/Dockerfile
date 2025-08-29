# Development stage with hot reload
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies first (for better caching)
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Expose port 5173 for Vite dev server
EXPOSE 5173

# Set environment variables
ENV NODE_OPTIONS=--openssl-legacy-provider
ENV CHOKIDAR_USEPOLLING=true

# Start development server using npm script defined in package.json
CMD ["npm", "run", "dev", "--", "--host"]
