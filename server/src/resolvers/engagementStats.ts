import { IDataSource } from "..";
import {
    EngagementHistory,
    EngagementStatResponse,
    QueryEngagementHistoryArgs,
    MutationUpsertEngagementCurrentArgs,
    Resolvers,
} from "../generated/graphql";

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

const engagementStatsResolver: Resolvers = {
    Query: {
        engagementHistory: async (_, { room_id, student_id }: QueryEngagementHistoryArgs, { dataSources }: { dataSources: IDataSource })
            : Promise<EngagementHistory[]> => {
            return await dataSources.db.engagementAPI().getEngagementHistory(room_id, student_id);
        },
    },
    Mutation: {
        upsertEngagementCurrent: async (_, args: MutationUpsertEngagementCurrentArgs, { dataSources }: { dataSources: IDataSource })
            : Promise<EngagementStatResponse> => {
            return await dataSources.db.engagementAPI().upsertEngagementCurrent(args);
        }
    }
}

export default engagementStatsResolver;