import { IDataSource } from "..";
import { ClassroomDetails, Resolvers, Role } from "../generated/graphql";

const fakeClassroomData = [
    {
        id: '1',
        name: 'BIO-101',
        subject: 'Biology',
        description: 'Learn about plants.'
    },
    {
        id: '2',
        name: 'CLAS-102',
        subject: 'Mythology',
        description: 'Classical mythology to bore the mind.'
    }
];

const classroomResolver: Resolvers = {
    Query: {
        classroom: (_, { id }) => fakeClassroomData.find(c => c.id === id),
        classroomDetails: async (_, { id, role }: { id: string, role: Role }, { dataSources }: { dataSources: IDataSource }): Promise<ClassroomDetails> => {
            return await dataSources.db.getClassDetails(id, role);
        },
    },
    Mutation: {

    }
}

export default classroomResolver;