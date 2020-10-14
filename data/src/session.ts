import {prisma} from "./prisma";
import {Client} from "@omo/auth-client/dist/client";
import {ValueGenerator} from "@omo/auth-utils/dist/valueGenerator";
import jsonwebtoken from 'jsonwebtoken';
import {Identity} from "./identity";
import {Agent} from "./agent";

export class Session
{
  static async findSessionBySessionId(sessionId: string)
  {
    const session = await prisma.session.findOne({
      where: {
        sessionId
      },
      include: {
        agent: true
      }
    });

    if (!session)
    {
      return null;
    }

    const now = new Date();
    const expires = new Date(session.createdAt.getTime() + session.maxLifetime * 1000);

    if (expires.getTime() < now.getTime())
    {
      return null;
    }

    return session;
  }

  static async createSessionFromJWT(jwt: string)
  {
    const tokenPayload: any = jsonwebtoken.decode(jwt);
    if (!tokenPayload)
    {
      throw new Error("Couldn't decode the supplied JWT.")
    }

    const authorities = await prisma.authority.findMany({where: {issuer: tokenPayload.iss}});
    if (!authorities || authorities.length != 1)
    {
      throw new Error("Couldn't find a specific authority for the 'iss' (issuer) of the JWT: The issuer in question is: '" + tokenPayload.iss + "'");
    }

    const authority = authorities[0];
    const client = new Client(authority.appId, authority.issuer);

    // Verify the token and get the paylout
    const payload = await client.verify(jwt);
    const sub = payload.sub;
    const subType = payload.subType;

    if (subType == "email")
    {
    }
    else if (subType == "publicKey")
    {
    }
    else
    {
      throw new Error("unkown authentication method (subType) in received jwt: '" + subType + "'");
    }

    // Find an agent that matches the subject
    const agents = await prisma.agent.findMany({where: {type: subType, key: sub}});

    let agent;
    if (agents.length == 0 && subType == "email")
    {
      // If this is the first time that we see this "sub", create a new agent
      agent = await Agent.createFromEmail(sub);
    }
    else if (agents.length == 0 && subType == "publicKey")
    {
      throw new Error("not implemented!");
      //agent = await Agent.createFromPublicKey();
    }
    else
    {
      if (!agents || agents.length != 1)
      {
        throw new Error("Couldn't find an identity for the jwt's subject ('" + sub + "').");
      }
      agent = agents[0];
    }

    const session = await prisma.session.create({
      data: {
        agent: {
          connect: {
            UX_Agent_Type_Key: {
              key: agent.key,
              type: agent.type
            }
          }
        },
        issuedBy: {
          connect: {id: authority.id}
        },
        createdAt: new Date(),
        maxLifetime: 60 * 60 * 24,
        sessionId: ValueGenerator.generateRandomBase64String(64)
      }
    });

    return session;
  }
}
