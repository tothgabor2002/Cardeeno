# Deployment Guide

Complete guide for deploying Cardeeno to various cloud platforms.

## Pre-Deployment Checklist

Before deploying to production:

- [ ] All tests passing (`npm run test:ci && npm run test:e2e`)
- [ ] Build successful (`npm run build`)
- [ ] Environment variables configured
- [ ] Database migrations run (if applicable)
- [ ] Docker image builds successfully
- [ ] Security review completed
- [ ] Performance testing done
- [ ] Backup strategy in place

## Deployment Options

### 1. AWS ECS/Fargate

**Pros**: Highly scalable, managed containers, AWS ecosystem
**Cons**: More complex setup, potentially higher cost

#### Setup Steps

1. **Install AWS CLI**
   ```bash
   # Mac
   brew install awscli

   # Windows
   # Download from https://aws.amazon.com/cli/
   ```

2. **Configure AWS**
   ```bash
   aws configure
   # Enter: Access Key ID, Secret Key, Region, Output format
   ```

3. **Create ECR Repository**
   ```bash
   aws ecr create-repository --repository-name cardeeno --region us-east-1
   ```

4. **Build and Push Image**
   ```bash
   # Get ECR login
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

   # Build image
   docker build -t cardeeno:latest .

   # Tag image
   docker tag cardeeno:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/cardeeno:latest

   # Push image
   docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/cardeeno:latest
   ```

5. **Create ECS Cluster and Service**
   - Use AWS Console or CloudFormation template
   - Configure task definition with 512 CPU, 1GB memory
   - Set environment variables
   - Configure load balancer
   - Set up auto-scaling

6. **Update GitHub Actions**
   Add to `.github/workflows/ci.yml`:
   ```yaml
   - name: Deploy to ECS
     run: |
       aws ecs update-service --cluster cardeeno-cluster --service cardeeno-service --force-new-deployment
   ```

### 2. Google Cloud Run

**Pros**: Serverless, pay-per-use, easy scaling, good for variable traffic
**Cons**: Cold starts, platform lock-in

#### Setup Steps

1. **Install gcloud CLI**
   ```bash
   # Mac
   brew install google-cloud-sdk

   # Windows/Linux
   # Download from https://cloud.google.com/sdk/docs/install
   ```

2. **Initialize gcloud**
   ```bash
   gcloud init
   gcloud auth login
   gcloud config set project <project-id>
   ```

3. **Build and Deploy**
   ```bash
   # Build with Cloud Build
   gcloud builds submit --tag gcr.io/<project-id>/cardeeno

   # Deploy to Cloud Run
   gcloud run deploy cardeeno \
     --image gcr.io/<project-id>/cardeeno \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --set-env-vars "NODE_ENV=production"
   ```

4. **Configure Custom Domain** (optional)
   ```bash
   gcloud run domain-mappings create --service cardeeno --domain cardeeno.com
   ```

5. **Update GitHub Actions**
   Add to `.github/workflows/ci.yml`:
   ```yaml
   - name: Deploy to Cloud Run
     run: |
       gcloud builds submit --tag gcr.io/${{ secrets.GCP_PROJECT_ID }}/cardeeno
       gcloud run deploy cardeeno --image gcr.io/${{ secrets.GCP_PROJECT_ID }}/cardeeno
   ```

### 3. DigitalOcean App Platform

**Pros**: Simple, affordable, managed platform
**Cons**: Less flexibility, fewer regions

#### Setup Steps

1. **Install doctl**
   ```bash
   # Mac
   brew install doctl

   # Windows/Linux
   # Download from https://docs.digitalocean.com/reference/doctl/
   ```

2. **Authenticate**
   ```bash
   doctl auth init
   ```

3. **Create App Spec**
   Create `.do/app.yaml`:
   ```yaml
   name: cardeeno
   services:
     - name: web
       github:
         repo: yourusername/cardeeno
         branch: main
         deploy_on_push: true
       dockerfile_path: Dockerfile
       http_port: 3000
       instance_count: 2
       instance_size_slug: basic-xs
       routes:
         - path: /
       env:
         - key: NODE_ENV
           value: production
   ```

4. **Deploy**
   ```bash
   doctl apps create --spec .do/app.yaml
   ```

5. **Monitor**
   ```bash
   doctl apps list
   doctl apps logs <app-id> --follow
   ```

### 4. Azure Container Apps

**Pros**: Good Azure integration, managed containers
**Cons**: Newer service, fewer features

#### Setup Steps

1. **Install Azure CLI**
   ```bash
   # Mac
   brew install azure-cli

   # Windows
   # Download from https://learn.microsoft.com/cli/azure/install-azure-cli
   ```

2. **Login**
   ```bash
   az login
   ```

3. **Create Resources**
   ```bash
   # Create resource group
   az group create --name cardeeno-rg --location eastus

   # Create container registry
   az acr create --resource-group cardeeno-rg --name cardeenoacr --sku Basic

   # Login to ACR
   az acr login --name cardeenoacr
   ```

4. **Build and Push**
   ```bash
   # Build image
   docker build -t cardeenoacr.azurecr.io/cardeeno:latest .

   # Push image
   docker push cardeenoacr.azurecr.io/cardeeno:latest
   ```

