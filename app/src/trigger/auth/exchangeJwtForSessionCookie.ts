import type {Trigger} from "../trigger";
import {Actions} from "../../actions/actions";

export class ExchangeJwtForSessionCookie implements Trigger {
  title: string = "Request magic login link";
  triggers: Actions = Actions.exchangeJwtForSessionCookie;
  jwt:string;

  constructor(jwt:string)
  {
    this.jwt = jwt;
  }
}
