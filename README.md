# Learnlab

## Requirements
### Docker
https://docs.docker.com/desktop/

## Setup
### To Run
```
docker-compose up
```

This will start the following services:
* Web http://localhost:3000
* Server http://localhost:4000
* RabbitMQ Management Portal http://localhost:15672/
* PostgreSQL http://localhost:5432 (username:postgres, password: postgres)
**Note:** The database `learnlab_local` will automatically be created. In order to connect to the docker PostgreSQL, you can't have a local PostgreSQL running.

## Running tests

## Deployment
