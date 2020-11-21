import { IDataSource } from "..";
import {
    Classroom, ClassroomDetails, CreateClassroomResponse,
    MutationAddStudentsToClassroomArgs, MutationCreateClassroomArgs,
    QueryClassroomArgs, QueryClassroomDetailsArgs, Resolvers, Response
} from "../generated/graphql";


const classroomResolver: Resolvers = {
    Query: {
        classroom: async (_, { id }: QueryClassroomArgs, { dataSources }: { dataSources: IDataSource })
        : Promise<Classroom> => {
            return await dataSources.db.classroomAPI().getClassroom(id);
        },
        classroomDetails: async (_, args: QueryClassroomDetailsArgs, { dataSources }: { dataSources: IDataSource })
        : Promise<ClassroomDetails> => {
            return await dataSources.db.classroomAPI().getClassDetails(args);
        },
    },
    Mutation: {
        createClassroom: async (_, args: MutationCreateClassroomArgs, { dataSources }: { dataSources: IDataSource })
        : Promise<CreateClassroomResponse> => {
            return await dataSources.db.classroomAPI().createClassroom(args);
        },
        addStudentsToClassroom: async (_, args: MutationAddStudentsToClassroomArgs,
            { dataSources }: { dataSources: IDataSource }): Promise<Response> => {
            return await dataSources.db.classroomAPI().addStudentsToClassroom(args);
        }
    }
};

export default classroomResolver;