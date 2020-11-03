import * as Knex from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("engagement_stats_history").del();

    // Inserts seed entries
    await knex("engagement_stats_history").insert([
        {
            id: 1,
            room_id: 1,
            student_id: 1,
            score: 80,
            classification: 'engaged',
        },
        {
            id: 2,
            room_id: 1,
            student_id: 2,
            score: 30,
            classification: 'not engaged',
        },
        {
            id: 3,
            room_id: 1,
            student_id: 3,
            score: 90,
            classification: 'engaged',
        },
    ]);
};
