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
* RabbitMQ Management Portal http://localhost:15672/ (username:guest, password:guest)
* PostgreSQL http://localhost:5432 (username:postgres, password: postgres)

    **Note:** The database `learnlab_local` will automatically be created. In order to connect to the docker PostgreSQL, make sure to stop your local PostgreSQL service (check Services on Windows).
    * To connect to the docker database, you can use PGAdmin to create a new server with:
        * Name: your choice
        * Host name/address: localhost
        * Port: 5432
        * Username: postgres
        * Password: postgres
## Running tests

## Deployment
