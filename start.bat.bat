@echo off
echo Starting HCX Secure Transfer Application...

:: Start MongoDB
echo Starting MongoDB...
start mongod --dbpath ./data/db

:: Start Backend Server
echo Starting Backend Server...
cd server
call npm install
start npm start

:: Start Frontend Server
echo Starting Frontend Server...
cd ../client
call npm install
start npm run dev

echo Application is starting...
echo Frontend will be available at: http://localhost:5173
echo Backend will be available at: http://localhost:5000 