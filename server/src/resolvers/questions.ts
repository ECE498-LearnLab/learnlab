import { IDataSource } from "..";
import {
    CreateQuestionResponse, MutationAnswerQuestionArgs, MutationSubmitQuestionArgs,
    MutationUpvoteQuestionArgs, QueryQuestionsArgs, Question, Resolvers, Response, Upvotes
} from "../generated/graphql";


const questionResolver: Resolvers = {
    Query: {
        questions: async (_, args: QueryQuestionsArgs, { dataSources }: { dataSources: IDataSource })
        : Promise<Question[]> => {
            return await dataSources.db.questionsAPI().getQuestionsForRoom(args);
        },
    },
    Mutation: {
        submitQuestion: async (_, args: MutationSubmitQuestionArgs, { dataSources }: { dataSources: IDataSource })
        : Promise<CreateQuestionResponse> => {
           return await dataSources.db.questionsAPI().submitQuestion(args);
        },
        answerQuestion: async (_, args: MutationAnswerQuestionArgs, { dataSources }: { dataSources: IDataSource })
        : Promise<Response> => {
            return await dataSources.db.questionsAPI().answerQuestion(args);
        },
        upvoteQuestion: async (_, args: MutationUpvoteQuestionArgs, { dataSources }: { dataSources: IDataSource })
        : Promise<Upvotes> => {
            return dataSources.db.questionsAPI().upvoteQuestion(args);
        }
    }
};

export default questionResolver;