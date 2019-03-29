# Specify a base image
FROM node:alpine

# Set working folder (automatically create if doesn't exist)
WORKDIR /usr/app

# Install some dependencies

# First we copy only package.json which is what npm install needs
COPY ./package.json .
RUN npm install

# Copy the rest of the application. That way, the cache is not invalidated
# whenever we change any file on the project, and npm install doesn't need
# do run again
COPY . .

# Default command
CMD ["npm", "start"]