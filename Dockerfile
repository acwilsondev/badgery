# Build stage
FROM node:20-slim AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# Production stage
FROM node:20-slim AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 remixuser && \
    chown -R remixuser:nodejs /app

# Add curl for healthcheck
RUN apt-get update && \
    apt-get install -y --no-install-recommends curl && \
    rm -rf /var/lib/apt/lists/*

# Copy only necessary files from builder
COPY --from=builder --chown=remixuser:nodejs /app/build ./build
COPY --from=builder --chown=remixuser:nodejs /app/public ./public
COPY --from=builder --chown=remixuser:nodejs /app/package*.json ./

# Install production dependencies o