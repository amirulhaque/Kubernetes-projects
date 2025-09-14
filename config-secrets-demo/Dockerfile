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
