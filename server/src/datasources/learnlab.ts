import { SQLDataSource } from 'datasource-sql';
import Knex from 'knex';
import classroomAPI from './classroomAPI';
import engagementAPI from './engagementAPI';
import fileAPI from './fileAPI';
import questionsAPI from './questionsAPI';
import roomAPI from './roomAPI';
import userAPI from './userAPI';


class LearnlabDB extends SQLDataSource {
    db: Knex;

    constructor (dbConfig: any) {
        super(dbConfig);
    }

    classroomAPI = () => classroomAPI(this.db);

    roomAPI = () => roomAPI(this.db);

    userAPI = () => userAPI(this.db);

    questionsAPI = () => questionsAPI(this.db);

    engagementAPI = () => engagementAPI(this.db);
    
    fileAPI = () => fileAPI(this.db);
}

export default LearnlabDB;