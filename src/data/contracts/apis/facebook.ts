export interface LoadFacebookUserApi{
  loadUser: (params: LoadFacebookUserApi.Params) => Promise<LoadFacebookUserApi.Result>
}

export namespace LoadFacebookUserApi{
  export interface Params {
    token: string
  }
  export type Result = undefined | {
    name: string,
    email: string,
    facebookId: string
  }
}
