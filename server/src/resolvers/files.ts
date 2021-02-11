import { IDataSource } from "..";
import {
    File,
    Maybe,
    MutationCreateTagArgs,
    MutationUploadFileArgs,
    QueryFilesForClassroomArgs,
    QueryFileTagsForClassroomArgs,
    Resolvers, Response, Tag
} from "../generated/graphql";


const fileResolver: Resolvers = {
    Query: {
        filesForClassroom: async (_, { class_id } : QueryFilesForClassroomArgs,
            { dataSources }: { dataSources: IDataSource }): Promise<Maybe<Array<Maybe<File>>>> => {           
            return await dataSources.db.fileAPI().getFilesByClassroom(
                { class_id }
            );
        },
        fileTagsForClassroom: async (_, { class_id } : QueryFileTagsForClassroomArgs,
            { dataSources }: { dataSources: IDataSource }): Promise<Maybe<Array<Maybe<Tag>>>> => {           
            return await dataSources.db.fileAPI().getFileTagsByClassroom(
                { class_id }
            );
        },
    },
    Mutation: {
        uploadFile: async (_, args: MutationUploadFileArgs, { dataSources }: { dataSources: IDataSource })
        : Promise<Response> => {
            return await dataSources.db.fileAPI().uploadFile(args);
        },
        createTag: async (_, args: MutationCreateTagArgs, { dataSources }: { dataSources: IDataSource })
        : Promise<Response> => {
            return await dataSources.db.fileAPI().createTag(args);
        },
    }
};

export default fileResolver;