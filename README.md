# About The Project 

**Ohana** Food Ordering Platform is a modern web application that allows users to browse, order, and manage meals online with ease. It is designed to create a seamless and user-friendly experience, both for customers and for admin management.  

**Ohana** means family — more than a restaurant, it’s about creating a sense of home, connecting loved ones, and sharing meals that bring people closer. Here, food feels like home and makes the distance fade away.

---
## Demo Video

Watch the full demo here:  

https://github.com/user-attachments/assets/68ae262a-034f-4802-af3e-6b074d42b178

---
## Getting Started

**CI/CD Notice:** This project uses **GitHub Actions** for automated build, Docker image push, and Kubernetes deployment.  
For full setup instructions, check the [CI/CD README](https://github.com/MohanadHesham98/food-app/blob/main/.github/workflows/README.md).

Follow these instructions to set up the project locally on your machine.

### Prerequisites

Make sure you have the following installed on your system:

- **Node.js** (v14 or later)
- **npm** (for package management)
- **Docker** and **Docker Compose**
- **kubectl** (for Kubernetes deployments "K3S")

---

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/MohanadHesham98/food-app.git
   cd food-app
   ```

2. **Build Docker images**:
     ```bash
       docker compose build
     ```
3. **Push images to Docker Hub**:
     ```bash
       docker login
       docker push mohanad898/food-backend:latest
       docker push mohanad898/food-frontend:latest
       docker push mohanad898/food-admin:latest
     ```

### Running the Application on Kubernetes

1. **Apply namespace and secrets**:
   ```bash
   cd k8s
   kubctle apply -f namespace.ymal
   kubctle apply -f food-secrets.yaml
   ```
 2. **Deploy services**:
   ```bash
   kubctle apply -f mongodb/
   kubctle apply -f backend/ 
   kubctle apply -f frontend/
   kubctle apply -f admin/
   ```

3. **Verify deployments**:
   ```bash
   kubctel get ns
   kubctel get all -n food
   ```
   
4. **Get your machine IP**:
   ```bash
   ip a
   ```
5. **Open in browser**:
   ```bash
   http://<machine-ip>:<node-port>
   ```
## How It Works
### User Flow:
1. Sign Up: New users can create an account quickly and securely to get started with ordering.
2. Login: Existing users can log in to access their account, view past orders, and manage their profile.
3. Browse & Add to Cart: Users can explore the menu, view food details, and add desired items to their cart.
4. Apply Promocode: Users can enter a promocode at checkout to receive discounts. The platform supports two    types of coupons: percentage-based and fixed-amount discounts.
   
### Admin Dashboard:
1. Food Management: Admins can add, edit, or delete food items to keep the menu updated.
2. Promocode Management: Admins can create and remove promocodes, defining discount type and validity.
3. Order Management: Admins can monitor all orders, update their status, and ensure smooth order
   fulfillment.

## Repository Structure

The project is divided into three main parts:

1. **Frontend**:  
   The customer-facing food ordering platform is built using **React (Vite)**. This section handles user interactions, displaying food items, and managing the cart and checkout process.

2. **Backend**:  
   The server-side API, built with **Node.js** and **Express**, handles data processing, database operations, and serves requests from both the frontend and admin dashboard.

3. **Admin Dashboard**:  
   A dedicated admin interface built using **React (Vite)**, allowing admins to manage food items, orders, and promocodes. It is connected to the backend for data management and order processing.
---
### Notes
- Replace <machine-ip> and <node-port> with the actual values from your cluster.
- Make sure your Docker Hub username is correctly used in the docker-compose.yml for all services.
- For any updates, rebuild images and push them again before reapplying deployments.
