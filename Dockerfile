# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.14.0

################################################################################
# Use node image for base image for all stages.
FROM node:${NODE_VERSION}-alpine AS base

# Set working directory for all build stages.
WORKDIR /usr/src/app

RUN mkdir -p ./uploads

COPY package*.json ./

# Copy the rest of the source files into the image.
COPY . .

RUN chmod -R 777 ./uploads

# Install all your dependencies.
RUN yarn

# Run the application.
CMD ["yarn", "start:dev"]
