# syntax=docker/dockerfile:1

ARG NODE_VERSION=20.17.0

################################################################################
# Use node image for base image for all stages.
FROM node:${NODE_VERSION}-alpine as base

# Set working directory for all build stages.
WORKDIR /usr/src/app

COPY package*.json ./

# Copy the rest of the source files into the image.
COPY . .

# Install all your dependencies.
RUN npm install

# Expose the port that the application listens on.
EXPOSE 3000

# Run the application.
CMD ["npm", "run", "start:dev"]
