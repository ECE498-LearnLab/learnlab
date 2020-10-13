// some hardcoded data for now
const fakeClassroomData = [
    {
        id: "1",
        name: "BIO-101",
        subject: "Biology",
        description: "Learn about plants."
    },
    {
        id: "2",
        name: "CLAS-102",
        subject: "Mythology",
        description: "Classical mythology to bore the mind."
    }
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
        classroomByDB: async (_, { id }, { dataSources }) => dataSources.db.getClassroom(id)
    }
}