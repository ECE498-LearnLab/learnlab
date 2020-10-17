# Learnlab

## Requirements
### Docker
https://docs.docker.com/desktop/

### PostgreSQL (12.4)
Note: You'll need to remember the superuser credentials because they are needed to create the local database!
  * For Windows follow steps 1 and 2 [here](https://www.microfocus.com/documentation/idol/IDOL_12_0/MediaServer/Guides/html/English/Content/Getting_Started/Configure/_TRN_Set_up_PostgreSQL.htm)
  * For MAC make sure to have PostgreSQL installed on your machine

The following command should work if you installed it correctly
```
psql -V
```


## Setup
### Database
To setup the local database run the following command:
```
psql -U <username> -c "create database learnlab_local"
```
Note: replace `<username>` with the superuser username. The command will prompt you for the superuser password.

### To Run
```
docker-compose up
```

This will start the following services:
* Web http://localhost:3000
* Server http://localhost:4000

## Running tests

## Deployment
