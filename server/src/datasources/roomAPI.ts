import Knex from "knex";
import {
    CreateRoomResponse, MutationCreateRoomArgs, MutationUpdateRoomStatusArgs,
    Response, Room, RoomState
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
        getParticipantsForRoom: async (room_id: string): Promise<any> => {
            // TODO: https://github.com/ECE498-LearnLab/learnlab/issues/81
            /**
             * return this.db.select('*').from('participants').join('user').on('student_id', '=', 'id')
             * .where({ room_id });
             */
            return null;
        },
        getQuestionsForRoom: async (room_id: string):Promise<any> => {
            // TODO: https://github.com/ECE498-LearnLab/learnlab/issues/81
            return null;
        },
        joinAsParticipant: async (student_id: string, room_id): Promise<any> => {
            // TODO: https://github.com/ECE498-LearnLab/learnlab/issues/81
            return null;
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