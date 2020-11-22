import Knex from "knex";
import {
    CreateRoomResponse, MutationCreateRoomArgs, MutationJoinRoomArgs,
    MutationUpdateRoomStatusArgs, QueryParticipantsArgs,
    Response, Room, RoomState, User
} from "../generated/graphql";

/**
 * Room API.
 * 
 * Use this API to create, retrieve, update, and manage the participants of a room.
 */
export default (db: Knex) => {
    
    const createRoom = async (room_uuid: string, roomInfo: MutationCreateRoomArgs)
    : Promise<CreateRoomResponse> => {
        const { class_id, name, start_time, end_time } = roomInfo;
        let success = true, message;

        const res = await db('rooms').returning('id').insert({
            room_uuid,
            class_id,
            room_name: name,
            room_status: RoomState.Scheduled,
            start_time: start_time,
            end_time: end_time
        }).catch((err) => {
            success = false;
            message = err.message;
        });

        if (!success) {
            return { success, message };
        }

        return {
            id: res[0], success, room_uuid,
            message: `Room ${room_uuid} (${name}) created successfully`
        };
    };

    return {
        getRoomsByClassroom: async (class_id: string, room_states: RoomState[]): Promise<Room[]> => {
            return await db.select('*').from('rooms')
            .where({ class_id })
            .andWhere('room_status', 'in', room_states);
        },
        getParticipantsInRoom: async ({room_id}: QueryParticipantsArgs): Promise<User[]> => {
            const res = (await db.select(db.ref('*').withSchema('users')).from<User>('participants')
                                .join('users', {'participants.student_id': 'users.id'})
                                .where({room_id})) as unknown as User[];
            return res;
        },
        joinRoom: async ({student_id, room_id}: MutationJoinRoomArgs): Promise<Response> => {
            let errorMsg;
            const success = await db('participants').insert({student_id, room_id})
            .then(() => true)
            .catch((err) => {
                errorMsg = err.message;
                return false;
            });

            return {
                success,
                message: success ? `Student ${student_id} successfully added to room ${room_id}` 
                                : `Failed to add student ${student_id} to room ${room_id}: ${errorMsg}`
            };
        },
        createRoom,
        updateRoomStatus: async (roomUpdateInfo: MutationUpdateRoomStatusArgs): Promise<Response> => {
            const { room_id, room_status } = roomUpdateInfo;
            let success = true, message;

            await db('rooms').where({id: room_id}).update({room_status}).catch((err) => {
                success = false;
                message = err.message;
            });
    
            if (!success) {
                return { success, message };
            }
    
            return {
                success,
                message: `Status for room ${room_id} was successfully updated to ${room_status}`
            };
        }
    };
};