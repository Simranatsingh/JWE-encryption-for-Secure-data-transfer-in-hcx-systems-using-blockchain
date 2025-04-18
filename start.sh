#!/bin/bash

# Start MongoDB (if not running)
echo "Starting MongoDB..."
mongod --dbpath ./data/db &

# Start backend server
echo "Starting backend server..."
cd server
npm install
npm run dev &

# Start frontend server
echo "Starting frontend server..."
cd ../client
npm install
npm run dev 