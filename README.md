# 🚀 Kubernetes - The Container Orchestration Platform

## 🌐 1. What is Kubernetes?

Kubernetes (a.k.a **K8s**) is an **open-source container orchestration platform**.  
- Originally designed by **Google**, now maintained by the **Cloud Native Computing Foundation (CNCF)**.  
- **Purpose**: Automate the deployment, scaling, networking, and management of containerized applications.

💡 **Without Kubernetes**: You’d have to run, stop, scale, and update containers manually.  
💡 **With Kubernetes**: You declare what you want (e.g., *“I want 5 replicas of my app”*), and Kubernetes ensures it.

---

## ⚡ 2. Why Kubernetes?

- **Scalability** → Scale applications up or down easily.  
- **High availability** → Your app stays up even if some nodes fail.  
- **Self-healing** → Automatically restarts crashed pods.  
- **Load balancing** → Distributes traffic across pods.  
- **Rolling updates & rollbacks** → Zero downtime deployments.  
- **Portability** → Works on AWS, GCP, Azure, or on-premises.  

---

## 🏗️ 3. Kubernetes Architecture

A **Kubernetes cluster** = **Control Plane** + **Worker Nodes**

### 🧠 Control Plane (Brain)
- **API Server** → Entry point for all `kubectl` / REST commands.  
- **etcd** → Key-value store that keeps cluster state.  
- **Scheduler** → Decides which node a Pod will run on.  
- **Controller Manager** → Ensures desired state (e.g., *3 replicas must always run*).  
- **Cloud Controller Manager** → Integrates with cloud providers.  

### 💪 Worker Nodes (Muscles)
- **Kubelet** → Talks to API server, runs Pods on the node.  
- **Kube-proxy** → Manages networking/routing for Pods.  
- **Container Runtime** → (Docker, containerd, CRI-O) runs actual containers.  
- **Pod(s)** → The running container workloads.  

---

## 📦 4. Kubernetes Core Concepts

### 🔹 Pod
- Smallest deployable unit in Kubernetes.  
- Encapsulates **1 or more containers** (usually one).  
- Example: An `nginx` container running in a pod.  

### 🔹 ReplicaSet
- Ensures a fixed number of Pod replicas are always running.  
- If a pod dies → ReplicaSet spawns a new one.  

### 🔹 Deployment
- Higher-level controller that manages ReplicaSets.  
- Provides **rolling updates**, **rollbacks**, and **scaling**.  
- Most commonly used for **stateless applications**.  

### 🔹 Service
- Provides stable networking for Pods (since Pods have dynamic IPs).  
- **Types**:  
  - `ClusterIP` → Accessible only inside the cluster (default).  
  - `NodePort` → Exposes on a port across all nodes.  
  - `LoadBalancer` → Exposes using cloud load balancers.  
  - `ExternalName` → Maps service to external DNS.  

### 🔹 ConfigMap & Secret
- **ConfigMap** → Stores **non-sensitive** configuration (key-value).  
- **Secret** → Stores **sensitive** data (passwords, tokens), base64 encoded.  

### 🔹 Namespace
- Provides **logical isolation** within a cluster.  
- Useful for separating environments: `dev`, `staging`, `prod`.  

### 🔹 Ingress
- Manages **external HTTP/HTTPS traffic**.  
- Acts like a **smart router** with rules for URLs/domains.  

### 🔹 Persistent Volume (PV) & Persistent Volume Claim (PVC)
- **PV** → Actual physical storage (disk, NFS, cloud volume).  
- **PVC** → A request for storage by Pods.  
- Ensures storage is **not lost** when Pods restart.  

### 🔹 StatefulSet
- Like Deployment, but for **stateful apps** (databases, Kafka, etc.).  
- Provides **stable pod names**, **ordered deployments**, **persistent storage**.  

### 🔹 DaemonSet
- Ensures a pod runs on **every node**.  
- Example: Monitoring agent (**Prometheus Node Exporter**) or logging agent (**Fluentd**).  

---

## 🏗️ 5. Workloads & Controllers

### 🔹 Job
- Runs a task until completion (not long-running like Deployments).  
- Example: Data processing batch jobs.  
- If the pod fails, Job will retry.  

### 🔹 CronJob
- Schedules Jobs like a Linux `cron`.  
- Example: Backup a database every night at 2 AM.  

---

## 🔐 6. Security in Kubernetes

Security is a **big part** of Kubernetes:

