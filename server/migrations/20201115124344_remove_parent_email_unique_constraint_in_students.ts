import * as Knex from "knex";


exports.up = function(knex, Promise) {
  return knex.schema.alterTable('students', function (table) {
    table.dropUnique('parent_email');
  });
}


exports.down = function(knex, Promise) {
   return knex.schema.alterTable('students', function (table) {
    table.unique('parent_email');
  });
}

