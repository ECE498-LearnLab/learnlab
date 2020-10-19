/**
 * TODO: Once we determine needed models, refer to the below for using custom models in code gen
 * https://the-guild.dev/blog/better-type-safety-for-resolvers-with-graphql-codegen
*/

export type User = {
    id: string;
    email: string;
    profile?: UserProfile;
};

export type UserProfile = {
    firstName?: string;
    lastName?: string;
};