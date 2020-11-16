import { IDataSource } from "..";
import { MutationAnswerQuestionArgs, MutationSubmitQuestionArgs, Resolvers, Response } from "../generated/graphql";

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

const questionResolver: Resolvers = {
    Query: {
        questions: (_, { room_id }) => fakeQuestionData.filter((q) => q.room_id === room_id),
    },
    Mutation: {
        submitQuestion: async (_, args: MutationSubmitQuestionArgs, { dataSources }: { dataSources: IDataSource })
        : Promise<Response> => {
            const result = await dataSources.db.questionsAPI().submitQuestion(args);
            return {
                success: result && result === [],
                message: result && result === [] ? `Question ${result} submitted successfully` : 'Unable to submit question'
            };
        },
        answerQuestion: async (_, args: MutationAnswerQuestionArgs, { dataSources }: { dataSources: IDataSource })
        : Promise<Response> => {
            const result = await dataSources.db.questionsAPI().answerQuestion(args);
            return {
                success: result,
                message: result ? `Successfully marked question ${args.id} as answered` 
                : `Failed to mark question ${args.id} as answered`
            };
        }
    }
};

export default questionResolver;