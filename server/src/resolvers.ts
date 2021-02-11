import { mergeResolvers } from '@graphql-tools/merge';
import { GraphQLScalarType, Kind } from 'graphql';
import { Resolvers } from "./generated/graphql";
import classroomResolver from './resolvers/classrooms';
import engagementStatsResolver from './resolvers/engagementStats';
import filesResolver from './resolvers/files';
import questionResolver from './resolvers/questions';
import roomResolver from './resolvers/rooms';
import userResolver from './resolvers/users';

// the 4 positional arguments for a resolver are: (parent, args, context, info)
export const resolvers: Resolvers = mergeResolvers([
    userResolver,
    classroomResolver,
    roomResolver,
    questionResolver,
    engagementStatsResolver,
    filesResolver,
    {
        Date: new GraphQLScalarType({
            name: 'Date',
            description: 'Custom scalar for dates',
            parseValue (value) {
                return new Date(value); // value from the client
            },
            serialize (value) {
                return value.getTime(); // value sent to the client
            },
            parseLiteral (ast) {
                return ast.kind === Kind.INT ? new Date(+ast.value) : null; // ast value is always a string
            }
        })
}]);
