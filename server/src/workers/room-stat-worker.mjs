import Knex from 'knex';
import workerpool from 'workerpool';
import dbConfig from '../datasources/dbConfig.js';

const db = Knex(dbConfig);
const AVERAGING_INTERVAL = 5000;


async function computeRoomStatAvgs (room_id) {
    workerpool.workerEmit({
        status: 'starting'
    });
    
    for (;;) {
        const stats = await readRoomStatsNow(room_id);
        if (stats.length > 0) {
            console.log(stats);
            await writeAverage(room_id, stats);
        }

        await timeout(5000);
    } 
}

const readRoomStatsNow = async (room_id) => {
    const now = new Date();
    const then = new Date(now.getTime() - AVERAGING_INTERVAL);
    return await db.select(['score', 'updated_at'])
                    .from('engagement_current')
                    .where({ room_id })
                    .andWhereBetween('updated_at', [
                        then,
                        now
                    ]);
};

const writeAverage = async (room_id, stats) => {
    const avgScore = stats.reduce((sum, n) => (sum + n.score), 0) / stats.length;
    const avgTimestamp = new Date((stats.map((d) => new Date(d.updated_at).getTime())
                            .reduce((sum, d) => (sum + d)) / stats.length));

    // TODO: Figure out how subscriptions will work with this
    await db('engagement_average')
        .insert({ room_id, score: avgScore, taken_at: avgTimestamp})
        .catch((err) => {
            console.log("Could not write engagement average: " + err);
        });

    console.log("Avg. score is " + avgScore);
    console.log("Taken at " + avgTimestamp);
};

const timeout = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

workerpool.worker({
    roomStats: computeRoomStatAvgs
});