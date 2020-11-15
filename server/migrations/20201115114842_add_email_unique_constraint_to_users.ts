import * as Knex from "knex";


exports.up = function(knex, Promise) {
  return knex.schema.alterTable('users', function (table) {
    table.unique('email');
  });
}


exports.down = function(knex, Promise) {
   return knex.schema.alterTable('users', function (table) {
    table.dropUnique('email');
  });
}

