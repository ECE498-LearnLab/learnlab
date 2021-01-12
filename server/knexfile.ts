// Update with your config settings.

module.exports = {

  development: {
    client: "postgresql",
    connection: {
      host: "db",
      port: 5432,
      database: "learnlab_local",
      user: "postgres",
      password: "postgres"
    },
    migrations: {
      tableName: "knex_migrations"
    }
  },

  production: {
    client: "postgresql",
    connection: {
      host: "learnlab-1.csosestc6lcm.ca-central-1.rds.amazonaws.com",
      port: 5432,
      database: "learnlab",
      user: "postgres",
      password: "postgres"
    },
    migrations: {
      tableName: "knex_migrations"
    }
  },

};
