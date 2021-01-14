import * as Knex from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("classrooms").del();

    // Inserts seed entries
    await knex("classrooms").insert([
        {
            id: 1,
            name: "Introduction to Biology",
            subject: "BIO101",
            description: "An introduction to the basics of biology, including the birds and the bees."
        },
        {
            id: 2,
            name: "Operating Systems and Systems Programming",
            subject: "ECE254",
            description: "Concepts of operating systems and systems programming; utility programs, subsystems, multiple-program systems."
        }
    ]);
};
