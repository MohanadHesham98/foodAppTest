# =========================
# Stage 1: Build
# =========================
FROM node:20 AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy source code
COPY . .

# =========================
# Stage 2: Runtime
# =========================
FROM node:20

# Set working directory
WORKDIR /app

# Copy node_modules and app from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app ./

# Expose port
EXPOSE 5000

# Start server
CMD ["node", "server.js"]

