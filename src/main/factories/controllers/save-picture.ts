import { Controller, SavePictureController } from '@/application/controllers';
import { makeChangeProfilePicture } from '@/main/factories/use-cases';
import { makePgTransactionController } from '@/main/factories/decorators';

export const makeSavePictureController = (): Controller => {
  const controller = new SavePictureController(makeChangeProfilePicture());
  return makePgTransactionController(controller);
};
