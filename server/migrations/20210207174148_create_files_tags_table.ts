import * as Knex from "knex";


export async function up (knex: Knex): Promise<void> {
  return knex.schema.createTable('files_tags', function (table) {
    table.integer('file_id').unsigned().notNullable();
    table.integer('tag_id').unsigned().notNullable();
    table.primary(['file_id','tag_id']);

    table.foreign('file_id').references('id').inTable('files');
    table.foreign('tag_id').references('id').inTable('tags');
  });
}


export async function down (knex: Knex): Promise<void> {
  return knex.schema.dropTable("files_tags");
}
