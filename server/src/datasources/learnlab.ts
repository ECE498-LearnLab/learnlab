import { SQLDataSource } from 'datasource-sql';
import Knex from 'knex';
import { Classroom, ClassroomDetails, Question, Role, Session, User } from '../generated/graphql';

const MINUTE = 60;

class LearnlabDB extends SQLDataSource {
    db: Knex;

    constructor(dbConfig: any) {
        super(dbConfig);
    }

    getClassroom = (id: string): Promise<Classroom> => {
        return this.db
            .select('*')
            .from('classroom')
            .where({ id })
            //@ts-ignore
            .cache(MINUTE); // default value for cache: 5sec
    }

    getClassDetails = (class_id: string, role: Role): Promise<ClassroomDetails> => {
        if (role === Role.Instructor) {
            //TODO once db is set up
        } else {
            //TODO once db is set up
        }

        return null;
    }

    getRoom = (room_id: string): Promise<any> => {
        return this.db.select('*').from('session').where({ room_id });
    }

    createRoom = (room_id: string, class_id: string, start_time: Date, end_time: Date): Promise<string[]> => {
        return Promise.resolve([room_id]);

        //TODO: Use once db is set up

        // return this.db('session').insert({
        //     room_id: room_id,
        //     class_id: class_id,
        //     start_time: start_time,
        //     end_time: end_time
        // }).returning('room_id');
    }

    submitQuestion = (questionInfo: Question): Promise<string[]> => {
        return this.db('question').insert({
            room_id: questionInfo.room_id,
            student_id: questionInfo.student_id,
            text: questionInfo.text,
            created_at: questionInfo.created_at
        });
    }

    answerQuestion = (question_id: string): boolean => {
        //STUB: Figure out what we're doing with questions. Delete? Remove?
        return true;
    }
}

export default LearnlabDB;
