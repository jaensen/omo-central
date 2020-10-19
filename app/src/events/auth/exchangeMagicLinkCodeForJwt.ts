import type {Event} from "../event";
import {Actions} from "../../actions/actions";

export class ExchangeMagicLoginCodeForJwt implements Event {
  triggers: Actions = Actions.exchangeMagicLoginCodeForJwt;
  jwt:string;
  oneTimeToken: string;

  constructor(oneTimeToken:string)
  {
    this.oneTimeToken = oneTimeToken;
  }
}
