# syntax=docker/dockerfile:1

ARG NODE_VERSION=20.17.0

################################################################################
# Use node image for base image for all stages.
FROM node:${NODE_VERSION}-alpine AS base

# Set working directory for all build stages.
WORKDIR /usr/src/app

COPY package*.json ./

# Copy the rest of the source files into the image.
COPY . .

# Install all your dependencies.
RUN yarn

# Expose the port that the application listens on.
#EXPOSE 5000

# Run the application.
CMD ["yarn", "start:dev"]
