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
  FileUpload: any;
};



export enum Role {
  Student = 'STUDENT',
  Instructor = 'INSTRUCTOR'
}

export enum RoomState {
  Scheduled = 'SCHEDULED',
  Ongoing = 'ONGOING',
  Ended = 'ENDED'
}

export enum ParticipantStatus {
  Invited = 'INVITED',
  Joined = 'JOINED'
}

export enum TeacherPrefix {
  Mr = 'Mr',
  Mrs = 'Mrs',
  Ms = 'Ms'
}

export type File = {
  __typename?: 'File';
  id: Scalars['ID'];
  filename: Scalars['String'];
  class_id: Scalars['ID'];
  created_at: Scalars['Date'];
  storage_link: Scalars['String'];
  tags?: Maybe<Array<Maybe<Tag>>>;
};

export type Tag = {
  __typename?: 'Tag';
  id: Scalars['ID'];
  tag: Scalars['String'];
  class_id: Scalars['ID'];
  color: Scalars['String'];
};

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
  name: Scalars['String'];
  subject: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['Date']>;
  updated_at?: Maybe<Scalars['Date']>;
};

export type ClassroomDetails = {
  __typename?: 'ClassroomDetails';
  id: Scalars['ID'];
  classroom: Classroom;
  instructor?: Maybe<User>;
  students?: Maybe<Array<Maybe<User>>>;
};

export type ClassroomsTaught = {
  __typename?: 'ClassroomsTaught';
  classrooms?: Maybe<Array<Maybe<Classroom>>>;
};

export type ClassroomsTaken = {
  __typename?: 'ClassroomsTaken';
  classrooms?: Maybe<Array<Maybe<Classroom>>>;
};

export type Question = {
  __typename?: 'Question';
  id: Scalars['ID'];
  room_id: Scalars['ID'];
  student_id: Scalars['ID'];
  text: Scalars['String'];
  upvotes?: Maybe<Scalars['Int']>;
  created_at?: Maybe<Scalars['Date']>;
  deleted_at?: Maybe<Scalars['Date']>;
};

export type QuestionUpvoteState = {
  __typename?: 'QuestionUpvoteState';
  id: Scalars['ID'];
  upvotes?: Maybe<Scalars['Int']>;
};

export type QuestionAnsweredState = {
  __typename?: 'QuestionAnsweredState';
  id: Scalars['ID'];
};

export type Room = {
  __typename?: 'Room';
  id: Scalars['ID'];
  room_uuid: Scalars['ID'];
  class_id: Scalars['ID'];
  room_name?: Maybe<Scalars['String']>;
  start_time?: Maybe<Scalars['Date']>;
  end_time?: Maybe<Scalars['Date']>;
  room_status: RoomState;
  created_at?: Maybe<Scalars['Date']>;
  updated_at?: Maybe<Scalars['Date']>;
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
  id?: Maybe<Scalars['ID']>;
  room_uuid?: Maybe<Scalars['ID']>;
  success: Scalars['Boolean'];
  message?: Maybe<Scalars['String']>;
};

export type CreateAccountResponse = {
  __typename?: 'CreateAccountResponse';
  user_id?: Maybe<Scalars['ID']>;
  success: Scalars['Boolean'];
  message?: Maybe<Scalars['String']>;
};

export type CreateClassroomResponse = {
  __typename?: 'CreateClassroomResponse';
  class_id?: Maybe<Scalars['ID']>;
  success: Scalars['Boolean'];
  message?: Maybe<Scalars['String']>;
};

export type CreateQuestionResponse = {
  __typename?: 'CreateQuestionResponse';
  id?: Maybe<Scalars['ID']>;
  created_at?: Maybe<Scalars['Date']>;
  success: Scalars['Boolean'];
  message?: Maybe<Scalars['String']>;
};

export type AnswerQuestionResponse = {
  __typename?: 'AnswerQuestionResponse';
  room_id: Scalars['ID'];
  success: Scalars['Boolean'];
  message: Scalars['String'];
};

