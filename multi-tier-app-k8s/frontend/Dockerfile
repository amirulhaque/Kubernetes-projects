# Step 1: Build React app
FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Step 2: Nginx for serving static files
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Copy built React files
COPY --from=build /app/build .

# Copy entrypoint script that injects env vars
COPY env.sh /docker-entrypoint.d/env.sh

# Make sure script is executable
RUN chmod +x /docker-entrypoint.d/env.sh

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
