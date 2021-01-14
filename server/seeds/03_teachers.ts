import * as Knex from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("teachers").del();

    // Inserts seed entries
    await knex("teachers").insert([
        {
            id: 3
        },
        {
            id: 4
        }
    ]);
};
