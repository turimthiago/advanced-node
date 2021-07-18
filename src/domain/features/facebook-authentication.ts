import { AcessToken } from '@/domain/models';
import { AuthenticationError } from '@/domain/errors';

export interface FacebookAuthentication {
  perform: (token: string) => AcessToken | AuthenticationError;
}

export namespace FacebookAuthentication{
  export interface Params {
    token: string;
  }

  export type Result = AcessToken | AuthenticationError;
}
