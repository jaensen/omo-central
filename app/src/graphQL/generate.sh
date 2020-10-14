#!/bin/bash
# run the codegenerator
echo "Generating 'auth' client ..";
cd auth || exit
npx graphql-codegen

echo "Generating 'identity' client ..";
cd ../identity || exit
npx graphql-codegen

# replace some code that doesn't fit within our environment
cd .. || exit

sed -i "s/import { GraphQLClient } from 'graphql-request';/import type { GraphQLClient } from 'graphql-request';/" auth/generated.ts identity/generated.ts
sed -i "s/import { GraphQLError, Headers } from 'graphql-request\\/dist\\/src\\/types';/import type { GraphQLError } from 'graphql-request\\/dist\\/types';\nimport type { Headers } from 'graphql-request\\/dist\\/types.dom';/" auth/generated.ts identity/generated.ts
