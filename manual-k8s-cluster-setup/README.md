
# 🚀 Kubernetes Manual Cluster Setup & Microservices Deployment (Azure VMs + kubeadm + Ingress + Load Balancer)

This repository documents the full end-to-end setup of a production-style Kubernetes Cluster manually installed using kubeadm, deployed on Azure VMs, with:

Containerd runtime

Flannel CNI networking

NGINX Ingress Controller

Azure Load Balancer

DNS Mapping

Multi-service Microservices Deployment

End-to-end Testing & Verification



---

📘 Architecture Overview

Cluster Architecture

+-------------------+
          | Public Internet |
          +---------+---------+
                    |
                    ▼
          +-------------------+
          | Azure LoadBalancer|
          | Public IP: X.X.X.X|
          +---------+---------+
                    |
   ---------------------------------------
   | |
   ▼ ▼
+----------+ +-------------+
| Master | | Worker Node |
| 10.0.0.4 | | 10.0.0.5 |
+----------+ +-------------+
       | |
       |------ Flannel Pod Network --------|
                10.244.0.0/16 [10.244.0.0]

Ingress Flow

User → DNS → Azure LB → NodePort (31177) → Ingress Controller → Services → Pods


---

🖥️ 1. Azure VM Provisioning

Create 2 VMs

Role VM Name Private IP Public IP

Master k8s-master 10.0.0.4 <master-public-ip>
Worker k8s-worker1 10.0.0.5 <worker-public-ip>


Security Group Rules (NSG)

Master Node NSG

Port Description

22 SSH
6443 Kubernetes API
10248-10260 Kubelet
443 HTTPS
80 HTTP
NodePort Range 30000–32767 Required
31177 Ingress NodePort
30692 HTTPS NodePort


Worker Node NSG

Same NodePort + 80/443 allowed.


---

⚙️ 2. Install Kubernetes Components

On all Nodes

sudo apt update
sudo apt install -y apt-transport-https curl
sudo modprobe br_netfilter

Install Containerd

sudo apt install -y containerd
containerd config default | sudo tee /etc/containerd/config.toml >/dev/null
sudo systemctl restart containerd

Install kubeadm, kubelet, kubectl

sudo apt-get install -y kubelet kubeadm kubectl
sudo apt-mark hold kubelet kubeadm kubectl


---

🚀 3. Initialize the Master Node

sudo kubeadm init --pod-network-cidr=10.244.0.0/16 [10.244.0.0]

Save the join command.

Setup kubectl for Master

mkdir -p $HOME/.kube
sudo cp /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config


---

🌐 4. Install Flannel CNI

kubectl apply -f https://github.com/flannel-io/flannel/releases/latest/download/kube-flannel.yml [github.com]


---

🔗 5. Join Worker Node

Run the command given by kubeadm:

sudo kubeadm join <master-ip>:6443 --token <token> --discovery-token-ca-cert-hash sha256:<hash>


---

✔️ 6. Verify Cluster

kubectl get nodes
kubectl get pods -A


---

🌍 7. Install Ingress-NGINX (Bare Metal mode)

kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/baremetal/deploy.yaml [raw.githubusercontent.com]


---

🟦 8. Configure Azure Load Balancer

Backend Pool

Add:

Master (10.0.0.4)

Worker1 (10.0.0.5)


Health Probe

Protocol: TCP

Port: 80


Load Balancer Rule

LB Port Backend Port Purpose

80 31177 Ingress HTTP
443 30692 Ingress HTTPS



---

📝 9. DNS Configuration

Example (GoDaddy):

Type Name Value

A @ LoadBalancer IP (48.221.114.169)
A www LoadBalancer IP



---

🛠️ 10. Deploy Microservices

kubectl apply -f k8-microservices/

Make sure the microshop namespace exists.


---

🌐 11. Create Ingress Rule

microshop-ingress.yaml

apiVersion: networking.k8s.io/v1 [networking.k8s.io]
kind: Ingress
metadata:
  name: microshop-ingress
  namespace: microshop
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target [nginx.ingress.kubernetes.io]: /
spec:
  ingressClassName: nginx
  rules:
  - host: amirulhaq.world
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: frontend
            port:
              number: 80

Apply:

kubectl apply -f microshop-ingress.yaml


---

🧪 12. Test Access

From inside cluster

curl -I http://amirulhaq.world [amirulhaq.world]

From outside

Open browser:

http://amirulhaq.world [amirulhaq.world]


---

🐞 13. Troubleshooting

Check Ingress Logs

kubectl logs -n ingress-nginx -l app.kubernetes.io/component=controller [app.kubernetes.io]

Check NodePort

kubectl get svc -n ingress-nginx

Check LB health probe

Use:

curl http://<node-ip>:31177


---

🎉 14. Final Result

You now have:

✔ Manually installed Kubernetes cluster (kubeadm + containerd)
✔ Flannel networking
✔ NGINX Ingress Controller
✔ Azure Load Balancer with public IP
✔ DNS with custom domain
✔ Deployed microservices
✔ Publicly accessible website

👉 Access: http://amirulhaq.world [amirulhaq.world]


---
