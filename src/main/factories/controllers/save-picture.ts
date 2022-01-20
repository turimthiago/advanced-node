import { SavePictureController } from '@/application/controllers';
import { makeChangeProfilePicture } from '../use-cases';

export const makeSavePictureController = (): SavePictureController => {
  return new SavePictureController(makeChangeProfilePicture());
};
