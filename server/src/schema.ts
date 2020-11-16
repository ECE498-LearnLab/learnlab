import { gql } from 'apollo-server';

/**
 * A collection of the query "shapes" that we'll execute against our data.
 */
const typeDefs = gql`
    scalar Date

    enum Role {
        STUDENT
        INSTRUCTOR
        ADMIN
    }

    enum RoomState {
        SCHEDULED
        ONGOING
        ENDED
    }

    type User {
        id: ID!
        first_name: String!
        last_name: String!
        middle_name: String
        phone_number: String
        role: Role!
        email: String! # ! for mandatory field (cannot be null)
        last_login: Date
        created_at: Date
        updated_at: Date
    }

    type Classroom {
        id: ID!
        name: String!
        subject: String!
        description: String
        created_at: Date
        updated_at: Date
    }

    type ClassroomDetails {
        classroom: Classroom!
        instructor: User
        students: [User]
    }

    type Question {
        id: ID!
        room_id: ID!
        student_id: ID!
        text: String!
        created_at: Date
    }

    type Room {
        id: ID!
        room_uuid: ID!
        class_id: ID!
        name: String
        start_time: Date
        end_time: Date
        room_status: RoomState!
        created_at: Date
        updated_at: Date
    }

    type Response {
        success: Boolean!
        message: String!
    }

    type UserResponse {
        success: Boolean!
        message: String
        user: User
    }

    type CreateRoomResponse {
        id: ID
        room_uuid: ID
        success: Boolean!
        message: String
    }

    type CreateAccountResponse {
        user_id: ID
        success: Boolean!
        message: String
    }

    type CreateClassroomResponse {
        class_id: ID
        success: Boolean!
        message: String
    }

    # Query type is special; it lists all the available queries that the client can execute
    type Query {
        user(id: ID!): UserResponse!
        classroom(id: ID!): Classroom
        classroomDetails(id: ID!, role: Role!): ClassroomDetails
        questions(room_id: ID!): [Question]!
        roomsForClassroom(class_id: ID!, room_states: [RoomState]): [Room]!
        participants(room_id: ID!): [User]!
    }

    type Mutation {
        createUser(first_name: String!, last_name: String!, 
                   middle_name: String, role: Role!, email: String!,
                   phone_number: String, created_at: Date, parent_email: String): CreateAccountResponse
        createRoom(class_id: ID!, name: String!, start_time: Date, end_time: Date): CreateRoomResponse
        createClassroom(name: String!, subject: String!, teacher_id: ID!, description: String): CreateClassroomResponse
        submitQuestion(room_id: ID!, student_id: ID!, text: String, created_at: Date): Response
        answerQuestion(id: ID!): Response,
        updateRoomStatus(room_id: ID!, room_status: RoomState!): Response,
        addStudentsToClassroom(class_id: ID!, student_emails: [String!]): Response
    }
`;

export = typeDefs;