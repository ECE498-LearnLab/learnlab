import * as Knex from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Inserts seed entries
    await knex("teaches").insert([
        {
            teacher_id: "3",
            class_id: "2"
        },
        {
            teacher_id: "4",
            class_id: "1"
        }
    ]);
};
