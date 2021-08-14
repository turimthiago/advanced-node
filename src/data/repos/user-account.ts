export interface LoadUserAccountRepository{
  load: (params: LoadUserAccountRepository.Params) => Promise<LoadUserAccountRepository.Result>;
}

export namespace LoadUserAccountRepository{
  export interface Params {
    email: string
  }

  export type Result = undefined | {
    id: string,
    name?: string
  };
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

export interface UpdateFacebookAccountRepository{
  updateWithFacebook: (params: UpdateFacebookAccountRepository.Params) => Promise<UpdateFacebookAccountRepository.Result>;
}

export namespace UpdateFacebookAccountRepository{
  export interface Params {
    id: string,
    name: string;
    facebookId: string;
  }

  export type Result = undefined;
}
