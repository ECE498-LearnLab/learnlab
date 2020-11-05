import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('takes', function (table) {
    table.integer('student_id').unsigned().notNullable();
    table.integer('class_id').unsigned().notNullable();
    table.primary(['student_id', 'class_id']);

    table.foreign('student_id').references('id').inTable('students');
    table.foreign('class_id').references('id').inTable('classrooms');
  });
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("takes");
}

