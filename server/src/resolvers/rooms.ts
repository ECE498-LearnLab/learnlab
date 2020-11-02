import { IDataSource } from "..";
import { v4 as uuidv4 } from 'uuid';
import { CreateRoomResponse, Resolvers, RoomState, Room } from "../generated/graphql";

const fakeRoomsForClassroom = [
    {
        room_id: '3e1ff1c5-f98a-468b-aad6-6c1810028363',
        class_id: '1',
        name: 'Intro to Quantum Physics (Lecture 1)',
        start_time: new Date(1602632500122),
        end_time: new Date(1602632500422),
        room_state: RoomState.Pending
    },
    {
        room_id: '636229ae-37d7-462c-8a13-88e917c3867e',
        class_id: '1',
        name: 'Diving into Deep Space and Time (Lecture 2)',
        start_time: new Date(1602632500122),
        end_time: new Date(1602632500422),
        room_state: RoomState.Ongoing
    },
    {
        room_id: '290d3ac2-950b-4cf2-9106-25b211ceadae',
        class_id: '2',
        name: 'Basket Weaving Lesson 17',
        start_time: new Date(1602632500122),
        end_time: new Date(1602632500422),
        room_state: RoomState.Ended
    },
];

/**
 * Example queries:
 * 
 * query getRoomsForClassroom($class_id: ID!, $room_states: [RoomState]){
        roomsForClassroom(class_id: $class_id, room_states: $room_states){
            room_id
            name
            start_time
            room_state
        }
    }
    mutation createRoom($class_id: ID!) {
        createRoom(class_id: $class_id) {
            success
            message
            room_id
        }
    }
 */

const roomResolver: Resolvers = {
    Query: {
        room: async (_, { room_id }: { room_id: string }, { dataSources }: { dataSources: IDataSource }): Promise<Room> => {
            return await dataSources.db.getRoom(room_id);
        },
        roomsForClassroom: async (_, { class_id, room_states }: { class_id: string, room_states: RoomState[]}, { dataSources }: { dataSources: IDataSource }): Promise<Room[]> => {
            if (room_states.includes(RoomState.All)){
                return fakeRoomsForClassroom.filter(r => r.class_id === class_id);
            }
            return fakeRoomsForClassroom.filter(r => r.class_id === class_id && room_states.includes(r.room_state));
           
            // return await dataSources.db.getRoomsByClassroom(
            //     class_id, room_states
            // );
        },
        participants: async (_, { room_id }: { room_id: string }, { dataSources }: { dataSources: IDataSource }) => await dataSources.db.getParticipantsForRoom(room_id)
    },
    Mutation: {
        createRoom: async (_, args, { dataSources }: { dataSources: IDataSource }): Promise<CreateRoomResponse> => {
            const room_id = uuidv4();
            
            const result = await dataSources.db.createRoom(room_id, args.class_id, args.start_time, args.end_time);
            return {
                success: result && result[0] === room_id,
                message: `Room ${room_id} ${result && result[0] === room_id ? 'created successfully': 'could not be created'}`,
                room_id: room_id
            }
        },
    }
}

export default roomResolver;