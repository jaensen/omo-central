import {ApolloServer} from "apollo-server";
import {Resolvers} from "./api/resolvers";

// TODO: Migrate to GraphQL-tools: https://www.graphql-tools.com/docs/migration-from-import/
import {importSchema} from "graphql-import";
import {KeyRotator} from "./keyRotator";
import {RequestContext} from "./requestContext";

export class Main
{
    private readonly _server: ApolloServer;
    private readonly _resolvers: Resolvers;
    private readonly _keyRotator: KeyRotator;

    constructor()
    {
        if (!process.env.AUTH_GRAPHQL_SCHEMA)
        {
            throw new Error("The AUTH_GRAPHQL_SCHEMA environment variable must contain a valid path that " +
                "points to the GraphQL api schema.");
        }
        if (!process.env.AUTH_CORS_ORIGINS){
          throw new Error("The AUTH_CORS_ORIGINS environment variable must contain a valid URL terminated by a semicolon. Values in this list are allowed to request the api service.")
        }
        const apiSchemaTypeDefs = importSchema(process.env.AUTH_GRAPHQL_SCHEMA);

        this._resolvers = new Resolvers();
        this._keyRotator = new KeyRotator();

        const corsOrigins = process.env.AUTH_CORS_ORIGINS.split(";");
        console.log("cors origins: ", corsOrigins);

        this._server = new ApolloServer({
            context: RequestContext.create,
            typeDefs: apiSchemaTypeDefs,
            resolvers: {
                Mutation: this._resolvers.mutationResolvers,
                Query: this._resolvers.queryResolvers
            },
            cors: {
              origin: corsOrigins,
              credentials: true
            }
        });
    }

    async run()
    {
        if (!process.env.AUTH_PORT)
        {
            throw new Error("The AUTH_PORT environment variable is not set.");
        }
        if (!process.env.AUTH_ROTATE_EVERY_N_SECONDS)
        {
            throw new Error("The AUTH_ROTATE_EVERY_N_SECONDS environment variable is not set.");
        }

        await this._server.listen({
            port: parseInt(process.env.AUTH_PORT)
        });

        await this._keyRotator.start(parseInt(process.env.AUTH_ROTATE_EVERY_N_SECONDS));
    }
}

new Main()
    .run()
    .then(() => "Running");
