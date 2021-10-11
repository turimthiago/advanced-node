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