export type Upvotes = {
  __typename?: 'Upvotes';
  upvotes: Scalars['Int'];
};

export type EngagementHistory = {
  __typename?: 'EngagementHistory';
  id?: Maybe<Scalars['ID']>;
  room_id: Scalars['ID'];
  student_id: Scalars['ID'];
  score: Scalars['Int'];
  classification: Scalars['String'];
  created_at?: Maybe<Scalars['Date']>;
};

export type EngagementAverage = {
  __typename?: 'EngagementAverage';
  id?: Maybe<Scalars['ID']>;
  room_id: Scalars['ID'];
  score: Scalars['Int'];
  taken_at: Scalars['Date'];
};

export type Subscription = {
  __typename?: 'Subscription';
  engagementStatAdded?: Maybe<EngagementHistory>;
  engagementAverageAdded?: Maybe<EngagementAverage>;
  questionAdded?: Maybe<Question>;
  questionAnswered?: Maybe<QuestionAnsweredState>;
  questionUpvoteChanged?: Maybe<QuestionUpvoteState>;
};


export type SubscriptionEngagementStatAddedArgs = {
  student_id: Scalars['ID'];
};


export type SubscriptionEngagementAverageAddedArgs = {
  room_id: Scalars['ID'];
};


export type SubscriptionQuestionAddedArgs = {
  room_id: Scalars['ID'];
};


export type SubscriptionQuestionAnsweredArgs = {
  room_id: Scalars['ID'];
};


export type SubscriptionQuestionUpvoteChangedArgs = {
  question_id: Scalars['ID'];
};

export type Query = {
  __typename?: 'Query';
  user: UserResponse;
  userByEmail: UserResponse;
  classroom?: Maybe<Classroom>;
  classroomDetails?: Maybe<ClassroomDetails>;
  classroomsTaken?: Maybe<ClassroomsTaken>;
  classroomsTaught?: Maybe<ClassroomsTaught>;
  questions: Array<Maybe<Question>>;
  roomsForClassroom: Array<Maybe<Room>>;
  endedRoomsOnDate: Array<Maybe<Room>>;
  participants: Array<Maybe<User>>;
  studentRoomEngagementHistory: Array<Maybe<EngagementHistory>>;
  studentAllEngagementHistory: Array<Maybe<EngagementHistory>>;
  roomEngagementAverages: Array<Maybe<EngagementAverage>>;
  filesForClassroom?: Maybe<Array<Maybe<File>>>;
  fileTagsForClassroom?: Maybe<Array<Maybe<Tag>>>;
};


export type QueryUserArgs = {
  id: Scalars['ID'];
};


export type QueryUserByEmailArgs = {
  email: Scalars['String'];
};


export type QueryClassroomArgs = {
  id: Scalars['ID'];
};


export type QueryClassroomDetailsArgs = {
  id: Scalars['ID'];
  role: Role;
};


export type QueryClassroomsTakenArgs = {
  student_id: Scalars['ID'];
};


export type QueryClassroomsTaughtArgs = {
  teacher_id: Scalars['ID'];
};


export type QueryQuestionsArgs = {
  room_id: Scalars['ID'];
};


export type QueryRoomsForClassroomArgs = {
  class_id: Scalars['ID'];
  user_id: Scalars['ID'];
  room_states?: Maybe<Array<Maybe<RoomState>>>;
};


export type QueryEndedRoomsOnDateArgs = {
  user_id: Scalars['ID'];
  end_time: Scalars['Date'];
};


export type QueryParticipantsArgs = {
  room_id: Scalars['ID'];
  statuses?: Maybe<Array<Maybe<ParticipantStatus>>>;
};


export type QueryStudentRoomEngagementHistoryArgs = {
  room_id: Scalars['ID'];
  student_id: Scalars['ID'];
};


