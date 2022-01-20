import {
  ChangeProfilePicture,
  setupChangeProfilePicture
} from '@/domain/use-cases';
import { makePgUserProfileRepo } from '@/main/factories/repos';
import {
  makeAwsS3FileStorage,
  makeUUIDHandler
} from '@/main/factories/gateways';

export const makeChangeProfilePicture = (): ChangeProfilePicture => {
  return setupChangeProfilePicture(
    makeAwsS3FileStorage(),
    makeUUIDHandler(),
    makePgUserProfileRepo()
  );
};
