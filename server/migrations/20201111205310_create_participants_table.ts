import * as Knex from "knex";


exports.up = function(knex, Promise) {
  return knex.schema.createTable('participants', function (table) {
    table.integer('student_id').unsigned().notNullable();
    table.integer('room_id').unsigned().notNullable();
    table.timestamp('joined_at').defaultTo(knex.fn.now());

    table.primary(['student_id', 'room_id']);
    table.foreign('student_id').references('id').inTable('students');
    table.foreign('room_id').references('id').inTable('rooms');
  });
}


exports.down = function(knex, Promise) {
  return knex.schema.dropTable("participants");
}

