import Knex from "knex";
import {
    CreateQuestionResponse, MutationAnswerQuestionArgs,
    MutationSubmitQuestionArgs, MutationUpvoteQuestionArgs, QueryQuestionsArgs, Question, Response, Upvotes
} from "../generated/graphql";
import pubsub, { QUESTION_ADDED } from "../subscriptions/pubsub";


export default (db: Knex) => ({
    getQuestionsForRoom: async ({room_id}: QueryQuestionsArgs): Promise<Question[]> => {
        return await db.select('*').from('questions').where({ room_id });
    },
    submitQuestion: async (questionInfo: MutationSubmitQuestionArgs): Promise<CreateQuestionResponse> => {
        const {room_id, student_id, text} = questionInfo;
        let success = true, message;

        const res = await db('questions').returning(['id', 'created_at']).insert({
            room_id: room_id,
            student_id: student_id,
            text: text,
        }).catch((err) => {
            success = false;
            message = err.message;
        });

        if (!success) {
            return { success, message };
        }

        const {id, created_at} = res[0];
        return {
            id, created_at,
            success,
            message: `Question "${text}" submitted successfully`
        };
    },
    answerQuestion: async ({id}: MutationAnswerQuestionArgs): Promise<Response> => {
        /**
         * Answering a question is implemented as a soft delete of the row.
         */
        const success = await db('questions').where({ id }).update({
            'deleted_at': new Date()
        }).then(() => true).catch(() => false);

        return {
            success,
            message: success ? `Successfully marked question ${id} as answered` 
            : `Failed to mark question ${id} as answered`
        };
    },
    upvoteQuestion: async ({id}: MutationUpvoteQuestionArgs): Promise<Upvotes> => {
        const res = await db('questions').where({ id }).increment('upvotes', 1)
        .returning('upvotes');

        return { upvotes: res[0] };
    }
});