### 🔹 RBAC (Role-Based Access Control)
- Controls **who can do what** in the cluster.  
- **Resources**:  
  - `Role` → permissions within a namespace.  
  - `ClusterRole` → permissions cluster-wide.  
  - `RoleBinding` / `ClusterRoleBinding` → attach roles to users/service accounts.  

### 🔹 Service Accounts
- Identities for Pods to interact with the API securely.  
- Useful for apps that need cluster access.  

### 🔹 Network Policies
- Control which pods/services can talk to each other.  
- Example: Allow only `frontend → backend` traffic, block all others.  

### 🔹 Pod Security Standards
- Define policies like:  
  - Run as non-root  
  - Restrict privileged containers  
  - Restrict hostPath mounts  

---

## 🛰️ 7. Networking (Advanced)

### 🔹 CNI (Container Network Interface)
- Plugins that provide pod networking.  
- Popular ones: **Calico**, **Flannel**, **Cilium**.  

### 🔹 DNS in Kubernetes
- Every Service gets a DNS name automatically:

---

## 📂 8. Storage in Kubernetes

### 🔹 StorageClass
- Defines types of storage (fast SSD, slow HDD, cloud block storage).  
- Automates dynamic provisioning of PersistentVolumes.  

### 🔹 CSI (Container Storage Interface)
- Standard to integrate any storage system into Kubernetes.  
- Cloud providers (AWS EBS, Azure Disk, GCP PD) all use CSI drivers.  

---

## 🔧 9. Configuration Management

### 🔹 Downward API
- Lets pods access their own metadata (name, namespace, labels).  

### 🔹 Resource Limits & Requests
- Define **CPU/Memory requests** (minimum) and **limits** (maximum) per container.  

---

## 📊 10. Monitoring & Logging

### 🔹 Metrics Server
- Collects CPU/memory usage.  
- Required for **HPA (Horizontal Pod Autoscaler)**.  

### 🔹 Prometheus & Grafana
- **Prometheus** → collects metrics.  
- **Grafana** → visualizes dashboards.  

### 🔹 Logging
- Logs are ephemeral → usually sent to:  
- **EFK** (Elasticsearch, Fluentd, Kibana)  
- **Loki + Grafana**  

---

## 🚀 11. Scaling & Autoscaling

### 🔹 Horizontal Pod Autoscaler (HPA)
- Scales pods in/out based on CPU/memory or custom metrics.  

### 🔹 Vertical Pod Autoscaler (VPA)
- Adjusts resource requests/limits automatically.  

### 🔹 Cluster Autoscaler
- Adds/removes nodes in the cluster based on demand (in cloud environments).  

---

## 📦 12. Packaging & App Management

### 🔹 Helm
- Kubernetes package manager.  
- Helm charts = pre-configured apps (like MySQL, WordPress).  
- Example:  
```bash
helm repo add bitnami https://charts.bitnami.com/bitnami
helm install mydb bitnami/mysql
```

## 🎯 Suggested Learning Path

Here’s the remaning topic to master in kubernetes:

1. **Workloads**  
   - Jobs  
   - CronJobs  

2. **Security**  
   - RBAC (Roles, ClusterRoles, RoleBindings)  
   - Service Accounts  
   - Network Policies  
   - Pod Security Standards  

3. **Networking**  
   - CNI Plugins (Calico, Flannel, Cilium)  
   - DNS in Kubernetes  
   - Ingress Controllers  

4. **Storage**  
   - Persistent Volumes (PV) & Persistent Volume Claims (PVC)  
   - StorageClass  
   - CSI (Container Storage Interface)  

5. **Configuration Management**  
   - ConfigMaps & Secrets  
   - Downward API  
   - Resource Limits & Requests  
   - Affinity, Taints & Tolerations  

6. **Monitoring & Logging**  
   - Metrics Server  
   - Prometheus & Grafana  
   - EFK (Elasticsearch, Fluentd, Kibana) / Loki  

7. **Scaling & Autoscaling**  
   - Horizontal Pod Autoscaler (HPA)  
   - Vertical Pod Autoscaler (VPA)  
   - Cluster Autoscaler  

8. **Packaging & App Management**  
   - Helm  
   - Kustomize  

9. **Service Mesh**  
   - Istio  
   - Linkerd  

10. **CI/CD**  
    - ArgoCD  
    - Tekton  
    - Jenkins X  

11. **Disaster Recovery**  
    - Velero  
    - High Availability setups  

12. **Ecosystem Tools**  
    - k9s  
    - Lens  
    - Harbor
