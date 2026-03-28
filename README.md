
# FoodApp Deployment to K3s

This repository contains the FoodApp application with a GitHub Actions workflow to automatically build, push Docker images, and deploy to a K3s cluster on an EC2 instance.

---

## Deployment Steps

1. **Push to `main` branch**  
   The GitHub Actions workflow is triggered on every push to the `main` branch.

2. **GitHub Actions Workflow Tasks**  
   The workflow performs the following tasks on the EC2 server:
   - Installs `git`, `docker`, and other dependencies if needed.
   - Clones the repository (or pulls the latest changes if already exists).
   - Logs in to Docker Hub using credentials stored in GitHub Secrets.
   - Builds and pushes Docker images for:
     - Frontend
     - Backend
     - Admin
   - Deploys Kubernetes manifests to the K3s cluster.
   - Verifies pods in the `foodapp` namespace.

3. **K3s Deployment**  
   The workflow deploys manifests from the `k8s` directory on the EC2 instance. It ensures the `foodapp` namespace exists before applying the manifests.

---

## Required GitHub Secrets

Before running the workflow, make sure the following GitHub Secrets are configured in your repository:

| Secret Name           | Description                                      |
|----------------------|--------------------------------------------------|
| `EC2_HOST`            | Public IP or hostname of your EC2 instance      |
| `EC2_USER`            | SSH username for the EC2 instance (usually `ubuntu`) |
| `SSH_PRIVATE_KEY`     | Private SSH key with access to the EC2 instance |
| `DOCKER_USERNAME`     | Docker Hub username                              |
| `DOCKER_PASSWORD`     | Docker Hub password                              |
| `KUBECONFIG_DATA`     | (Optional) Base64-encoded K3s kubeconfig if not using local `/etc/rancher/k3s/k3s.yaml` |

> **Important:** Make sure these secrets are properly configured before anyone clones this repository or pushes to `main`. Otherwise, the deployment workflow will fail.
> repo settings --> secrets and variables --> Actions --> Repository secrets

---

## Notes

- The workflow is designed to run on the EC2 instance directly via SSH.
- If your repository is private, make sure the EC2 instance has access to clone it (via SSH key or GitHub token).
- All Kubernetes manifests are in the `k8s` directory, and Dockerfiles are in the `Frontend`, `Backend`, and `Admin` directories.

---

## Usage

1. Push your code to the `main` branch.
2. GitHub Actions will automatically run the workflow.
3. Check the workflow logs to verify Docker images are built and pushed, and K3s manifests are applied successfully.
4. Use `kubectl get pods -n foodapp` on the EC2 instance to see running pods.
