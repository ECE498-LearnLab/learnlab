import * as Knex from "knex";

exports.up = function (knex: Knex): Promise<void>  {
  return knex.schema.alterTable('files', function (table) {
    table.string('filename');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};


exports.down = function (knex: Knex): Promise<void>  {
   return knex.schema.table('files', (table) => {
        table.dropColumn('filename');
        table.dropColumn('created_at');
    });
};