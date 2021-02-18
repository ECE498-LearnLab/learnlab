import { gql } from 'apollo-server';

/**
 * A collection of the query "shapes" that we'll execute against our data.
 */
const typeDefs = gql`
    scalar Date
    scalar FileUpload

    enum Role {
        STUDENT
        INSTRUCTOR
    }

    enum RoomState {
        SCHEDULED
        ONGOING
        ENDED
    }

    enum ParticipantStatus {
        INVITED
        JOINED
    }

    enum TeacherPrefix {
        Mr
        Mrs
        Ms
    }

    type File {
        id: ID!
        filename: String!
        class_id: ID!
        created_at: Date!
        storage_link: String!
        tags: [Tag]
    }

    type Tag {
        id: ID!
        tag: String!
        class_id: ID!
        color: String!
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

    type ClassroomsTaught {
        classrooms: [Classroom]
    }

    type ClassroomsTaken {
        classrooms: [Classroom]
    }

    type Question {
        id: ID!
        room_id: ID!
        student_id: ID!
        text: String!
        upvotes: Int
        created_at: Date,
        deleted_at: Date
    }

    type Room {
        id: ID!
        room_uuid: ID!
        class_id: ID!
        room_name: String
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

    type CreateQuestionResponse {
        id: ID
        created_at: Date,
        success: Boolean!
        message: String
    }

    type Upvotes {
        upvotes: Int!
    }

    type EngagementHistory {
        id: ID
        room_id: ID!
        student_id: ID!
        score: Int!
        classification: String!
        created_at: Date
    }

    type EngagementAverage {
        id: ID
        room_id: ID!
        score: Int!
        taken_at: Date!
    }

    type Subscription {
        engagementStatAdded(student_id: ID!): EngagementHistory
        engagementAverageAdded(room_id: ID!): EngagementAverage
    }

    # Query type is special; it lists all the available queries that the client can execute
    type Query {
        user(id: ID!): UserResponse!
        userByEmail(email: String!): UserResponse!
        classroom(id: ID!): Classroom
        classroomDetails(id: ID!, role: Role!): ClassroomDetails
        classroomsTaken(student_id: ID!): ClassroomsTaken
        classroomsTaught(teacher_id: ID!): ClassroomsTaught
        questions(room_id: ID!): [Question]!
        roomsForClassroom(class_id: ID!, user_id: ID!, room_states: [RoomState]): [Room]!
        endedRoomsByDate(user_id: ID!, end_time: Date!): [Room]!
        participants(room_id: ID!, statuses: [ParticipantStatus]): [User]!
        studentRoomEngagementHistory(room_id: ID!, student_id: ID!): [EngagementHistory]!
        studentAllEngagementHistory(student_id: ID!): [EngagementHistory]! 
        roomEngagementAverage(room_id: ID!): [EngagementAverage]!
        filesForClassroom(class_id: ID!): [File]
        fileTagsForClassroom(class_id: ID!): [Tag]
    }

    type Mutation {
        createStudent(first_name: String!, last_name: String!, 
                   middle_name: String, email: String!,
                   phone_number: String, created_at: Date, parent_email: String): CreateAccountResponse,
        createTeacher(first_name: String!, last_name: String!, 
                   middle_name: String, prefix: TeacherPrefix, email: String!,
                   phone_number: String, created_at: Date): CreateAccountResponse,
        updateUserInfo(user_id: ID!, first_name: String, last_name: String,
            middle_name: String, email: String, phone_number: String, parent_email: String, prefix: String):
             CreateAccountResponse,
        createRoom(class_id: ID!, name: String!, start_time: Date, end_time: Date): CreateRoomResponse
        createClassroom(name: String!, subject: String!, teacher_id: ID!, description: String): CreateClassroomResponse
        submitQuestion(room_id: ID!, student_id: ID!, text: String): CreateQuestionResponse
        answerQuestion(id: ID!): Response,
        upvoteQuestion(id: ID!): Upvotes,
        updateRoomStatus(room_id: ID!, room_status: RoomState!): Response,
        addStudentsToClassroom(class_id: ID!, student_emails: [String!]): Response
        invite(student_ids: [ID!], room_id: ID!): Response
        joinRoom(student_id: ID!, room_id: ID!): Response
        upsertEngagementCurrent(room_id: ID!, student_id: ID!, score: Int!, classification: String!, created_at: Date!):
                    Response
        uploadFile(class_id: ID!, file: FileUpload!, tags: [ID!]): Response
        createTag(class_id: ID!, tag: String!, color: String!): Response
    }
`;

export = typeDefs;
