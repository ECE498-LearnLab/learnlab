import * as Knex from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Inserts seed entries
    await knex("users").insert([
        {
            first_name: "John",
            last_name: "Smith",
            role: "STUDENT",
            email: "john@student.com",
            phone_number: "416-111-1111"
        },
        {
            first_name: "Alice",
            last_name: "Wonderland",
            role: "STUDENT",
            email: "alice@student.com"
        },
        {
            first_name: "Jeff",
            last_name: "Zarnett",
            role: "INSTRUCTOR",
            email: "zarnett@instructor.com",
            phone_number: "519-888-4567 ext 31719"
        },
        {
            first_name: "Martin",
            last_name: "Pei",
            role: "INSTRUCTOR",
            email: "pei@instructor.com",
            phone_number: "519-888-4567 ext 35587"
        },
        {
            first_name: "Jessie",
            last_name: "Foo",
            role: "STUDENT",
            email: "jessie@student.com",
            phone_number: "666-666-6666"
        },
        {
            first_name: "Andrew",
            last_name: "Xia",
            role: "STUDENT",
            email: "andrew@student.com"
        },
        {
            first_name: "Tian",
            last_name: "Tian",
            role: "STUDENT",
            email: "tian@student.com"
        }
    ]);
};
