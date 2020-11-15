import * as Knex from "knex";


exports.up = function(knex, Promise) {
  return knex.schema.createTable('files', function (table) {
    table.increments('id');
    table.integer('class_id').unsigned().notNullable();
    table.string('storage_link').notNullable().unique();

    table.foreign('class_id').references('id').inTable('classrooms');
  });
}


exports.down = function(knex, Promise) {
  return knex.schema.dropTable("files");
}

