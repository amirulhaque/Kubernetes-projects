#!/bin/bash
REG="amirul135"
services=(api-gateway user-service product-service order-service payment-service inventory-service shipping-service notification-service review-service recommendation-service frontend)

for s in "${services[@]}"; do
  echo "Building $s..."
  docker build -t ${REG}/microshop-$s:latest ./$s
  echo "Pushing ${REG}/microshop-$s:latest ..."
  docker push ${REG}/microshop-$s:latest
done
