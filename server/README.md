# Server Usage
1. `cd server`
2. `npm install`
3. `npm run start:watch` to run the server (watches for changes)

> **Alternative**: `npm run start:dev` to run the server *and* automatically regenerate types.

`npm run start` to build and run.

## Generating Types
Run `npm run typegen` to watch modifications to the GraphQL schema and regenerate types.

# Migrations
## Setup
1. If you haven't already, `npm install -g knex` to install knex globally
2. If you haven't already, add `$NODE_PATH` to your environment variables that points to `%USERPROFILE%\AppData\Roaming\npm\node_modules` (windows)

### Connecting to Docker
1. Grab docker container id by `docker ps` and looking for `learnlab_server`
2. `docker exec -it <container_id> bash` (if `bash` doesn't work, try `sh`)

## Creating a new migration
You can do this in the docker container. 
`npx knex migrate:make name_of_migration -x ts`

## Testing Locally
See [Migrations API](http://knexjs.org/#Migrations-API) for how to run and rollback migrations.

I find `migrate:up` and `migrate:down` the most useful.

## Setting up your db for the first time
After successfully running the migrations, you should initially seed your database with data. This can be done inside the docker container by running `npx knex seed:run`. This will run ALL the seeds. Make sure your tables are EMPTY before running the seeds!

## Production Database Migration
After merging a migration file, you need to update the production database with the new schema changes. Currently this needs to be done locally (in the server directory) by running the following command:

`npx knex migrate:latest --env production`

**Note:** To avoid potential problems, make sure this is done on the latest master branch!

After running the command, connect to the production database (you can use pgAdmin) and ensure that the changes are good.
