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
  loginWithEmail: LoginResponse;
  loginWithPublicKey: LoginResponse;
  verify: VerifyResponse;
};


export type MutationLoginWithEmailArgs = {
  appId: Scalars['String'];
  emailAddress: Scalars['String'];
};


export type MutationLoginWithPublicKeyArgs = {
  appId: Scalars['String'];
  publicKey: Scalars['String'];
};


export type MutationVerifyArgs = {
  oneTimeToken: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  keys?: Maybe<PublicKey>;
  version?: Maybe<Version>;
};


export type QueryKeysArgs = {
  kid: Scalars['String'];
};

export type ActionResponse = {
  success: Scalars['Boolean'];
  errorMessage?: Maybe<Scalars['String']>;
};

export type PublicKey = {
  __typename?: 'PublicKey';
  id: Scalars['Int'];
  publicKey: Scalars['String'];
  validTo: Scalars['String'];
};

export type LoginResponse = ActionResponse & {
  __typename?: 'LoginResponse';
  success: Scalars['Boolean'];
  errorMessage?: Maybe<Scalars['String']>;
  challenge?: Maybe<Scalars['String']>;
};

export type VerifyResponse = ActionResponse & {
  __typename?: 'VerifyResponse';
  success: Scalars['Boolean'];
  errorMessage?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  key?: Maybe<Scalars['String']>;
  jwt: Scalars['String'];
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


export type LoginWithEmailMutationVariables = Exact<{
  appId: Scalars['String'];
  emailAddress: Scalars['String'];
}>;


export type LoginWithEmailMutation = (
  { __typename?: 'Mutation' }
  & { loginWithEmail: (
    { __typename?: 'LoginResponse' }
    & Pick<LoginResponse, 'success' | 'errorMessage'>
  ) }
);

export type LoginWithPublicKeyMutationVariables = Exact<{
  appId: Scalars['String'];
  publicKey: Scalars['String'];
}>;


export type LoginWithPublicKeyMutation = (
  { __typename?: 'Mutation' }
  & { loginWithPublicKey: (
    { __typename?: 'LoginResponse' }
    & Pick<LoginResponse, 'success' | 'errorMessage'>
  ) }
);

export type VerifyMutationVariables = Exact<{
  oneTimeToken: Scalars['String'];
}>;


export type VerifyMutation = (
  { __typename?: 'Mutation' }
  & { verify: (
    { __typename?: 'VerifyResponse' }
    & Pick<VerifyResponse, 'success' | 'errorMessage' | 'jwt'>
  ) }
);

export type KeysQueryVariables = Exact<{
  kid: Scalars['String'];
}>;


export type KeysQuery = (
  { __typename?: 'Query' }
  & { keys?: Maybe<(
    { __typename?: 'PublicKey' }
    & Pick<PublicKey, 'id' | 'publicKey' | 'validTo'>
  )> }
);


export const LoginWithEmailDocument = gql`
    mutation LoginWithEmail($appId: String!, $emailAddress: String!) {
  loginWithEmail(appId: $appId, emailAddress: $emailAddress) {
    success
    errorMessage
  }
}
    `;
export const LoginWithPublicKeyDocument = gql`
    mutation LoginWithPublicKey($appId: String!, $publicKey: String!) {
  loginWithPublicKey(appId: $appId, publicKey: $publicKey) {
    success
    errorMessage
  }
}
    `;
export const VerifyDocument = gql`
    mutation Verify($oneTimeToken: String!) {
  verify(oneTimeToken: $oneTimeToken) {
    success
    errorMessage
    jwt
  }
}
    `;
export const KeysDocument = gql`
    query Keys($kid: String!) {
  keys(kid: $kid) {
    id
    publicKey
    validTo
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: () => Promise<T>) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = sdkFunction => sdkFunction();
export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    LoginWithEmail(variables: LoginWithEmailMutationVariables): Promise<{ data?: LoginWithEmailMutation | undefined; extensions?: any; headers: Headers; status: number; errors?: GraphQLError[] | undefined; }> {
        return withWrapper(() => client.rawRequest<LoginWithEmailMutation>(print(LoginWithEmailDocument), variables));
    },
    LoginWithPublicKey(variables: LoginWithPublicKeyMutationVariables): Promise<{ data?: LoginWithPublicKeyMutation | undefined; extensions?: any; headers: Headers; status: number; errors?: GraphQLError[] | undefined; }> {
        return withWrapper(() => client.rawRequest<LoginWithPublicKeyMutation>(print(LoginWithPublicKeyDocument), variables));
    },
    Verify(variables: VerifyMutationVariables): Promise<{ data?: VerifyMutation | undefined; extensions?: any; headers: Headers; status: number; errors?: GraphQLError[] | undefined; }> {
        return withWrapper(() => client.rawRequest<VerifyMutation>(print(VerifyDocument), variables));
    },
    Keys(variables: KeysQueryVariables): Promise<{ data?: KeysQuery | undefined; extensions?: any; headers: Headers; status: number; errors?: GraphQLError[] | undefined; }> {
        return withWrapper(() => client.rawRequest<KeysQuery>(print(KeysDocument), variables));
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;