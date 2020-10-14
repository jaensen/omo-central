FROM node:latest

COPY ./auth ./auth
COPY ./data ./data
COPY ./identity ./identity

RUN cd identity && ./rebuild.sh

# Alias host "omo.local" with "auth" so that the identity can reach the auth-container.
# DOESN'T WORK - FCK...
# RUN echo "omo.local auth" > /etc/host.aliases
# RUN sh -c "export HOSTALIASES=/etc/host.aliases"

CMD ["node", "identity/server/dist/main.js"]
