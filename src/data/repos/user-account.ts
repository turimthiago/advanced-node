export interface LoadUserAccountRepository{
  load: (params: LoadUserAccountRepository.Params) => Promise<LoadUserAccountRepository.Result>;
}

export namespace LoadUserAccountRepository{
  export interface Params {
    email: string
  }

  export type Result = undefined;
}

export interface CreateFacebookAccountRepository{
  createFromFacebook: (params: CreateFacebookAccountRepository.Params) => Promise<CreateFacebookAccountRepository.Result>;
}

export namespace CreateFacebookAccountRepository{
  export interface Params {
    email: string;
    name: string;
    facebookId: string;
  }

  export type Result = undefined;
}
