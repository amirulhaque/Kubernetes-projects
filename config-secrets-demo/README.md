# Go ConfigMaps & Secrets Demo (Kubernetes)

This project demonstrates how to use **Kubernetes ConfigMaps** and **Secrets** with a simple Go HTTP server.  
The app reads configuration values (non-sensitive) from ConfigMaps and credentials (sensitive) from Secrets, both via **environment variables** and **mounted files**.

---

## ✨ **What are ConfigMaps and Secrets?**

- **ConfigMap** → Stores non-sensitive configuration data (like app settings, file paths, or JSON configs).  
  Example: App environment (`APP_MODE` = production), feature flags, URLs.

- **Secret** → Stores sensitive information (like database passwords, AWS keys, API tokens).  

---

## 🔒 **Why use them?**

- **Separation of configs and code** → You don’t need to rebuild images for config changes.  
- **Security** → Sensitive data stays outside container images and repos.  
- **Portability** → Same app can run in different environments by just changing ConfigMap/Secret.  
- **Flexibility** → Configs can be injected as env vars or files mounted into the pod.  

---

## ⚙️ **Prerequisites**

1. An **EC2 instance (or VM)** with Kubernetes setup (Minikube, kubeadm, or EKS).  
2. **Docker** installed & running.  
3. **kubectl** CLI installed.  
4. GitHub repo cloned to your system.  

---

## 🚀 Features
- Minimal **Go web app** (`main.go`)
- **Multi-stage Dockerfile** → small final image
- Kubernetes manifests:
  - `ConfigMap` → app settings
  - `Secret` → DB credentials / API key
  - `Deployment` → mounts env vars + secret volume
  - `Service` → exposes the app inside cluster
- Step-by-step build, deploy, and test instructions



---

## 📥 **Clone the Repository**
```bash
git clone https://github.com/amirulhaque/Kubernetes-projects.git
cd config-secrets-demo
```

# 🐳 Dockerfile
```bash
# Step 1: build stage
FROM golang:1.21-alpine AS builder
WORKDIR /app
COPY . .
RUN go mod init config-secrets-demo && go build -o server main.go

# Step 2: runtime stage (tiny image)
FROM alpine:3.18
WORKDIR /app
COPY --from=builder /app/server .
EXPOSE 8080
CMD ["./server"]
```

**Stage 1: build the Go binary**

**Stage 2: run it in a minimal Alpine image**



---

# 🛠️ Build & Deploy

1. Build & Push Docker image
```bash
docker build -t <YOUR_REGISTRY>/go-config-secrets-demo:1.0 .
docker push <YOUR_REGISTRY>/go-config-secrets-demo:1.0
```

2. Apply ConfigMap & Secret
```bash
kubectl apply -f configmap.yaml
kubectl apply -f secret.yaml
```

3. Deploy Application
```bash
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
```

4. Verify
```bash
kubectl get pods
kubectl get svc
curl http://localhost:8080/config
```

5. Search in browser
```bash
http://ec2-public-ip:nodeport
```

---

**Expected output:**
```yaml
APP_ENV=staging
LOG_LEVEL=debug
DB_HOST=postgres.default.svc.cluster.local
DB_USER_present=true
DB_PASSWORD_present=true
DB_PASSWORD_file_present=true
```


---
