import { SQLDataSource } from 'datasource-sql';
import Knex from 'knex';
import { Classroom, ClassroomDetails, CreateAccountResponse, Role, RoomState, User, UserResponse } from '../generated/graphql';
import { isUniqueViolationError } from './utils';

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
        return this.db.select('*').from('room').where({ room_id });
    }

    getRoomsByClassroom = (class_id: string, room_states: RoomState[]): Promise<any> => {
        return this.db.select('*').from('room').where({ class_id }).andWhere('state', 'in', room_states);
    }

    getParticipantsForRoom = (room_id: string): Promise<any> => {
        /**
         * return this.db.select('*').from('participants').join('user').on('student_id', '=', 'id').where({ room_id });
         */
        return null;
    }

    getUser = async (id: string): Promise<UserResponse> => {
        const res = await this.db.select('*').from('users').where({ id }).catch(err => { throw err; });
        if (res && res[0]) {
            return {
                success: true,
                user: { ...res[0] }
            };
        } else {
            return {
                success: false,
                message: `User ${id} does not exist`
            }
        }
    }

    createUser = async (userInfo: User): Promise<CreateAccountResponse> => {
        const { first_name, last_name, middle_name, role, email, phone_number, created_at} = userInfo;
        let success = true;
        let message;

        const res = await this.db('users').returning('id').insert({
            first_name,
            last_name,
            middle_name,
            role,
            email,
            phone_number,
            created_at
        }).catch(err => {
            success = false;
            if (isUniqueViolationError(err)) {
                message = 'A user matching this information already exists!';
            } else {
                message = err.message
            }
        });

        if (!success) {
            return { success, message };
        }
        
        return {
            user_id: res[0],
            success,
            message: `User account for ${email} successfully created`
        }
    }

    createRoom = (room_id: string, class_id: string, start_time: Date, end_time: Date): Promise<string[]> => {
        return Promise.resolve([room_id]);

        //TODO: Use once db is set up

        // return this.db('room').insert({
        //     room_id: room_id,
        //     class_id: class_id,
        //     start_time: start_time,
        //     end_time: end_time
        // }).returning('room_id');
    }

    submitQuestion = (room_id: string, student_id: string, text: string, created_at: Date): Promise<string[]> => {
        return this.db('question').insert({
            room_id: room_id,
            student_id: student_id,
            text: text,
            created_at: created_at
        });
    }

    answerQuestion = (question_id: string): boolean => {
        //STUB: Figure out what we're doing with questions. Delete? Remove?
        return true;
    }
}

export default LearnlabDB;
