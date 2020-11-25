import { GraphQLScalarType, Kind } from 'graphql';
import { mergeResolvers } from '@graphql-tools/merge';
import { Resolvers } from "./generated/graphql";
import userResolver from './resolvers/users';
import classroomResolver from './resolvers/classrooms';
import roomResolver from './resolvers/rooms';
import questionResolver from './resolvers/questions';
import engagementStatsResolver from './resolvers/engagementStats';

// the 4 positional arguments for a resolver are: (parent, args, context, info)
export const resolvers: Resolvers = mergeResolvers([
    userResolver,
    classroomResolver,
    roomResolver,
    questionResolver,
    engagementStatsResolver,
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
