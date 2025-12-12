
# 🚀 Kubernetes Manual Cluster Setup & Microservices Deployment (Azure VMs + kubeadm + Ingress + Load Balancer)

**This repository contains a complete step-by-step guide for manually setting up a Kubernetes cluster on Azure Virtual Machines, deploying a microservices application, and exposing it using NGINX Ingress Controller with an Azure Load Balancer.**



# 🧩 Architecture Overview
````markdown
                                                            +----------------------+
                                                            | Public User          |
                                                            +----------+-----------+
                                                                       |
                                                                       v
                                                            +----------------------+
                                                            | Domain:              |
                                                            | amirulhaq.world      |
                                                            +----------+-----------+
                                                                       |
                                                                       v
                                                          +-------------------------+
                                                          | Azure Load Balancer     |
                                                          | (Static Public IP)      |
                                                          +-----------+-------------+
                                                                      |
                                                                      v
                                                        +----------------------------+
                                                        | NGINX Ingress Controller   |
                                                        | (Running in Kubernetes)    |
                                                        +------------+---------------+
                                                                     |
                                                                     v
                                                      +-------------------------------------+
                                                      | Kubernetes Cluster (kubeadm)        |
                                                      +-------------------------------------+
                                                      | Master Node: k8s-master             |
                                                      | Worker Node: k8s-worker1            |
                                                      +-----------------+--------------------+
                                                                        |
                                               +-------------------------------------------------------+
                                               |                                                       |
                                               v                                                       v
                                        +---------------+                                    +-------------------+
                                        | Frontend App  |                                    | Backend Services  |
                                        | (Deployment + |                                    | (API, Auth, etc.) |
                                        | Service)      |                                    | (Pods + Services) |
                                        +---------------+                                    +-------------------+

````





---

## 1. VM Provisioning
   
   Create 2 vm (2vcpu and 4 GB Ram)
   
   i.Master
   
   ii.Worker

   ### In Security Group Rules (NSG), Please make sure this rule enabled

      ```
      Master Node NSG
      ---------------
      Port Protocol Description
      22 TCP SSH Access
      6443 TCP Kubernetes API Server
      10250 TCP Kubelet API
      179 TCP/UDP Calico BGP
      
      Worker Node NSG
      ---------------
      Port Protocol Description
      22 TCP SSH Access
      10250 TCP Kubelet API
      30000-32767 TCP NodePort Range
      ```


---

⚙️ 2. Install Dependencies on Both VMs

    ```bash
        sudo apt-get update
        sudo apy-get install -y apt-transport-https ca-certificates curl
    ```

### Disable Swap
    ```bash
    sudo swapoff -a
    sudo sed -i '/ swap / s/^/#/' /etc/fstab
    sudo modprobe overlay
    sudo modprobe br_netfilter
    cat <<EOF | sudo tee /etc/sysctl.d/99-kubernetes-cri.conf
    net.bridge.bridge-nf-call-iptables = 1
    net.ipv4.ip_forward = 1
    net.bridge.bridge-nf-call-ip6tables = 1
    EOF
    sudo sysctl --system
    ```

sudo apt-get install -y apt-transport-https ca-certificates curl gnupg lsb-release


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
