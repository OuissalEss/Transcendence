FROM alpine:latest

# Use the official Node.js 14 image as a base image
RUN apk update && apk add nodejs npm nginx openrc python3 make g++ --no-cache

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

RUN chmod +x ./frontend-entrypoint.sh

# RUN cp ./nginx/default.conf /etc/nginx/http.d/default.conf

# # Build the Vue 3 project
RUN npm run build

# RUN cp -rf dist /var/www/dist
EXPOSE 5173
# Start the Nest.js application
CMD ["sh", "./frontend-entrypoint.sh"]