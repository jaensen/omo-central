import jsonwebtoken from 'jsonwebtoken';

const fetch = require('cross-fetch');

/**
 * This client can be used solely to verify JWT tokens that have been issued by this service.
 */
export class Client
{
  private readonly _issuer: string;
  private readonly _appId: string;

  constructor(appId: string, issuer: string)
  {
    this._issuer = issuer;
    this._appId = appId;
  }

  /**
   * Verifies the received token and returns the "sub" claim if successful.
   * @param jwt
   */
  public async verify(jwt: string)
  {
    const tokenPayload: any = jsonwebtoken.decode(jwt);

    // Check who issued the token
    if (typeof tokenPayload !== "object")
      throw new Error("Couldn't decode the jwt");

    const iss = tokenPayload.iss;
    if (!iss)
      throw new Error("No issuer (iss) claim.");
    if (iss !== this._issuer)
      throw new Error("The issuer must match the _authUrl (is: " + iss + "; should be:" + this._issuer + ")");

    let kid = tokenPayload.kid;
    if (!kid)
      throw new Error("No key id (kid) claim.")

    if (process.env.DEBUG)
    {
      // When in DEBUG mode, use the docker internal DNS names
      let newKid = kid.replace(process.env.PROXY_EXTERN_DOMAIN, process.env.AUTH_DOMAIN);
      if (kid.indexOf(process.env.PROXY_EXTERN_PORT) > -1) {
        newKid = newKid.replace(process.env.PROXY_EXTERN_PORT, process.env.AUTH_PORT);
      }
      console.warn("Rewrote the KID. Old: '" + kid + "'; New: '" + newKid + "'");

      kid = newKid;
    }

    const aud = tokenPayload.aud;
    if (typeof aud !== "object")
      throw new Error("The audience (aud) must be an array.");

    const audAppId = aud[0];
    if (audAppId != this._appId)
      throw new Error("The audience of the received jwt doesn't match the configured appId. (is: " + audAppId + "; should be: " + this._appId + ")");

    const sub = tokenPayload.sub;
    if (!sub)
      throw new Error("No subject (sub) claim.");

    const key = await fetch(kid).then((data: any) => data.json());
    const pubKey = key.data.keys.publicKey;
    if (!pubKey)
      throw new Error("Couldn't fetch the public key to verify the jwt");

    const verifiedPayload = jsonwebtoken.verify(jwt, pubKey);
    if (!verifiedPayload)
      throw new Error("The received jwt couldn't be verified.")

    return tokenPayload;
  }
}
