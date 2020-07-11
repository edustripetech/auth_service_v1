#!/usr/bin/env bash

set -e
set -o pipefail

if [ "$TEST_ONLY" == "1" ]; then
  echo ">>Running test with 'yarn test:all'..."
  yarn test:all
else
  echo ">>Running lint with 'yarn lint'..."
  yarn lint
  echo ">>Build app 'yarn build'..."
  yarn build
  echo ">>Running test with 'yarn test'..."
  yarn test
fi
