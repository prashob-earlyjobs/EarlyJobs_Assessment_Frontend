# Vercel Deployment Guide

## 🚀 How to Deploy to Vercel

### 1. **Prepare Your Project**

Make sure your project structure looks like this:
```
├── api/
│   └── assessment.js          # Vercel serverless function
├── src/
│   └── ...                    # Your React app
├── public/
│   └── ...                    # Static assets
├── vercel.json                # Vercel configuration
├── package.json
└── vite.config.ts
```

### 2. **Deployment Methods**

#### Option A: Deploy via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel

# Follow the prompts:
# - Link to existing project? No
# - Project name: your-project-name
# - Deploy? Yes
```

#### Option B: Deploy via GitHub
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your GitHub repository
5. Configure settings (usually auto-detected)
6. Click "Deploy"

### 3. **How It Works on Vercel**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Request  │    │ Vercel Function │    │  Static Files   │
│ /assessment/123 │───▶│ api/assessment  │───▶│   dist/         │
│                 │    │ Injects SEO     │    │                 │
│                 │◀───│ Meta Tags       │◀───│                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

#### Request Flow:
1. **Assessment URLs** (`/assessment/*`) → Serverless function
2. **Static files** (`/assets/*`, `/favicon.ico`) → CDN
3. **All other routes** → `index.html` (React Router handles routing)

### 4. **Vercel Configuration Explained**

**vercel.json:**
- `functions`: Defines serverless functions
- `routes`: URL routing rules (order matters!)
- `buildCommand`: How to build your project
- `outputDirectory`: Where built files are located

### 5. **Testing Your Deployment**

After deployment, test these URLs:
- `https://your-app.vercel.app/` → Regular React app
- `https://your-app.vercel.app/dashboard` → React routing
- `https://your-app.vercel.app/assessment/123` → SEO optimized page

**Check SEO:**
1. View page source on assessment pages
2. Look for: `<title>Assessment 123 - EarlyJobs</title>`
3. Test with [Facebook Debugger](https://developers.facebook.com/tools/debug/)

### 6. **Environment Variables (Optional)**

If you need environment variables:
```bash
# In Vercel dashboard or CLI
vercel env add VITE_API_URL
```

### 7. **Custom Domain (Optional)**

1. Go to Vercel dashboard → Your project → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

### 8. **Monitoring & Logs**

- **Functions**: Vercel dashboard → Your project → Functions
- **Analytics**: Built-in analytics in Vercel dashboard
- **Logs**: Real-time function logs in dashboard

## 🔧 Local Testing

To test the Vercel setup locally:
```bash
# Install Vercel CLI
npm i -g vercel

# Test locally
vercel dev

# This simulates the Vercel environment locally
```

## 🚨 Troubleshooting

### Build Fails
- Check `package.json` scripts
- Ensure all dependencies are listed
- Verify Node.js version compatibility

### Function Errors
- Check Vercel function logs
- Ensure `api/assessment.js` syntax is correct
- Verify file paths in the function

### SEO Not Working
- Check route order in `vercel.json`
- Verify function is being called
- Test with curl: `curl -H "Accept: text/html" https://your-app.vercel.app/assessment/123`

### React Router Issues
- Ensure all non-assessment routes go to `index.html`
- Check route precedence in `vercel.json`

## 📈 Performance Optimization

- **Caching**: Assessment pages cached for 1 year
- **CDN**: Static files served from global CDN
- **Cold Start**: Minimal for simple function
- **Bundle Size**: Regular Vite optimizations apply

## 🔄 Updates

To update your deployment:
```bash
# Via CLI
vercel

# Via Git (if connected)
git push origin main
```

Vercel will automatically rebuild and deploy! 🎉 