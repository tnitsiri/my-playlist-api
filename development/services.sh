#!/bin/bash

# redis
if [ $(docker ps -qa --filter name=^/REDIS$) ]
then 
  docker rm -f REDIS
fi

docker run \
  --name REDIS \
  -v $(pwd)/development/redis/configs/redis.conf:/opt/bitnami/redis/mounted-etc/redis.conf \
  -v $(pwd)/data/redis:/bitnami/redis/data \
  -p 6379:6379 \
  -e ALLOW_EMPTY_PASSWORD=yes \
  -d bitnami/redis:7.4.2

# for windows
if [ "$OSTYPE" == "msys" ] || [ "$OSTYPE" == "win32" ];
then
  printf "\n"
  read -p "Press any key to continue..." x
fi
