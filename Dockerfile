# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.14.0

################################################################################
# Use node image for base image for all stages.
FROM node:${NODE_VERSION}-alpine AS builder

# Set working directory for all build stages.
WORKDIR /app

COPY package.json yarn.lock ./

# Install all your dependencies.
RUN yarn install --production --frozen-lockfile

# Copy the rest of the source files into the image.
COPY . .

# Build the application.
RUN yarn build

FROM node:${NODE_VERSION}-alpine

# Set working directory for all build stages.
WORKDIR /app

# Copy the rest of the source files into the image.
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
EXPOSE 8080

# Run the application.
CMD ["yarn", "start:prod"]
