import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: any;
};


export enum Role {
  Student = 'STUDENT',
  Instructor = 'INSTRUCTOR',
  Admin = 'ADMIN'
}

export enum RoomState {
  Scheduled = 'SCHEDULED',
  Ongoing = 'ONGOING',
  Ended = 'ENDED',
  All = 'ALL'
}

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  first_name: Scalars['String'];
  last_name: Scalars['String'];
  middle_name?: Maybe<Scalars['String']>;
  phone_number?: Maybe<Scalars['String']>;
  role: Role;
  email: Scalars['String'];
  last_login?: Maybe<Scalars['Date']>;
  created_at?: Maybe<Scalars['Date']>;
  updated_at?: Maybe<Scalars['Date']>;
};

export type Classroom = {
  __typename?: 'Classroom';
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  subject?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
};

export type ClassroomDetails = {
  __typename?: 'ClassroomDetails';
  classroom: Classroom;
  instructor?: Maybe<User>;
  students?: Maybe<Array<Maybe<User>>>;
};

export type Question = {
  __typename?: 'Question';
  id: Scalars['ID'];
  room_id: Scalars['ID'];
  student_id: Scalars['ID'];
  text: Scalars['String'];
  created_at?: Maybe<Scalars['Date']>;
};

export type Room = {
  __typename?: 'Room';
  room_id: Scalars['ID'];
  class_id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  start_time?: Maybe<Scalars['Date']>;
  end_time?: Maybe<Scalars['Date']>;
  room_state: RoomState;
};

