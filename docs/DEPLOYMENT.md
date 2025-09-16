# Deployment Guide

## Prerequisites

- Node.js 16.0.0 or higher
- npm 8.0.0 or higher
- Docker (optional)
- Cloud platform account (AWS, Google Cloud, Azure, etc.)

## Local Development

1. **Clone and setup:**
   ```bash
   git clone <repository-url>
   cd gTek-SaaS_GLOBAL-ENTERPRISE-TEMPLATES-WEBSITE
   npm run install:all
   ```

2. **Environment configuration:**
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

3. **Start development servers:**
   ```bash
   npm run dev
   ```

This starts both the backend server (port 3001) and frontend development server (port 3000).

## Production Deployment

### Option 1: Direct Node.js Deployment

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Set production environment variables:**
   ```bash
   export NODE_ENV=production
   export PORT=8080
   export JWT_SECRET=your-secure-secret
   export MONGODB_URI=your-production-mongodb-uri
   ```

3. **Start the production server:**
   ```bash
   npm start
   ```

### Option 2: Docker Deployment

1. **Create Dockerfile:**
   ```dockerfile
   FROM node:18-alpine

   WORKDIR /app

   # Copy package files
   COPY package*.json ./
   COPY src/client/package*.json ./src/client/

   # Install dependencies
   RUN npm ci --only=production
   RUN cd src/client && npm ci --only=production

   # Build client
   RUN cd src/client && npm run build

   # Copy source code
   COPY . .

   EXPOSE 3001

   CMD ["npm", "start"]
   ```

2. **Build and run Docker container:**
   ```bash
   docker build -t gtek-saas .
   docker run -p 3001:3001 \
     -e NODE_ENV=production \
     -e JWT_SECRET=your-secret \
     gtek-saas
   ```

### Option 3: Docker Compose

Create `docker-compose.prod.yml`:
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - JWT_SECRET=your-secure-secret
      - MONGODB_URI=mongodb://mongo:27017/gtek-saas
    depends_on:
      - mongo
    restart: unless-stopped

  mongo:
    image: mongo:5
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped

volumes:
  mongo_data:
```

## Cloud Platform Deployment

### AWS Deployment

1. **Elastic Beanstalk:**
   ```bash
   # Install EB CLI
   pip install awsebcli

   # Initialize and deploy
   eb init
   eb create production
   eb deploy
   ```

2. **ECS with Fargate:**
   ```bash
   # Build and push to ECR
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com
   docker build -t gtek-saas .
   docker tag gtek-saas:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/gtek-saas:latest
   docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/gtek-saas:latest
   ```

### Google Cloud Platform

1. **Cloud Run:**
   ```bash
   # Build and deploy
   gcloud builds submit --tag gcr.io/PROJECT-ID/gtek-saas
   gcloud run deploy --image gcr.io/PROJECT-ID/gtek-saas --platform managed
   ```

2. **App Engine:**
   Create `app.yaml`:
   ```yaml
   runtime: nodejs18
   env: standard
   
   env_variables:
     NODE_ENV: production
     JWT_SECRET: your-secret
   
   automatic_scaling:
     min_instances: 1
     max_instances: 10
   ```

   Deploy:
   ```bash
   gcloud app deploy
   ```

### Azure

1. **App Service:**
   ```bash
   # Create resource group and app service plan
   az group create --name gtek-saas-rg --location "East US"
   az appservice plan create --name gtek-saas-plan --resource-group gtek-saas-rg --sku B1 --is-linux

   # Create web app
   az webapp create --resource-group gtek-saas-rg --plan gtek-saas-plan --name gtek-saas-app --runtime "NODE|18-lts"

   # Deploy from local git
   az webapp deployment source config-local-git --name gtek-saas-app --resource-group gtek-saas-rg
   ```

## Environment Variables

### Required Variables
```bash
NODE_ENV=production
PORT=3001
JWT_SECRET=your-super-secure-secret-key
```

### Optional Variables
```bash
MONGODB_URI=mongodb://localhost:27017/gtek-saas
CORS_ORIGIN=https://yourdomain.com
LOG_LEVEL=info
RATE_LIMIT_WINDOW_MS=3600000
RATE_LIMIT_MAX_REQUESTS=1000
```

## SSL/HTTPS Configuration

### Using Let's Encrypt with Nginx

1. **Install Certbot:**
   ```bash
   sudo apt-get update
   sudo apt-get install certbot python3-certbot-nginx
   ```

2. **Obtain SSL certificate:**
   ```bash
   sudo certbot --nginx -d yourdomain.com
   ```

3. **Nginx configuration example:**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       return 301 https://$server_name$request_uri;
   }

   server {
       listen 443 ssl http2;
       server_name yourdomain.com;

       ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

       location / {
           proxy_pass http://localhost:3001;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

## Monitoring and Logging

### Health Checks
The application provides a health check endpoint at `/api/health` that returns:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "service": "gTek SaaS Global Enterprise Templates"
}
```

### Application Monitoring
Recommended monitoring solutions:
- **New Relic**: Application performance monitoring
- **Datadog**: Infrastructure and application monitoring
- **Prometheus + Grafana**: Open-source monitoring stack
- **AWS CloudWatch**: For AWS deployments

### Logging
The application uses structured logging. Configure log levels:
- `error`: Only errors
- `warn`: Warnings and errors
- `info`: General information (default)
- `debug`: Detailed debugging information

## Scaling Considerations

### Horizontal Scaling
- Use load balancers (Nginx, HAProxy, or cloud load balancers)
- Deploy multiple instances of the application
- Implement session management (Redis for session storage)

### Database Scaling
- Use MongoDB replica sets for read scaling
- Implement database sharding for write scaling
- Consider MongoDB Atlas for managed scaling

### Caching
- Implement Redis for application caching
- Use CDN for static assets
- Cache frequently accessed API responses

## Security Checklist

- [ ] Use HTTPS in production
- [ ] Set secure environment variables
- [ ] Enable rate limiting
- [ ] Implement proper authentication
- [ ] Use security headers (helmet.js)
- [ ] Regular security audits
- [ ] Keep dependencies updated
- [ ] Implement proper logging and monitoring

## Troubleshooting

### Common Issues

1. **Port already in use:**
   ```bash
   # Find and kill process using port 3001
   lsof -ti:3001 | xargs kill
   ```

2. **Module not found errors:**
   ```bash
   # Clear node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Build failures:**
   ```bash
   # Clear npm cache
   npm cache clean --force
   npm run build
   ```

### Performance Optimization

1. **Enable gzip compression**
2. **Optimize bundle sizes**
3. **Implement code splitting**
4. **Use CDN for static assets**
5. **Enable browser caching**
6. **Optimize database queries**

### Backup and Recovery

1. **Database backups:**
   ```bash
   # MongoDB backup
   mongodump --uri="mongodb://localhost:27017/gtek-saas" --out=/path/to/backup
   ```

2. **Application backups:**
   - Source code in version control
   - Environment configurations
   - SSL certificates
   - Database backups

## Support

For deployment support:
- Email: devops@gtek.com
- Documentation: https://docs.gtek.com/deployment
- Community: https://community.gtek.com