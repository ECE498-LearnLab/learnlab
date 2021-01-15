import * as Knex from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Inserts seed entries
    await knex("students").insert([
        {
            id: 1
        },
        {
            id: 2
        },
        {
            id: 5,
            parent_email: "jiaying@parent.com"
        },
        {
            id: 6
        },
        {
            id: 7,
            parent_email: "jiaying@parent.com"
        }
    ]);
};
