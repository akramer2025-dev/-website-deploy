@echo off
echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║  🤖 Social Media Analyzer API - Quick Start             ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

cd /d "%~dp0"

echo [1/3] Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js not found! Please install from https://nodejs.org/
    pause
    exit /b 1
)
echo ✅ Node.js installed

echo.
echo [2/3] Checking dependencies...
if not exist "node_modules\" (
    echo 📦 Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo ❌ npm install failed!
        pause
        exit /b 1
    )
) else (
    echo ✅ Dependencies already installed
)

echo.
echo [3/3] Starting server...
if not exist ".env" (
    echo 📝 Creating .env file...
    copy .env.example .env >nul
)

echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║  🚀 Server will start on http://localhost:3000          ║
echo ║  📊 Test at: http://localhost:3000/api/health           ║
echo ║  💡 Press Ctrl+C to stop the server                     ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

node server.js

pause
