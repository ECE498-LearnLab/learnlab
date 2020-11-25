import { IDataSource } from "..";
import {
    Classroom,
    CreateClassroomResponse,
    EngagementStat,
    EngagementStatResponse,
    MutationCreateClassroomArgs,
    MutationCreateEngagementStatArgs, MutationUpdateEngagementCurrentArgs,
    MutationUpdateRoomStatusArgs, QueryClassroomArgs,
    QueryEngagementStatArgs,
    Resolvers,
    Response,
    Room,
    RoomState,
    UserResponse
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
        // getEngagementStat: async (_, { room_id, student_id }: { room_id: string, student_id: string},
        //                           { dataSources }: { dataSources: IDataSource }): Promise<EngagementStat[]> => {
        //     return await dataSources.db.engagementAPI().getEngagementStat(
        //         room_id, student_id
        //     );
        // },
        engagementStat: async (_, { room_id, student_id }: QueryEngagementStatArgs, { dataSources }: { dataSources: IDataSource })
            : Promise<EngagementStat[]> => {
            return await dataSources.db.engagementAPI().getEngagementStat(room_id, student_id);
        },
    },
    Mutation: {
        createEngagementStat: async (_, args: MutationCreateEngagementStatArgs, { dataSources }: { dataSources: IDataSource })
            : Promise<EngagementStatResponse> => {
            return await dataSources.db.engagementAPI().createEngagementStat(args);
        },
        updateEngagementCurrent: async (_, args: MutationUpdateEngagementCurrentArgs, { dataSources }: { dataSources: IDataSource })
            : Promise<EngagementStatResponse> => {
            return await dataSources.db.engagementAPI().updateEngagementCurrent(args);
        }
    }
}

export default engagementStatsResolver;