import * as Knex from "knex";


exports.up = function(knex, Promise) {
  return knex.schema.createTable('questions', function (table) {
    table.increments('id');
    table.integer('student_id').unsigned().notNullable();
    table.integer('room_id').unsigned().notNullable();
    table.string('text').notNullable();
    table.integer('upvotes').unsigned().notNullable().defaultTo(0);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('deleted_at');

    table.foreign('student_id').references('id').inTable('students');
    table.foreign('room_id').references('id').inTable('rooms');
  });
}


exports.down = function(knex, Promise) {
  return knex.schema.dropTable("questions");
}

