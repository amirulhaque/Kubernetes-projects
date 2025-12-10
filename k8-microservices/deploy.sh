#!/bin/bash
kubectl apply -f k8s/namespace.yaml
kubectl config set-context --current --namespace=microshop
kubectl apply -f k8s/
