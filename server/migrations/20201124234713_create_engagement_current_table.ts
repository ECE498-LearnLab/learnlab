import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('engagementCurrent', function (table) {
        table.integer('room_id').unsigned().notNullable();
        table.integer('student_id').unsigned().notNullable();
        table.integer('score').unsigned().notNullable();
        table.string('classification').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
        table.primary(['student_id', 'room_id']);

        table.foreign('student_id').references('id').inTable('students');
        table.foreign('room_id').references('id').inTable('rooms');
    })
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("engagementCurrent")
}