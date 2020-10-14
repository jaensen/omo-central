import type {Trigger} from "../trigger";
import {Actions} from "../../actions/actions";

export class RequestMagicLoginLink implements Trigger {
  title: string = "Request magic login link";
  triggers: Actions = Actions.requestMagicLoginLink;
  emailAddress: string;

  constructor(emailAddress:string)
  {
    this.emailAddress = emailAddress;
  }
}