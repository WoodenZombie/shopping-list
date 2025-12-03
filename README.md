# Shopping List Application

## Deployment Guide

This guide explains how to deploy the Shopping List application to the cloud using Docker and Docker Compose.

### Prerequisites
- Docker installed on your machine.
- Docker Compose installed.
- MongoDB connection string (if not using the mock mode).

### Environment Variables
Create a `.env` file in the `server` directory with the following content:

```
MONGO_URI=<your-mongodb-connection-string>
USE_MOCK=false
```

### Build and Run with Docker Compose
1. Navigate to the root of the project.
2. Run the following command to build and start the services:

```bash
docker-compose up --build
```

3. Access the application:
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:4000](http://localhost:4000)

### Deployment to Cloud
To deploy the application to a cloud provider like AWS, Azure, or Google Cloud:
1. Push the Docker images to a container registry (e.g., Docker Hub, AWS ECR).
2. Use the cloud provider's container orchestration service (e.g., ECS, AKS, GKE) to deploy the services.
3. Ensure the environment variables are configured in the cloud environment.

### Deploying from GitHub

To deploy the application directly from GitHub, you can use GitHub Actions and a cloud provider like Heroku, Render, or AWS. Below are the steps for a typical GitHub-based deployment:

1. **Set Up GitHub Actions**:
   - Create a `.github/workflows/deploy.yml` file in your repository.
   - Define the workflow to build and deploy the application. For example, to deploy to Heroku:

```yaml
name: Deploy to Heroku

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout code
      uses: actions/checkout@v3

    - name: Log in to Heroku
      uses: akhileshns/heroku-deploy@v4.1.6
      with:
        heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
        heroku_app_name: your-heroku-app-name
        heroku_email: your-email@example.com

    - name: Deploy to Heroku
      run: |
        git push heroku main
```

2. **Configure Secrets**:
   - Go to your GitHub repository settings.
   - Add the required secrets (e.g., `HEROKU_API_KEY`, `MONGO_URI`).

3. **Push Changes**:
   - Commit and push your changes to the `main` branch.
   - The GitHub Actions workflow will automatically build and deploy the application.

4. **Verify Deployment**:
   - Access the deployed application using the URL provided by your cloud provider.

### Notes
- Replace `your-heroku-app-name` and `your-email@example.com` with your actual Heroku app name and email.
- For other cloud providers, adjust the GitHub Actions workflow accordingly.
- The frontend is served statically by the backend in production mode.
- MongoDB data is persisted in a Docker volume (`mongo-data`).