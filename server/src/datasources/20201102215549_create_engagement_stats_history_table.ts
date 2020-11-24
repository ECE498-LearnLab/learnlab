// import * as Knex from "knex";
//
//
// export async function up(knex: Knex): Promise<void> {
//     return knex.schema.createTable('engagement_stats_history', function (table) {
//         table.increments('id');
//         table.integer('room_id').notNullable();
//         table.integer('student_id').notNullable();
//         table.integer('score').notNullable();
//         table.string('classification').notNullable();
//         table.timestamp('created_at').defaultTo(knex.fn.now());
//         table.timestamp('updated_at').defaultTo(knex.fn.now());
//         table.primary(['student_id', 'room_id']);
//
//         table.foreign('student_id').references('id').inTable('students');
//         table.foreign('room_id').references('id').inTable('rooms');
//
//         knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
//
//     })
// }
//
// export async function down(knex: Knex): Promise<void> {
//     return knex.schema.dropTable("engagement_stats_history")
// }