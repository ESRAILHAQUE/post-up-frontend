# 🚀 Auto Deployment Setup Guide

## GitHub Actions + Vercel Auto Deploy

### Step 1: Vercel Account Setup
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub account
3. Import your repository
4. Get your tokens from Vercel dashboard

### Step 2: GitHub Secrets Configuration
Go to your GitHub repository → Settings → Secrets and variables → Actions

Add these secrets:
- `VERCEL_TOKEN`: Your Vercel API token
- `VERCEL_ORG_ID`: Your Vercel organization ID  
- `VERCEL_PROJECT_ID`: Your Vercel project ID

### Step 3: Environment Variables in Vercel
In Vercel dashboard, add these environment variables:
- `NEXT_PUBLIC_API_URL`: Your backend API URL
- `NEXT_PUBLIC_FIREBASE_API_KEY`: Firebase config
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`: Firebase config
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`: Firebase config
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`: Firebase config
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`: Firebase config
- `NEXT_PUBLIC_FIREBASE_APP_ID`: Firebase config
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Stripe config

### Step 4: Auto Deploy Process
1. Push code to `main` branch
2. GitHub Actions automatically triggers
3. Builds the application
4. Deploys to Vercel
5. Your site is live!

### Commands to Get Vercel Tokens:
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Link project
vercel link

# Get project info
vercel project ls
```

### Deployment URLs:
- **Production**: https://your-project.vercel.app
- **Preview**: https://your-project-git-branch.vercel.app
