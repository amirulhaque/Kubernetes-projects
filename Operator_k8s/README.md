
# 🚀 Kubernetes Operator Project

### Project Overview
This project demonstrates how to use Kubernetes Operators to deploy and manage applications like **Prometheus** (Monitoring and alerting) and **MySQL** (Database management).
We use Helm to simplify operator deployment and manage CRDs (Custom Resource Definitions).

### Goals

  i. Automate deployment and scaling

  ii. Manage configurations automatically

  iii. Handle database backups seamlessly

  iv. Enable continuous monitoring with Prometheus


### What is a Kubernetes Operator?

A Kubernetes Operator is an application-specific controller that extends Kubernetes capabilities by automating the deployment, management, and operations of complex applications.

 **📌 Key Concepts**

-  Operators use Custom Resources (CRs) to define the desired state.

-  The Operator Controller continuously reconciles the actual state with the desired state.

-  Automates tasks like scaling, backups, upgrades, failover, and more.


 **🌟 Benefits**

-  Reduces manual intervention

-  Ensures consistent and reliable deployments

-  Automates complex app lifecycle operations

-  Integrates seamlessly with Kubernetes native APIs



  **Prerequisites:**
  
  Requirement Description

  1.  AWS EC2 Ubuntu 22.04 LTS, 2 vCPU, 4 GB RAM, 20 GB disk
  2.  Security Group Open ports: 22 (SSH), 30000–32767 (NodePort), 3306 (MySQL), 9090 (Prometheus), 9093 (Alertmanager), 3000 (Grafana)
  3.  Docker Installed and running
  4.  Kubernetes Cluster running (Minikube or kubeadm)
  5.  Tools kubectl, Helm (v3+) installed



---

## 🧩 Step 1: Setup Kubernetes Cluster
```bash
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
```


## 🧩 Step 2: Install Helm

```bash
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
helm version
```

## 🧩 Step 3: Deploy Prometheus Operator

```bash
# Add Helm repo
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

# Create namespace
kubectl create namespace monitoring

# Install Prometheus Operator
helm install kube-prometheus prometheus-community/kube-prometheus-stack -n monitoring
```

**✅ Verify:**

```bash
kubectl get pods -n monitoring
kubectl get crds | grep prometheus
```


## 🧩 Step 4: Deploy MySQL Operator

```bash
# Add Helm repo for MySQL operator
helm repo add presslabs https://presslabs.github.io/charts
helm repo update

# Create namespace
kubectl create namespace mysql

# Install MySQL Operator
helm install mysql-operator presslabs/mysql-operator -n mysql
```

**✅ Verify:**

```bash
kubectl get pods -n mysql
kubectl get crds | grep mysql
```



## 🧩 Step 5: Deploy Prometheus Custom Resource

**Create manifests/prometheus/prometheus-cr.yaml:**

```bash
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
```

**Apply:**

```bash
kubectl apply -f manifests/prometheus/prometheus-cr.yaml
```


## 🧩 Step 6: Deploy MySQL Custom Resource

**Create manifests/mysql/mysql-cr.yaml:**

```bash
apiVersion: mysql.presslabs.org/v1alpha1
kind: MysqlCluster
metadata:
  name: demo-mysql
  namespace: mysql
spec:
  replicas: 1
  secretName: demo-mysql-secret
```

**Create the MySQL root password secret:**

```bash
kubectl create secret generic demo-mysql-secret --from-literal=root=password123 -n mysql
kubectl apply -f manifests/mysql/mysql-cr.yaml
```

✅ The operator will automatically create MySQL pods and services.


## 🧩 Step 7: Deploy a Demo Application (for Monitoring)

```bash
kubectl create deployment demo-app --image=nginx --port=80
kubectl expose deployment demo-app --port=80
```

**Create a ServiceMonitor for Prometheus —** manifests/prometheus/servicemonitor.yaml:

```bash
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: demo-app-monitor
  namespace: monitoring
spec:
  selector:
    matchLabels:
      app: demo-app
  namespaceSelector:
    matchNames:
      - default
  endpoints:
    - port: 80
      interval: 15s
```

**Apply:**

```bash
kubectl apply -f manifests/prometheus/servicemonitor.yaml
```

✅ Prometheus will now automatically detect and scrape metrics.


## 🌐 Step 8: Access Application UIs

**Application URL Notes**

**📊 Prometheus** http://<EC2-IP>:30090 Monitoring UI

**🔔 Alertmanager** http://<EC2-IP>:30903 Alert management

**📈 Grafana** http://<EC2-IP>:3000 Included in kube-prometheus-stack

**🗄️ MySQL** mysql -h <EC2-IP> -P 3306 -u root -p Use password from secret


## 🧹 Step 9: Cleanup

```bash
helm uninstall kube-prometheus -n monitoring
helm uninstall mysql-operator -n mysql

kubectl delete namespace monitoring
kubectl delete namespace mysql
kubectl delete deployment demo-app
```


## 📚 Summary

- Operators simplify lifecycle management of complex applications.

-  Prometheus Operator automates monitoring setup.

-  MySQL Operator handles database creation and management.

-  Combined, they provide a powerful, automated, and scalable application stack on Kubernetes.


---




