FROM node:20.17.0-alpine3.20 AS node-base-image

WORKDIR /app

FROM node-base-image AS maintainer-node

RUN apk add --update --no-cache curl git build-base gcc autoconf automake zlib-dev libpng-dev nasm bash vips-dev openssl

RUN yarn global add nx@20.0.6

FROM maintainer-node AS gitlab-ci-node

# Install kubectl
RUN curl -LO https://storage.googleapis.com/kubernetes-release/release/v1.22.2/bin/linux/amd64/kubectl && \
    chmod +x ./kubectl && \
    mv ./kubectl /usr/local/bin/kubectl

# Install Helm
RUN curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/master/scripts/get-helm-3 \
        && chmod +x get_helm.sh && ./get_helm.sh

FROM node-base-image AS node-runtime-image

ARG PROJECT
ENV PROJECT=$PROJECT

ADD /docker-entrypoint.sh /docker-entrypoint-custom.sh
RUN chmod 755 /docker-entrypoint-custom.sh
RUN addgroup --system ${PROJECT} && adduser --system -G ${PROJECT} ${PROJECT}

ADD /dist/libs ./libs
ADD /dist/apps ./apps
ADD /package.json ./package.json
ADD /.yarnrc.yml ./.yarnrc.yml
ADD /.yarn ./.yarn
ADD /yarn.lock ./yarn.lock
RUN yarn

ENTRYPOINT ["/docker-entrypoint-custom.sh"]

CMD [ "node", "--require", "./node_modules/dd-trace/init", "./apps/$PROJECT/main.js" ]
