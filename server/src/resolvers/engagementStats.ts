import { IDataSource } from "..";
import {
    EngagementHistory,
    Response,
    QueryEngagementHistoryArgs,
    MutationUpsertEngagementCurrentArgs,
    Resolvers,
} from "../generated/graphql";

const engagementStatsResolver: Resolvers = {
    Query: {
        engagementHistory: async (_, { room_id, student_id }: QueryEngagementHistoryArgs, { dataSources }: { dataSources: IDataSource })
            : Promise<EngagementHistory[]> => {
            return await dataSources.db.engagementAPI().getEngagementHistory(room_id, student_id);
        },
    },
    Mutation: {
        upsertEngagementCurrent: async (_, args: MutationUpsertEngagementCurrentArgs, { dataSources }: { dataSources: IDataSource })
            : Promise<Response> => {
            return await dataSources.db.engagementAPI().upsertEngagementCurrent(args);
        }
    }
}

export default engagementStatsResolver;