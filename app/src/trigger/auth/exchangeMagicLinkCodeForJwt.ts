import type {Trigger} from "../trigger";
import {Actions} from "../../actions/actions";

export class ExchangeMagicLoginCodeForJwt implements Trigger {
  title: string = "Request magic login link";
  triggers: Actions = Actions.exchangeMagicLoginCodeForJwt;
  jwt:string;
  oneTimeToken: string;

  constructor(oneTimeToken:string)
  {
    this.oneTimeToken = oneTimeToken;
  }
}