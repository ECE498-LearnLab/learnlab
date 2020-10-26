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

};
