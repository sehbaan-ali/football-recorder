# Deployment Guide

## SPA Routing Fix (404 on Refresh)

This application uses client-side routing (React Router). When you refresh on routes like `/players` or `/settings`, the server needs to redirect all routes to `index.html`.

### Solutions by Platform

#### Vercel (Current Hosting)
Your site is hosted at `www.footy-tracker.com` which appears to be on Vercel.

**Option 1: Using vercel.json (Already configured)**
The `vercel.json` file in the root directory is already set up:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**To apply this:**
1. Make sure `vercel.json` is committed to your repository
2. Redeploy your application
3. Vercel should automatically pick up the configuration

**Option 2: Via Vercel Dashboard**
If the file method doesn't work:
1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Rewrites
4. Add a rewrite: `/*` → `/index.html`

#### Netlify
The `netlify.toml` and `public/_redirects` files are already configured:

**netlify.toml:**
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**public/_redirects:**
```
/*    /index.html   200
```

Just deploy and Netlify will automatically use these files.

#### Other Platforms

**Apache (.htaccess):**
Create `.htaccess` in your public directory:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

**Nginx:**
Add to your nginx config:
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

## Quick Fix Steps

1. **Verify file presence:**
   ```bash
   ls -la vercel.json netlify.toml public/_redirects
   ```

2. **Commit all config files:**
   ```bash
   git add vercel.json netlify.toml public/_redirects
   git commit -m "Add SPA routing configuration"
   git push
   ```

3. **Rebuild and redeploy:**
   - Your hosting platform should automatically detect the changes
   - The configuration will be applied on next deployment

4. **Test:**
   - After deployment, visit `https://www.footy-tracker.com/players`
   - Refresh the page - it should work without 404

## Troubleshooting

If you still see 404 errors after deployment:

1. **Check build output:**
   - Verify `dist/_redirects` exists after running `npm run build`
   - Run `ls -la dist/` to confirm

2. **Clear cache:**
   - Clear your browser cache
   - Try in incognito/private mode

3. **Check hosting platform:**
   - Verify the platform is serving from the `dist/` directory
   - Check platform logs for any configuration errors

4. **Contact support:**
   - If using Vercel, check their rewrite documentation
   - Provide them with your `vercel.json` configuration

## Current Status

✅ `vercel.json` - Configured
✅ `netlify.toml` - Configured
✅ `public/_redirects` - Configured
✅ `dist/_redirects` - Generated during build

All configuration files are in place. You just need to commit and redeploy!
