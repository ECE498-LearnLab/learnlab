import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.renameTable('engagementHistory', 'engagement_history');
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.renameTable('engagement_history', 'engagementHistory');
}
