import * as Knex from "knex";


export async function up (knex: Knex): Promise<void> {
    return knex.schema.createTable('engagement_average', (table) => {
        table.integer('room_id').unsigned().primary();
        table.integer('score').unsigned().notNullable();
        table.timestamp('taken_at').defaultTo(knex.fn.now());

        table.foreign('room_id').references('id').inTable('rooms');
    });
}


export async function down (knex: Knex): Promise<void> {
    return knex.schema.dropTable('engagement_average');
}

