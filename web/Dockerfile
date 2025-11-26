FROM nginx:alpine

# Copy web files
COPY index.html /usr/share/nginx/html/
COPY ../shared/ /usr/share/nginx/html/shared/

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1
