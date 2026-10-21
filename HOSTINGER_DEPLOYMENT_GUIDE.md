# Hostinger Production Deployment Guide for spcsolarcbe.com

This document provides a step-by-step deployment guide to connect and deploy **SPC Solar** on **Hostinger** via **GitHub** for the custom domain **`https://spcsolarcbe.com`**.

---

## 1. Architecture Overview in Production

In production on `spcsolarcbe.com`:
* **Domain**: `https://spcsolarcbe.com` & `https://www.spcsolarcbe.com`
* **Backend**: Node.js + Express + Mongoose (Connecting to MongoDB Atlas)
* **Frontend**: React 19 + Vite + TailwindCSS (Served via Express or static LiteSpeed web server)
* **Storage**: Cloudinary Cloud Media Storage (Reels & Images) or local uploads
* **SSL / HTTPS**: Automated Let's Encrypt SSL via Hostinger

---

## 2. Step 1: Push Project to GitHub

1. In your terminal inside the project directory (`c:\Users\ASUS\Desktop\SPC Solar\SPC_SOLAR`):
   ```bash
   git add .
   git commit -m "feat: production configuration for spcsolarcbe.com and Hostinger deployment"
   ```

2. If you haven't linked a remote GitHub repository yet:
   ```bash
   git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_REPO_NAME>.git
   git branch -M main
   git push -u origin main
   ```

---

## 3. Step 2: Deploy on Hostinger (via Git)

### Method A: Hostinger Node.js Application Manager (Recommended)

1. Log in to **Hostinger hPanel** (`hpanel.hostinger.com`).
2. Navigate to **Websites** -> Select **`spcsolarcbe.com`** -> Open **Advanced** -> **Node.js**.
3. Click **Create Application**:
   * **Node.js version**: Choose `v20.x` or `v22.x`
   * **Application Mode**: `Production`
   * **Application Root**: `/` (or root of repository)
   * **Application Startup File**: `Backend/server.js`
4. Connect Git:
   * Go to **Advanced** -> **Git**.
   * Enter your GitHub Repository URL: `https://github.com/<YOUR_USERNAME>/<YOUR_REPO>.git`.
   * Branch: `main`.
   * Click **Create**.
5. Set Environment Variables in Hostinger hPanel under **Node.js -> Environment Variables**:
   ```env
   NODE_ENV=production
   PORT=5000
   CLIENT_URL=https://spcsolarcbe.com
   MONGO_URI=mongodb+srv://spctechnologycoimbatore_db_user:cydxOLUpRgL47RxI@cluster0.izowxop.mongodb.net/spcsolar?retryWrites=true&w=majority
   JWT_SECRET=your_super_secret_jwt_key_for_production_2026
   JWT_EXPIRE=7d
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
6. Build and Start:
   * Click **NPM Install**.
   * Click **Run Script** -> `build` (runs `npm --prefix Frontend run build`).
   * Click **Restart Application**.

---

### Method B: Hostinger VPS (with PM2 & Nginx)

If you are using a Hostinger VPS with Ubuntu:
1. SSH into your VPS:
   ```bash
   ssh root@<YOUR_VPS_IP>
   ```
2. Clone your repository:
   ```bash
   git clone https://github.com/<YOUR_USERNAME>/<YOUR_REPO>.git /var/www/spcsolar
   cd /var/www/spcsolar
   ```
3. Install dependencies and build frontend:
   ```bash
   npm run install:all
   npm run build
   ```
4. Copy `.env`:
   ```bash
   cp Backend/.env.example Backend/.env
   nano Backend/.env # Enter your MongoDB & Cloudinary credentials
   ```
5. Start with PM2:
   ```bash
   pm2 start ecosystem.config.js --env production
   pm2 save
   pm2 startup
   ```
6. Configure Nginx for `spcsolarcbe.com`:
   ```nginx
   server {
       server_name spcsolarcbe.com www.spcsolarcbe.com;

       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```
7. Obtain Free SSL with Certbot:
   ```bash
   certbot --nginx -d spcsolarcbe.com -d www.spcsolarcbe.com
   ```

---

## 4. Step 3: Domain DNS Configuration

In your Hostinger DNS Zone Editor for **`spcsolarcbe.com`**:
1. **A Record**:
   * Name: `@`
   * Points to: Your Hostinger Server / VPS IP
2. **CNAME Record**:
   * Name: `www`
   * Points to: `spcsolarcbe.com`

---

## 5. Step 4: Verification Checklist

| Item | Expected Status |
| --- | --- |
| **Homepage** | Loads at `https://spcsolarcbe.com/` |
| **Solar Reels** | Plays video feed at `https://spcsolarcbe.com/reels` |
| **Admin Portal** | Login loads at `https://spcsolarcbe.com/admin/login` |
| **Media Manager** | Library accessible at `https://spcsolarcbe.com/admin/media` |
| **Dynamic Sitemap** | XML loads at `https://spcsolarcbe.com/sitemap.xml` |
| **Robots.txt** | File loads at `https://spcsolarcbe.com/robots.txt` |
| **Page Refresh** | Refreshing any React page (e.g. `/reels`, `/projects`) does NOT produce a 404 |
