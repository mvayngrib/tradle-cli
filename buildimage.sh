#!/bin/bash

if [ -z "$1" ]; then
  echo "specify an image tag"
  exit 1
fi

source ~/.bash_profile
echo 'building new docker image...'
cp ~/.npmrc .npmrc
docker build -t "tradle/cli:$1" .
rm -f .npmrc
