import { UploadFile, UUIDGenerator } from '@/domain/contracts/gateways';
import { SaveUserPicture } from '@/domain/contracts/repos';

type Setup = (
  fileStorage: UploadFile,
  crypto: UUIDGenerator,
  userProfileRepository: SaveUserPicture
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
    }
    await userProfileRepository.savePicture({ pictureUrl });
  };