5. **Create Container App**
   ```bash
   az containerapp create \
     --name cardeeno \
     --resource-group cardeeno-rg \
     --image cardeenoacr.azurecr.io/cardeeno:latest \
     --target-port 3000 \
     --ingress external
   ```

### 5. Vercel (Alternative - No Docker)

**Pros**: Zero config, automatic previews, edge network
**Cons**: Vendor lock-in, serverless limitations

#### Setup Steps

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

4. **Configure in vercel.json**
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": ".next",
     "devCommand": "npm run dev",
     "installCommand": "npm install"
   }
   ```

## Database Setup

### PostgreSQL on AWS RDS

```bash
aws rds create-db-instance \
  --db-instance-identifier cardeeno-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username admin \
  --master-user-password <password> \
  --allocated-storage 20
```

### PostgreSQL on Google Cloud SQL

```bash
gcloud sql instances create cardeeno-db \
  --database-version=POSTGRES_14 \
  --tier=db-f1-micro \
  --region=us-central1
```

### Managed PostgreSQL on DigitalOcean

Use DigitalOcean Console to create a managed database.

## Environment Variables

Set these in your cloud platform:

```env
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://cardeeno.com
DATABASE_URL=postgresql://...
ANTHROPIC_API_KEY=sk-ant-...
```

## Monitoring Setup

### CloudWatch (AWS)

```bash
aws logs create-log-group --log-group-name /ecs/cardeeno
```

### Cloud Logging (GCP)

Automatically enabled for Cloud Run.

### App Platform Logs (DigitalOcean)

```bash
doctl apps logs <app-id> --follow
```

## SSL/TLS Certificates

All platforms provide automatic HTTPS:
- AWS: Use ACM (AWS Certificate Manager)
- GCP: Automatic with Cloud Run
- DigitalOcean: Automatic with Let's Encrypt
- Azure: Automatic with Container Apps

## Scaling Configuration

### Auto-scaling Example (AWS ECS)

```json
{
  "targetValue": 70.0,
  "scaleInCooldown": 60,
  "scaleOutCooldown": 60,
  "predefinedMetricSpecification": {
    "predefinedMetricType": "ECSServiceAverageCPUUtilization"
  }
}
```

### Cloud Run Scaling

```bash
gcloud run services update cardeeno \
  --min-instances=1 \
  --max-instances=100 \
  --concurrency=80
```

## Rollback Strategy

### AWS ECS

```bash
aws ecs update-service \
  --cluster cardeeno-cluster \
  --service cardeeno-service \
  --task-definition cardeeno:PREVIOUS_VERSION
```

### Cloud Run

```bash
gcloud run services update-traffic cardeeno \
  --to-revisions=REVISION_NAME=100
```

### DigitalOcean

```bash
doctl apps create-deployment <app-id> --revision <previous-revision>
```

## Backup Strategy

1. **Database Backups**: Enable automated backups
2. **Code**: Git repository serves as backup
3. **User Data**: Regular database dumps
4. **Configuration**: Store in version control

## Performance Optimization

1. **Enable CDN**: CloudFront (AWS), Cloud CDN (GCP)
2. **Image Optimization**: Next.js Image component
3. **Caching**: Redis for session/data caching
4. **Database**: Read replicas for scaling reads
5. **Monitoring**: Set up APM (Application Performance Monitoring)

## Security Checklist

- [ ] HTTPS enabled (mandatory)
- [ ] Environment variables secured
- [ ] Database access restricted to app only
- [ ] Security groups configured
- [ ] DDoS protection enabled
- [ ] Regular security updates
- [ ] Secrets in secrets manager
- [ ] API rate limiting configured

## Cost Estimation

### AWS (Small Scale)
- ECS Fargate: ~$30-50/month
- RDS PostgreSQL: ~$15-30/month
- Load Balancer: ~$16/month
- **Total**: ~$60-100/month

### Google Cloud (Small Scale)
- Cloud Run: ~$10-30/month (pay per use)
- Cloud SQL: ~$10-25/month
- **Total**: ~$20-55/month

### DigitalOcean (Small Scale)
- App Platform: ~$12-25/month
- Managed Database: ~$15/month
- **Total**: ~$27-40/month

## Troubleshooting

### Issue: Container won't start

```bash
# Check logs
docker logs <container-id>

# Verify environment variables
docker inspect <container-id>
```

### Issue: Database connection fails

- Verify DATABASE_URL is correct
- Check network security groups
- Ensure database is publicly accessible (if needed)

### Issue: High latency

- Enable CDN
- Add caching layer (Redis)
- Scale horizontally
- Optimize database queries

## Post-Deployment

1. **Set up monitoring alerts**
2. **Configure uptime monitoring** (UptimeRobot, Pingdom)
3. **Enable error tracking** (Sentry)
4. **Set up analytics** (Google Analytics, Plausible)
5. **Configure backups**
6. **Document runbook** for common issues

## Maintenance

### Regular Tasks

- Update dependencies monthly
- Review and rotate secrets quarterly
- Check for security updates weekly
- Monitor costs and optimize
- Review logs for errors
- Test backup/restore procedures

---

**Need Help?** Open an issue or contact the team.
