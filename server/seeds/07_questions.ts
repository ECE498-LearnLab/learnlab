import * as Knex from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Inserts seed entries
    await knex("questions").insert([
        {
            room_id: 1,
            student_id: 1,
            text: "Where do babies come from?",
            upvotes: 1
        },
        {
            room_id: 2,
            student_id: 1,
            text: "Are gender traits completely a result of societal expectations?",
            upvotes: 5
        },{
            room_id: 3,
            student_id: 2,
            text: "What is the main purpose of an operating system?"
        },{
            room_id: 3,
            student_id: 2,
            text: "What is the advantage of a multiprocessor system?"
        },
    ]);
};
