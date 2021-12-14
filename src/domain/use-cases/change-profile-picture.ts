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
    let initials: string | undefined;
    if (file) {
      pictureUrl = await fileStorage.upload({
        file,
        key: crypto.uuid({ key: id })
      });
    } else {
      const { name } = await userProfileRepository.load({ id });
      if (name) {
        const firstLetters = name.match(/\b(.)/g) ?? [];
        if (firstLetters.length > 1) {
          initials = `${firstLetters.shift()?.toUpperCase() ?? ''}${
            firstLetters.pop()?.toUpperCase() ?? ''
          }`;
        } else {
          initials = name.substring(0, 2).toUpperCase();
        }
      }
    }
    await userProfileRepository.savePicture({ pictureUrl, initials });
  };