export interface TockenGenerator {
  generateToken: (
    params: TockenGenerator.Params
  ) => Promise<TockenGenerator.Result>;
}

export namespace TockenGenerator {
  export interface Params {
    key: string;
    expirationInMs: number;
  }

  export type Result = string;
}

export interface TokenValidator {
  validateToken: (
    params: TokenValidator.Params
  ) => Promise<TokenValidator.Result>;
}

export namespace TokenValidator {
  export type Params = { token: string };
  export type Result = string;
}
