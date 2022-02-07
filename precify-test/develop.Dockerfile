FROM nginx:alpine
VOLUME /var/cache/nginx
COPY ./config/nginx.conf /etc/nginx/config.d/default.conf