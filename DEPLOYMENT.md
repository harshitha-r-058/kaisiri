# 🚀 Deployment Guide - Kaisiri

This guide covers deploying Kaisiri to various cloud platforms.

## Prerequisites

Before deploying, ensure you have:
- ✅ A MongoDB database (local or cloud)
- ✅ Node.js installed on your deployment server
- ✅ Environment variables configured
- ✅ Git repository (optional but recommended)

## Option 1: Heroku (Recommended for Beginners)

### Step 1: Create MongoDB Atlas Database

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (free tier available)
4. Create a database user
5. Whitelist all IPs (0.0.0.0/0) for Heroku
6. Get your connection string

### Step 2: Deploy to Heroku

```bash
# Install Heroku CLI
# Download from: https://devcenter.heroku.com/articles/heroku-cli

# Login to Heroku
heroku login

# Create a new Heroku app
heroku create kaisiri-eco-shop

# Set environment variables
heroku config:set MONGODB_URI="your_mongodb_atlas_connection_string"
heroku config:set JWT_SECRET="your_jwt_secret_here"
heroku config:set SESSION_SECRET="your_session_secret_here"
heroku config:set NODE_ENV="production"

# Deploy
git init
git add .
git commit -m "Initial commit"
git push heroku main

# Seed the database
heroku run npm run seed

# Open your app
heroku open
```

### Heroku Configuration

Create a `Procfile` in the root:
```
web: node server/index.js
```

## Option 2: DigitalOcean App Platform

### Step 1: Prepare Your Repository

1. Push your code to GitHub/GitLab
2. Ensure `.env` is in `.gitignore`

### Step 2: Create App

