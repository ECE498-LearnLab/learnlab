import * as Knex from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Inserts seed entries
    await knex("participants").insert([
        {
            room_id: 1,
            student_id: 1
        },
        {
            room_id: 2,
            student_id: 1,
            status: "JOINED",
        },{
            room_id: 3,
            student_id: 1
        },{
            room_id: 4,
            student_id: 1,
            status: "JOINED"
        },
        {
            room_id: 1,
            student_id: 2
        },
        {
            room_id: 2,
            student_id: 2,
            status: "JOINED",
        },
        {
            room_id: 3,
            student_id: 2,
            status: "JOINED",
        },
        {
            room_id: 2,
            student_id: 5,
            status: "JOINED",
        },
        {
            room_id: 3,
            student_id: 5
        },
        {
            room_id: 4,
            student_id: 5,
            status: "JOINED",
        },
        {
            room_id: 2,
            student_id: 6
        },
        {
            room_id: 1,
            student_id: 6
        },
        {
            room_id: 4,
            student_id: 6,
            status: "JOINED",
        },
        {
            room_id: 1,
            student_id: 7
        },
        {
            room_id: 2,
            student_id: 7,
            status: "JOINED",
        },
        {
            room_id: 3,
            student_id: 7,
            status: "JOINED",
        },
        {
            room_id: 4,
            student_id: 7,
            status: "JOINED"
        },

    ]);
};
