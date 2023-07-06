# Use an official Node.js runtime as the base image
FROM node:14

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Copy the code to the working directory
COPY tableAPI.js index.js

# Install the dependencies
RUN npm install

# Copy the code to the working directory
COPY . .

# Copy the .env file to the working directory
COPY .env .env

# Expose the port on which the application will run
EXPOSE 3000

# Start the application with the dotenv package to load environment variables from .env file
CMD [ "node", "-r", "dotenv/config", "index.js" ]
