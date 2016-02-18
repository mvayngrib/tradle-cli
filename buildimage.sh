#!/bin/bash

echo 'building new docker image...'
mv node_modules $TMPDIR/tradle_cli_node_modules
docker build -t tradle/cli:dev .
mv $TMPDIR/tradle_cli_node_modules node_modules
