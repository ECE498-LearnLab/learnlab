const { SQLDataSource } = require('datasource-sql');

const MINUTE = 60;

class LearnlabDB extends SQLDataSource {
    async getClassroom (id) {
        const res = await this.db
            .select('*')
            .from('classroom')
            .where({ id })
            .cache(MINUTE); // default value for cache: 5sec
        return res.data;
    }
}

module.exports = LearnlabDB;
