#!/bin/bash

# creates a container the first time around
# ignores error subsequently
docker create -v /tdata --name tradle-cli-data cogniteev/echo &>/dev/null
docker run -it --rm --name tradle-cli -e "HOME=/tdata" --volumes-from tradle-cli-data tradle/cli:1.0.0
