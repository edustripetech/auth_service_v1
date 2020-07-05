#!/usr/bin/env bash

export WORKING_DIR=/var/www/
export APP_WORKSPACE=${APP_WORKSPACE:-$APP_NAME}
export APP_ENV="${$APP_ENV:=local}"

echo ">>Preparing app $APP_NAME..."
echo ">>APP_ENV: $APP_ENV"

if [ $APP_ENV != "local" ]; then
  # Download and setup repository if not in local environment
  repo.sh setup
fi

#Change directory to APP_WORKSPACE
cd "$WORKING_DIR/$APP_WORKSPACE" || exit 1

#Install dependencies
echo ">>Running yarn to install or update dependencies..."
yarn

if [ $APP_ENV == "test" ]; then
  chmod +x "$WORKING_DIR/$APP_WORKSPACE/arch/scripts/run-test.sh"
  source "$WORKING_DIR/$APP_WORKSPACE/arch/scripts/run-test.sh" || exit 1
  echo ">>Test ran successfully";exit 0
else
  #Run migrations
  [ $UNDO_MIGRATION_ON_STARTUP == 1 ] && echo ">>Undoing database migrations" && yarn db:migrate:undo
  echo ">>Running database migrations"
  yarn db:migrate
fi

if [ $APP_ENV == "local" ]; then
  echo ">>Running local server..."
  yarn dev
else
  # Setup and run server
  chmod +x "$WORKING_DIR/$APP_WORKSPACE/arch/scripts/setup.sh"
  source "$WORKING_DIR/$APP_WORKSPACE/arch/scripts/setup.sh" || echo ">>Can not find setup script" && exit 1
fi
