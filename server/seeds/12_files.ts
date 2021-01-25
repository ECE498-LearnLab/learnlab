import * as Knex from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Inserts seed entries
    await knex("files").insert([
        {
            class_id: "1",
            storage_link: "https://drive.google.com/"
        },
        {
            class_id: "2",
            storage_link: "https://www.microsoft.com/en-ca/microsoft-365/onedrive/online-cloud-storage"
        },
        {
            class_id: "1",
            storage_link: "https://learn.uwaterloo.ca/"
        },
        {
            class_id: "2",
            storage_link: "https://piazza.com/"
        }
    ]);
};
