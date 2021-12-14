export interface SaveUserPicture {
  savePicture: (params: SaveUserPicture.Input) => Promise<void>;
}

export namespace SaveUserPicture {
  export interface Input {
    pictureUrl?: string;
  }
}
