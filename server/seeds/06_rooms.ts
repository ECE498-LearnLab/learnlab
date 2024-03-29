import * as Knex from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Inserts seed entries
    await knex("rooms").insert([
        {
            class_id: 1,
            room_name: "Biology Lesson 1",
            room_uuid: "0208002a-da45-4506-9ff4-test01uuidv4",
            room_status: "SCHEDULED"
        },
        {
            class_id: 1,
            room_name: "Biology Lesson 2",
            room_uuid: "0208002a-da45-4506-9ff4-test02uuidv4",
            room_status: "ONGOING"
        },
        {
            class_id: 2,
            room_name: "OS Lesson 1",
            room_uuid: "0208002a-da45-4506-9ff4-test03uuidv4",
            room_status: "ONGOING"
        },
        {
            class_id: 2,
            room_name: "OS Lesson 2",
            room_uuid: "0208002a-da45-4506-9ff4-test04uuidv4",
            room_status: "ENDED"
        },
    ]);
};
