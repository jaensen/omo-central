FROM node:latest

ARG PROXY_PROTOCOL
ARG PROXY_EXTERN_DOMAIN
ARG PROXY_EXTERN_PORT

COPY . .

RUN printf "PROXY_PROTOCOL=${PROXY_PROTOCOL}\n" > ./.env
RUN printf "PROXY_EXTERN_DOMAIN=${PROXY_EXTERN_DOMAIN}\n" >> ./.env
RUN printf "PROXY_EXTERN_PORT=${PROXY_EXTERN_PORT}\n" >> ./.env
RUN echo "$(cat ./.env)"

RUN cd app && npm i
RUN cd app && npm run build

FROM nginx:latest

COPY --from=0 ./app/default.nginx.conf  /etc/nginx/conf.d/default.conf
COPY --from=0 ./app/public /usr/share/nginx/html
