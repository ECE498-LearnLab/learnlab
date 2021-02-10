import * as Knex from "knex";

exports.up = function (knex: Knex): Promise<void>  {
  return knex.schema.alterTable('tags', function (table) {
    table.string('color');
  });
};


exports.down = function (knex: Knex): Promise<void>  {
   return knex.schema.table('tags', (table) => {
        table.dropColumn('color');
    });
};