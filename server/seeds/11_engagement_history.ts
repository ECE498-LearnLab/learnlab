import * as Knex from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("engagement_history").del();

    // Inserts seed entries
    await knex("engagement_history").insert([
        {
            room_id: 2,
            student_id: 1,
            classification: "NOT ENGAGED",
            score: 10
        },
        {
            room_id: 1,
            student_id: 2,
            classification: "ENGAGED",
            score: 90
        },
        {
            room_id: 2,
            student_id: 1,
            classification: "ENGAGED",
            score: 80
        },
        {
            room_id: 1,
            student_id: 2,
            classification: "NOT ENGAGED",
            score: 50
        }
    ]);
};
