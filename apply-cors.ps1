# Firebase Storage CORS Configuration Script
Write-Host "🔧 Firebase Storage CORS Setup" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

# Check if gsutil is installed
$gsutilPath = Get-Command gsutil -ErrorAction SilentlyContinue

if (-not $gsutilPath) {
    Write-Host "❌ Google Cloud SDK (gsutil) not installed!`n" -ForegroundColor Red
    Write-Host "📥 Installation Steps:`n" -ForegroundColor Yellow
    Write-Host "1. Download Google Cloud SDK:" -ForegroundColor White
    Write-Host "   https://cloud.google.com/sdk/docs/install`n" -ForegroundColor Cyan
    
    Write-Host "2. Or run this PowerShell command as Administrator:" -ForegroundColor White
    Write-Host '   (New-Object Net.WebClient).DownloadFile("https://dl.google.com/dl/cloudsdk/channels/rapid/GoogleCloudSDKInstaller.exe", "$env:Temp\CloudSDK.exe"); Start-Process "$env:Temp\CloudSDK.exe"' -ForegroundColor Cyan
    Write-Host ""
    
    Write-Host "3. After installation, restart PowerShell and run:" -ForegroundColor White
    Write-Host "   gcloud auth login" -ForegroundColor Cyan
    Write-Host "   gcloud config set project akramplatform-2c6be" -ForegroundColor Cyan
    Write-Host "   .\apply-cors.ps1`n" -ForegroundColor Cyan
    
    Write-Host "⚠️  Alternative: Apply CORS manually from Firebase Console:" -ForegroundColor Yellow
    Write-Host "   1. Go to: https://console.firebase.google.com/project/akramplatform-2c6be/storage" -ForegroundColor White
    Write-Host "   2. Click 'Rules' tab" -ForegroundColor White
    Write-Host "   3. Make sure rules allow access from your domain`n" -ForegroundColor White
    
    exit 1
}

Write-Host "✅ gsutil found at: $($gsutilPath.Source)`n" -ForegroundColor Green

# Check if user is authenticated
Write-Host "🔐 Checking authentication..." -ForegroundColor Cyan
gcloud auth list 2>&1 | Out-Null

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Not authenticated. Please login first:`n" -ForegroundColor Red
    Write-Host "   gcloud auth login`n" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Authenticated`n" -ForegroundColor Green

# Set project
Write-Host "📋 Setting project..." -ForegroundColor Cyan
gcloud config set project akramplatform-2c6be 2>&1 | Out-Null

# Apply CORS
Write-Host "📝 Applying CORS configuration to Firebase Storage..." -ForegroundColor Cyan
Write-Host "   Bucket: gs://akramplatform-2c6be.appspot.com`n" -ForegroundColor Gray

gsutil cors set cors.json gs://akramplatform-2c6be.appspot.com

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ CORS applied successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🎉 Now you can upload files to Firebase Storage!" -ForegroundColor Cyan
    Write-Host "   Try the employee onboarding form again.`n" -ForegroundColor White
} else {
    Write-Host "`n❌ Failed to apply CORS" -ForegroundColor Red
    Write-Host "Please check:" -ForegroundColor Yellow
    Write-Host "  - You have permissions on the project" -ForegroundColor White
    Write-Host "  - The bucket name is correct" -ForegroundColor White
    Write-Host "  - cors.json file exists in current directory`n" -ForegroundColor White
}
