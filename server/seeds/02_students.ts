import * as Knex from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("students").del();

    // Inserts seed entries
    await knex("students").insert([
        {
            id: 1
        },
        {
            id: 2
        }
    ]);
};
