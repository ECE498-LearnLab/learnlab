import { ApolloServer, AuthenticationError } from 'apollo-server';
import { DataSources } from 'apollo-server-core/dist/graphqlOptions';
import * as admin from 'firebase-admin';
import { firebaseConfig } from './auth/verification';
import dbConfig from './datasources/dbConfig';
import LearnlabDB from './datasources/learnlab';
import { resolvers } from './resolvers';
import { AWSS3Uploader } from './s3/s3';
import typeDefs from './schema';


export interface IDataSource {
    db: LearnlabDB
}

interface ConnectionParams {
    authToken: string
}

const learnlabDB = new LearnlabDB(dbConfig);

const uidFromValidToken = async (token: string) => {
    return await admin.auth().verifyIdToken(token).then((decodedToken) => {
        return decodedToken.uid;
    }).catch(() => null);
};
  
admin.initializeApp(firebaseConfig);

const s3Uploader = new AWSS3Uploader({ 
  accessKeyId: 'AKIAYPXW62UVVNPK7HJK',
  secretAccessKey: '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',
  destinationBucketName: 'learnlab'
});

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
    dataSources: () => ({ db: learnlabDB} as DataSources<IDataSource>)
});

server.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`);
});


export { s3Uploader };
