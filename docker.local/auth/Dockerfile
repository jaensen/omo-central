FROM node:latest

#RUN git clone https://github.com/omoearth/omo-auth.git
COPY ./client/src ./client/src
COPY ./client/package.json ./client/package.json
COPY ./client/tsconfig.json ./client/tsconfig.json

COPY ./data/src ./data/src
COPY ./data/package.json ./data/package.json
COPY ./data/tsconfig.json ./data/tsconfig.json

COPY ./mailer/src ./mailer/src
COPY ./mailer/package.json ./mailer/package.json
COPY ./mailer/tsconfig.json ./mailer/tsconfig.json

COPY ./server/src ./server/src
COPY ./server/package.json ./server/package.json
COPY ./server/tsconfig.json ./server/tsconfig.json
COPY ./server/codegen.yml ./server/codegen.yml

COPY ./util/src ./util/src
COPY ./util/package.json ./util/package.json
COPY ./util/tsconfig.json ./util/tsconfig.json

COPY ./rebuild.sh ./rebuild.sh

RUN ./rebuild.sh

CMD ["node", "server/dist/main.js"]
