#!/bin/bash

docker run -it --rm --name tradle-cli -e "HOME=/home" -v $(pwd):/home tradle/cli:1.0.0
