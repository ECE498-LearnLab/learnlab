const { gql } = require('apollo-server');

/**
 * A collection of the query "shapes" that we'll execute against our data.
 */

const typeDefs = gql`
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

    # Query type is special; it lists all the available queries that the client can execute
    type Query {
        classroom(id: ID!): Classroom,
        classroomByDB(id: ID!): Classroom
    }
`;

module.exports = typeDefs;
