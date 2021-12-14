import { UploadFile, UUIDGenerator } from '@/domain/contracts/gateways';
import { LoadUserProfile, SaveUserPicture } from '@/domain/contracts/repos';

type Setup = (
  fileStorage: UploadFile,
  crypto: UUIDGenerator,
  userProfileRepository: SaveUserPicture & LoadUserProfile
) => ChangeProfilePicture;
type Input = { id: string; file?: Buffer };
export type ChangeProfilePicture = (input: Input) => Promise<void>;

export const setupChangeProfilePicture: Setup =
  (fileStorage, crypto, userProfileRepository) =>
  async ({ id, file }) => {
    let pictureUrl: string | undefined;
    if (file) {
      pictureUrl = await fileStorage.upload({
        file,
        key: crypto.uuid({ key: id })
      });
    } else {
      await userProfileRepository.load({ id });
    }
    await userProfileRepository.savePicture({ pictureUrl });
  };
