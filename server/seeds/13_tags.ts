/* eslint-disable max-len */
import * as Knex from "knex";

export async function seed (knex: Knex): Promise<void> {
    // Inserts seed entries
    await knex("tags").insert([
        {
            tag: "MISC",
            class_id: "1",
            color: "#f44336"
        },
        {
            tag: "PPT",
            class_id: "1",
            color: "#2196f3"
        },
        {
            tag: "UNIT 1",
            class_id: "1",
            color: "#4caf50"
        },
        {
            tag: "REVIEW",
            class_id: "1",
            color: "#673ab7"
        },
        {
            tag: "ASSIGNMENT",
            class_id: "1",
            color: "#00bcd4"
        },
        {
            tag: "UNIT 2",
            class_id: "1",
            color: "#795548"
        }
    ]);
}
