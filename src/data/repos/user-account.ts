export interface LoadUserAccountRepository{
  load: (params: LoadUserAccountRepository.Params) => Promise<void>;
}

export namespace LoadUserAccountRepository{
  export interface Params {
    email: string
  }
}
