// import workerpool from 'workerpool';
// import Knex from 'knex';

const workerpool = require('workerpool');
const Knex = require('knex');
const dbConfig = require('../datasources/dbConfig.js');


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
    return await db.select(['score', 'updated_at', 'student_id'])
                    .from('engagement_current')
                    .where({ room_id })
                    .andWhere('updated_at', '>=', then);
};

const writeAverage = async (room_id, stats) => {
    const avgScore = Math.round(stats.reduce((sum, n) => (sum + n.score), 0) / stats.length);
    const avgTimestamp = new Date((stats.map((d) => new Date(d.updated_at).getTime())
                            .reduce((sum, d) => (sum + d)) / stats.length));

    await db('engagement_average')
        .insert({ room_id, score: avgScore, taken_at: avgTimestamp})
        .catch((err) => {
            console.log("Could not write engagement average: " + err);
        });

    console.log("Avg. score is " + avgScore);
    console.log("Taken at " + avgTimestamp);
    workerpool.workerEmit({
        status: 'published_stat',
        publishedStat: {
            score: avgScore,
            taken_at: avgTimestamp
        }
    });
};

const timeout = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

workerpool.worker({
    roomStats: computeRoomStatAvgs
});