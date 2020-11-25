import Knex from "knex";
import {
    EngagementStat,
    Classroom,
    ClassroomDetails,
    CreateClassroomResponse,
    MutationAddStudentsToClassroomArgs,
    MutationCreateClassroomArgs,
    QueryClassroomDetailsArgs,
    Response,
    Role,
    EngagementStatResponse,
    MutationCreateEngagementStatArgs,
    MutationUpdateEngagementCurrentArgs,
    QueryQuestionsArgs, Question, QueryEngagementStatArgs, RoomState, Room
} from "../generated/graphql";

/**
 * Room API.
 * 
 * Use this API to create, retrieve, update, and manage the engagement statistics of students.
 */
export default (db: Knex) => {
    return {
        getEngagementStat: async (room_id: string, student_id: string): Promise<EngagementStat[]> => {
            const res = await db.select('*').from('engagementHistory').where({ room_id, student_id}) as EngagementStat[];
            return res;
        },
        createEngagementStat: async (engagementInfo: MutationCreateEngagementStatArgs): Promise<EngagementStatResponse> => {
            const { room_id, student_id, score, classification } = engagementInfo;
            let success = true, message;

            const res = await db('engagementHistory').returning(['id', 'room_id', 'student_id']).insert({
                room_id, student_id, score, classification
            }).catch((err) => {
                success = false;
                message = err.message;
            });

            if (!success) {
                return { success, message };
            }

            return {
                room_id: res[0].room_id,
                student_id: res[0].student_id,
                success,
                message: `Engagement stat with room: "${room_id}" and student: "${student_id}"  was created successfully`
            };
        },
        updateEngagementCurrent: async (engagementUpdateInfo: MutationUpdateEngagementCurrentArgs): Promise<EngagementStatResponse> => {
            const {room_id, student_id, score, classification} = engagementUpdateInfo;
            let success = true, message;

            const res = await db('engagementHistory').where({room_id: room_id, student_id: student_id})
                .update({score, classification}).catch((err) => {
                success = false;
                message = err.message;
            });

            if (!success) {
                return {success, message};
            }

            return {
                success,
                message: `Engagement stat with room: "${room_id}" and student: "${student_id}"  was updated successfully`
            };
        },
        // updateEngagementCurrent: async (room_id: string, student_id: string, score: number, classification: string, created_at: Date): Promise<string[]> => {
        //     // im going to assume this upsert function works for now, until we are able to test it with real db
        //
        //     var data = {
        //         room_id: room_id,
        //         student_id: student_id,
        //         score: score,
        //         classification: classification,
        //         created_at: created_at,
        //     };
        //
        //     return this.db.raw(
        //         `? ON CONFLICT (room_id, student_id)
        //             DO UPDATE SET
        //             role = EXCLUDED.role,
        //             RETURNING *;`,
        //         [this.db("engagement_stats_history").insert(data)]);
        // }
    };
};