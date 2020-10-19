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

export type Question = {
  __typename?: 'Question';
  id: Scalars['ID'];
  session_id: Scalars['ID'];
  student_id: Scalars['ID'];
  text?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['Date']>;
};

export type Session = {
  __typename?: 'Session';
  id: Scalars['ID'];
  class_id: Scalars['ID'];
  start_time?: Maybe<Scalars['Date']>;
  end_time?: Maybe<Scalars['Date']>;
  room_id?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  user: User;
  classroom?: Maybe<Classroom>;
  classroomByDB?: Maybe<Classroom>;
  question?: Maybe<Question>;
};


export type QueryUserArgs = {
  id: Scalars['ID'];
};


export type QueryClassroomArgs = {
  id: Scalars['ID'];
};


export type QueryClassroomByDbArgs = {
  id: Scalars['ID'];
};


export type QueryQuestionArgs = {
  student_id: Scalars['ID'];
  session_id: Scalars['ID'];
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
  User: ResolverTypeWrapper<User>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Classroom: ResolverTypeWrapper<Classroom>;
  Question: ResolverTypeWrapper<Question>;
  Session: ResolverTypeWrapper<Session>;
  Query: ResolverTypeWrapper<{}>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Date: Scalars['Date'];
  User: User;
  ID: Scalars['ID'];
  String: Scalars['String'];
  Classroom: Classroom;
  Question: Question;
  Session: Session;
  Query: {};
  Boolean: Scalars['Boolean'];
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

export type QuestionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Question'] = ResolversParentTypes['Question']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  session_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  student_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  text?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  created_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SessionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Session'] = ResolversParentTypes['Session']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  class_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  start_time?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  end_time?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  room_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<QueryUserArgs, 'id'>>;
  classroom?: Resolver<Maybe<ResolversTypes['Classroom']>, ParentType, ContextType, RequireFields<QueryClassroomArgs, 'id'>>;
  classroomByDB?: Resolver<Maybe<ResolversTypes['Classroom']>, ParentType, ContextType, RequireFields<QueryClassroomByDbArgs, 'id'>>;
  question?: Resolver<Maybe<ResolversTypes['Question']>, ParentType, ContextType, RequireFields<QueryQuestionArgs, 'student_id' | 'session_id'>>;
};

export type Resolvers<ContextType = any> = {
  Date?: GraphQLScalarType;
  User?: UserResolvers<ContextType>;
  Classroom?: ClassroomResolvers<ContextType>;
  Question?: QuestionResolvers<ContextType>;
  Session?: SessionResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
