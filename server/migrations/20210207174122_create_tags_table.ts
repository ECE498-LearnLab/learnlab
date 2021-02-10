import * as Knex from "knex";


export async function up (knex: Knex): Promise<void> {
  return knex.schema.createTable('tags', function (table) {
    table.increments('id');
    table.integer('class_id').unsigned().notNullable();
    table.string('tag').notNullable();

    table.foreign('class_id').references('id').inTable('classrooms');
  });
}


export async function down (knex: Knex): Promise<void> {
  return knex.schema.dropTable("tags");
}
