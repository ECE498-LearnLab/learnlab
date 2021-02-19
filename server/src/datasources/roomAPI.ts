import Knex from "knex";
import {
    CreateRoomResponse, MutationCreateRoomArgs,
    MutationInviteArgs, MutationJoinRoomArgs,
    MutationUpdateRoomStatusArgs, ParticipantStatus, QueryParticipantsArgs,
    Response, Role, Room, RoomState, User
} from "../generated/graphql";
import { pool } from "../workers/worker-pool";
import { Promise } from 'workerpool';
import pubsub, { ENGAGEMENT_AVERAGE_ADDED } from "../subscriptions/pubsub";


const roomWorkers = {};

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
        getRoomsByClassroom: async (class_id: string, user_id: string, room_states: RoomState[]): Promise<Room[]> => {
            const user = (await db.select('*').from('users').where({ id: user_id }))[0];
            if (user && user.role === 'STUDENT') {
                return await db.select('*').from('rooms')
                .join('participants', {'rooms.id': 'participants.room_id'})
                .where({ class_id, student_id: user_id })
                .andWhere('room_status', 'in', room_states);
            } else {
                return await db.select('*').from('rooms')
                .where({ class_id })
                .andWhere('room_status', 'in', room_states);
            }
        },
        // returns a list of all ENDED rooms on a selected date in which the student/teacher is a part of
        // works if we pass in a Date with timestamp, or just a Date
        getEndedRoomsOnDate: async (user_id: string, end_time: Date): Promise<Room[]> => {
            const user = (await db.select('*').from('users').where({ id: user_id }))[0];
            const prev_midnight = new Date(end_time.setHours(0, 0, 0, 0));
            const next_midnight = new Date(end_time.setHours(24, 0, 0, 0));    

            if (user && user.role === Role.Student) {
                return await db.select('*').from('rooms')
                .where('rooms.end_time', '>=', prev_midnight)
                .where('rooms.end_time', '<', next_midnight)
                .join('participants', {'rooms.id': 'participants.room_id'})
                .where({ student_id: user_id });
            } else if (user && user.role === Role.Instructor) {   
                return await db.select('*').from('rooms')
                .where('rooms.end_time', '>=', prev_midnight)
                .where('rooms.end_time', '<', next_midnight)
                .join('teaches', {'rooms.class_id': 'teaches.class_id'})
                .where({ teacher_id: user_id });
            }
        },
        getParticipantsInRoom: async (args: QueryParticipantsArgs): Promise<User[]> => {
            const {room_id, statuses = [ParticipantStatus.Invited, ParticipantStatus.Joined]} = args;
            const res = (await db.select(db.ref('*').withSchema('users')).from<User>('participants')
                                .join('users', {'participants.student_id': 'users.id'})
                                .where({room_id})
                                .andWhere('status', 'in', statuses)) as unknown as User[];
            return res;
        },
        inviteToRoom: async ({student_ids, room_id}: MutationInviteArgs): Promise<Response> => {            
            let errorMsg;
            const success = await db('participants')
                .insert(student_ids.map((id) => ({student_id: id, room_id})))
                .then(() => true)
                .catch((err) => {
                    errorMsg = err.message;
                    return false;
                });
    
            return {
                success,
                message: success ? `Students ${student_ids} successfully invited to room ${room_id}` 
                                : `Invitations to room ${room_id} failed: ${errorMsg}`
            };
        },
        joinRoom: async ({student_id, room_id}: MutationJoinRoomArgs): Promise<Response> => {
            let errorMsg;
            const success = await db('participants').where({student_id, room_id}).update({ status: 'JOINED' })
                .then(() => true)
                .catch((err) => {
                    errorMsg = err.message;
                    return false;
                });

            return {
                success,
                message: success ? `Student ${student_id} successfully joined room ${room_id}` 
                                : `Student ${student_id} failed to join room ${room_id}: ${errorMsg}`
            };
        },
        createRoom,
        updateRoomStatus: async (roomUpdateInfo: MutationUpdateRoomStatusArgs): Promise<Response> => {
            const { room_id, room_status } = roomUpdateInfo;
            let success = true, message;

            const room = (await db.select('room_status').from('rooms').where({id: room_id}))[0];
            if (room.room_status === room_status) { // only change room status if it's actually a change
                return {
                    success: true,
                    message: `No changes done; status for room ${room_id} was already ${room_status}`
                };
            }

            await db('rooms').where({id: room_id}).update({room_status}).catch((err) => {
                success = false;
                message = err.message;
            });
    
            if (!success) {
                return { success, message };
            }

            switch (room_status) {
                case RoomState.Ongoing: {
                    // room was started, assign worker pool to it
                    const workerPromise = pool.exec('roomStats', [room_id], {
                        on: (payload) => {
                            if (payload.status === 'starting') {
                                console.log(`Worker ${room_id} started...`);
                            } else if (payload.status === 'published_stat') {
                                const { score, taken_at } = payload.publishedStat;
                                pubsub.publish(ENGAGEMENT_AVERAGE_ADDED, {
                                    engagementAverageAdded: {
                                        room_id,
                                        score,
                                        taken_at
                                    }
                                });
                            }
                        }
                    })
                    .timeout(1000*60*10) // 10-min
                    .then(() => {
                        // no use for the result, since this worker either times out or gets cancelled
                    })
                    .catch((err) => { 
                        if (err instanceof Promise.CancellationError) {
                            console.log(`Worker ${room_id} was cancelled`);
                        } else if (err instanceof Promise.TimeoutError) {
                            console.log(`Worker ${room_id} timed out.`);
                        } else {
                            console.log(err); 
                        }
                    });

                    roomWorkers[room_id] = workerPromise;
                    break;
                }
                case RoomState.Ended: {
                    if (room_id in roomWorkers) {
                        roomWorkers[room_id].cancel();
                        delete roomWorkers[room_id];
                        console.log(pool.stats());
                    }
                    break;
                }
                case RoomState.Scheduled: break;
            }
    
            return {
                success,
                message: `Status for room ${room_id} was successfully updated to ${room_status}`
            };
        }
    };
};