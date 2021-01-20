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

interface ConnectionParams {
    authToken: string
}

const buildDataSource = () => {
    return {
        db: new LearnlabDB(dbConfig)
    } as DataSources<IDataSource>;
};

const uidFromValidToken = async (token: string) => {
    return await admin.auth().verifyIdToken(token).then((decodedToken) => {
        return decodedToken.uid;
    }).catch(() => null);
};
  
admin.initializeApp(firebaseConfig);

const server = new ApolloServer({
    typeDefs,
    resolvers,
    subscriptions: {
        onConnect: async (connectionParams: ConnectionParams, _, __) => {
            if (connectionParams.authToken) {
                const uid = await uidFromValidToken(connectionParams.authToken);
                if (!uid) throw new AuthenticationError('You must be logged in!');
                return { loggedIn: true };
            }

            throw new AuthenticationError("Missing auth token.");
        }
    },
    context: async ({ req, connection }) => {
        if (connection) {
            // context for subscriptions is in connection and is different from queries/mutations
            return connection.context;
        }

        let token = req.headers.authorization;
        if (token) {
            token = token.replace('Bearer ', '');
            const uid = await uidFromValidToken(token);
    
            if (!uid) throw new AuthenticationError('You must be logged in!');
        } else {
            throw new AuthenticationError('Token missing in request');
        }

        return { loggedIn: true };
    },
    dataSources: () => buildDataSource()
});

server.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`);
});
