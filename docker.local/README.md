.env file contents:
```
# Remove or comment out this line when in production
DEBUG=true

# SMTP Settings for the server that sends the magic-login mails
SMTP_PASS=
SMTP_SERVER=
SMPT_PORT=
SMTP_SECURE=
SMTP_USER=

# Postgres host
POSTGRES_HOST=postgres
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=omo-auth

#
# Proxy configuration
#
# The protocol that should be used in all server-generated links (in e-mail tenplates etc.)
PROXY_PROTOCOL=http://
# The docker-internal DNS name of the proxy server
PROXY_DOMAIN=proxy
# The docker-internal listener port of the proxy server
PROXY_PORT=80

# The domain that shoulc be used in all server-generated links (in e-mail tenplates etc.)
PROXY_EXTERN_DOMAIN=omo.local
# The port that shoulc be used in all server-generated links (in e-mail tenplates etc.)
PROXY_EXTERN_PORT=8080

# The path to the auth-service on the omo domain
PROXY_SERVICE_STATIC_PATH=static
# The path to the auth-service on the omo domain
PROXY_SERVICE_AUTH_PATH=auth
# The path to the auth-service on the omo domain
PROXY_SERVICE_IDENTITY_PATH=identity
# The path to the app on the omo domain (empty means that this is at the root level of the domain '/')
PROXY_SERVICE_APP_PATH=

#
# Static content server configuration
#
STATIC_PROTOCOL=http://
STATIC_DOMAIN=static
STATIC_PORT=80

#
# App configuration
#
APP_PROTOCOL=http://
APP_DOMAIN=app
APP_PORT=80

#
# Auth service configuration
#
AUTH_PROTOCOL=http://
AUTH_DOMAIN=auth
AUTH_PORT=80
AUTH_CORS_ORIGINS=http://omo.local:8080;http://localhost:5000;
# The AUTH_APP_REDIRECT variable is set in the docker-compose file
# because the URL value contains a hash that is interpreted as comment in .env files.
# AUTH_APP_REDIRECT=http://omo.local:5000/#!/sign-in/onetime

AUTH_JWT_EXP_IN_SEC=60
AUTH_ROTATE_EVERY_N_SECONDS=300
AUTH_GRAPHQL_SCHEMA=server/src/api/api-schema.graphql

#
# Keystore service configuration
#
IDENTITY_PROTOCOL=http://
IDENTITY_DOMAIN=identity
IDENTITY_PORT=80
IDENTITY_CORS_ORIGINS=http://omo.local:8080;http://localhost:5000;

IDENTITY_GRAPHQL_SCHEMA=identity/server/src/api/api-schema.graphql
```
