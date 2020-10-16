const { GraphQLScalarType, Kind } = require("graphql");

// some hardcoded data for now
const fakeClassroomData = [
    {
        id: "1",
        name: "BIO-101",
        subject: "Biology",
        description: "Learn about plants.",
    },
    {
        id: "2",
        name: "CLAS-102",
        subject: "Mythology",
        description: "Classical mythology to bore the mind.",
    },
];

const fakeQuestionData = [
    {
        id: "0",
        session_id: "1",
        student_id: "1",
        text: "Mrs.Dees, where are your nuts?",
        created_at: new Date(1602632500122),
    },
    {
        id: "1",
        session_id: "1",
        student_id: "2",
        text: "When is lunch break?",
        created_at: new Date(1600868700000),
    },
];

module.exports = {
    // the 4 positional arguments for a resolver are: (parent, args, context, info)
    // where "args" is the argument coming in from the graphql query
    Query: {
        /**
         * Example: query for the first classroom w/ this query:
         *   classroom(id: 1) {
                id
                name
                subject
            }
         */
        classroom: (_, { id }) => fakeClassroomData.find(c => c.id === id),
        classroomByDB: async (_, { id }, { dataSources }) => dataSources.db.getClassroom(id),
        question: (_, { student_id, session_id }) => fakeQuestionData.find(q => q.student_id === student_id),
    },
    Date: new GraphQLScalarType({
        name: "Date",
        description: "Custom scalar for dates",
        parseValue (value) {
            return new Date(value); // value from the client
        },
        serialize (value) {
            return value.getTime(); // value sent to the client
        },
        parseLiteral (ast) {
            return ast.kind === Kind.INT ? new Date(+ast.value) : null; // ast value is always a string
        },
    }),
};
