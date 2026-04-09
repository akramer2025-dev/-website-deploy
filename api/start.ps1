# Social Media Analyzer API - PowerShell Launcher

Write-Host ""
Write-Host "=========================================================="
Write-Host "  Social Media Analyzer API - Quick Start"
Write-Host "=========================================================="
Write-Host ""

# Change to API directory
Set-Location $PSScriptRoot

# Check Node.js
Write-Host "[1/3] Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "OK Node.js installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR Node.js not found! Please install from https://nodejs.org/" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Check dependencies
Write-Host ""
Write-Host "[2/3] Checking dependencies..." -ForegroundColor Yellow
if (!(Test-Path "node_modules")) {
    Write-Host "Installing dependencies (this may take a few minutes)..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR npm install failed!" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
} else {
    Write-Host "OK Dependencies already installed" -ForegroundColor Green
}

# Create .env if not exists
if (!(Test-Path ".env")) {
    Write-Host ""
    Write-Host "Creating .env file..." -ForegroundColor Yellow
    Copy-Item .env.example .env
    Write-Host "OK Created .env file" -ForegroundColor Green
}

# Start server
Write-Host ""
Write-Host "[3/3] Starting server..." -ForegroundColor Yellow
Write-Host ""
Write-Host "=========================================================="
Write-Host "  Server will start on http://localhost:3000"
Write-Host "  Test at: http://localhost:3000/api/health"
Write-Host "  Press Ctrl+C to stop the server"
Write-Host "=========================================================="
Write-Host ""

# Find available port
$port = 3000
$portFound = $false
while (!$portFound -and $port -lt 3010) {
    try {
        $listener = New-Object System.Net.Sockets.TcpListener([System.Net.IPAddress]::Any, $port)
        $listener.Start()
        $listener.Stop()
        $portFound = $true
        Write-Host "OK Port $port is available" -ForegroundColor Green
    } catch {
        Write-Host "WARNING Port $port is in use, trying port $($port+1)..." -ForegroundColor Yellow
        $port++
    }
}

$env:PORT = $port
node server.js

Read-Host "Press Enter to exit"