export type QueryStudentAllEngagementHistoryArgs = {
  student_id: Scalars['ID'];
};


export type QueryRoomEngagementAveragesArgs = {
  room_id: Scalars['ID'];
};


export type QueryFilesForClassroomArgs = {
  class_id: Scalars['ID'];
};


export type QueryFileTagsForClassroomArgs = {
  class_id: Scalars['ID'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createStudent?: Maybe<CreateAccountResponse>;
  createTeacher?: Maybe<CreateAccountResponse>;
  updateUserInfo?: Maybe<CreateAccountResponse>;
  createRoom?: Maybe<CreateRoomResponse>;
  createClassroom?: Maybe<CreateClassroomResponse>;
  submitQuestion?: Maybe<CreateQuestionResponse>;
  answerQuestion?: Maybe<AnswerQuestionResponse>;
  upvoteQuestion?: Maybe<Upvotes>;
  updateRoomStatus?: Maybe<Response>;
  addStudentsToClassroom?: Maybe<Response>;
  invite?: Maybe<Response>;
  joinRoom?: Maybe<Response>;
  upsertEngagementCurrent?: Maybe<Response>;
  uploadFile?: Maybe<Response>;
  createTag?: Maybe<Response>;
};


export type MutationCreateStudentArgs = {
  first_name: Scalars['String'];
  last_name: Scalars['String'];
  middle_name?: Maybe<Scalars['String']>;
  email: Scalars['String'];
  phone_number?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['Date']>;
  parent_email?: Maybe<Scalars['String']>;
};


export type MutationCreateTeacherArgs = {
  first_name: Scalars['String'];
  last_name: Scalars['String'];
  middle_name?: Maybe<Scalars['String']>;
  prefix?: Maybe<TeacherPrefix>;
  email: Scalars['String'];
  phone_number?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['Date']>;
};


export type MutationUpdateUserInfoArgs = {
  user_id: Scalars['ID'];
  first_name?: Maybe<Scalars['String']>;
  last_name?: Maybe<Scalars['String']>;
  middle_name?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  phone_number?: Maybe<Scalars['String']>;
  parent_email?: Maybe<Scalars['String']>;
  prefix?: Maybe<Scalars['String']>;
};


export type MutationCreateRoomArgs = {
  class_id: Scalars['ID'];
  name: Scalars['String'];
  start_time?: Maybe<Scalars['Date']>;
  end_time?: Maybe<Scalars['Date']>;
};


export type MutationCreateClassroomArgs = {
  name: Scalars['String'];
  subject: Scalars['String'];
  teacher_id: Scalars['ID'];
  description?: Maybe<Scalars['String']>;
};


export type MutationSubmitQuestionArgs = {
  room_id: Scalars['ID'];
  student_id: Scalars['ID'];
  text?: Maybe<Scalars['String']>;
};


export type MutationAnswerQuestionArgs = {
  id: Scalars['ID'];
  room_id: Scalars['ID'];
};


export type MutationUpvoteQuestionArgs = {
  id: Scalars['ID'];
};


export type MutationUpdateRoomStatusArgs = {
  room_id: Scalars['ID'];
  room_status: RoomState;
};


export type MutationAddStudentsToClassroomArgs = {
  class_id: Scalars['ID'];
  student_emails?: Maybe<Array<Scalars['String']>>;
};


export type MutationInviteArgs = {
  student_ids?: Maybe<Array<Scalars['ID']>>;
  room_id: Scalars['ID'];
};


export type MutationJoinRoomArgs = {
  student_id: Scalars['ID'];
  room_id: Scalars['ID'];
};


export type MutationUpsertEngagementCurrentArgs = {
  room_id: Scalars['ID'];
  student_id: Scalars['ID'];
  score: Scalars['Int'];
  classification: Scalars['String'];
  created_at: Scalars['Date'];
};


export type MutationUploadFileArgs = {
  class_id: Scalars['ID'];
  file: Scalars['FileUpload'];
  tags?: Maybe<Array<Scalars['ID']>>;
};


export type MutationCreateTagArgs = {
  class_id: Scalars['ID'];
  tag: Scalars['String'];
  color: Scalars['String'];
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
  FileUpload: ResolverTypeWrapper<Scalars['FileUpload']>;
  Role: Role;
  RoomState: RoomState;
  ParticipantStatus: ParticipantStatus;
  TeacherPrefix: TeacherPrefix;
  File: ResolverTypeWrapper<File>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Tag: ResolverTypeWrapper<Tag>;
  User: ResolverTypeWrapper<User>;
  Classroom: ResolverTypeWrapper<Classroom>;
  ClassroomDetails: ResolverTypeWrapper<ClassroomDetails>;
  ClassroomsTaught: ResolverTypeWrapper<ClassroomsTaught>;
  ClassroomsTaken: ResolverTypeWrapper<ClassroomsTaken>;
  Question: ResolverTypeWrapper<Question>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  QuestionUpvoteState: ResolverTypeWrapper<QuestionUpvoteState>;
  QuestionAnsweredState: ResolverTypeWrapper<QuestionAnsweredState>;
  Room: ResolverTypeWrapper<Room>;
  Response: ResolverTypeWrapper<Response>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  UserResponse: ResolverTypeWrapper<UserResponse>;
  CreateRoomResponse: ResolverTypeWrapper<CreateRoomResponse>;
  CreateAccountResponse: ResolverTypeWrapper<CreateAccountResponse>;
  CreateClassroomResponse: ResolverTypeWrapper<CreateClassroomResponse>;
  CreateQuestionResponse: ResolverTypeWrapper<CreateQuestionResponse>;
  AnswerQuestionResponse: ResolverTypeWrapper<AnswerQuestionResponse>;
  Upvotes: ResolverTypeWrapper<Upvotes>;
  EngagementHistory: ResolverTypeWrapper<EngagementHistory>;
  EngagementAverage: ResolverTypeWrapper<EngagementAverage>;
  Subscription: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  Mutation: ResolverTypeWrapper<{}>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Date: Scalars['Date'];
  FileUpload: Scalars['FileUpload'];
  File: File;
  ID: Scalars['ID'];
  String: Scalars['String'];
  Tag: Tag;
  User: User;
  Classroom: Classroom;
  ClassroomDetails: ClassroomDetails;
  ClassroomsTaught: ClassroomsTaught;
  ClassroomsTaken: ClassroomsTaken;
  Question: Question;
  Int: Scalars['Int'];
  QuestionUpvoteState: QuestionUpvoteState;
  QuestionAnsweredState: QuestionAnsweredState;
  Room: Room;
  Response: Response;
  Boolean: Scalars['Boolean'];
  UserResponse: UserResponse;
  CreateRoomResponse: CreateRoomResponse;
  CreateAccountResponse: CreateAccountResponse;
  CreateClassroomResponse: CreateClassroomResponse;
  CreateQuestionResponse: CreateQuestionResponse;
  AnswerQuestionResponse: AnswerQuestionResponse;
  Upvotes: Upvotes;
  EngagementHistory: EngagementHistory;
  EngagementAverage: EngagementAverage;
  Subscription: {};
  Query: {};
  Mutation: {};
};

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export interface FileUploadScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['FileUpload'], any> {
  name: 'FileUpload';
}

export type FileResolvers<ContextType = any, ParentType extends ResolversParentTypes['File'] = ResolversParentTypes['File']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  filename?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  class_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  created_at?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  storage_link?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tags?: Resolver<Maybe<Array<Maybe<ResolversTypes['Tag']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TagResolvers<ContextType = any, ParentType extends ResolversParentTypes['Tag'] = ResolversParentTypes['Tag']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  tag?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  class_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  color?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

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
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  subject?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  created_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  updated_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ClassroomDetailsResolvers<ContextType = any, ParentType extends ResolversParentTypes['ClassroomDetails'] = ResolversParentTypes['ClassroomDetails']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  classroom?: Resolver<ResolversTypes['Classroom'], ParentType, ContextType>;
  instructor?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  students?: Resolver<Maybe<Array<Maybe<ResolversTypes['User']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ClassroomsTaughtResolvers<ContextType = any, ParentType extends ResolversParentTypes['ClassroomsTaught'] = ResolversParentTypes['ClassroomsTaught']> = {
  classrooms?: Resolver<Maybe<Array<Maybe<ResolversTypes['Classroom']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ClassroomsTakenResolvers<ContextType = any, ParentType extends ResolversParentTypes['ClassroomsTaken'] = ResolversParentTypes['ClassroomsTaken']> = {
  classrooms?: Resolver<Maybe<Array<Maybe<ResolversTypes['Classroom']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QuestionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Question'] = ResolversParentTypes['Question']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  room_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  student_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  text?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  upvotes?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  created_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  deleted_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QuestionUpvoteStateResolvers<ContextType = any, ParentType extends ResolversParentTypes['QuestionUpvoteState'] = ResolversParentTypes['QuestionUpvoteState']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  upvotes?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QuestionAnsweredStateResolvers<ContextType = any, ParentType extends ResolversParentTypes['QuestionAnsweredState'] = ResolversParentTypes['QuestionAnsweredState']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RoomResolvers<ContextType = any, ParentType extends ResolversParentTypes['Room'] = ResolversParentTypes['Room']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  room_uuid?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  class_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  room_name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  start_time?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  end_time?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  room_status?: Resolver<ResolversTypes['RoomState'], ParentType, ContextType>;
  created_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  updated_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
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
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  room_uuid?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
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

export type CreateClassroomResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateClassroomResponse'] = ResolversParentTypes['CreateClassroomResponse']> = {
  class_id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateQuestionResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateQuestionResponse'] = ResolversParentTypes['CreateQuestionResponse']> = {
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  created_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AnswerQuestionResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['AnswerQuestionResponse'] = ResolversParentTypes['AnswerQuestionResponse']> = {
  room_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpvotesResolvers<ContextType = any, ParentType extends ResolversParentTypes['Upvotes'] = ResolversParentTypes['Upvotes']> = {
  upvotes?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EngagementHistoryResolvers<ContextType = any, ParentType extends ResolversParentTypes['EngagementHistory'] = ResolversParentTypes['EngagementHistory']> = {
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  room_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  student_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  score?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  classification?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  created_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EngagementAverageResolvers<ContextType = any, ParentType extends ResolversParentTypes['EngagementAverage'] = ResolversParentTypes['EngagementAverage']> = {
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  room_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  score?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  taken_at?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SubscriptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = {
  engagementStatAdded?: SubscriptionResolver<Maybe<ResolversTypes['EngagementHistory']>, "engagementStatAdded", ParentType, ContextType, RequireFields<SubscriptionEngagementStatAddedArgs, 'student_id'>>;
  engagementAverageAdded?: SubscriptionResolver<Maybe<ResolversTypes['EngagementAverage']>, "engagementAverageAdded", ParentType, ContextType, RequireFields<SubscriptionEngagementAverageAddedArgs, 'room_id'>>;
  questionAdded?: SubscriptionResolver<Maybe<ResolversTypes['Question']>, "questionAdded", ParentType, ContextType, RequireFields<SubscriptionQuestionAddedArgs, 'room_id'>>;
  questionAnswered?: SubscriptionResolver<Maybe<ResolversTypes['QuestionAnsweredState']>, "questionAnswered", ParentType, ContextType, RequireFields<SubscriptionQuestionAnsweredArgs, 'room_id'>>;
  questionUpvoteChanged?: SubscriptionResolver<Maybe<ResolversTypes['QuestionUpvoteState']>, "questionUpvoteChanged", ParentType, ContextType, RequireFields<SubscriptionQuestionUpvoteChangedArgs, 'question_id'>>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  user?: Resolver<ResolversTypes['UserResponse'], ParentType, ContextType, RequireFields<QueryUserArgs, 'id'>>;
  userByEmail?: Resolver<ResolversTypes['UserResponse'], ParentType, ContextType, RequireFields<QueryUserByEmailArgs, 'email'>>;
  classroom?: Resolver<Maybe<ResolversTypes['Classroom']>, ParentType, ContextType, RequireFields<QueryClassroomArgs, 'id'>>;
  classroomDetails?: Resolver<Maybe<ResolversTypes['ClassroomDetails']>, ParentType, ContextType, RequireFields<QueryClassroomDetailsArgs, 'id' | 'role'>>;
  classroomsTaken?: Resolver<Maybe<ResolversTypes['ClassroomsTaken']>, ParentType, ContextType, RequireFields<QueryClassroomsTakenArgs, 'student_id'>>;
  classroomsTaught?: Resolver<Maybe<ResolversTypes['ClassroomsTaught']>, ParentType, ContextType, RequireFields<QueryClassroomsTaughtArgs, 'teacher_id'>>;
  questions?: Resolver<Array<Maybe<ResolversTypes['Question']>>, ParentType, ContextType, RequireFields<QueryQuestionsArgs, 'room_id'>>;
  roomsForClassroom?: Resolver<Array<Maybe<ResolversTypes['Room']>>, ParentType, ContextType, RequireFields<QueryRoomsForClassroomArgs, 'class_id' | 'user_id'>>;
  endedRoomsOnDate?: Resolver<Array<Maybe<ResolversTypes['Room']>>, ParentType, ContextType, RequireFields<QueryEndedRoomsOnDateArgs, 'user_id' | 'end_time'>>;
  participants?: Resolver<Array<Maybe<ResolversTypes['User']>>, ParentType, ContextType, RequireFields<QueryParticipantsArgs, 'room_id'>>;
  studentRoomEngagementHistory?: Resolver<Array<Maybe<ResolversTypes['EngagementHistory']>>, ParentType, ContextType, RequireFields<QueryStudentRoomEngagementHistoryArgs, 'room_id' | 'student_id'>>;
  studentAllEngagementHistory?: Resolver<Array<Maybe<ResolversTypes['EngagementHistory']>>, ParentType, ContextType, RequireFields<QueryStudentAllEngagementHistoryArgs, 'student_id'>>;
  roomEngagementAverages?: Resolver<Array<Maybe<ResolversTypes['EngagementAverage']>>, ParentType, ContextType, RequireFields<QueryRoomEngagementAveragesArgs, 'room_id'>>;
  filesForClassroom?: Resolver<Maybe<Array<Maybe<ResolversTypes['File']>>>, ParentType, ContextType, RequireFields<QueryFilesForClassroomArgs, 'class_id'>>;
  fileTagsForClassroom?: Resolver<Maybe<Array<Maybe<ResolversTypes['Tag']>>>, ParentType, ContextType, RequireFields<QueryFileTagsForClassroomArgs, 'class_id'>>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createStudent?: Resolver<Maybe<ResolversTypes['CreateAccountResponse']>, ParentType, ContextType, RequireFields<MutationCreateStudentArgs, 'first_name' | 'last_name' | 'email'>>;
  createTeacher?: Resolver<Maybe<ResolversTypes['CreateAccountResponse']>, ParentType, ContextType, RequireFields<MutationCreateTeacherArgs, 'first_name' | 'last_name' | 'email'>>;
  updateUserInfo?: Resolver<Maybe<ResolversTypes['CreateAccountResponse']>, ParentType, ContextType, RequireFields<MutationUpdateUserInfoArgs, 'user_id'>>;
  createRoom?: Resolver<Maybe<ResolversTypes['CreateRoomResponse']>, ParentType, ContextType, RequireFields<MutationCreateRoomArgs, 'class_id' | 'name'>>;
  createClassroom?: Resolver<Maybe<ResolversTypes['CreateClassroomResponse']>, ParentType, ContextType, RequireFields<MutationCreateClassroomArgs, 'name' | 'subject' | 'teacher_id'>>;
  submitQuestion?: Resolver<Maybe<ResolversTypes['CreateQuestionResponse']>, ParentType, ContextType, RequireFields<MutationSubmitQuestionArgs, 'room_id' | 'student_id'>>;
  answerQuestion?: Resolver<Maybe<ResolversTypes['AnswerQuestionResponse']>, ParentType, ContextType, RequireFields<MutationAnswerQuestionArgs, 'id' | 'room_id'>>;
  upvoteQuestion?: Resolver<Maybe<ResolversTypes['Upvotes']>, ParentType, ContextType, RequireFields<MutationUpvoteQuestionArgs, 'id'>>;
  updateRoomStatus?: Resolver<Maybe<ResolversTypes['Response']>, ParentType, ContextType, RequireFields<MutationUpdateRoomStatusArgs, 'room_id' | 'room_status'>>;
  addStudentsToClassroom?: Resolver<Maybe<ResolversTypes['Response']>, ParentType, ContextType, RequireFields<MutationAddStudentsToClassroomArgs, 'class_id'>>;
  invite?: Resolver<Maybe<ResolversTypes['Response']>, ParentType, ContextType, RequireFields<MutationInviteArgs, 'room_id'>>;
  joinRoom?: Resolver<Maybe<ResolversTypes['Response']>, ParentType, ContextType, RequireFields<MutationJoinRoomArgs, 'student_id' | 'room_id'>>;
  upsertEngagementCurrent?: Resolver<Maybe<ResolversTypes['Response']>, ParentType, ContextType, RequireFields<MutationUpsertEngagementCurrentArgs, 'room_id' | 'student_id' | 'score' | 'classification' | 'created_at'>>;
  uploadFile?: Resolver<Maybe<ResolversTypes['Response']>, ParentType, ContextType, RequireFields<MutationUploadFileArgs, 'class_id' | 'file'>>;
  createTag?: Resolver<Maybe<ResolversTypes['Response']>, ParentType, ContextType, RequireFields<MutationCreateTagArgs, 'class_id' | 'tag' | 'color'>>;
};

export type Resolvers<ContextType = any> = {
  Date?: GraphQLScalarType;
  FileUpload?: GraphQLScalarType;
  File?: FileResolvers<ContextType>;
  Tag?: TagResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  Classroom?: ClassroomResolvers<ContextType>;
  ClassroomDetails?: ClassroomDetailsResolvers<ContextType>;
  ClassroomsTaught?: ClassroomsTaughtResolvers<ContextType>;
  ClassroomsTaken?: ClassroomsTakenResolvers<ContextType>;
  Question?: QuestionResolvers<ContextType>;
  QuestionUpvoteState?: QuestionUpvoteStateResolvers<ContextType>;
  QuestionAnsweredState?: QuestionAnsweredStateResolvers<ContextType>;
  Room?: RoomResolvers<ContextType>;
  Response?: ResponseResolvers<ContextType>;
  UserResponse?: UserResponseResolvers<ContextType>;
  CreateRoomResponse?: CreateRoomResponseResolvers<ContextType>;
  CreateAccountResponse?: CreateAccountResponseResolvers<ContextType>;
  CreateClassroomResponse?: CreateClassroomResponseResolvers<ContextType>;
  CreateQuestionResponse?: CreateQuestionResponseResolvers<ContextType>;
  AnswerQuestionResponse?: AnswerQuestionResponseResolvers<ContextType>;
  Upvotes?: UpvotesResolvers<ContextType>;
  EngagementHistory?: EngagementHistoryResolvers<ContextType>;
  EngagementAverage?: EngagementAverageResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
