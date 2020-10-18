import { SQLDataSource } from 'datasource-sql';

const MINUTE = 60;

class LearnlabDB extends SQLDataSource {
    db;

    constructor(dbConfig: any) {
        super(dbConfig);
    }

    async getClassroom (id: string) {
        const res = await this.db
            .select('*')
            .from('classroom')
            .where({ id })
            .cache(MINUTE); // default value for cache: 5sec
        return res.data;
    }
}

export default LearnlabDB;
