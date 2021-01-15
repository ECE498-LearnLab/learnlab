import * as Knex from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Inserts seed entries
    await knex("teachers").insert([
        {
            id: 3,
            prefix: "Mr"
        },
        {
            id: 4
        }
    ]);
};
