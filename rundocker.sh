#!/bin/bash

docker run -it --rm --name tradle-cli -e "HOME=/data" -v /data tradle/cli:1.0.0
