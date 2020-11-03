import { IDataSource } from "..";
import { Resolvers, Response } from "../generated/graphql";

const fakeQuestionData = [
    {
        id: '0',
        room_id: '1',
        student_id: '1',
        text: 'Mrs.Dees, where are your nuts? I am a hungry little squirrel child.',
        created_at: new Date(1602632500122)
    },
    {
        id: '1',
        room_id: '1',
        student_id: '2',
        text: 'When is lunch break?',
        created_at: new Date(1600868700000)
    }
];

/**
 * Example queries:
 * 
 * query getQuestions($room_id: ID!) {
        questions(room_id: $room_id) {
            id
            text
            created_at
        }
    }
 * 
 *  mutation postQuestion($room_id: ID!, $student_id: ID!, $text: String!) {
        submitQuestion(room_id: $room_id, student_id: $student_id, text: $text) {
            success
            message
        }
    }
*
*   mutation answerQuestion($id: ID!) {
        answerQuestion(id: $id) {
            success
            message
        }
    }
 */

const questionResolver: Resolvers = {
    Query: {
        questions: (_, { room_id }) => fakeQuestionData.filter(q => q.room_id === room_id),
    },
    Mutation: {
        submitQuestion: async (_, args, { dataSources }: { dataSources: IDataSource }): Promise<Response> => {
            const result = await dataSources.db.submitQuestion(args.room_id, args.student_id, args.text, args.created_at);
            return {
                success: result && result === [],
                message: result && result === [] ? `Question ${result} submitted successfully` : 'Unable to submit question'
            }
        },
        answerQuestion: async (_, { id }: { id: string }, { dataSources }: { dataSources: IDataSource }): Promise<Response> => {
            const result = await dataSources.db.answerQuestion(id)
            return {
                success: result,
                message: result ? `Successfully marked question ${id} as answered` 
                : `Failed to mark question ${id} as answered`
            }
        }
    }
}

export default questionResolver;