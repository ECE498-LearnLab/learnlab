import { withFilter } from 'apollo-server';
import { IDataSource } from "..";
import {
    EngagementHistory,
    MutationUpsertEngagementCurrentArgs, QueryEngagementHistoryArgs,
    Resolvers,
    Response
} from "../generated/graphql";
import pubsub, { ENGAGEMENT_AVERAGE_ADDED, ENGAGEMENT_STAT_ADDED } from '../subscriptions/pubsub';

const engagementStatsResolver: Resolvers = {
    Subscription: {
        engagementStatAdded: {
            subscribe: withFilter(
                () => pubsub.asyncIterator([ENGAGEMENT_STAT_ADDED]),
                (payload, variables) => {
                    return payload.engagementStatAdded.student_id === variables.student_id;
                }
            ),
        },
        engagementAverageAdded: {
            subscribe: withFilter(
                () => pubsub.asyncIterator([ENGAGEMENT_AVERAGE_ADDED]),
                (payload, variables) => {
                    return payload.engagementAverageAdded.room_id === variables.room_id;
                }
            )
        }
    },
    Query: {
        engagementHistory: async (_, { room_id, student_id }: QueryEngagementHistoryArgs,
            { dataSources }: { dataSources: IDataSource })
            : Promise<EngagementHistory[]> => {
            return await dataSources.db.engagementAPI().getEngagementHistory(room_id, student_id);
        },
    },
    Mutation: {
        upsertEngagementCurrent: async (_, args: MutationUpsertEngagementCurrentArgs,
            { dataSources }: { dataSources: IDataSource })
            : Promise<Response> => {
            pubsub.publish(ENGAGEMENT_STAT_ADDED, { engagementStatAdded: args });
            return await dataSources.db.engagementAPI().upsertEngagementCurrent(args);
        }
    }
};

export default engagementStatsResolver;