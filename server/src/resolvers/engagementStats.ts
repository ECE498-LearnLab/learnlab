import { IDataSource } from "..";
import { Resolvers, Response } from "../generated/graphql";

const fakeEngagementHistory = [
    {
        id: "1",
        room_id: "1",
        student_id: "1",
        score: 80,
        classification: "engaged",
        created_at: new Date(1600868700000)
    },
    {
        id: "2",
        room_id: "2",
        student_id: "2",
        score: 20,
        classification: "not engaged",
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

const engagementStatsResolver: Resolvers = {
    Query: {
        singleEngagementStat: (_, { room_id, student_id }) => fakeEngagementHistory.find(r => r.room_id === room_id && r.student_id === student_id),
        // need a query for gets average engagement stat of student for a classroom
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
        },
        updateEngagementCurrent: async (_, args, { dataSources }: { dataSources: IDataSource }): Promise<Response> => {
            const result = await dataSources.db.updateEngagementCurrent(args.room_id, args.student_id, args.score, args.classification, args.created_at);
            return {
                success: result === [],
                message: result === [] ? `Engagement stat ${result} updated successfully` : 'Unable to update engagement stat'
            }
        }
    }
}

export default engagementStatsResolver;