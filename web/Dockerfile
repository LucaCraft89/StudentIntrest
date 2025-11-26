FROM nginx:alpine

WORKDIR /usr/share/nginx/html

# Copy web files from build context root
COPY web/index.html .
COPY web/nginx.conf /etc/nginx/conf.d/default.conf

# Copy shared files
COPY shared ./shared

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1
