export interface SaveUserPicture {
  savePicture: (params: SaveUserPicture.Input) => Promise<void>;
}

export namespace SaveUserPicture {
  export interface Input {
    pictureUrl?: string;
  }
}

export interface LoadUserProfile {
  load: (params: LoadUserProfile.Input) => Promise<void>;
}

export namespace LoadUserProfile {
  export type Input = {
    id: string;
  };
}
