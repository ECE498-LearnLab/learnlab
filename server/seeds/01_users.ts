import * as Knex from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("users").del();

    // Inserts seed entries
    await knex("users").insert([
        {
            id: 1,
            first_name: "John",
            last_name: "Smith",
            role: "STUDENT",
            email: "john@student.com"
        },
        {
            id: 2,
            first_name: "Alice",
            last_name: "Wonderland",
            role: "STUDENT",
            email: "alice@student.com"
        },
        {
            id: 3,
            first_name: "Jeff",
            last_name: "Zarnett",
            role: "INSTRUCTOR",
            email: "zarnett@instructor.com"
        },
        {
            id: 4,
            first_name: "Martin",
            last_name: "Pei",
            role: "INSTRUCTOR",
            email: "pei@instructor.com"
        },
        {
            id: 5,
            first_name: "Jessie",
            last_name: "Foo",
            role: "STUDENT",
            email: "jessie@student.com"
        },
        {
            id: 6,
            first_name: "Andrew",
            last_name: "Xia",
            role: "STUDENT",
            email: "andrew@student.com"
        },
        {
            id: 7,
            first_name: "Tian",
            last_name: "Tian",
            role: "STUDENT",
            email: "tian@student.com"
        }
    ]);
};
