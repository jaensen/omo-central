import type {Event} from "../event";
import {Actions} from "../../actions/actions";

export class ExchangeJwtForSessionCookie implements Event {
  triggers: Actions = Actions.exchangeJwtForSessionCookie;
  jwt:string;

  constructor(jwt:string)
  {
    this.jwt = jwt;
  }
}
