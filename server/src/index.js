const { ApolloServer } = require('apollo-server');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const LearnlabDB = require('./datasources/learnlab');

const dbConfig = {
    client: 'pg',
    connection: {
        host: 'learnlab-database-1.csosestc6lcm.ca-central-1.rds.amazonaws.com',
        user: 'root',
        password: '<PWD HERE>',
        database: 'learnlab_1'
    }
};

const db = new LearnlabDB(dbConfig);

const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => ({ db })
});

server.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`);
});
