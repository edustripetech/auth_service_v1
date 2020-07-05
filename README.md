# Edustripe.com Authentication Service

This repository houses the Edustripe Authentication API

## Technologies
[Node](https://nodejs.org/en/)

[Express](https://expressjs.com/)

## Setup

- Dependencies: First, install the project's dependencies. Run this command in the project's root folder:
```bash
$ yarn install
```

- Environment variables: Create a `.env` file and copy the variables in the example file by running 
```bash
$ cp .env.example .env
```

## Start Server
Start the development server by running
```bash
$ yarn run dev
```

## Run development server with docker
Ensure you have docker and docker-compose installed on your machine, then run
```bash
$ docker-compose build
$ docker-compose up -d app
```

## Run test with docker
Ensure you have docker and docker-compose installed on your machine, then run
```bash
$ docker-compose build
$ docker-compose run -e APP_ENV=test app 
```
