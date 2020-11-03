import { ApolloServer } from 'apollo-server';
import { DataSources } from 'apollo-server-core/dist/graphqlOptions';
import typeDefs from './schema';
import { resolvers } from './resolvers';
import LearnlabDB from './datasources/learnlab';

const dbConfig = {
    client: 'pg',
    connection: {
        // host: 'learnlab-database-1.csosestc6lcm.ca-central-1.rds.amazonaws.com',
        host: 'db',
        user: 'postgres',
        password: 'postgres',
        database: 'learnlab_local'
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
