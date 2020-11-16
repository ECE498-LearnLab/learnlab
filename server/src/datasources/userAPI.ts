import Knex from "knex";
import { CreateAccountResponse, MutationCreateUserArgs, Role, UserResponse } from "../generated/graphql";
import { isUniqueViolationError } from "./utils";


export default (db: Knex) => {

    const createUser = async (userInfo: MutationCreateUserArgs): Promise<CreateAccountResponse> => {
        const { first_name, last_name, middle_name, role, email, phone_number, created_at } = userInfo;
        let success = true;
        let message;

        const res = await db('users').returning('id').insert({
            first_name,
            last_name,
            middle_name,
            role,
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

        if (role === Role.Student) {
            const { parent_email } = userInfo;
            await db('students').insert({
                id: res[0],
                parent_email
            });
        } else if (role === Role.Instructor) {
            await db('teachers').insert({
                id: res[0]
            });
        }

        return {
            user_id: res[0],
            success,
            message: `User account for ${email} successfully created`
        };
    };

    return {
        createUser,
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
        }
    };
};