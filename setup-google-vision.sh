#!/bin/bash

# Google Cloud Vision API Setup Script for Campus Guide
# This script helps you deploy the OCR function and set up the API key

echo "🚀 Campus Guide - Google Cloud Vision API Setup"
echo "================================================"
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null
then
    echo "❌ Supabase CLI is not installed."
    echo "📦 Install it with: npm install -g supabase"
    exit 1
fi

echo "✅ Supabase CLI found"
echo ""

# Check if user is logged in
echo "🔐 Checking Supabase authentication..."
if ! supabase projects list &> /dev/null
then
    echo "❌ Not logged in to Supabase"
    echo "🔑 Please login with: supabase login"
    exit 1
fi

echo "✅ Authenticated with Supabase"
echo ""

# Ask for Google Cloud Vision API Key
echo "📋 Please enter your Google Cloud Vision API key:"
echo "   (Get it from: https://console.cloud.google.com/apis/credentials)"
read -p "API Key: " api_key

if [ -z "$api_key" ]; then
    echo "❌ API key cannot be empty"
    exit 1
fi

echo ""
echo "📦 Deploying OCR Vision function..."
cd campus-pharmacy-main
supabase functions deploy ocr-vision

if [ $? -ne 0 ]; then
    echo "❌ Failed to deploy function"
    exit 1
fi

echo "✅ Function deployed successfully"
echo ""

echo "🔒 Setting API key as secret..."
supabase secrets set GOOGLE_VISION_API_KEY="$api_key"

if [ $? -ne 0 ]; then
    echo "❌ Failed to set secret"
    exit 1
fi

echo "✅ API key configured"
echo ""

echo "🎉 Setup Complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Test by uploading a prescription in your app"
echo "   2. Check logs with: supabase functions logs ocr-vision"
echo "   3. Monitor usage in Google Cloud Console"
echo ""
echo "💡 Tips:"
echo "   - Free tier: 1,000 requests/month"
echo "   - After free tier: $1.50 per 1,000 requests"
echo "   - Set up billing alerts in Google Cloud Console"
echo ""
echo "Happy scanning! 🏥📄✨"
