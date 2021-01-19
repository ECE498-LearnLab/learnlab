import { AuthenticationError } from "apollo-server";
import * as admin from 'firebase-admin';

/**
 * Most of the functions in this file are not being used at the moment.
 * It may be integrated at a later time to allow usage of session cookies.
 * 
 * Thank you to https://github.com/develomark/graphql-server-firebase-authentication-example
 * which was referenced while linking the firebase authentication checks with our server.
 */

export const firebaseConfig = {
    apiKey: 'AIzaSyDqWf-FmQC1aQU3SMRT6Z2i7--6l_ltmW0',
    authDomain: 'learnlab-ef56a.firebaseapp.com',
    projectId: 'learnlab-ef56a',
    storageBucket: 'learnlab-ef56a.appspot.com',
    messagingSenderId: '566239504531',
    appId: '1:566239504531:web:3d6b3e60d14ddabc0e8566',
};
  
export async function getUser (context): Promise<any> {
    const Authorization = (context.req || context.request).get('Authorization');
    if (Authorization) {
      const token = Authorization.replace('Bearer ', '');
      const { id, admin } = (await verifyUserSessionToken(token));
      return { id, admin };
    }
    return null;
}

/**
 *  Verify session cookies tokens with firebase admin; this is a low overhead operation.
 * @param token 
 */
const verifyUserSessionToken = async (token) => {
    const user = await admin
      .auth()
      // verify session cookie is valid and check if it is revoked
      .verifySessionCookie(token, true);
  
    if (user.id) {
        return user;
    } else if (user.uid) {
      const { customClaims } = await getUserRecord(user.uid);
      
      return customClaims;
    } else {
        throw new AuthenticationError('Unable to verify user session token');
    }
};

const getUserRecord = (uid) => admin.auth().getUser(uid);