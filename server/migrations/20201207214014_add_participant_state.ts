import * as Knex from "knex";


export async function up (knex: Knex): Promise<void> {
    return knex.schema.table('participants', (table) => {
        table.enum('status', ['INVITED', 'JOINED'], {
            useNative: true,
            enumName: 'participant_status'
        }).notNullable().defaultTo('INVITED');
    });
}


export async function down (knex: Knex): Promise<void> {
    await knex.schema.table('participants', (table) => {
        table.dropColumn('status');
    });

    return knex.schema.raw('DROP TYPE participant_status');
}

