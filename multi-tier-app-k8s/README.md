# 🚀 Multi-Tier Application on Kubernetes ( with Jenkins, Prometheus & Grafana  

This project demonstrates deploying a **multi-tier application** (React Frontend + Node.js Backend + MySQL Database) on a **K3s Kubernetes cluster**, with **CI/CD using Jenkins** and **monitoring using Prometheus & Grafana**.  



## 🖥️ 1. Prerequisites  

### Infrastructure  
- **Two EC2 Instances**  
  - **Jenkins Server** (Ubuntu 22.04, t3.medium recommended)  
  - **K3s Kubernetes Cluster Node** (Ubuntu 22.04, t3.medium recommended)

### Security Groups (Open Ports)  
- **Jenkins Server** → `22`, `8080`, `443` 
- **K3s Node** →  
  - `22` → SSH
  - `443` → HTTPS 
  - `6443` → K3s API  
  - `30080` → Frontend  
  - `30081` → Backend  
  - `32001` → Prometheus  
  - `32000` → Grafana
 
### Installled Docker and Kubectl in Jenkins Server

---

## ⚙️ 2. Jenkins Server Setup  

i. **Install Java (required by Jenkins)**  
   ```bash
   sudo apt update
   sudo apt install openjdk-17-jdk -y
   ```
   
ii. **Install Jenkins**
   ```bash
   curl -fsSL https://pkg.jenkins.io/debian/jenkins.io-2023.key | sudo tee \
   /usr/share/keyrings/jenkins-keyring.asc > /dev/null
   echo deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] \
   https://pkg.jenkins.io/debian binary/ | sudo tee \
   /etc/apt/sources.list.d/jenkins.list > /dev/null
   sudo apt update
   sudo apt install jenkins -y
   ```

iii. **Start Jenkins**
   ```bash
    sudo systemctl enable jenkins
    sudo systemctl start jenkins
   ```

iv. **Access Jenkins**

    URL → http://<JENKINS_PUBLIC_IP>:8080

    Unlock with:
    sudo cat /var/lib/jenkins/secrets/initialAdminPassword
    


   **Install Plugins**

   Git

   Pipeline

   Docker Pipeline

   Kubernetes CLI





---

## ⚙️ 3. Kubernetes (K3s) Cluster Setup

i. **Install K3s**
   ```bash 
     curl -sfL https://get.k3s.io | sh -
     kubectl get nodes
   ```

ii. **Export kubeconfig**

     - sudo cat /etc/rancher/k3s/k3s.yaml

     - Replace 127.0.0.1 with K3s Node Private IP.

     - Save as k3s-config and upload to Jenkins (Manage Jenkins → Credentials).





---



## ⚙️ 4. Code Updates (Before Build)

- **Backend (backend/index.js) →** Update MySQL connection host with K3s Node Private IP.

- **Frontend (k8s-manifests/frontend-deployment.yaml) →** Update REACT_APP_URL environment variable with K3s Node Public IP:Backend_NodePort.

- **Jenkins Configuration →** Upload modified k3s-config to Jenkins credentials.



---

## ⚙️ 5. Jenkins Pipeline Setup

 a. In Jenkins Dashboard → New Item → Pipeline.

 b. Choose Pipeline script from SCM.

 c. Configure SCM:

 d. Repository: https://github.com/amirulhaque/Kubernetes-projects.git

 e. Branch: main

 f. Script Path: multi-tier-app-k8s/Jenkinsfile

 g. Save → Build Now.

 ---

 ## ⚙️ 6. MySQL Database Setup

**a. Connect to MySQL pod**
  ```yaml
   kubectl exec -it <mysql-pod> -n three-tier-app -- mysql -u root -p
  ```
   password is **rootpass**

**b. Create DB & User**
  ```yaml
   CREATE DATABASE car_db;
   CREATE USER 'car_user'@'%' IDENTIFIED BY 'car_pass';
   GRANT ALL PRIVILEGES ON car_db.* TO 'car_user'@'%';
   FLUSH PRIVILEGES;
  ```



---



### Pipeline Stages

- **Build Docker images**

- **Push to DockerHub**

- **Deploy MySQL, Backend, Frontend**

- **Deploy Prometheus & Grafana**



---

## 📊 7. Monitoring & Visualization

The monitoring stack is under monitoring/.

**Prometheus →** http://<K3S_NODE_PUBLIC_IP>:30090

**Grafana →** http://<K3S_NODE_PUBLIC_IP>:31000

**Default login:** admin / admin123



**Example Dashboards**

Cluster CPU & Memory Usage

Pod/Container Utilization

Workload Performance



---

## 🌍 8. Access the Application

**Frontend:**
```bash
http://<K3S_NODE_PUBLIC_IP>:30080
```

**Backend API:**
```bash
http://<K3S_NODE_PUBLIC_IP>:30081/users
```


If the database is configured correctly, the frontend will display user details from the backend → database.


---

## ✅ 9. Summary

- Jenkins automates CI/CD pipeline.

- K3s runs a multi-tier app (Frontend + Backend + MySQL).

- Prometheus & Grafana provide observability.

- End-to-end deployment from GitHub → Jenkins → K3s → Monitoring.



---

## 📌 Notes

→ Open required ports in AWS Security Groups.

→ Always update IP addresses in backend & frontend configs.

→ Upload modified k3s-config into Jenkins before running pipeline.
