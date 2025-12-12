# Use a small and secure Nginx base image
FROM nginx:stable-alpine

# Copy your HTML and CSS files into Nginx's web root
COPY index.html /usr/share/nginx/html/index.html
COPY styles.css /usr/share/nginx/html/styles.css
COPY images/ /usr/share/nginx/html/images/

# Replace default Nginx site config with your custom one
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for the container
EXPOSE 80

# Start Nginx in foreground mode
CMD ["nginx", "-g", "daemon off;"]
