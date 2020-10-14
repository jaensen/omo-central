import {
  LoginResponse,
  MutationResolvers,
  QueryResolvers, VerifyResponse, Version
} from "../generated/graphql";
import {Challenge} from "@omo/auth-data/dist/challenge";
import {Mailer} from "@omo/auth-mailer/dist/mailer";
import {login} from "@omo/auth-mailer/dist/templates/login";
import jsonwebtoken from 'jsonwebtoken';
import {ValueGenerator} from "@omo/auth-util/dist/valueGenerator";
import {SigningKeyPair} from "@omo/auth-data/dist/signingKeyPair";
import {Apps} from "@omo/auth-data/dist/apps";
import {publicEncrypt} from "crypto";

export class Resolvers
{
  // TODO: Add rate limiting (e.g. with https://www.npmjs.com/package/graphql-rate-limit-directive)

  readonly queryResolvers: QueryResolvers;
  readonly mutationResolvers: MutationResolvers;

  async getAppById(appId:string) :  Promise<{
    appId: string
    originHeaderValue?: string
    validFrom?: Date|null
    validTo?: Date|null
  }> {
    const app = await Apps.findById(appId);
    if (!app)
      throw new Error("The app with the id '" + appId + "' couldn't be found.")

    if (!process.env.DEBUG)
    {
      if (app.originHeaderValue !== origin) // Validate the Origin only when not in DEBUG mode
        throw new Error("The origin of the request (" + origin + ") doesn't map with the configured origin for app '" + appId + "'");
    }
    return app;
  }

  constructor()
  {
    this.mutationResolvers = {
      loginWithPublicKey:  async (parent, {appId, publicKey}, {origin}) => {
        try {
          const app = await this.getAppById(appId);
          const challenge = await Challenge.requestChallenge("publicKey", publicKey, app.appId, 8, 120);
          if (!challenge.success)
          {
            return <LoginResponse>{
              success: false,
              errorMessage: challenge.errorMessage
            }
          }

          return <LoginResponse>{
            success: true,
            challenge: challenge.challenge,
          }
        } catch (e) {
          console.error(e);

          return <LoginResponse>{
            success: false,
            errorMessage: "Internal server error"
          }
        }
      },
      loginWithEmail: async (parent, {appId, emailAddress}, {origin}) =>
      {
        try
        {
          const app = await this.getAppById(appId);
          const challenge = await Challenge.requestChallenge("email", emailAddress, app.appId, 8, 120);
          if (!challenge.success)
          {
            return <LoginResponse>{
              success: false,
              errorMessage: challenge.errorMessage
            }
          }

          await Mailer.send(login, {
            challenge: challenge.challenge,
            env: process.env
          }, emailAddress);

          return <LoginResponse>{
            success: true
          }
        }
        catch (e)
        {
          console.error(e);

          return <LoginResponse>{
            success: false,
            errorMessage: "Internal server error"
          }
        }
      },
      verify: async (parent, {oneTimeToken}, {origin}) =>
      {
        try
        {
          const verificationResult = await Challenge.verifyChallenge(oneTimeToken);
          if (!verificationResult.success || !verificationResult.type || !verificationResult.key || !verificationResult.appId)
          {
            return <VerifyResponse>{
              success: false,
              errorMessage: "Your code is invalid or already expired."
            }
          }

          const jwt = await Resolvers._generateJwt(verificationResult.type, verificationResult.key, verificationResult.appId);

          return <VerifyResponse>{
            success: true,
            jwt: jwt
          }
        }
        catch (e)
        {
          console.error(e);

          return <VerifyResponse>{
            success: false,
            errorMessage: "Internal server error"
          }
        }
      }
    };

    this.queryResolvers = {
      keys: async (parent, {kid}, {origin}) =>
      {
        if (!kid)
          throw new Error("No key id (kid) was supplied.")

        const keyId = parseInt(kid);
        const pk = await SigningKeyPair.findPublicKeyById(keyId);
        if (!pk)
          throw new Error("Couldn't find a key with the specified id.");

        return {
          id: pk.id,
          publicKey: pk.publicKeyPem,
          validTo: pk.validTo.toJSON()
        };
      },
      version: async (parent, {}, {origin}) =>
      {
        return <Version>{
          major: 1,
          minor: 0,
          revision: 0
        }
      }
    }
  }

  private static async _generateJwt(type:string, key: string, forAppId: string)
  {
    if (!process.env.AUTH_JWT_EXP_IN_SEC)
    {
      throw new Error("The AUTH_JWT_EXP_IN_SEC environment variable must contain a numeric " +
        "value that specifies the token expiration duration in minutes.")
    }

    const externalUrl = `${process.env.PROXY_PROTOCOL}${process.env.PROXY_EXTERN_DOMAIN}${process.env.PROXY_EXTERN_PORT == "443" || process.env.PROXY_EXTERN_PORT == "80" ? "" : ":" + process.env.PROXY_EXTERN_PORT}/${process.env.PROXY_SERVICE_AUTH_PATH}`;

    // RFC 7519: 4.1.1.  "iss" (Issuer) Claim
    const iss = externalUrl;

    // RFC 7519: 4.1.2.  "sub" (Subject) Claim
    const sub = key;

    const subType = type;

    // RFC 7519: 4.1.3.  "aud" (Audience) Claim
    const aud = [forAppId];

    // RFC 7519: 4.1.4.  "exp" (Expiration Time) Claim
    const expInSeconds = parseInt(process.env.AUTH_JWT_EXP_IN_SEC);
    const exp = Math.floor(Date.now() / 1000) + expInSeconds;

    // RFC 7519: 4.1.5.  "nbf" (Not Before) Claim
    // TODO: Sync with key rotation
    // const nbf =

    // RFC 7519: 4.1.6.  "iat" (Issued At) Clai
    const iat = Date.now() / 1000

    // RFC 7519: 4.1.7.  "jti" (JWT ID) Claim
    const jti = ValueGenerator.generateRandomUrlSafeString(24);

    const keypair = await SigningKeyPair.findValidKey();
    if (!keypair)
      throw new Error("No valid key available to sign the jwt.")

    const kid = externalUrl + "/graphql?query=query%20%7B%20keys%28kid%3A%22" + keypair.id + "%22%29%20%7Bid%2C%20validTo%2C%20publicKey%20%7D%7D";

    const tokenData = {
      iss, sub, subType, aud, exp, iat, jti, kid
    };

    return jsonwebtoken.sign(tokenData, keypair.privateKeyPem, {
      algorithm: "RS256"
    });
  }
}
