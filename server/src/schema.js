const { gql } = require('apollo-server');

/**
 * A collection of the query "shapes" that we'll execute against our data.
 */
const typeDefs = gql`
    scalar Date

    type User {
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

    type Question {
        id: ID!
        session_id: ID!
        student_id: ID!
        text: String
        created_at: Date
    }

    type Session {
        id: ID!
        class_id: ID!
        start_time: Date
        end_time: Date
        session_link: String
    }

    # Query type is special; it lists all the available queries that the client can execute
    type Query {
        classroom(id: ID!): Classroom
        classroomByDB(id: ID!): Classroom
        question(student_id: ID!, session_id: ID!): Question
    }
`;

module.exports = typeDefs;
