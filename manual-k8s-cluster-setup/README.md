
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

## ⚙️ 2. Install Dependencies on Both VMs
```bash
sudo apt-get update
sudo apt-get install -y apt-transport-https ca-certificates curl gnupg lsb-release
```
### Disable Swap

```bash
sudo modprobe overlay
sudo modprobe br_netfilter
cat <<EOF | sudo tee /etc/sysctl.d/99-kubernetes-cri.conf
net.bridge.bridge-nf-call-iptables = 1
net.ipv4.ip_forward = 1
net.bridge.bridge-nf-call-ip6tables = 1
EOF
sudo sysctl --system
```

### Install containerd
```bash
sudo apt-get update
sudo apt-get install -y containerd
# Create default containerd config and restart
sudo mkdir -p /etc/containerd
containerd config default | sudo tee /etc/containerd/config.toml
# Use systemd cgroup driver (recommended for kubeadm)
sudo sed -i 's/SystemdCgroup = false/SystemdCgroup = true/' /etc/containerd/config.toml
sudo systemctl restart containerd
sudo systemctl enable containerd
```

### Install Kubeadm, Kubelet, Kubectl (on all nodes)
```bash
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.29/deb/Release.key [pkgs.k8s.io]   | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg
echo "deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] \
https://pkgs.k8s.io/core:/stable:/v1.29/deb/ [pkgs.k8s.io] /"   | sudo tee /etc/apt/sources.list.d/kubernetes.list
sudo apt-get update
sudo apt-get install -y kubelet kubeadm kubectl
sudo apt-mark hold kubelet kubeadm kubectl
kubeadm version
kubelet --version
kubectl version --client
```

## ⚙️ 3. Initialize the Kubernetes Master(Only on Master node)
```bash
#Initialize the control plane(run only on master)
sudo kubeadm init   --pod-network-cidr=10.244.0.0/16 [10.244.0.0]   --apiserver-advertise-address=10.0.0.4   --node-name master
```
After sucess
### Configure kubectl for the ubuntu user(on master)

```bash
mkdir -p $HOME/.kube
sudo cp /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

## ⚙️ 4. Install Pod Network(Calico/Flannel) on Master
```bash
kubectl apply -f https://github.com/flannel-io/flannel/releases/latest/download/kube-flannel.yml
```

## ⚙️ 5. Join Worker Node
This command you will get after Initialize the control plane, you need to copy it
```bash
kubeadm join <master-ip>:6443 --token <token> \
  --discovery-token-ca-cert-hash sha256:<hash>
```
  
#If you miss to copy then please again recreate it
sudo kubeadm token create --print-join-command

Run this to verify:
```bash
kubectl get nodes
```

## 📥6 **Clone the Repository**
```bash
git clone https://github.com/amirulhaque/Kubernetes-projects.git
cd manual-k8s-cluster-setup
```
After cloning you will find two script build.sh and deploy.sh

If you want to build docker image on that case you have to change manifest file and please provide your dockerhub username
or you can use the existing image which is push into docker hub just by running
```bash
./deploy.sh
kubectl get pods -n microshop
```

It will create all pod, deployment and services into cluster

## ⚙️ 7. Install Nginx Ingress Controller
```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/cloud/deploy.yaml
```

Check:-
```bash
kubectl apply ingress.yaml
kubectl get pods -n ingress-nginx
```

## ⚙️ 8.Create Azure Load Balancer (Static Public IP)

Go to Azure → Create Load Balancer

Backend Pool = Kubernetes Nodes

Health Probe = port 80

**Forwarding rule:**

Port 80 → NGINX Ingress Controller Service (NodePort)

Get ingress controller NodePort:
```bash
kubectl get svc -n ingress-nginx
```

## Connect Domain → Load Balancer IP

Go to your domain provider (Namecheap / GoDaddy)

**Create A-record:**

Host: @
Value: <Azure LB Public IP>
TTL: 300


**Access Your Application**
http://amirulhaq.world


---
