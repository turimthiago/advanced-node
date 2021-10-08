import { AuthenticationError } from '@/domain/entities/errors';
import { AccessToken } from '../entities';

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
