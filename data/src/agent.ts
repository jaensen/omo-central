import { prisma } from "./prisma";
import { KeyGenerator } from "@omo/auth-utils/dist/keyGenerator";
import { createHash } from "crypto";

export class Agent
{
  /**
   * Creates a new agent together with an identity.
   * The private key will be generated by the system and is kept in plain text.
   * @param email
   */
  static async createFromEmail(email: string)
  {
    // Generate a random key for the Identity's 'privateData' field.
    const keyLengthInBits = 256;
    const identityKey = await KeyGenerator.generateRandomKey(keyLengthInBits / 8);
    const identityId = createHash('sha512')
                         .update(identityKey)
                         .digest('base64');

    return prisma.agent.create({
      data: {
        type: "email",
        key: email,
        identityKey: identityKey.toString("base64"),
        identity: {
          create: {
            initializationVector: "",
            identityId: identityId,
            privateData: "",
            publicData: {}
          }
        }
      }
    });
  }

  /**
   * Creates a new agent together with an identity.
   * The supplied data is used to create the identity.
   * The 'identityKey' must be passed only encrypted.
   * This method is also used to add a new agent to an existing identity.
   * @param agentPublicKey
   * @param identityId
   * @param identityKey The private key for the identity, already encrypted with the 'agentPublicKey' by the agent.
   */
  static async createFromPublicKey(agentPublicKey: string, identityId: string, identityKey: string)
  {
    let identity = await prisma.identity.findOne({where: {identityId: identityId}});
    if (!identity)
    {
      // Create a new identity with the passed data
      identity = await prisma.identity.create({
        data: {
          initializationVector: "",
          identityId: identityId,
          privateData: "",
          publicData: {}
        }
      });
    }

    return prisma.agent.create({
      data: {
        identity: {
          connect: {
            identityId: identity.identityId
          }
        },
        identityKey: identityKey,
        key: agentPublicKey,
        type: "publicKey"
      }
    });
  }

  static async remove(type: string, key: string)
  {
    await prisma.agent.delete({
      where: {
        UX_Agent_Type_Key: {
          type: type,
          key: key
        }
      }
    });
  }
}