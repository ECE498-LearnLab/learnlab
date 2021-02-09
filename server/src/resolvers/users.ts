import { IDataSource } from "..";
import {
    CreateAccountResponse, MutationUpdateUserInfoArgs, MutationCreateStudentArgs, MutationCreateTeacherArgs,
    Resolvers, Response, UserResponse, MutationUpdateRoomStatusArgs
} from "../generated/graphql";


const userResolver: Resolvers = {
    Query: {
        user: async (_, { id }: { id: string }, { dataSources }: { dataSources: IDataSource })
        : Promise<UserResponse> => await dataSources.db.userAPI().getUser(id),
        userByEmail: async (_, { email }: { email : string }, { dataSources }: { dataSources: IDataSource })
        : Promise<UserResponse> => await dataSources.db.userAPI().getUserByEmail(email),
    },
    Mutation: {
        createStudent: async (_, args: MutationCreateStudentArgs, { dataSources }: { dataSources: IDataSource })
        : Promise<CreateAccountResponse> => {
            return await dataSources.db.userAPI().createStudent(args);
        },
        createTeacher: async (_, args: MutationCreateTeacherArgs, { dataSources }: { dataSources: IDataSource })
        : Promise<CreateAccountResponse> => {
            return await dataSources.db.userAPI().createTeacher(args);
        },
        updateUserInfo: async (_, args: MutationUpdateUserInfoArgs, { dataSources }: { dataSources: IDataSource })
        : Promise<CreateAccountResponse> => {
            return await dataSources.db.userAPI().updateUserInfo(args);
        }
    }
};

export default userResolver;