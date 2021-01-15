import * as Knex from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Inserts seed entries
    await knex("takes").insert([
        {
            student_id: "1",
            class_id: "1"
        },
        {
            student_id: "2",
            class_id: "1"
        },
        {
            student_id: "5",
            class_id: "1"
        },
        {
            student_id: "6",
            class_id: "1"
        },
        {
            student_id: "7",
            class_id: "1"
        },
        {
            student_id: "1",
            class_id: "2"
        },
        {
            student_id: "2",
            class_id: "2"
        },
        {
            student_id: "5",
            class_id: "2"
        },
        {
            student_id: "6",
            class_id: "2"
        },
        {
            student_id: "7",
            class_id: "2"
        }
    ]);
};
