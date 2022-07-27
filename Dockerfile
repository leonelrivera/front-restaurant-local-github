# FROM node:17-buster
FROM node:17-alpine3.15
RUN npm install -g @quasar/cli

WORKDIR front

EXPOSE ${PUERTO}
# EXPOSE 8080