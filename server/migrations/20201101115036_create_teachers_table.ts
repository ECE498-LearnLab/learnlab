import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('teachers', function (table) {
    table.integer('id').unsigned().notNullable().primary();

    table.foreign('id').references('id').inTable('users').onDelete('CASCADE');
  });
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("teachers");
}

