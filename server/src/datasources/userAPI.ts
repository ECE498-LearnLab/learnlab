import Knex from "knex";
import {
    CreateAccountResponse, MutationCreateStudentArgs, MutationCreateTeacherArgs,
    Role, UserResponse
} from "../generated/graphql";
import { isUniqueViolationError } from "./utils";


export default (db: Knex) => {

    const createStudent = async (userInfo: MutationCreateStudentArgs): Promise<CreateAccountResponse> => {
        const { first_name, last_name, middle_name, email, phone_number, created_at } = userInfo;
        let success = true;
        let message;

        const res = await db('users').returning('id').insert({
            first_name,
            last_name,
            middle_name,
            role: Role.Student,
            email,
            phone_number,
            created_at
        }).catch((err) => {
            success = false;
            if (isUniqueViolationError(err)) {
                message = 'A user matching this information already exists!';
            } else {
                message = err.message;
            }
        });

        if (!success) {
            return { success, message };
        }

        const { parent_email } = userInfo;
        await db('students').insert({
            id: res[0],
            parent_email
        });

        return {
            user_id: res[0],
            success,
            message: `Student user account for ${email} successfully created`
        };
    };

    const createTeacher = async (userInfo: MutationCreateTeacherArgs): Promise<CreateAccountResponse> => {
        const { first_name, last_name, middle_name, email, phone_number, created_at } = userInfo;
        let success = true;
        let message;

        const res = await db('users').returning('id').insert({
            first_name,
            last_name,
            middle_name,
            role: Role.Instructor,
            email,
            phone_number,
            created_at
        }).catch((err) => {
            success = false;
            if (isUniqueViolationError(err)) {
                message = 'A user matching this information already exists!';
            } else {
                message = err.message;
            }
        });

        if (!success) {
            return { success, message };
        }

        const { prefix } = userInfo;
        await db('teachers').insert({
            id: res[0],
            prefix
        });

        return {
            user_id: res[0],
            success,
            message: `Instructor user account for ${email} successfully created`
        };
    };

    return {
        createStudent,
        createTeacher,
        getUser: async (id: string): Promise<UserResponse> => {
            const res = await db.select('*').from('users').where({ id }).catch((err) => { throw err; });
            if (res && res[0]) {
                return { success: true, user: { ...res[0] } };
            } else {
                return {
                    success: false,
                    message: `User ${id} does not exist`
                };
            }
        },
        getUserByEmail: async (email: string): Promise<UserResponse> => {
            const res = await db.select('*').from('users').where({ email }).catch((err) => { throw err; });
            if (res && res[0]) {
                return { success: true, user: { ...res[0] } };
            } else {
                return {
                    success: false,
                    message: `User with this email(${email}) does not exist`
                };
            }
        }
    };
};