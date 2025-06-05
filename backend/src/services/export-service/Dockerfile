# Use official Node.js LTS image
FROM node:22

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the server listens on
EXPOSE 5006

# Set environment variables
ENV NODE_ENV=production

# Start the application
CMD ["node", "index.js"]
