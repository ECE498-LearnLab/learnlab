import * as Knex from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Inserts seed entries
    await knex("rooms").insert([
        {
            id: 1,
            class_id: 1,
            room_name: "Biology Lesson 1",
            room_uuid: "0208002a-da45-4506-9ff4-test01uuidv4",
            room_status: "SCHEDULED"
        },
        {
            id: 2,
            class_id: 1,
            room_name: "Biology Lesson 2",
            room_uuid: "0208002a-da45-4506-9ff4-test02uuidv4",
            room_status: "ONGOING"
        },
        {
            id: 3,
            class_id: 2,
            room_name: "OS Lesson 1",
            room_uuid: "0208002a-da45-4506-9ff4-test03uuidv4",
            room_status: "ONGOING"
        },
        {
            id: 4,
            class_id: 2,
            room_name: "OS Lesson 2",
            room_uuid: "0208002a-da45-4506-9ff4-test04uuidv4",
            room_status: "ENDED"
        },
    ]);
};
