import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('questions', function (table) {
    table.increments('id');
    table.integer('student_id').unsigned().notNullable();
    table.integer('room_id').unsigned().notNullable();
    table.string('text').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('deleted_at');

    table.foreign('student_id').references('id').inTable('students');
    table.foreign('room_id').references('id').inTable('rooms');
  });
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("questions");
}

