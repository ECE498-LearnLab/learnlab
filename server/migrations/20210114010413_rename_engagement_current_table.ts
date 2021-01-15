import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.renameTable('engagementCurrent', 'engagement_current');
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.renameTable('engagement_current', 'engagementCurrent');
}
