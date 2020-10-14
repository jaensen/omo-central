import {PrismaClient} from "@prisma/client";

export const prisma: PrismaClient = new PrismaClient({
    datasources: {
        db: {
            url: "postgresql://" + process.env.DATA_POSTGRES_USER + ":" + process.env.DATA_POSTGRES_PASSWORD + "@" + process.env.DATA_POSTGRES_HOST + ":5432/" + process.env.DATA_POSTGRES_DB + "?schema=public"
        }
    }
});
