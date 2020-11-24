cd ../
npx knex migrate:latest
npx knex seed:run
npm run start:dev
