import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('files', function (table) {
    table.increments('id');
    table.integer('class_id').unsigned().notNullable();
    table.string('storage_link').notNullable().unique();

    table.foreign('class_id').references('id').inTable('classrooms');
  });
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("files");
}

