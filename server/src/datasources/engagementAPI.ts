import Knex from "knex";
import {
    EngagementHistory,
    MutationUpsertEngagementCurrentArgs,
    Response
} from "../generated/graphql";

/**
 * Engagement API.
 * 
 * Use this API to create, retrieve, update, and manage the engagement statistics of students.
 */
export default (db: Knex) => {

    const createEngagementHistory = async (row: EngagementHistory): Promise<Response> => {
        let success = true, message;
        const {room_id, student_id, score, classification} = row;

        await db('engagement_history')
            .insert({room_id, student_id, score, classification})
            .catch((err) => {
                success = false;
                message = err.message;
            });

        return {
            success,
            message
        };
    };

    return {
        getEngagementHistory: async (room_id: string, student_id: string): Promise<EngagementHistory[]> => {
            const res = await db.select('*').from('engagement_history').where({ room_id, student_id}) as EngagementHistory[];
            return res;
        },
        upsertEngagementCurrent: async (engagementInfo: MutationUpsertEngagementCurrentArgs): Promise<Response> => {
            const { room_id, student_id, score, classification } = engagementInfo;
            const {success, message} = await db.raw(
                `? ON CONFLICT (room_id, student_id)
                        DO UPDATE SET
                        classification = EXCLUDED.classification,
                        score = EXCLUDED.score,
                        updated_at = CURRENT_TIMESTAMP
                        RETURNING *;`,
                [db("engagement_current").insert({
                    room_id, student_id, score, classification 
                })],
            ).then((res) => {
                return createEngagementHistory(res.rows[0]);
            }).catch((err) => ({ success: false, message: err.message }));

            if (!success) {
                return { success, message };
            }

            return {
                success,
                message: `Engagement stat with room: "${room_id}" and student: "${student_id}" was upserted successfully`
            };
        },
    };
};
