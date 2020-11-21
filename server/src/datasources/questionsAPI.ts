import Knex from "knex";
import { MutationAnswerQuestionArgs, MutationSubmitQuestionArgs } from "../generated/graphql";

/**
 * WIP: TODO in https://github.com/ECE498-LearnLab/learnlab/issues/81
 */
export default (db: Knex) => ({
    submitQuestion: async (questionInfo: MutationSubmitQuestionArgs): Promise<string[]> => {
        const {room_id, student_id, text, created_at} = questionInfo;
        return db('question').insert({
            room_id: room_id,
            student_id: student_id,
            text: text,
            created_at: created_at
        });
    },
    answerQuestion: ({id: question_id}: MutationAnswerQuestionArgs): boolean => {
        //STUB: Figure out what we're doing with questions. Delete? Remove?
        return true;
    }
});