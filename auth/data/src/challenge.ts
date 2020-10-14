import {prisma} from "./prisma";
import {ValueGenerator} from "@omo/auth-util/dist/valueGenerator";
import {publicEncrypt} from "crypto";
import * as constants from "constants";

export interface RequestChallengeResponse
{
  success: boolean,
  errorMessage?: string,
  challenge?: string
  validTo?: Date
}

export interface VerifyChallengeResponse
{
  success: boolean,
  type?: string,
  key?: string,
  appId?: string
}

export class Challenge
{
  public static async requestChallenge(type: string, key: string, forAppId: string, length: number, validForNSeconds: number): Promise<RequestChallengeResponse>
  {
    const now = new Date();

    const pendingChallenges = await prisma.challenges.findMany({
      where: {
        appId: forAppId,
        type: type,
        key: key,
        done: false,
        validTo: {
          gt: now
        }
      },
      select: {
        done: true,
        validTo: true
      }
    });

    if (pendingChallenges.length > 0)
    {
      return {
        success: false,
        errorMessage: "There is a pending challenge for this email address. " +
          "Please solve it first or let it time-out before requesting a new one."
      }
    }

    // encrypt the challenge with the supplied public key
    let challenge = ValueGenerator.generateRandomUrlSafeString(length);
    if (type === "publicKey")
    {
      const challengeBuffer = Buffer.from(challenge, "utf8");
      const encryptedChallengeBuffer = publicEncrypt({
        key: key,
        padding: constants.RSA_PKCS1_PADDING
      }, challengeBuffer);
      challenge = encryptedChallengeBuffer.toString("base64");
    }
    else if (type === "email")
    {

    }
    else
    {
      throw new Error("Unknown challenge type '" + type + "'.");
    }

    const newChallenge = await prisma.challenges.create({
      data: {
        appId: forAppId,
        type: type,
        key: key,
        validTo: new Date(new Date().getTime() + (validForNSeconds * 1000)),
        challenge: challenge,
        done: false
      },
      select: {
        challenge: true,
        validTo: true
      }
    });

    return {
      success: true,
      challenge: newChallenge.challenge,
      validTo: newChallenge.validTo
    };
  }

  public static async verifyChallenge(challengeResponse: string): Promise<VerifyChallengeResponse>
  {
    const now = new Date();
    const challenge = await prisma.challenges.findMany({
      where: {
        challenge: challengeResponse,
        done: false,
        validTo: {
          gte: now
        }
      }
    });

    if (challenge.length != 1)
    {
      return {
        success: false
      }
    }

    const foundChallenge = challenge[0];

    await prisma.challenges.update({
      where: {
        id: foundChallenge.id
      },
      data: {
        done: true
      }
    });

    return {
      success: true,
      type: foundChallenge.type,
      key: foundChallenge.key,
      appId: foundChallenge.appId
    }
  }
}
