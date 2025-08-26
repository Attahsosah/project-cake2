# 🚀 Railway Deployment Guide for PHP Backend

## 📋 **Prerequisites**
- GitHub account
- Railway account (free tier available)

## 🔧 **Step-by-Step Deployment**

### 1. **Prepare Your Repository**
Your backend is now ready with the necessary Railway configuration files:
- `railway.json` - Railway deployment settings
- `nixpacks.toml` - PHP and dependency configuration
- `.gitignore` - Excludes unnecessary files

### 2. **Deploy to Railway**

1. **Go to [Railway.app](https://railway.app)**
2. **Sign in with GitHub**
3. **Click "New Project"**
4. **Select "Deploy from GitHub repo"**
5. **Choose your repository**: `project-cake2`
6. **Configure deployment**:
   - **Root Directory**: `backend`
   - **Framework**: PHP
   - **Build Command**: `composer install --no-dev --optimize-autoloader`
   - **Start Command**: `php -S 0.0.0.0:$PORT index.php`

### 3. **Environment Variables**
Set these in Railway dashboard:
```
DATABASE_URL=sqlite:database.sqlite
JWT_SECRET=your-secret-key-here
```

### 4. **Database Setup**
- Railway will create a persistent volume for your SQLite database
- The database will be automatically initialized on first run

### 5. **Get Your API URL**
- Railway will provide a URL like: `https://your-app-name.railway.app`
- Use this as your `NEXT_PUBLIC_API_BASE_URL` in Vercel

## 🔗 **Connect to Frontend**

Once deployed, update your Vercel environment variables:
```
NEXT_PUBLIC_API_BASE_URL=https://your-app-name.railway.app
```

## 🐛 **Troubleshooting**

### Common Issues:
1. **Build fails**: Check PHP version compatibility
2. **Database errors**: Ensure SQLite extension is enabled
3. **CORS errors**: Check CORS configuration in `helpers/cors.php`
4. **JWT errors**: Verify JWT_SECRET environment variable

### Logs:
- Check Railway logs in the dashboard
- Monitor application health checks

## 📊 **Monitoring**
- Railway provides built-in monitoring
- Check logs for any errors
- Monitor resource usage

## 🔄 **Updates**
- Push changes to GitHub
- Railway will automatically redeploy
- No downtime during updates
