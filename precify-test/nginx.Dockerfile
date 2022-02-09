FROM node:lts-alpine as angular
WORKDIR /home/node/app
COPY package.json /home/node/app
RUN npm install --silent
COPY . .
RUN npm run build -- -c production

FROM nginx:alpine
VOLUME /var/cache/nginx
COPY --from=angular home/node/app/dist/precify-test /usr/share/nginx/html
COPY ./config/nginx.conf /etc/nginx/config.d/default.conf
