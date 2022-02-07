FROM node:lts-alpine
WORKDIR /home/node/app

USER root
RUN npm install -g json-server
ENV PORT_JSON_SERVER 3000
ENTRYPOINT json-server -p $PORT_JSON_SERVER -H 0.0.0.0 config/db.json --routes config/routes.json
EXPOSE $PORT_JSON_SERVER

#docker build -t json-server .
#docker run -d -p 3000:3000 -v $pwd/data:/home/node/app json-server