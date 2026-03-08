# Firebase Storage CORS Configuration Script
Write-Host "🔧 Applying CORS to Firebase Storage..." -ForegroundColor Cyan

# Check if gsutil is installed
$gsutilPath = Get-Command gsutil -ErrorAction SilentlyContinue

if (-not $gsutilPath) {
    Write-Host "❌ gsutil not found!" -ForegroundColor Red
    Write-Host "📥 Installing Google Cloud SDK..." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please run this command manually:" -ForegroundColor Yellow
    Write-Host "(New-Object Net.WebClient).DownloadFile('https://dl.google.com/dl/cloudsdk/channels/rapid/GoogleCloudSDKInstaller.exe', '$env:Temp\GoogleCloudSDKInstaller.exe'); Start-Process -FilePath '$env:Temp\GoogleCloudSDKInstaller.exe' -Wait" -ForegroundColor White
    exit 1
}

Write-Host "✅ gsutil found" -ForegroundColor Green

# Apply CORS
Write-Host "📝 Applying CORS configuration..." -ForegroundColor Cyan
gsutil cors set cors.json gs://akramplatform-2c6be.firebasestorage.app

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ CORS applied successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🎉 Now try uploading files again!" -ForegroundColor Cyan
} else {
    Write-Host "❌ Failed to apply CORS" -ForegroundColor Red
    Write-Host "Please login first: gcloud auth login" -ForegroundColor Yellow
}
