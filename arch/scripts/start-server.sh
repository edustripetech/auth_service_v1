#!/usr/bin/env bash

set -e
set -o pipefail

if [ $APP_ENV == "local" ]; then
  echo ">>Running local server..."
  yarn dev
else
  # Build and run server
  echo ">>Building app with 'yarn build...'"
  yarn build
  echo "Starting $APP_ENV server..."
  yarn start
fi
