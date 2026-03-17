# Google Cloud Vision API Setup Guide

This guide will help you set up Google Cloud Vision API for handwriting recognition in prescription scanning.

## Why Google Cloud Vision?

- ✅ **Excellent Handwriting Recognition** - Specifically designed to read doctor's handwriting
- ✅ **Fast Processing** - 1-2 seconds per image
- ✅ **High Accuracy** - Up to 98% accuracy on clear images
- ✅ **Free Tier** - 1,000 requests/month free
- ✅ **Supports Multiple Languages** - Over 50 languages

## Setup Steps

### 1. Create Google Cloud Account

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Accept the terms of service

### 2. Create a New Project

1. Click on the project dropdown at the top
2. Click "New Project"
3. Name it "Campus Guide" or any name you prefer
4. Click "Create"

### 3. Enable Billing (Required for API Access)

1. Go to "Billing" in the left menu
2. Link a billing account (credit card required)
3. **Don't worry**: You get $300 free credits + 1,000 free OCR requests/month
4. You won't be charged unless you exceed the free tier

### 4. Enable Cloud Vision API

1. Go to "APIs & Services" > "Library"
2. Search for "Cloud Vision API"
3. Click on it
4. Click "Enable"
5. Wait for it to activate (takes a few seconds)

### 5. Create API Key

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy the API key (it looks like: `AIzaSyC...`)
4. Click "Restrict Key" (recommended)
5. Under "API restrictions", select "Restrict key"
6. Choose "Cloud Vision API" from the dropdown
7. Click "Save"

### 6. Deploy Supabase Edge Function

Open your terminal in the project directory:

```bash
# Navigate to campus-pharmacy-main directory
cd campus-pharmacy-main

# Make sure you're logged in to Supabase
npx supabase login

# Link your project (if not already linked)
npx supabase link --project-ref your-project-ref

# Deploy the OCR function
npx supabase functions deploy ocr-vision

# Set the Google Vision API key as a secret
npx supabase secrets set GOOGLE_VISION_API_KEY="YOUR_API_KEY_HERE"

# Verify the secret was set
npx supabase secrets list
```

**Replace `YOUR_API_KEY_HERE` with your actual Google Cloud Vision API key**

### 7. Test the Function

You can test it from the Supabase dashboard:

1. Go to your Supabase project
2. Navigate to "Edge Functions"
3. Click on "ocr-vision"
4. Click "Invoke Function"
5. Test with sample data

Or test from your app by uploading a prescription image!

## Troubleshooting

### "API key not configured" Error

Make sure you've set the secret:
```bash
npx supabase secrets set GOOGLE_VISION_API_KEY="your-key-here"
```

### "Billing not enabled" Error

1. Go to Google Cloud Console
2. Enable billing for your project
3. Make sure Cloud Vision API is enabled

### "Function not found" Error

Deploy the function again:
```bash
npx supabase functions deploy ocr-vision
```

### Check Function Logs

```bash
npx supabase functions logs ocr-vision
```

## Pricing

### Free Tier (Monthly)
- First 1,000 requests: **FREE**
- Ideal for: Testing, small apps, personal use

### Paid Tier (After Free Tier)
- $1.50 per 1,000 requests
- $15 per 10,000 requests
- $150 per 100,000 requests

**Example Usage Costs:**
- 100 prescriptions/day = 3,000/month = $3/month (after free 1,000)
- 1,000 prescriptions/day = 30,000/month = $43.50/month

## Alternative: Fallback to OCR.space

If you don't want to set up Google Cloud Vision yet, you can temporarily use OCR.space as a fallback:

1. Keep the existing OCR.space code commented in the component
2. Uncomment it when Google Vision setup is pending
3. OCR.space provides 25,000 free requests/month (but worse handwriting recognition)

## Security Best Practices

✅ **Do**: Use Supabase Edge Functions (API key stays on server)
✅ **Do**: Restrict Google API key to only Cloud Vision API
✅ **Do**: Set up usage alerts in Google Cloud Console

❌ **Don't**: Put API key directly in frontend code
❌ **Don't**: Share your API key publicly
❌ **Don't**: Commit API keys to Git

## Need Help?

If you run into issues:
1. Check the function logs: `npx supabase functions logs ocr-vision`
2. Verify your API key is correct in Google Cloud Console
3. Make sure billing is enabled
4. Ensure Cloud Vision API is enabled

---

## Quick Reference Commands

```bash
# Deploy function
npx supabase functions deploy ocr-vision

# Set API key
npx supabase secrets set GOOGLE_VISION_API_KEY="your-key"

# View logs
npx supabase functions logs ocr-vision

# List secrets
npx supabase secrets list

# Test locally
npx supabase functions serve ocr-vision
```

---

**Status**: Once set up, your prescription scanner will have industry-leading handwriting recognition! 🎉
