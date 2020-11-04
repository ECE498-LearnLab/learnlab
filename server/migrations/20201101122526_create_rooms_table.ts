import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('rooms', function (table) {
    table.increments('id');
    table.integer('class_id').unsigned().notNullable();
    table.string('room_name');
    table.string('room_uuid').unique();
    table.string('room_status');
    table.timestamp('start_time').defaultTo(knex.fn.now());
    table.timestamp('end_time').defaultTo(knex.fn.now());
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    table.foreign('class_id').references('id').inTable('classrooms');
  });
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("rooms");
}

