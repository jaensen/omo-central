--CREATE DATABASE "omo-auth";
\c "omo-auth";

create table "_Migration"
(
    revision           serial       not null
        constraint "_Migration_pkey"
            primary key,
    name               text         not null,
    datamodel          text         not null,
    status             text         not null,
    applied            integer      not null,
    rolled_back        integer      not null,
    datamodel_steps    text         not null,
    database_migration text         not null,
    errors             text         not null,
    started_at         timestamp(3) not null,
    finished_at        timestamp(3)
);

alter table "_Migration"
    owner to postgres;

create table public."Challenges"
(
    id        serial       not null
        constraint "Challenges_pkey"
            primary key,
    "validTo" timestamp(3) not null,
    type       text         not null,
    key       text         not null,
    challenge text         not null,
    done      boolean      not null,
    "appId"   text         not null
);

alter table public."Challenges"
    owner to postgres;

create unique index "UX_Challenges_Type_Key_Challenge"
    on public."Challenges" (type, key, challenge);

create table "Apps"
(
    id                  serial       not null
        constraint "Apps_pkey"
            primary key,
    "originHeaderValue" text         not null,
    "validFrom"         timestamp(3) not null,
    "validTo"           timestamp(3),
    "appId"             text         not null
);

alter table "Apps"
    owner to postgres;

create unique index "Apps.appId_unique"
    on "Apps" ("appId");

create table "SigningKeyPairs"
(
    id              serial       not null
        constraint "SigningKeyPairs_pkey"
            primary key,
    "validFrom"     timestamp(3) not null,
    "validTo"       timestamp(3) not null,
    "privateKeyPem" text         not null,
    "publicKeyPem"  text         not null,
    "privateKeyJwk" text         not null,
    "publicKeyJwk"  text         not null
);

alter table "SigningKeyPairs"
    owner to postgres;


INSERT INTO "Apps" ("appId", "originHeaderValue", "validFrom", "validTo")
VALUES ('1', 'http://omo.local:8080', '2020-01-01', null);

CREATE DATABASE "omo-data";
\c "omo-data";

create table "_Migration"
(
    revision serial not null
        constraint "_Migration_pkey"
            primary key,
    name text not null,
    datamodel text not null,
    status text not null,
    applied integer not null,
    rolled_back integer not null,
    datamodel_steps text not null,
    database_migration text not null,
    errors text not null,
    started_at timestamp(3) not null,
    finished_at timestamp(3)
);
alter table "_Migration" owner to postgres;

create table "Identity"
(
    "identityId" text not null
        constraint "Identity_pkey"
            primary key,
    "publicData" jsonb not null,
    "initializationVector" text not null,
    "privateData" text not null
);

alter table "Identity" owner to postgres;

create table "Agent"
(
    "identityId" text not null
        constraint "Agent_identityId_fkey"
            references "Identity"
            on update cascade on delete cascade,
    "identityKey" text not null,
    type text not null,
    key text not null
);

alter table "Agent" owner to postgres;

create unique index "UX_Agent_Type_Key"
    on "Agent" (type, key);

create table "Authority"
(
    id serial not null
        constraint "Authority_pkey"
            primary key,
    issuer text not null,
    "appId" text not null
);

alter table "Authority" owner to postgres;

create table "Session"
(
    "sessionId" text not null,
    "createdAt" timestamp(3) not null,
    "maxLifetime" integer not null,
    "authorityId" integer not null
        constraint "Session_authorityId_fkey"
            references "Authority"
            on update cascade on delete cascade,
    "agentType" text not null,
    "agentKey" text not null,
    constraint "Session_agentType_agentKey_fkey"
        foreign key ("agentType", "agentKey") references "Agent" (type, key)
            on update cascade on delete cascade
);

alter table "Session" owner to postgres;

create unique index "Session.sessionId_unique"
    on "Session" ("sessionId");

-- TODO: Get URL from ENV
INSERT INTO "Authority" (issuer, "appId") VALUES ('http://omo.local:8080/auth', '1');
