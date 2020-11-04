import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('students', function (table) {
    table.integer('id').unsigned().notNullable().primary();
    table.string('parent_email').unique();

    table.foreign('id').references('id').inTable('users').onDelete('CASCADE');
  });
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("students");
}

