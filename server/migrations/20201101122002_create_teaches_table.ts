import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('teaches', function (table) {
    table.integer('teacher_id').unsigned().notNullable();
    table.integer('class_id').unsigned().notNullable();
    table.primary(['teacher_id', 'class_id']);

    table.foreign('teacher_id').references('id').inTable('teachers');
    table.foreign('class_id').references('id').inTable('classrooms');
  });
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("teaches");
}

