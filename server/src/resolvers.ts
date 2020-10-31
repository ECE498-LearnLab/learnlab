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
    },
    {
        id: "2",
        name_first: "Wojciech",
        name_last: "Golab",
        role: "teacher",
        email: "teacher@learnlab.com"
    }
];

const fakeSession = [
    {
        room_id: "1",
        class_id: "1",
    },
    {
        room_id: "2",
        class_id: "1",
    }
];

const fakeEngagementHistory = [
    {
        id: "1",
        room_id: "1",
        student_id: "1",
        score: 80,
        classification: "engaged",
        created_at: new Date(1600868700000)
    },
    {
        id: "2",
        room_id: "2",
        student_id: "2",
        score: 20,
        classification: "not engaged",
        created_at: new Date(1600868700000)
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
        room: async (_, { room_id }, { dataSources }: { dataSources: IDataSource }): Promise<Session> => await dataSources.db.getRoom(room_id),
        roomsForClassroom: async (_, { class_id, room_states }, { dataSources }: { dataSources: IDataSource }): Promise<Session[]> => await dataSources.db.getRoomsByClassroom(
            class_id, room_states
        ),
        singleEngagementStat: (_, { room_id, student_id }) => fakeEngagementHistory.find(r => r.room_id === room_id && r.student_id === student_id)
        // need a query for gets average engagement stat of student for a classroom

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
        submitQuestion: async (_, args, { dataSources }: { dataSources: IDataSource }): Promise<Response> => {
            const result = await dataSources.db.submitQuestion(args.room_id, args.student_id, args.text, args.created_at);
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
        },
        updateEngagementCurrent: async (_, args, { dataSources }: { dataSources: IDataSource }): Promise<Response> => {
            const result = await dataSources.db.updateEngagementCurrent(args.room_id, args.student_id, args.score, args.classification, args.created_at);
            return {
                success: result === [],
                message: result === [] ? `Engagement stat ${result} updated successfully` : 'Unable to update engagement stat'
            }
        },
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
