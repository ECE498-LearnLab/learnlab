import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('engagementHistory', function (table) {
        table.increments('id');
        table.integer('room_id').unsigned().notNullable();
        table.integer('student_id').unsigned().notNullable();
        table.integer('score').unsigned().notNullable();
        table.string('classification').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());

        table.foreign(['student_id', 'room_id']).references(['student_id', 'room_id']).inTable('engagementCurrent');
    })
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("engagementHistory")
}