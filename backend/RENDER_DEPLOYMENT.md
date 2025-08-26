# 🚀 Render.com Deployment Guide

## 📋 **Prerequisites**
- GitHub account
- Render.com account (free tier available)

## 🔧 **Step-by-Step Deployment**

### 1. **Prepare Your Repository**
Your backend is now ready with Render configuration:
- `render.yaml` - Render deployment settings
- `render-healthcheck.php` - Render-specific healthcheck
- Updated `index.php` - Healthcheck endpoint

### 2. **Deploy to Render**

1. **Go to [Render.com](https://render.com)**
2. **Sign up/Login with GitHub**
3. **Click "New +" → "Web Service"**
4. **Connect your GitHub repository**: `project-cake2`
5. **Configure the service**:
   - **Name**: `cake-backend-api`
   - **Root Directory**: `backend`
   - **Environment**: `PHP`
   - **Build Command**: `composer install --no-dev --optimize-autoloader`
   - **Start Command**: `php -S 0.0.0.0:$PORT index.php`
   - **Health Check Path**: `/`

### 3. **Environment Variables**
Add these in Render dashboard:
```
PHP_VERSION=8.1
```

### 4. **Get Your API URL**
- Render will provide a URL like: `https://cake-backend-api.onrender.com`
- Use this as your `NEXT_PUBLIC_API_BASE_URL` in Vercel

## 🔗 **Connect to Frontend**

Once deployed, update your Vercel environment variables:
```
NEXT_PUBLIC_API_BASE_URL=https://your-render-app.onrender.com
```

## 🐛 **Troubleshooting**

### Common Issues:
1. **Build fails**: Check PHP version compatibility
2. **Health check fails**: Verify the root path returns 200 OK
3. **Database errors**: SQLite will be created automatically
4. **CORS errors**: Check CORS configuration

### Logs:
- Check Render logs in the dashboard
- Monitor application health checks

## 📊 **Monitoring**
- Render provides built-in monitoring
- Check logs for any errors
- Monitor resource usage

## 🔄 **Updates**
- Push changes to GitHub
- Render will automatically redeploy
- No downtime during updates

## 💰 **Pricing**
- **Free tier**: 750 hours/month
- **Paid plans**: Start at $7/month
- **Auto-sleep**: Free tier sleeps after 15 minutes of inactivity
