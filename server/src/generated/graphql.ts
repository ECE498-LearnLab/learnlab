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
  Pending = 'PENDING',
  Ongoing = 'ONGOING',
  Ended = 'ENDED'
}

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  name_first?: Maybe<Scalars['String']>;
  name_last?: Maybe<Scalars['String']>;
  role?: Maybe<Scalars['String']>;
  email: Scalars['String'];
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

export type Session = {
  __typename?: 'Session';
  room_id: Scalars['ID'];
  class_id: Scalars['ID'];
  start_time?: Maybe<Scalars['Date']>;
  end_time?: Maybe<Scalars['Date']>;
};

export type Response = {
  __typename?: 'Response';
  success: Scalars['Boolean'];
  message: Scalars['String'];
};

export type CreateRoomResponse = {
  __typename?: 'CreateRoomResponse';
  room_id: Scalars['ID'];
  success: Scalars['Boolean'];
  message?: Maybe<Scalars['String']>;
};

export type EngagementStat = {
  __typename?: 'EngagementStat';
  id: Scalars['ID'];
  room_id: Scalars['ID'];
  student_id: Scalars['ID'];
  score: Scalars['Int'];
  classification: Scalars['String'];
  created_at?: Maybe<Scalars['Date']>;
};

export type Query = {
  __typename?: 'Query';
  user: User;
  classroom?: Maybe<Classroom>;
  classroomDetails?: Maybe<ClassroomDetails>;
  questions: Array<Maybe<Question>>;
  room?: Maybe<Session>;
  roomsForClassroom: Array<Maybe<Session>>;
  singleEngagementStat: EngagementStat;
  studentClassEngagementStat: Array<Maybe<EngagementStat>>;
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


export type QuerySingleEngagementStatArgs = {
  room_id: Scalars['ID'];
  student_id: Scalars['ID'];
};


export type QueryStudentClassEngagementStatArgs = {
  class_id: Scalars['ID'];
  student_id: Scalars['ID'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createRoom?: Maybe<CreateRoomResponse>;
  submitQuestion?: Maybe<Response>;
  answerQuestion?: Maybe<Response>;
  updateEngagementCurrent?: Maybe<Response>;
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


export type MutationUpdateEngagementCurrentArgs = {
  room_id: Scalars['ID'];
  student_id: Scalars['ID'];
  score?: Maybe<Scalars['Int']>;
  classification?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['Date']>;
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
  Session: ResolverTypeWrapper<Session>;
  Response: ResolverTypeWrapper<Response>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  CreateRoomResponse: ResolverTypeWrapper<CreateRoomResponse>;
  EngagementStat: ResolverTypeWrapper<EngagementStat>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
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
  Session: Session;
  Response: Response;
  Boolean: Scalars['Boolean'];
  CreateRoomResponse: CreateRoomResponse;
  EngagementStat: EngagementStat;
  Int: Scalars['Int'];
  Query: {};
  Mutation: {};
};

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name_first?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name_last?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  role?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
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

export type SessionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Session'] = ResolversParentTypes['Session']> = {
  room_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  class_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  start_time?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  end_time?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['Response'] = ResolversParentTypes['Response']> = {
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateRoomResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateRoomResponse'] = ResolversParentTypes['CreateRoomResponse']> = {
  room_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EngagementStatResolvers<ContextType = any, ParentType extends ResolversParentTypes['EngagementStat'] = ResolversParentTypes['EngagementStat']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  room_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  student_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  score?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  classification?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  created_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<QueryUserArgs, 'id'>>;
  classroom?: Resolver<Maybe<ResolversTypes['Classroom']>, ParentType, ContextType, RequireFields<QueryClassroomArgs, 'id'>>;
  classroomDetails?: Resolver<Maybe<ResolversTypes['ClassroomDetails']>, ParentType, ContextType, RequireFields<QueryClassroomDetailsArgs, 'id'>>;
  questions?: Resolver<Array<Maybe<ResolversTypes['Question']>>, ParentType, ContextType, RequireFields<QueryQuestionsArgs, 'room_id'>>;
  room?: Resolver<Maybe<ResolversTypes['Session']>, ParentType, ContextType, RequireFields<QueryRoomArgs, 'room_id'>>;
  roomsForClassroom?: Resolver<Array<Maybe<ResolversTypes['Session']>>, ParentType, ContextType, RequireFields<QueryRoomsForClassroomArgs, 'class_id'>>;
  singleEngagementStat?: Resolver<ResolversTypes['EngagementStat'], ParentType, ContextType, RequireFields<QuerySingleEngagementStatArgs, 'room_id' | 'student_id'>>;
  studentClassEngagementStat?: Resolver<Array<Maybe<ResolversTypes['EngagementStat']>>, ParentType, ContextType, RequireFields<QueryStudentClassEngagementStatArgs, 'class_id' | 'student_id'>>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createRoom?: Resolver<Maybe<ResolversTypes['CreateRoomResponse']>, ParentType, ContextType, RequireFields<MutationCreateRoomArgs, 'class_id'>>;
  submitQuestion?: Resolver<Maybe<ResolversTypes['Response']>, ParentType, ContextType, RequireFields<MutationSubmitQuestionArgs, 'room_id' | 'student_id'>>;
  answerQuestion?: Resolver<Maybe<ResolversTypes['Response']>, ParentType, ContextType, RequireFields<MutationAnswerQuestionArgs, 'id'>>;
  updateEngagementCurrent?: Resolver<Maybe<ResolversTypes['Response']>, ParentType, ContextType, RequireFields<MutationUpdateEngagementCurrentArgs, 'room_id' | 'student_id'>>;
};

export type Resolvers<ContextType = any> = {
  Date?: GraphQLScalarType;
  User?: UserResolvers<ContextType>;
  Classroom?: ClassroomResolvers<ContextType>;
  ClassroomDetails?: ClassroomDetailsResolvers<ContextType>;
  Question?: QuestionResolvers<ContextType>;
  Session?: SessionResolvers<ContextType>;
  Response?: ResponseResolvers<ContextType>;
  CreateRoomResponse?: CreateRoomResponseResolvers<ContextType>;
  EngagementStat?: EngagementStatResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
