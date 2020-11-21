import { IDataSource } from "..";
import { CreateAccountResponse, MutationCreateUserArgs, Resolvers, UserResponse } from "../generated/graphql";


const userResolver: Resolvers = {
    Query: {
        user: async (_, { id }: { id: string }, { dataSources }: { dataSources: IDataSource })
        : Promise<UserResponse> => await dataSources.db.userAPI().getUser(id),
    },
    Mutation: {
        createUser: async (_, args: MutationCreateUserArgs, { dataSources }: { dataSources: IDataSource })
        : Promise<CreateAccountResponse> => {
            return await dataSources.db.userAPI().createUser(args);
        },
    }
};

export default userResolver;