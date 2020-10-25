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

    type User {
        id: ID!
        name_first: String
        name_last: String
        role: String
        email: String! # ! for mandatory field (cannot be null)
    }

    type Classroom {
        id: ID!
        name: String
        subject: String
        description: String
    }

    type ClassroomDetails {
        classroom: Classroom!
        instructor: User
        students: [User]
    }

    type Question {
        id: ID
        room_id: ID!
        student_id: ID!
        text: String
        created_at: Date
    }

    type Session {
        room_id: ID!
        class_id: ID!
        start_time: Date
        end_time: Date
    }

    type Response {
        success: Boolean!
        message: String!
    }

    type CreateRoomResponse {
        room_id: ID!
        success: Boolean!
        message: String
    }

    # Query type is special; it lists all the available queries that the client can execute
    type Query {
        user(id: ID!): User!
        classroom(id: ID!): Classroom
        classroomDetails(id: ID!, role: Role): ClassroomDetails
        questions(room_id: ID!): [Question]!
        room(room_id: ID!): Session
    }

    type Mutation {
        createRoom(class_id: ID!, start_time: Date, end_time: Date): CreateRoomResponse
        submitQuestion(room_id: ID!, student_id: ID!, text: String, created_at: Date): Response
        answerQuestion(id: ID!): Response
    }
`;

export = typeDefs;
