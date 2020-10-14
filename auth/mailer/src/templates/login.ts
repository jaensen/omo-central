import {Template} from "../template";

export const login:Template = {
    subject: "Your magic login link",
    bodyPlain: `Please click the link below to sign-in:
{{env.AUTH_APP_REDIRECT}}/{{challenge}}`,
    bodyHtml: `Please click the link below to sign-in:<br/>
<a href="{{env.AUTH_APP_REDIRECT}}/{{challenge}}">Sign-in</a>`
}
