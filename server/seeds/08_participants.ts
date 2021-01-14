import * as Knex from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("participants").del();

    // Inserts seed entries
    await knex("participants").insert([
        {
            room_id: 1,
            student_id: 1,
            status: "INVITED",
        },
        {
            room_id: 2,
            student_id: 1,
            status: "JOINED",
        },{
            room_id: 3,
            student_id: 2,
            status: "INVITED"
        },{
            room_id: 4,
            student_id: 1,
            status: "JOINED"
        },
    ]);
};
