# Base image
FROM node:18

# Create app directory
WORKDIR /usr/src/app

COPY prisma ./prisma/

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

RUN chmod +x ./backend-entrypoint.sh

# Creates a "dist" folder with the production build
RUN npm run build


CMD ["sh", "./backend-entrypoint.sh"]