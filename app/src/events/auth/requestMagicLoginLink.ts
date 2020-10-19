import type {Event} from "../event";
import {Actions} from "../../actions/actions";

export class RequestMagicLoginLink implements Event {
  triggers: Actions = Actions.requestMagicLoginLink;
  emailAddress: string;

  constructor(emailAddress:string)
  {
    this.emailAddress = emailAddress;
  }
}
