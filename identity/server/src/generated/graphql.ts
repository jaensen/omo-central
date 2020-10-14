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
  Json: any;
};


export type Mutation = {
  __typename?: 'Mutation';
  exchangeToken: ExchangeTokenResponse;
  setPublicData: SetPublicDataResponse;
  setPrivateData: SetPrivateDataResponse;
};


export type MutationExchangeTokenArgs = {
  jwt: Scalars['String'];
};


export type MutationSetPublicDataArgs = {
  data?: Maybe<Scalars['Json']>;
};


export type MutationSetPrivateDataArgs = {
  initializationVector: Scalars['String'];
  data: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  version?: Maybe<Version>;
  publicData?: Maybe<Scalars['Json']>;
  privateData: PrivateData;
  identityKey: Scalars['String'];
  identityId: Scalars['String'];
};


export type QueryPublicDataArgs = {
  identityId?: Maybe<Scalars['String']>;
};

export type ActionResponse = {
  success: Scalars['Boolean'];
  errorMessage?: Maybe<Scalars['String']>;
};

export type PrivateData = {
  __typename?: 'PrivateData';
  initializationVector: Scalars['String'];
  data: Scalars['String'];
};

export type ExchangeTokenResponse = ActionResponse & {
  __typename?: 'ExchangeTokenResponse';
  success: Scalars['Boolean'];
  errorMessage?: Maybe<Scalars['String']>;
};

export type SetPublicDataResponse = ActionResponse & {
  __typename?: 'SetPublicDataResponse';
  success: Scalars['Boolean'];
  errorMessage?: Maybe<Scalars['String']>;
};

export type SetPrivateDataResponse = ActionResponse & {
  __typename?: 'SetPrivateDataResponse';
  success: Scalars['Boolean'];
  errorMessage?: Maybe<Scalars['String']>;
};

export type Version = {
  __typename?: 'Version';
  major: Scalars['Int'];
  minor: Scalars['Int'];
  revision: Scalars['Int'];
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

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
export type ResolversTypes = ResolversObject<{
  Json: ResolverTypeWrapper<Scalars['Json']>;
  Mutation: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Query: ResolverTypeWrapper<{}>;
  ActionResponse: ResolversTypes['ExchangeTokenResponse'] | ResolversTypes['SetPublicDataResponse'] | ResolversTypes['SetPrivateDataResponse'];
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  PrivateData: ResolverTypeWrapper<PrivateData>;
  ExchangeTokenResponse: ResolverTypeWrapper<ExchangeTokenResponse>;
  SetPublicDataResponse: ResolverTypeWrapper<SetPublicDataResponse>;
  SetPrivateDataResponse: ResolverTypeWrapper<SetPrivateDataResponse>;
  Version: ResolverTypeWrapper<Version>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Json: Scalars['Json'];
  Mutation: {};
  String: Scalars['String'];
  Query: {};
  ActionResponse: ResolversParentTypes['ExchangeTokenResponse'] | ResolversParentTypes['SetPublicDataResponse'] | ResolversParentTypes['SetPrivateDataResponse'];
  Boolean: Scalars['Boolean'];
  PrivateData: PrivateData;
  ExchangeTokenResponse: ExchangeTokenResponse;
  SetPublicDataResponse: SetPublicDataResponse;
  SetPrivateDataResponse: SetPrivateDataResponse;
  Version: Version;
  Int: Scalars['Int'];
}>;

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Json'], any> {
  name: 'Json';
}

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  exchangeToken?: Resolver<ResolversTypes['ExchangeTokenResponse'], ParentType, ContextType, RequireFields<MutationExchangeTokenArgs, 'jwt'>>;
  setPublicData?: Resolver<ResolversTypes['SetPublicDataResponse'], ParentType, ContextType, RequireFields<MutationSetPublicDataArgs, never>>;
  setPrivateData?: Resolver<ResolversTypes['SetPrivateDataResponse'], ParentType, ContextType, RequireFields<MutationSetPrivateDataArgs, 'initializationVector' | 'data'>>;
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  version?: Resolver<Maybe<ResolversTypes['Version']>, ParentType, ContextType>;
  publicData?: Resolver<Maybe<ResolversTypes['Json']>, ParentType, ContextType, RequireFields<QueryPublicDataArgs, never>>;
  privateData?: Resolver<ResolversTypes['PrivateData'], ParentType, ContextType>;
  identityKey?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  identityId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
}>;

export type ActionResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['ActionResponse'] = ResolversParentTypes['ActionResponse']> = ResolversObject<{
  __resolveType: TypeResolveFn<'ExchangeTokenResponse' | 'SetPublicDataResponse' | 'SetPrivateDataResponse', ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  errorMessage?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
}>;

export type PrivateDataResolvers<ContextType = any, ParentType extends ResolversParentTypes['PrivateData'] = ResolversParentTypes['PrivateData']> = ResolversObject<{
  initializationVector?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  data?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ExchangeTokenResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['ExchangeTokenResponse'] = ResolversParentTypes['ExchangeTokenResponse']> = ResolversObject<{
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  errorMessage?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SetPublicDataResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['SetPublicDataResponse'] = ResolversParentTypes['SetPublicDataResponse']> = ResolversObject<{
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  errorMessage?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SetPrivateDataResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['SetPrivateDataResponse'] = ResolversParentTypes['SetPrivateDataResponse']> = ResolversObject<{
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  errorMessage?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type VersionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Version'] = ResolversParentTypes['Version']> = ResolversObject<{
  major?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  minor?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  revision?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  Json?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  ActionResponse?: ActionResponseResolvers<ContextType>;
  PrivateData?: PrivateDataResolvers<ContextType>;
  ExchangeTokenResponse?: ExchangeTokenResponseResolvers<ContextType>;
  SetPublicDataResponse?: SetPublicDataResponseResolvers<ContextType>;
  SetPrivateDataResponse?: SetPrivateDataResponseResolvers<ContextType>;
  Version?: VersionResolvers<ContextType>;
}>;


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
