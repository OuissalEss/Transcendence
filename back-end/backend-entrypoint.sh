#!/bin/bash
npx prisma db push

# Start the server using the production build
node dist/main.js