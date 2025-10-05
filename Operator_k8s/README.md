
---

🚀 Kubernetes Operator Project

📖 Project Overview

This project demonstrates how to use Kubernetes Operators to deploy and manage applications like:

🧠 Prometheus — Monitoring and alerting

💾 MySQL — Database management


We use Helm to simplify operator deployment and manage CRDs (Custom Resource Definitions).

🎯 Goals

✅ Automate deployment and scaling
✅ Manage configurations automatically
✅ Handle database backups seamlessly
✅ Enable continuous monitoring with Prometheus


---

🧠 What is a Kubernetes Operator?

A Kubernetes Operator is an application-specific controller that extends Kubernetes capabilities by automating the deployment, management, and operations of complex applications.

📌 Key Concepts

🧩 Operators use Custom Resources (CRs) to define the desired state.

🔄 The Operator Controller continuously reconciles the actual state with the desired state.

🤖 Automates tasks like scaling, backups, upgrades, failover, and more.


🌟 Benefits

📉 Reduces manual intervention

✅ Ensures consistent and reliable deployments

⚙️ Automates complex app lifecycle operations

🔗 Integrates seamlessly with Kubernetes native APIs



---

🛠️ Prerequisites

Requirement Description

☁️ AWS EC2 Ubuntu 22.04 LTS, 2 vCPU, 4 GB RAM, 20 GB disk
🔐 Security Group Open ports: 22 (SSH), 30000–32767 (NodePort), 3306 (MySQL), 9090 (Prometheus), 9093 (Alertmanager), 3000 (Grafana)
🐳 Docker Installed and running
☸️ Kubernetes Cluster running (Minikube or kubeadm)
🧰 Tools kubectl, Helm (v3+) installed



---

🧩 Step 1: Setup Kubernetes Cluster

# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
sudo apt install -y docker.io
sudo systemctl enable docker --now

# Install Minikube
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube

# Start Minikube
minikube start --driver=docker

# Verify cluster
kubectl get nodes


---

🧩 Step 2: Install Helm

curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
helm version


---

🧩 Step 3: Deploy Prometheus Operator

# Add Helm repo
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

# Create namespace
kubectl create namespace monitoring

# Install Prometheus Operator
helm install kube-prometheus prometheus-community/kube-prometheus-stack -n monitoring

✅ Verify:

kubectl get pods -n monitoring
kubectl get crds | grep prometheus


---

🧩 Step 4: Deploy MySQL Operator

# Add Helm repo for MySQL operator
helm repo add presslabs https://presslabs.github.io/charts
helm repo update

# Create namespace
kubectl create namespace mysql

# Install MySQL Operator
helm install mysql-operator presslabs/mysql-operator -n mysql

✅ Verify:

kubectl get pods -n mysql
kubectl get crds | grep mysql


---

🧩 Step 5: Deploy Prometheus Custom Resource

Create manifests/prometheus/prometheus-cr.yaml:

apiVersion: monitoring.coreos.com/v1
kind: Prometheus
metadata:
  name: prometheus-demo
  namespace: monitoring
spec:
  replicas: 1
  serviceAccountName: prometheus
  serviceMonitorSelector: {}
  resources:
    requests:
      memory: 400Mi

Apply:

kubectl apply -f manifests/prometheus/prometheus-cr.yaml


---

🧩 Step 6: Deploy MySQL Custom Resource

Create manifests/mysql/mysql-cr.yaml:

apiVersion: mysql.presslabs.org/v1alpha1
kind: MysqlCluster
metadata:
  name: demo-mysql
  namespace: mysql
spec:
  replicas: 1
  secretName: demo-mysql-secret

Create the MySQL root password secret:

kubectl create secret generic demo-mysql-secret --from-literal=root=password123 -n mysql
kubectl apply -f manifests/mysql/mysql-cr.yaml

✅ The operator will automatically create MySQL pods and services.


---
