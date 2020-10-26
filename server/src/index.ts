import { ApolloServer } from 'apollo-server';
import { DataSources } from 'apollo-server-core/dist/graphqlOptions';
import typeDefs from './schema';
import { resolvers } from './resolvers';
import LearnlabDB from './datasources/learnlab';

const dbConfig = {
    client: 'pg',
    connection: {
        host: 'learnlab-database-1.csosestc6lcm.ca-central-1.rds.amazonaws.com',
        user: 'root',
        password: '<PWD HERE>',
        database: 'learnlab_1'
    }
};

export interface IDataSource {
    db: LearnlabDB
}

const buildDataSource = () => {
    return {
        db: new LearnlabDB(dbConfig)
    } as DataSources<IDataSource>
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => buildDataSource()
});

server.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`);
});
