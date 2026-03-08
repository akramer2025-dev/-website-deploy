# Setup Firebase Storage after enabling it from Console
Write-Host "🔥 Deploying Firebase Storage Rules..." -ForegroundColor Cyan

# Deploy storage rules
firebase deploy --only storage

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Storage rules deployed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📝 Now applying CORS configuration..." -ForegroundColor Cyan
    
    # Check if gsutil is available
    $gsutil = Get-Command gsutil -ErrorAction SilentlyContinue
    
    if ($gsutil) {
        Write-Host "✅ gsutil found, applying CORS..." -ForegroundColor Green
        gsutil cors set cors.json gs://akramplatform-2c6be.appspot.com
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "`n🎉 All done! Firebase Storage is ready!" -ForegroundColor Green
        } else {
            Write-Host "`n⚠️  CORS setup failed. Please run manually:" -ForegroundColor Yellow
            Write-Host "   gsutil cors set cors.json gs://akramplatform-2c6be.appspot.com" -ForegroundColor White
        }
    } else {
        Write-Host "`n⚠️  gsutil not found." -ForegroundColor Yellow
        Write-Host "You can set CORS from Firebase Console → Storage → CORS" -ForegroundColor White
        Write-Host "Or install Google Cloud SDK and run:" -ForegroundColor White
        Write-Host "   gsutil cors set cors.json gs://akramplatform-2c6be.appspot.com`n" -ForegroundColor Cyan
    }
} else {
    Write-Host "`n❌ Failed to deploy storage rules" -ForegroundColor Red
    Write-Host "Make sure Firebase Storage is enabled in Console:" -ForegroundColor Yellow
    Write-Host "https://console.firebase.google.com/project/akramplatform-2c6be/storage`n" -ForegroundColor Cyan
}
