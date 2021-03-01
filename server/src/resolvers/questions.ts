import { withFilter } from "apollo-server";
import { IDataSource } from "..";
import {
    CreateQuestionResponse, AnswerQuestionResponse, MutationAnswerQuestionArgs, MutationSubmitQuestionArgs,
    MutationUpvoteQuestionArgs, QueryQuestionsArgs, Question, Resolvers, Response, Upvotes
} from "../generated/graphql";
import pubsub, { QUESTION_ADDED, QUESTION_ANSWERED, QUESTION_UPVOTE_CHANGED } from "../subscriptions/pubsub";


const questionResolver: Resolvers = {
    Subscription: {
        questionAdded: {
            subscribe: withFilter(
                () => pubsub.asyncIterator([QUESTION_ADDED]),
                (payload, variables) => {
                    return payload.questionAdded.room_id === variables.room_id;
                }
            )
        },
        questionAnswered: {
            subscribe: withFilter(
                () => pubsub.asyncIterator([QUESTION_ANSWERED]),
                (payload, variables) => {
                    return payload.questionAnswered.room_id === variables.room_id;
                }
            )
        },
        questionUpvoteChanged: {
            subscribe: withFilter(
                () => pubsub.asyncIterator([QUESTION_UPVOTE_CHANGED]),
                (payload, variables) => {
                    return payload.questionUpvoteChanged.id === variables.question_id;
                }
            )
        }
    },
    Query: {
        questions: async (_, args: QueryQuestionsArgs, { dataSources }: { dataSources: IDataSource })
        : Promise<Question[]> => {
            return await dataSources.db.questionsAPI().getQuestionsForRoom(args);
        },
    },
    Mutation: {
        submitQuestion: async (_, args: MutationSubmitQuestionArgs, { dataSources }: { dataSources: IDataSource })
        : Promise<CreateQuestionResponse> => {
            const res = await dataSources.db.questionsAPI().submitQuestion(args);
            pubsub.publish(QUESTION_ADDED, {
                questionAdded: {
                    ...args,
                    id: res.id,
                    upvotes: 0,
                    created_at: res.created_at
                }
            });

            return res;
        },
        answerQuestion: async (_, args: MutationAnswerQuestionArgs, { dataSources }: { dataSources: IDataSource })
        : Promise<AnswerQuestionResponse> => {
            const res = await dataSources.db.questionsAPI().answerQuestion(args);
            pubsub.publish(QUESTION_ANSWERED, {
                questionAnswered: {
                    id: args.id,
                    room_id: res.room_id
                }
            });
            return res;
        },
        upvoteQuestion: async (_, args: MutationUpvoteQuestionArgs, { dataSources }: { dataSources: IDataSource })
        : Promise<Upvotes> => {
            const res = await dataSources.db.questionsAPI().upvoteQuestion(args);
            pubsub.publish(QUESTION_UPVOTE_CHANGED, {
                questionUpvoteChanged: {
                    id: args.id,
                    upvotes: res.upvotes
                }
            });

            return res;
        }
    }
};

export default questionResolver;