export type Response = {
  __typename?: 'Response';
  success: Scalars['Boolean'];
  message: Scalars['String'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  success: Scalars['Boolean'];
  message?: Maybe<Scalars['String']>;
  user?: Maybe<User>;
};

export type CreateRoomResponse = {
  __typename?: 'CreateRoomResponse';
  room_id: Scalars['ID'];
  success: Scalars['Boolean'];
  message?: Maybe<Scalars['String']>;
};

export type CreateAccountResponse = {
  __typename?: 'CreateAccountResponse';
  user_id?: Maybe<Scalars['ID']>;
  success: Scalars['Boolean'];
  message?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  user: UserResponse;
  classroom?: Maybe<Classroom>;
  classroomDetails?: Maybe<ClassroomDetails>;
  questions: Array<Maybe<Question>>;
  room?: Maybe<Room>;
  roomsForClassroom: Array<Maybe<Room>>;
  participants: Array<Maybe<User>>;
};


export type QueryUserArgs = {
  id: Scalars['ID'];
};


export type QueryClassroomArgs = {
  id: Scalars['ID'];
};


export type QueryClassroomDetailsArgs = {
  id: Scalars['ID'];
  role?: Maybe<Role>;
};


export type QueryQuestionsArgs = {
  room_id: Scalars['ID'];
};


export type QueryRoomArgs = {
  room_id: Scalars['ID'];
};


export type QueryRoomsForClassroomArgs = {
  class_id: Scalars['ID'];
  room_states?: Maybe<Array<Maybe<RoomState>>>;
};


export type QueryParticipantsArgs = {
  room_id: Scalars['ID'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createUser?: Maybe<CreateAccountResponse>;
  createRoom?: Maybe<CreateRoomResponse>;
  submitQuestion?: Maybe<Response>;
  answerQuestion?: Maybe<Response>;
};


export type MutationCreateUserArgs = {
  first_name: Scalars['String'];
  last_name: Scalars['String'];
  middle_name?: Maybe<Scalars['String']>;
  role: Role;
  email: Scalars['String'];
  phone_number?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['Date']>;
};


export type MutationCreateRoomArgs = {
  class_id: Scalars['ID'];
  start_time?: Maybe<Scalars['Date']>;
  end_time?: Maybe<Scalars['Date']>;
};


export type MutationSubmitQuestionArgs = {
  room_id: Scalars['ID'];
  student_id: Scalars['ID'];
  text?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['Date']>;
};


export type MutationAnswerQuestionArgs = {
  id: Scalars['ID'];
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> = LegacyStitchingResolver<TResult, TParent, TContext, TArgs> | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Date: ResolverTypeWrapper<Scalars['Date']>;
  Role: Role;
  RoomState: RoomState;
  User: ResolverTypeWrapper<User>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Classroom: ResolverTypeWrapper<Classroom>;
  ClassroomDetails: ResolverTypeWrapper<ClassroomDetails>;
  Question: ResolverTypeWrapper<Question>;
  Room: ResolverTypeWrapper<Room>;
  Response: ResolverTypeWrapper<Response>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  UserResponse: ResolverTypeWrapper<UserResponse>;
  CreateRoomResponse: ResolverTypeWrapper<CreateRoomResponse>;
  CreateAccountResponse: ResolverTypeWrapper<CreateAccountResponse>;
  Query: ResolverTypeWrapper<{}>;
  Mutation: ResolverTypeWrapper<{}>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Date: Scalars['Date'];
  User: User;
  ID: Scalars['ID'];
  String: Scalars['String'];
  Classroom: Classroom;
  ClassroomDetails: ClassroomDetails;
  Question: Question;
  Room: Room;
  Response: Response;
  Boolean: Scalars['Boolean'];
  UserResponse: UserResponse;
  CreateRoomResponse: CreateRoomResponse;
  CreateAccountResponse: CreateAccountResponse;
  Query: {};
  Mutation: {};
};

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  first_name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  last_name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  middle_name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  phone_number?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  role?: Resolver<ResolversTypes['Role'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  last_login?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  created_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  updated_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ClassroomResolvers<ContextType = any, ParentType extends ResolversParentTypes['Classroom'] = ResolversParentTypes['Classroom']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  subject?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ClassroomDetailsResolvers<ContextType = any, ParentType extends ResolversParentTypes['ClassroomDetails'] = ResolversParentTypes['ClassroomDetails']> = {
  classroom?: Resolver<ResolversTypes['Classroom'], ParentType, ContextType>;
  instructor?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  students?: Resolver<Maybe<Array<Maybe<ResolversTypes['User']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QuestionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Question'] = ResolversParentTypes['Question']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  room_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  student_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  text?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  created_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RoomResolvers<ContextType = any, ParentType extends ResolversParentTypes['Room'] = ResolversParentTypes['Room']> = {
  room_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  class_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  start_time?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  end_time?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  room_state?: Resolver<ResolversTypes['RoomState'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['Response'] = ResolversParentTypes['Response']> = {
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserResponse'] = ResolversParentTypes['UserResponse']> = {
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateRoomResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateRoomResponse'] = ResolversParentTypes['CreateRoomResponse']> = {
  room_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateAccountResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateAccountResponse'] = ResolversParentTypes['CreateAccountResponse']> = {
  user_id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  user?: Resolver<ResolversTypes['UserResponse'], ParentType, ContextType, RequireFields<QueryUserArgs, 'id'>>;
  classroom?: Resolver<Maybe<ResolversTypes['Classroom']>, ParentType, ContextType, RequireFields<QueryClassroomArgs, 'id'>>;
  classroomDetails?: Resolver<Maybe<ResolversTypes['ClassroomDetails']>, ParentType, ContextType, RequireFields<QueryClassroomDetailsArgs, 'id'>>;
  questions?: Resolver<Array<Maybe<ResolversTypes['Question']>>, ParentType, ContextType, RequireFields<QueryQuestionsArgs, 'room_id'>>;
  room?: Resolver<Maybe<ResolversTypes['Room']>, ParentType, ContextType, RequireFields<QueryRoomArgs, 'room_id'>>;
  roomsForClassroom?: Resolver<Array<Maybe<ResolversTypes['Room']>>, ParentType, ContextType, RequireFields<QueryRoomsForClassroomArgs, 'class_id'>>;
  participants?: Resolver<Array<Maybe<ResolversTypes['User']>>, ParentType, ContextType, RequireFields<QueryParticipantsArgs, 'room_id'>>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createUser?: Resolver<Maybe<ResolversTypes['CreateAccountResponse']>, ParentType, ContextType, RequireFields<MutationCreateUserArgs, 'first_name' | 'last_name' | 'role' | 'email'>>;
  createRoom?: Resolver<Maybe<ResolversTypes['CreateRoomResponse']>, ParentType, ContextType, RequireFields<MutationCreateRoomArgs, 'class_id'>>;
  submitQuestion?: Resolver<Maybe<ResolversTypes['Response']>, ParentType, ContextType, RequireFields<MutationSubmitQuestionArgs, 'room_id' | 'student_id'>>;
  answerQuestion?: Resolver<Maybe<ResolversTypes['Response']>, ParentType, ContextType, RequireFields<MutationAnswerQuestionArgs, 'id'>>;
};

export type Resolvers<ContextType = any> = {
  Date?: GraphQLScalarType;
  User?: UserResolvers<ContextType>;
  Classroom?: ClassroomResolvers<ContextType>;
  ClassroomDetails?: ClassroomDetailsResolvers<ContextType>;
  Question?: QuestionResolvers<ContextType>;
  Room?: RoomResolvers<ContextType>;
  Response?: ResponseResolvers<ContextType>;
  UserResponse?: UserResponseResolvers<ContextType>;
  CreateRoomResponse?: CreateRoomResponseResolvers<ContextType>;
  CreateAccountResponse?: CreateAccountResponseResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
