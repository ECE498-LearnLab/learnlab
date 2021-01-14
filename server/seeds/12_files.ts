import * as Knex from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("files").del();

    // Inserts seed entries
    await knex("files").insert([
        {
            id: "1",
            class_id: "1",
            storage_link: "https://drive.google.com/"
        },
        {
            id: "2",
            class_id: "2",
            storage_link: "https://www.microsoft.com/en-ca/microsoft-365/onedrive/online-cloud-storage"
        },
        {
            id: "3",
            class_id: "1",
            storage_link: "https://learn.uwaterloo.ca/"
        },
        {
            id: "4",
            class_id: "2",
            storage_link: "https://piazza.com/"
        }
    ]);
};
