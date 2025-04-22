#!/bin/bash

# variable
IMAGE="ghcr.io/fandom-me/zimpligital:prod"

# image
docker pull $IMAGE

# container
if [ $(docker ps -qa --filter name=^/FANDOM_ZIMPLIGITAL) ] 
then 
  docker rm -f FANDOM_ZIMPLIGITAL
fi

docker run \
  --name FANDOM_ZIMPLIGITAL \
  --restart unless-stopped \
  --link REDIS:redis \
  -e "VIRTUAL_HOST=zimpligital.fandom.me" \
  -e "VIRTUAL_PORT=4500" \
  -e "LETSENCRYPT_HOST=zimpligital.fandom.me" \
  -e "LETSENCRYPT_EMAIL=tnitsiri@hotmail.com" \
  -d $IMAGE

# clear unuse images
docker image prune -f
docker system prune -af
