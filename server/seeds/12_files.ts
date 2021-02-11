/* eslint-disable max-len */
import * as Knex from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Inserts seed entries
    await knex("files").insert([
        {
            class_id: "1",
            storage_link: "https://learnlab.s3.ca-central-1.amazonaws.com/be0eb69e-34b1-4a4e-8872-f09c411db071/Chapter1ReviewQuestions.docx",
            filename: "Chapter1ReviewQuestions.docx"
        },
        {
            class_id: "1",
            storage_link: "https://learnlab.s3.ca-central-1.amazonaws.com/5d55d863-3a63-4d40-886d-c4eec470d432/Chapter+1+Intro.pptx",
            filename: "Chapter1Intro.pptx"
        },
        {
            class_id: "1",
            storage_link: "https://learnlab.s3.ca-central-1.amazonaws.com/3725076e-5546-4210-9993-1b98f7d803a4/Evolution%20Assignment%201.docx",
            filename: "EvolutionAssignment1.docx"
        },
        {
            class_id: "1",
            storage_link: "https://learnlab.s3.ca-central-1.amazonaws.com/c4fe4781-f1b7-4fc3-b04b-b4b2c0fe48cb/RulesForGraphing.doc",
            filename: "RulesForGraphing.doc"
        },
        {
            class_id: "1",
            storage_link: "https://learnlab.s3.ca-central-1.amazonaws.com/65d8cbc9-ee0e-402e-a690-31f8628c6d2f/Chapter%202%20Essential%20Chemistry.pptx",
            filename: "Chapter2EssentialChemistry.pptx"
        },
        {
            class_id: "1",
            storage_link: "https://learnlab.s3.ca-central-1.amazonaws.com/46274379-f73f-4327-98ce-8ae5165d3863/Course_Outline.pdf",
            filename: "CourseOutline.pdf"
        },
    ]);
}
