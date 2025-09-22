FROM node:18-bullseye

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install system deps and production node modules
RUN apt-get update -y \
    && apt-get install -y --no-install-recommends openssl ca-certificates \
    && rm -rf /var/lib/apt/lists/* \
    && npm ci --only=production

# Copy source code
COPY . .

# Generate Prisma client (force clean engines cache)
RUN rm -rf node_modules/.prisma && npx prisma generate

# Build the application
RUN npm run build

# Create uploads directory
RUN mkdir -p uploads

# Expose port
EXPOSE 3001

# Start the application
CMD ["npm", "start"]
