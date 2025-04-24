# Multi-stage build for optimization

# Stage 1: Dependencies and build stage
FROM node:22-bullseye AS deps

# Install build dependencies for canvas (using Debian packages instead of Alpine)
RUN apt-get update && apt-get install -y \
    build-essential \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    python3 \
    && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm i

# Stage 2: Build the application
FROM node:22-bullseye AS builder
WORKDIR /app

# Copy node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules
# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Stage 3: Production runtime
FROM node:22-bullseye-slim AS runner
WORKDIR /app

# Install runtime dependencies for canvas
RUN apt-get update && apt-get install -y \
    libcairo2 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libjpeg62-turbo \
    libgif7 \
    librsvg2-2 \
    && rm -rf /var/lib/apt/lists/*

# Set to production environment
ENV NODE_ENV production

# Create a non-root user for security
RUN groupadd --system --gid 1001 nodejs \
    && useradd --system --uid 1001 --gid nodejs nextjs

# Copy necessary files and set correct permissions
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Set the correct user
USER nextjs

# Expose the port the app runs on
EXPOSE 3000

# Set the hostname to listen on all interfaces
ENV HOSTNAME "0.0.0.0"
# Pass environment variables
ENV BETTER_AUTH_SECRET=${BETTER_AUTH_SECRET}
ENV DATABASE_URL=${DATABASE_URL}
# Start the application
CMD ["node", "server.js"]
