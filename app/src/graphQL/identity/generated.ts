import type { GraphQLClient } from 'graphql-request';
import { print } from 'graphql';
import type { GraphQLError } from 'graphql-request/dist/types';
import type { Headers } from 'graphql-request/dist/types.dom';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Json: any;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
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

export enum CacheControlScope {
  Public = 'PUBLIC',
  Private = 'PRIVATE'
}


export type ExchangeTokenMutationVariables = Exact<{
  jwt: Scalars['String'];
}>;


export type ExchangeTokenMutation = (
  { __typename?: 'Mutation' }
  & { exchangeToken: (
    { __typename?: 'ExchangeTokenResponse' }
    & Pick<ExchangeTokenResponse, 'success' | 'errorMessage'>
  ) }
);

export type SetPublicDataMutationVariables = Exact<{
  data: Scalars['Json'];
}>;


export type SetPublicDataMutation = (
  { __typename?: 'Mutation' }
  & { setPublicData: (
    { __typename?: 'SetPublicDataResponse' }
    & Pick<SetPublicDataResponse, 'success' | 'errorMessage'>
  ) }
);

export type SetPrivateDataMutationVariables = Exact<{
  initializationVector: Scalars['String'];
  data: Scalars['String'];
}>;


export type SetPrivateDataMutation = (
  { __typename?: 'Mutation' }
  & { setPrivateData: (
    { __typename?: 'SetPrivateDataResponse' }
    & Pick<SetPrivateDataResponse, 'success' | 'errorMessage'>
  ) }
);

export type IdentityIdQueryVariables = Exact<{ [key: string]: never; }>;


export type IdentityIdQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'identityId'>
);

export type IdentityKeyQueryVariables = Exact<{ [key: string]: never; }>;


export type IdentityKeyQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'identityKey'>
);

export type PrivateDataQueryVariables = Exact<{ [key: string]: never; }>;


export type PrivateDataQuery = (
  { __typename?: 'Query' }
  & { privateData: (
    { __typename?: 'PrivateData' }
    & Pick<PrivateData, 'initializationVector' | 'data'>
  ) }
);

export type PublicDataQueryVariables = Exact<{
  identityId?: Maybe<Scalars['String']>;
}>;


export type PublicDataQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'publicData'>
);


export const ExchangeTokenDocument = gql`
    mutation ExchangeToken($jwt: String!) {
  exchangeToken(jwt: $jwt) {
    success
    errorMessage
  }
}
    `;
export const SetPublicDataDocument = gql`
    mutation setPublicData($data: Json!) {
  setPublicData(data: $data) {
    success
    errorMessage
  }
}
    `;
export const SetPrivateDataDocument = gql`
    mutation setPrivateData($initializationVector: String!, $data: String!) {
  setPrivateData(initializationVector: $initializationVector, data: $data) {
    success
    errorMessage
  }
}
    `;
export const IdentityIdDocument = gql`
    query identityId {
  identityId
}
    `;
export const IdentityKeyDocument = gql`
    query identityKey {
  identityKey
}
    `;
export const PrivateDataDocument = gql`
    query privateData {
  privateData {
    initializationVector
    data
  }
}
    `;
export const PublicDataDocument = gql`
    query publicData($identityId: String) {
  publicData(identityId: $identityId)
}
    `;

export type SdkFunctionWrapper = <T>(action: () => Promise<T>) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = sdkFunction => sdkFunction();
export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    ExchangeToken(variables: ExchangeTokenMutationVariables): Promise<{ data?: ExchangeTokenMutation | undefined; extensions?: any; headers: Headers; status: number; errors?: GraphQLError[] | undefined; }> {
        return withWrapper(() => client.rawRequest<ExchangeTokenMutation>(print(ExchangeTokenDocument), variables));
    },
    setPublicData(variables: SetPublicDataMutationVariables): Promise<{ data?: SetPublicDataMutation | undefined; extensions?: any; headers: Headers; status: number; errors?: GraphQLError[] | undefined; }> {
        return withWrapper(() => client.rawRequest<SetPublicDataMutation>(print(SetPublicDataDocument), variables));
    },
    setPrivateData(variables: SetPrivateDataMutationVariables): Promise<{ data?: SetPrivateDataMutation | undefined; extensions?: any; headers: Headers; status: number; errors?: GraphQLError[] | undefined; }> {
        return withWrapper(() => client.rawRequest<SetPrivateDataMutation>(print(SetPrivateDataDocument), variables));
    },
    identityId(variables?: IdentityIdQueryVariables): Promise<{ data?: IdentityIdQuery | undefined; extensions?: any; headers: Headers; status: number; errors?: GraphQLError[] | undefined; }> {
        return withWrapper(() => client.rawRequest<IdentityIdQuery>(print(IdentityIdDocument), variables));
    },
    identityKey(variables?: IdentityKeyQueryVariables): Promise<{ data?: IdentityKeyQuery | undefined; extensions?: any; headers: Headers; status: number; errors?: GraphQLError[] | undefined; }> {
        return withWrapper(() => client.rawRequest<IdentityKeyQuery>(print(IdentityKeyDocument), variables));
    },
    privateData(variables?: PrivateDataQueryVariables): Promise<{ data?: PrivateDataQuery | undefined; extensions?: any; headers: Headers; status: number; errors?: GraphQLError[] | undefined; }> {
        return withWrapper(() => client.rawRequest<PrivateDataQuery>(print(PrivateDataDocument), variables));
    },
    publicData(variables?: PublicDataQueryVariables): Promise<{ data?: PublicDataQuery | undefined; extensions?: any; headers: Headers; status: number; errors?: GraphQLError[] | undefined; }> {
        return withWrapper(() => client.rawRequest<PublicDataQuery>(print(PublicDataDocument), variables));
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;