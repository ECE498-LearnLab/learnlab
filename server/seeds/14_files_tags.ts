/* eslint-disable max-len */
import * as Knex from "knex";

export async function seed (knex: Knex): Promise<void> {
    // Inserts seed entries
    await knex("files_tags").insert([
        {
            file_id: "1",
            tag_id: "3",
        },
        {
            file_id: "1",
            tag_id: "4",
        },
        {
            file_id: "2",
            tag_id: "2",
        },
        {
            file_id: "2",
            tag_id: "3",
        },
        {
            file_id: "3",
            tag_id: "5",
        },
        {
            file_id: "3",
            tag_id: "6",
        },
        {
            file_id: "4",
            tag_id: "1",
        },
        {
            file_id: "4",
            tag_id: "3",
        },
        {
            file_id: "5",
            tag_id: "2",
        },
        {
            file_id: "5",
            tag_id: "3",
        },
        {
            file_id: "6",
            tag_id: "1",
        },
    ]);
}
