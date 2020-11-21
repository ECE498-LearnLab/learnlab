import { v4 as uuidv4 } from 'uuid';
import { IDataSource } from "..";
import {
    CreateRoomResponse, MutationCreateRoomArgs,
    MutationUpdateRoomStatusArgs, Resolvers, Response,
    Room, RoomState
} from "../generated/graphql";


const roomResolver: Resolvers = {
    Query: {
        roomsForClassroom: async (_, { class_id, room_states }: { class_id: string, room_states: RoomState[]}, 
            { dataSources }: { dataSources: IDataSource }): Promise<Room[]> => {           
            return await dataSources.db.roomAPI().getRoomsByClassroom(
                class_id, room_states
            );
        },
        //TODO:  participants: async (_, { room_id }: { room_id: string }, { dataSources }: { dataSources: IDataSource }) => await dataSources.db.getParticipantsForRoom(room_id)
    },
    Mutation: {
        createRoom: async (_, args: MutationCreateRoomArgs, { dataSources }: { dataSources: IDataSource })
        : Promise<CreateRoomResponse> => {
            const room_uuid = uuidv4();
            return await dataSources.db.roomAPI().createRoom(room_uuid, args);
        },
        updateRoomStatus: async (_, args: MutationUpdateRoomStatusArgs, { dataSources }: { dataSources: IDataSource })
        : Promise<Response> => {
            return await dataSources.db.roomAPI().updateRoomStatus(args);
        }
    }
};

export default roomResolver;