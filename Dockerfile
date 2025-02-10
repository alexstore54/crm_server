# Stage 1: Build image
FROM node:20-alpine3.19 AS BUILD_IMAGE

# Set working directory for build stage
WORKDIR /usr/src/app

# Copy package.json and package-lock.json for dependency installation
COPY package.json package-lock.json ./

# Install all dependencies including dev dependencies
RUN npm install

# Copy the rest of the app files
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production image
FROM node:20-alpine3.19 AS PRODUCTION_IMAGE

# Set working directory for production image
WORKDIR /usr/src/app

# Copy only package.json and package-lock.json from build stage to production stage
COPY --from=BUILD_IMAGE /usr/src/app/package.json /usr/src/app/package-lock.json ./

# Copy only production dependencies from build stage
COPY --from=BUILD_IMAGE /usr/src/app/node_modules ./node_modules

# Copy the rest of the application code
COPY --from=BUILD_IMAGE /usr/src/app/dist ./dist

# Expose the app's port
EXPOSE 3000

# Run the application in production mode
CMD ["npm", "run", "start:prod"]
