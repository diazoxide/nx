FROM node:20.17.0-alpine3.20 AS node-base-image

WORKDIR /app

FROM node-base-image as maintainer-node

RUN apk add --update --no-cache git build-base gcc autoconf automake zlib-dev libpng-dev nasm bash vips-dev openssh-client

RUN yarn global add nx@20.0.1

FROM node-base-image AS node-runtime-image
