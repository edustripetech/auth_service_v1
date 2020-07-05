#!/usr/bin/env bash

set -e
set -o pipefail

#Building app
echo ">>Building app with 'yarn build'"
yarn build
