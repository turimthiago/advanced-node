import { UploadFile, UUIDGenerator } from '@/domain/contracts/gateways';
import { LoadUserProfile, SaveUserPicture } from '@/domain/contracts/repos';
import { UserProfile } from '../entities';

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
    const data: { pictureUrl?: string; name?: string } = {};
    if (file) {
      data.pictureUrl = await fileStorage.upload({
        file,
        key: crypto.uuid({ key: id })
      });
    } else {
      data.name = (await userProfileRepository.load({ id })).name;
    }
    const userProfile = new UserProfile(id);
    userProfile.setPicture(data);
    await userProfileRepository.savePicture(userProfile);
  };
