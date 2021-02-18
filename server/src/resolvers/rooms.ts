import { v4 as uuidv4 } from 'uuid';
import { IDataSource } from "..";
import {
    CreateRoomResponse, MutationCreateRoomArgs,
    MutationInviteArgs,
    MutationJoinRoomArgs,
    MutationUpdateRoomStatusArgs, QueryParticipantsArgs, Resolvers, Response,
    Room, RoomState, User
} from "../generated/graphql";


const roomResolver: Resolvers = {
    Query: {
        roomsForClassroom: async (_, { class_id, user_id, room_states }: 
            { class_id: string, user_id: string, room_states: RoomState[]},
            { dataSources }: { dataSources: IDataSource }): Promise<Room[]> => {           
            return await dataSources.db.roomAPI().getRoomsByClassroom(
                class_id, user_id, room_states
            );
        },
        participants: async (_, args: QueryParticipantsArgs, { dataSources }: { dataSources: IDataSource })
        : Promise<User[]> => {
            return await dataSources.db.roomAPI().getParticipantsInRoom(args);
        }
    },
    Mutation: {
        createRoom: async (_, args: MutationCreateRoomArgs, { dataSources }: { dataSources: IDataSource })
        : Promise<CreateRoomResponse> => {
            const room_uuid = uuidv4();
            return await dataSources.db.roomAPI().createRoom(room_uuid, args);
        },
        invite: async (_, args: MutationInviteArgs, { dataSources }: { dataSources: IDataSource })
        : Promise<Response> => {
            return await dataSources.db.roomAPI().inviteToRoom(args);
        },
        joinRoom: async (_, args: MutationJoinRoomArgs, { dataSources }: { dataSources: IDataSource })
        : Promise<Response> => {
            return await dataSources.db.roomAPI().joinRoom(args);
        },
        updateRoomStatus: async (_, args: MutationUpdateRoomStatusArgs, { dataSources }: { dataSources: IDataSource })
        : Promise<Response> => {
            return await dataSources.db.roomAPI().updateRoomStatus(args);
        }
    }
};

export default roomResolver;