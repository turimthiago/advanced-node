export interface LoadUserAccount {
  load: (params: LoadUserAccount.Input) => Promise<LoadUserAccount.Output>;
}

export namespace LoadUserAccount {
  export interface Input {
    email: string;
  }

  export type Output =
    | undefined
    | {
        id: string;
        name?: string;
      };
}

export interface SaveFacebookAccount {
  saveWithFacebook: (
    params: SaveFacebookAccount.Params
  ) => Promise<SaveFacebookAccount.Result>;
}

export namespace SaveFacebookAccount {
  export interface Params {
    id?: string;
    email: string;
    name: string;
    facebookId: string;
  }

  export interface Result {
    id: string;
  }
}

export interface UpdateFacebookAccountRepository {
  updateWithFacebook: (
    params: UpdateFacebookAccountRepository.Params
  ) => Promise<UpdateFacebookAccountRepository.Result>;
}

export namespace UpdateFacebookAccountRepository {
  export interface Params {
    id: string;
    name: string;
    facebookId: string;
  }

  export type Result = undefined;
}
