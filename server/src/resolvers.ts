import { GraphQLScalarType, Kind } from 'graphql';
import { IDataSource } from '.';
import { v4 as uuidv4 } from 'uuid';
import { Question, Resolvers, Response, Session, ClassroomDetails, Role, CreateRoomResponse } from "./generated/graphql";

// some hardcoded data for now
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

const fakeQuestionData = [
    {
        id: '0',
        room_id: '1',
        student_id: '1',
        text: 'Mrs.Dees, where are your nuts? I am a hungry little squirrel child.',
        created_at: new Date(1602632500122)
    },
    {
        id: '1',
        room_id: '1',
        student_id: '2',
        text: 'When is lunch break?',
        created_at: new Date(1600868700000)
    }
];

const fakeUsers = [
    {
        id: "1",
        name_first: "Horace",
        name_last: "Beemer",
        role: "student",
        email: "user@learnlab.com"
    }
];

export const resolvers: Resolvers = {
    // the 4 positional arguments for a resolver are: (parent, args, context, info)
    Query: {
        user: (_, args) => fakeUsers.find(u => u.id === args.id),
        classroom: (_, { id }) => fakeClassroomData.find(c => c.id === id),
        classroomDetails: async (_, { id, role }: { id: string, role: Role }, { dataSources }: { dataSources: IDataSource }): Promise<ClassroomDetails> => {
           return await dataSources.db.getClassDetails(id, role);
        },
        questions: (_, { room_id }) => fakeQuestionData.filter(q => q.room_id === room_id),
        room: async (_, { room_id }, { dataSources }: { dataSources: IDataSource }): Promise<Session> => dataSources.db.getRoom(room_id),
    },
    Mutation: {
        createRoom: async (_, args, { dataSources }: { dataSources: IDataSource }): Promise<CreateRoomResponse> => {
            const room_id = uuidv4();
            
            const result = await dataSources.db.createRoom(room_id, args.class_id, args.start_time, args.end_time);
            return {
                success: result && result[0] === room_id,
                message: `Room ${room_id} ${result && result[0] === room_id ? 'created successfully': 'could not be created'}`,
                room_id: room_id
            }
        },
        submitQuestion: async (_, questionInfo: Question, { dataSources }: { dataSources: IDataSource }): Promise<Response> => {
            const result = await dataSources.db.submitQuestion(questionInfo);
            return {
                success: result === [],
                message: result === [] ? `Question ${result} submitted successfully` : 'Unable to submit question'
            }
        },
        answerQuestion: async (_, { id }: { id: string }, { dataSources }: { dataSources: IDataSource }): Promise<Response> => {
            const result = await dataSources.db.answerQuestion(id)
            return {
                success: result,
                message: result ? `Successfully marked question ${id} as answered` 
                : `Failed to mark question ${id} as answered`
            }
        }
    },
    Date: new GraphQLScalarType({
        name: 'Date',
        description: 'Custom scalar for dates',
        parseValue (value) {
            return new Date(value); // value from the client
        },
        serialize (value) {
            return value.getTime(); // value sent to the client
        },
        parseLiteral (ast) {
            return ast.kind === Kind.INT ? new Date(+ast.value) : null; // ast value is always a string
        }
    })
};