1. Go to [DigitalOcean](https://www.digitalocean.com/)
2. Click "Create" → "Apps"
3. Connect your GitHub repository
4. Select the `kaisiri` repository
5. Configure:
   - **Name:** kaisiri
   - **Region:** Choose closest to your users
   - **Branch:** main
   - **Build Command:** `npm install`
   - **Run Command:** `npm start`

### Step 3: Add Environment Variables

In the DigitalOcean dashboard:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret
NODE_ENV=production
```

### Step 4: Deploy

Click "Create Resources" and wait for deployment.

## Option 3: AWS EC2

### Step 1: Launch EC2 Instance

1. Go to AWS Console → EC2
2. Launch a new instance:
   - **AMI:** Ubuntu Server 22.04 LTS
   - **Instance Type:** t2.micro (free tier)
   - **Security Group:** Allow HTTP (80), HTTPS (443), SSH (22)

### Step 2: Connect and Setup

```bash
# SSH into your instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

# Install PM2 (process manager)
sudo npm install -g pm2

# Clone your repository
git clone https://github.com/yourusername/kaisiri.git
cd kaisiri

# Install dependencies
npm install

# Create .env file
nano .env
# Add your environment variables

# Seed database
npm run seed

# Start with PM2
pm2 start server/index.js --name kaisiri
pm2 save
pm2 startup
```

### Step 3: Setup Nginx (Optional)

```bash
# Install Nginx
sudo apt install -y nginx

# Configure Nginx
sudo nano /etc/nginx/sites-available/kaisiri

# Add this configuration:
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Enable site
sudo ln -s /etc/nginx/sites-available/kaisiri /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Option 4: Vercel (Frontend) + Railway (Backend)

### Deploy Backend to Railway

1. Go to [Railway.app](https://railway.app/)
2. Click "New Project" → "Deploy from GitHub"
3. Select your repository
4. Add environment variables
5. Railway will auto-deploy

### Deploy Frontend to Vercel

1. Separate frontend into its own repository
2. Go to [Vercel](https://vercel.com/)
3. Import your frontend repository
4. Configure build settings:
   - **Build Command:** (none for static)
   - **Output Directory:** public
5. Add environment variable:
   - `API_URL=your_railway_backend_url`

## Environment Variables

### Required Variables

```env
# Server
PORT=5000
NODE_ENV=production

# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/kaisiri

# Security
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
SESSION_SECRET=your_session_secret_min_32_chars
```

### Generate Secure Secrets

```bash
# Generate random secrets
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Database Options

### MongoDB Atlas (Cloud - Recommended)
- ✅ Free tier available (512 MB)
- ✅ Automatic backups
- ✅ Global distribution
- ✅ Easy setup
- 🔗 [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)

### MongoDB on Server
- ✅ Full control
- ✅ No external dependencies
- ❌ Requires server management
- ❌ Manual backups

### MongoDB on Docker
```bash
docker run -d \
  --name kaisiri-mongo \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  -v kaisiri-data:/data/db \
  mongo:6
```

## Post-Deployment Checklist

### 1. Seed Database
```bash
npm run seed
```

### 2. Test Core Features
- [ ] Homepage loads
- [ ] User registration works
- [ ] User login works
- [ ] Products display
- [ ] Cart functions
- [ ] Checkout completes
- [ ] Admin panel accessible

### 3. Configure Domain (Optional)

#### Heroku
```bash
heroku domains:add www.yourdomain.com
# Follow DNS instructions
```

#### DigitalOcean
1. Go to Networking → Domains
2. Add your domain
3. Point to your app

### 4. Enable HTTPS

#### Heroku
- Automatic with custom domains

#### DigitalOcean
- Automatic with Let's Encrypt

#### AWS/Custom Server
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### 5. Setup Monitoring

#### PM2 (if using)
```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

#### Heroku
```bash
heroku logs --tail
```

### 6. Backup Strategy

#### MongoDB Atlas
- Automatic backups included

#### Self-hosted MongoDB
```bash
# Create backup script
#!/bin/bash
mongodump --uri="mongodb://localhost:27017/kaisiri" --out=/backups/$(date +%Y%m%d)

# Add to crontab (daily at 2 AM)
0 2 * * * /path/to/backup-script.sh
```

## Performance Optimization

### 1. Enable Compression
```javascript
// In server/index.js
const compression = require('compression');
app.use(compression());
```

### 2. Add Caching Headers
```javascript
app.use(express.static('public', {
  maxAge: '1d',
  etag: true
}));
```

### 3. Use CDN for Images
- Upload product images to Cloudinary/AWS S3
- Update image URLs in database

### 4. Database Indexing
Already included in models, but verify:
```javascript
// Check indexes
db.products.getIndexes()
```

## Scaling Considerations

### Horizontal Scaling
- Use load balancer (AWS ELB, Nginx)
- Multiple server instances
- Shared session store (Redis)

### Vertical Scaling
- Upgrade server resources
- Optimize database queries
- Add caching layer (Redis)

### Database Scaling
- MongoDB Atlas auto-scaling
- Read replicas
- Sharding for large datasets

## Troubleshooting

### App Won't Start
```bash
# Check logs
heroku logs --tail  # Heroku
pm2 logs kaisiri    # PM2
journalctl -u kaisiri  # systemd
```

### Database Connection Failed
- Verify MONGODB_URI is correct
- Check IP whitelist (MongoDB Atlas)
- Ensure database is running

### 502 Bad Gateway
- Check if app is running
- Verify port configuration
- Check Nginx/proxy settings

### Environment Variables Not Working
```bash
# Verify variables are set
heroku config  # Heroku
printenv       # Linux
```

## Security Checklist

- [ ] Environment variables are not in code
- [ ] `.env` is in `.gitignore`
- [ ] Strong JWT_SECRET (32+ characters)
- [ ] Strong SESSION_SECRET (32+ characters)
- [ ] HTTPS enabled
- [ ] MongoDB authentication enabled
- [ ] Firewall configured (only necessary ports)
- [ ] Regular security updates
- [ ] Rate limiting enabled (optional)
- [ ] CORS properly configured

## Cost Estimates

### Free Tier Options
- **Heroku:** Free (with limitations)
- **MongoDB Atlas:** Free (512 MB)
- **Vercel:** Free (hobby projects)
- **Railway:** Free ($5 credit/month)

### Paid Options
- **Heroku:** $7/month (Hobby)
- **DigitalOcean:** $5/month (Basic Droplet)
- **AWS EC2:** $3.50/month (t2.micro)
- **MongoDB Atlas:** $9/month (Shared M2)

## Support

For deployment issues:
1. Check the logs first
2. Verify environment variables
3. Test database connection
4. Review security group/firewall rules
5. Check platform-specific documentation

## Additional Resources

- [Heroku Node.js Guide](https://devcenter.heroku.com/articles/deploying-nodejs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [DigitalOcean Tutorials](https://www.digitalocean.com/community/tutorials)
- [AWS EC2 Guide](https://docs.aws.amazon.com/ec2/)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)

---

**Need Help?** Check the troubleshooting section or review platform-specific documentation.

🌿 Good luck with your deployment!
