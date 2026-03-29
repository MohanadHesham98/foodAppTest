
# FoodApp Deployment to K3s

This repository contains the FoodApp application with a complete CI/CD pipeline using GitHub Actions to automatically build, push Docker images, and deploy to a K3s cluster running on AWS EC2 instances.
The infrastructure is fully managed with Terraform (Infrastructure as Code).

---
<img width="1408" height="768" alt="Gemini_Generated_Image_x9z39yx9z39yx9z3" src="https://github.com/user-attachments/assets/515fd17b-6848-48ac-a8d1-59c4e5d34389" />

---

## Architecture Overview

#### Infrastructure (Terraform)

1. VPC with two subnets:
   - Public Subnet: For Master Node and Worker01
   - Private Subnet: For Worker02 (MongoDB)

2. Internet Gateway + NAT Gateway
3. Route Tables (Public & Private)
4. 3 EC2 Instances:

| Instance       | Subnet  | Role / Services                     |
|----------------|---------|-------------------------------------|
| `Master`       | Public  | K3s Control Plane                   |
| `Worker01`     | Public  | Backend, Frontend, Admin services   |
| `Worker02`     | Private | MongoDB Database                    |

5. Security Groups
   - Allow SSH (22) from your IP
   - Allow K3s API (6443) between nodes
   - Allow NodePort range (30000-32767)
   - Allow internal communication between nodes
   - MongoDB accessible only inside private subnet
  
6. CI/CD Pipeline (GitHub Actions)
The pipeline automatically:
- Triggers on every push to `main`
- Builds Docker images
- Pushes images to Docker Hub
- Connects to EC2 via SSH
- Pulls latest code
- Applies Kubernetes manifests
- Updates running pods
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

## Deployment Steps

1. **Infrastructure Provisioning (Terraform)**  
   ```
   cd terraform
   terraform init
   terraform plan
   terraform apply
   ```
This will create the VPC, subnets, gateways, route tables, EC2 instances, and security groups.

2. **Manual K3s Cluster Setup**  
   ### On Master Node:
   - SSH into the Master EC2 instance.
   - Install K3s:
    ```
    curl -sfL https://get.k3s.io | sh -
    ```
   - Retrieve the node token
   ```
   sudo cat /var/lib/rancher/k3s/server/node-token
   ```
   #### On Worker01 and Worker02:
   - Run the following command (replace `<MASTER_IP>` and `<TOKEN>`):

    ```
   curl -sfL https://get.k3s.io | K3S_URL=https://<MASTER_PRIVATE_IP>:6443 K3S_TOKEN=<NODE_TOKEN> sh -
     ```
 - Add Labels (on Master Node):
   ```
   kubectl label node worker01 app=public
   kubectl label node worker02 app=private
   ```
- Add taint to worker02 node (private ec2 for database):
   ```
   kubectl taint node worker02 dedicated=db:NoSchedule
   ```
3. **Install project repo on master node**
   ```
   git clone https://github.com/MohanadHesham98/foodApp.git
   cd foodApp
   ```
4. **Login whith your Docker Hub**
   ```
   docker login
   ```
5. **Build and Push Docker Images**
   ```
   docker build -t yourusername/frontend:latest ./Frontend
   docker build -t yourusername/backend:latest ./Backend
   docker build -t yourusername/admin:latest ./Admin

   docker push yourusername/frontend:latest
   docker push yourusername/backend:latest
   docker push yourusername/admin:latest
   ```
6. **Deploy to K3s**
   ```
   cd k8s
   kubectl apply -f namespace.yaml
   kubectl apply -f food-secrets.yaml
   kubectl apply -f mongodb/
   kubectl apply -f backend/
   kubectl apply -f frontend/
   kubectl apply -f admin/
   ```

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
