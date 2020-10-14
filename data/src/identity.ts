import {Session} from "./session";
import {prisma} from "./prisma";

export class Identity {
  static async findByIdentityId(identityId: string)
  {
    return await prisma.identity.findOne({where:{identityId:identityId}});
  }

  static async findIdentityBySession(sessionId:string) {
    const session = await Session.findSessionBySessionId(sessionId);
    if (!session)
    {
      throw new Error("Couldn't find a valid session with the passed sessionId.");
    }
    const identity = await Identity.findByIdentityId(session.agent.identityId);
    if (!identity)
    {
      throw new Error("Couldn't find a identity with the passed sessionId.");
    }
    return identity;
  }

  static async setPublicData(sessionId:string, publicData:string) {
    const identity = await Identity.findIdentityBySession(sessionId);
    if (!identity)
    {
      throw new Error("Couldn't find a identity with the passed sessionId.");
    }
    await prisma.identity.update({
      where: {
        identityId: identity.identityId
      },
      data: {
        publicData
      }
    });
  }

  static async setPrivateData(sessionId:string, initializationVector:string, privateData:string) {
    const identity = await this.findIdentityBySession(sessionId);
    if (!identity)
    {
      throw new Error("Couldn't find a identity with the passed sessionId.");
    }
    await prisma.identity.update({
      where: {
        identityId: identity.identityId
      },
      data: {
        privateData,
        initializationVector
      }
    });
  }
}