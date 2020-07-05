#!/usr/bin/env bash

set -e
set -o pipefail

echo ">>Running lint with 'yarn lint'..."
yarn lint

echo ">>Running test with 'yarn test'..."
yarn test
