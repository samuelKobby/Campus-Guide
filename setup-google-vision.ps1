# Google Cloud Vision API Setup Script for Campus Guide (Windows)
# This script helps you deploy the OCR function and set up the API key

Write-Host "🚀 Campus Guide - Google Cloud Vision API Setup" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Check if Supabase CLI is installed
try {
    $null = Get-Command supabase -ErrorAction Stop
    Write-Host "✅ Supabase CLI found" -ForegroundColor Green
} catch {
    Write-Host "❌ Supabase CLI is not installed." -ForegroundColor Red
    Write-Host "📦 Install it with: npm install -g supabase" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Check if user is logged in
Write-Host "🔐 Checking Supabase authentication..." -ForegroundColor Cyan
try {
    $null = supabase projects list 2>&1
    Write-Host "✅ Authenticated with Supabase" -ForegroundColor Green
} catch {
    Write-Host "❌ Not logged in to Supabase" -ForegroundColor Red
    Write-Host "🔑 Please login with: supabase login" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Ask for Google Cloud Vision API Key
Write-Host "📋 Please enter your Google Cloud Vision API key:" -ForegroundColor Cyan
Write-Host "   (Get it from: https://console.cloud.google.com/apis/credentials)" -ForegroundColor Gray
$apiKey = Read-Host "API Key"

if ([string]::IsNullOrWhiteSpace($apiKey)) {
    Write-Host "❌ API key cannot be empty" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📦 Deploying OCR Vision function..." -ForegroundColor Cyan

# Navigate to campus-pharmacy-main directory
Set-Location -Path "campus-pharmacy-main"

# Deploy the function
$deployResult = supabase functions deploy ocr-vision 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to deploy function" -ForegroundColor Red
    Write-Host $deployResult -ForegroundColor Red
    exit 1
}

Write-Host "✅ Function deployed successfully" -ForegroundColor Green
Write-Host ""

Write-Host "🔒 Setting API key as secret..." -ForegroundColor Cyan
$secretResult = supabase secrets set "GOOGLE_VISION_API_KEY=$apiKey" 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to set secret" -ForegroundColor Red
    Write-Host $secretResult -ForegroundColor Red
    exit 1
}

Write-Host "✅ API key configured" -ForegroundColor Green
Write-Host ""

Write-Host "🎉 Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Cyan
Write-Host "   1. Test by uploading a prescription in your app"
Write-Host "   2. Check logs with: supabase functions logs ocr-vision"
Write-Host "   3. Monitor usage in Google Cloud Console"
Write-Host ""
Write-Host "💡 Tips:" -ForegroundColor Yellow
Write-Host "   - Free tier: 1,000 requests/month"
Write-Host "   - After free tier: `$1.50 per 1,000 requests"
Write-Host "   - Set up billing alerts in Google Cloud Console"
Write-Host ""
Write-Host "Happy scanning! 🏥📄✨" -ForegroundColor Green
