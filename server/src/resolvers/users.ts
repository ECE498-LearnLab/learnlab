import { IDataSource } from "..";
import { CreateAccountResponse, Resolvers, User, UserResponse } from "../generated/graphql";

/**
 * Example queries:
 * 
 * mutation createUser($first_name: String!, $last_name: String!, $role: Role!, $email: String!, $created_at: Date) {
    createUser(first_name: $first_name, last_name: $last_name, role: $role, email: $email, created_at: $created_at) {
        user_id
        success
        message
    }
    }

    query getUser($id: ID!) {
        user(id: $id) {
            user {
            first_name,
            last_name
            email
            created_at
            }
                success
            message
        }
    }
 */

const userResolver: Resolvers = {
    Query: {
        user: async (_, { id }: { id: string }, { dataSources }: { dataSources: IDataSource }): Promise<UserResponse> => await dataSources.db.getUser(id),
    },
    Mutation: {
        createUser: async (_, args: User, { dataSources }: { dataSources: IDataSource }): Promise<CreateAccountResponse> => {
            return await dataSources.db.createUser(args)
        },
    }
}

export default userResolver;