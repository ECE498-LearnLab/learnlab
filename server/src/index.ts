import { ApolloServer, AuthenticationError } from 'apollo-server';
import { DataSources } from 'apollo-server-core/dist/graphqlOptions';
import * as admin from 'firebase-admin';
import { firebaseConfig } from './auth/verification';
import LearnlabDB from './datasources/learnlab';
import { resolvers } from './resolvers';
import typeDefs from './schema';

const useLocalDb = true;
const connectionConfig = useLocalDb
    ? {        
        host: 'db',
        user: 'postgres',
        port: 5432,
        password: 'postgres',
        database: 'learnlab_local'
    }
    : {
        host: 'learnlab-database-1.csosestc6lcm.ca-central-1.rds.amazonaws.com',
        user: 'root',
        password: '<PWD>',
        database: 'learnlab_1'
};

const dbConfig = {
    client: 'pg',
    connection: connectionConfig
};

export interface IDataSource {
    db: LearnlabDB
}

const buildDataSource = () => {
    return {
        db: new LearnlabDB(dbConfig)
    } as DataSources<IDataSource>;
};
  
admin.initializeApp(firebaseConfig);

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
        const token = req.headers.authorization || '';
        const uid = await admin.auth().verifyIdToken(token).then((decodedToken) => {
            return decodedToken.uid;
        }).catch(() => null);

        if (!uid) throw new AuthenticationError('You must be logged in!');

        return { loggedIn: true };
    },
    dataSources: () => buildDataSource()
});

server.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`);
});
