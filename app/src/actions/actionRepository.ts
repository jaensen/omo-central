import {Actions} from "./actions";
import type {RequestMagicLoginLink} from "../trigger/auth/requestMagicLoginLink";
import {ExchangeJwtForSessionCookie} from "../trigger/auth/exchangeJwtForSessionCookie";
import type {ExchangeMagicLoginCodeForJwt} from "../trigger/auth/exchangeMagicLinkCodeForJwt";
import jwt_decode from "jwt-decode";
import {authClient} from "../graphQL/auth/authClient";
import {identityClient} from "../graphQL/identity/identityClient";

export const jwtLocalStorageKey = "magic-login-jwt";

const externalUrl = "__PROXY_PROTOCOL__" + "__PROXY_EXTERN_DOMAIN__" + ":" + "__PROXY_EXTERN_PORT__";

const conf = {
  auth: {
    url: externalUrl + "/auth",
    appId: "1"
  },
  identityServerUrl: externalUrl + "/identity"
};

export const config = conf;

export const actionRepository = {
  /**
   * The user receives a one time code in the magic login email.
   * This function exchanges it for a JWT.
   * !! Since the link opens in a new browser tab, the received JWT must be
   * exchanged with the already running instance via localStorage. Events/Triggers
   * won't work !!
   */
  [Actions.exchangeMagicLoginCodeForJwt]: async (trigger:ExchangeMagicLoginCodeForJwt) => {
    const result =  await authClient.Verify({
      oneTimeToken: trigger.oneTimeToken
    });
    if (result.errors && result.errors.length > 0) {
      throw new Error(result.errors.map(o => o.message) .join("\n"));
    }

    localStorage.setItem(jwtLocalStorageKey, result.data.verify.jwt);
    window.close();
  },
  /**
   * Requests a magic login link for an email address.
   * @param trigger
   */
  [Actions.requestMagicLoginLink]:async (trigger:RequestMagicLoginLink) => {
    // Below we're waiting for a new JWT so any pre-existing JWT must be deleted first.
    localStorage.removeItem(jwtLocalStorageKey);

    if (typeof checkForJwtIntervalHandle === "number") {
      // Looks strange but prevents the interval from keeping running
      // a second time if the user requests the login link more than once
      // because of input lag or similar problems
      clearInterval(<number>checkForJwtIntervalHandle);
    } else if (checkForJwtIntervalHandle) {
      clearTimeout(checkForJwtIntervalHandle);
    }
    var checkForJwtIntervalHandle: number|undefined|NodeJS.Timeout;

    const result =  await authClient.LoginWithEmail({
      appId: conf.auth.appId,
      emailAddress: trigger.emailAddress
    });
    if (result.errors && result.errors.length > 0) {
      throw new Error(result.errors.map(o => o.message) .join("\n"));
    }

    // When we got a result with "success" == true,
    // Wait for the user to click the magic link.
    // The magic-link's target will exchange the one time code
    // with a JWT. This is what we're waiting for (100ms polling).
    checkForJwtIntervalHandle = setInterval(() => {
      if (!localStorage.getItem(jwtLocalStorageKey))
      {
        console.log("Waiting for user to follow the magic link ..");
        return;
      }

      // The JWT was written by the magic-login-link landingpage.
      // Send it via Trigger/Event and remove the entry from the local storage ..
      window.trigger(new ExchangeJwtForSessionCookie(localStorage.getItem(jwtLocalStorageKey)));
      localStorage.removeItem(jwtLocalStorageKey);
      // .. then stop the timer
      if (typeof checkForJwtIntervalHandle === "number") {
        // Looks strange but prevents the interval from keeping running
        // a second time if the user requests the login link more than once
        // because of input lag or similar problems
        clearInterval(<number>checkForJwtIntervalHandle);
      } else if (checkForJwtIntervalHandle) {
        clearTimeout(checkForJwtIntervalHandle);
      }
    }, 100);
  },
  [Actions.exchangeJwtForSessionCookie]: async (trigger:ExchangeJwtForSessionCookie) => {
    const result =  await identityClient.ExchangeToken({
      jwt: trigger.jwt
    });
    if (result.errors && result.errors.length > 0) {
      throw new Error(result.errors.map(o => o.message) .join("\n"));
    }
    if (!result.data.exchangeToken.success) {
      throw new Error("Couldn't exchange the JWT for a session at the identity.")
    }

    const decodedJwt = jwt_decode(trigger.jwt);
    console.log("JWT:", decodedJwt);

    localStorage.removeItem(jwtLocalStorageKey);
    // window.trigger(new NavigateTo("To safe", "/safe"));

    alert("successfully logged in")
  }
}
