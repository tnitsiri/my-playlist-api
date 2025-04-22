# build
FROM node:22.14.0 AS build-stage
WORKDIR /usr/src/app

# args
ARG GITHUB_PERSONAL_ACCESS_TOKEN

# copy
COPY . .

# npmrc
RUN touch ./.npmrc
RUN echo $'@fandom-me:registry=https://npm.pkg.github.com/fandom-me\n//npm.pkg.github.com/:_authToken=${GITHUB_PERSONAL_ACCESS_TOKEN}\nregistry=https://registry.npmjs.org/\nlegacy-peer-deps=true' > ./.npmrc

# install
RUN apt-get update || : && apt-get install python3 -y
RUN npm install
RUN npm run build

# server
FROM node:22.14.0-alpine AS server
WORKDIR /usr/src/app

# args
ARG GITHUB_PERSONAL_ACCESS_TOKEN

ARG MONGODB_URI

ARG REDIS_AUTH_PASS

ARG DIGITALOCEAN_SPACES_ACCESS_KEY_ID
ARG DIGITALOCEAN_SPACES_SECRET_ACCESS_KEY

# copy
COPY --from=build-stage /usr/src/app/dist /usr/src/app
COPY package*.json ./

# npmrc
RUN touch ./.npmrc
RUN echo $'@fandom-me:registry=https://npm.pkg.github.com/fandom-me\n//npm.pkg.github.com/:_authToken=${GITHUB_PERSONAL_ACCESS_TOKEN}\nregistry=https://registry.npmjs.org/\nlegacy-peer-deps=true' > ./.npmrc

# install
RUN apk update && apk add g++ make && rm -rf /var/cache/apk/*
RUN npm install --only=production
RUN rm -f .npmrc

# envs
ENV NODE_ENV=production
ENV ENV_NAME=production

ENV MONGODB_URI=${MONGODB_URI}

ENV REDIS_HOST=redis
ENV REDIS_PORT="6379"
ENV REDIS_AUTH_PASS=${REDIS_AUTH_PASS}

ENV DIGITALOCEAN_SPACES_ACCESS_KEY_ID=${DIGITALOCEAN_SPACES_ACCESS_KEY_ID}
ENV DIGITALOCEAN_SPACES_SECRET_ACCESS_KEY=${DIGITALOCEAN_SPACES_SECRET_ACCESS_KEY}
ENV DIGITALOCEAN_SPACES_REGION=sgp1
ENV DIGITALOCEAN_SPACES_ENDPOINT=https://sgp1.digitaloceanspaces.com
ENV DIGITALOCEAN_SPACES_BUCKET=fandom
ENV DIGITALOCEAN_SPACES_NAMESPACE=zimpligital

ENV API_URL=https://zimpligital.fandom.me

# expose
EXPOSE 4500

# command
CMD ["node", "main"]
