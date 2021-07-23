import { AcessToken } from '@/domain/models';
import { AuthenticationError } from '@/domain/errors';

export interface FacebookAuthentication {
  perform: (params: FacebookAuthentication.Params) => Promise<void>;
}

export namespace FacebookAuthentication{
  export interface Params {
    token: string;
  }

  export type Result = AcessToken | AuthenticationError;
}
