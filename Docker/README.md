# Security Service Frontend - Docker Setup

This document provides instructions for running the Security Service Frontend in a Docker container.

## Prerequisites

- Docker
- Docker Compose
- Node.js (for local development without Docker)

## Development Setup

### Option A: Using Docker (Recommended)

1. Build and start the development container:
   ```bash
   cd security-service-frontend-dev/Docker
   docker compose up --build
   ```

2. Access the application at: http://localhost:5173

   The development server supports hot-reload, so your changes will be reflected automatically.

### Option B: Local Development (without Docker)

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Access the application at: http://localhost:5173

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Environment Variables

Create a `.env` file in the project root with the following variables:

```env
VITE_API_URL=http://localhost:3000  # Backend API URL
NODE_ENV=development
```

## Troubleshooting

- If you encounter file watching issues on Windows, ensure Docker has the necessary permissions to access your project directory.
- If the container fails to start, check the logs with `docker compose logs`
- For permission issues, try running Docker as administrator

## Production Build

To create a production build:

```bash
docker compose -f docker-compose.prod.yml up --build
```

This will create an optimized production build served by Nginx.
