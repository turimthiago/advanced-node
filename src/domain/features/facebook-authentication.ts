import { AuthenticationError } from "@/domain/errors";
import { AccessToken } from "../models";

export interface FacebookAuthentication {
  perform: (
    params: FacebookAuthentication.Params
  ) => Promise<FacebookAuthentication.Result>;
}

export namespace FacebookAuthentication {
  export interface Params {
    token: string;
  }

  export type Result = AccessToken | AuthenticationError;
}
