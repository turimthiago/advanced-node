import {
  DeleteFile,
  UploadFile,
  UUIDGenerator
} from '@/domain/contracts/gateways';
import { LoadUserProfile, SaveUserPicture } from '@/domain/contracts/repos';
import { UserProfile } from '../entities';

type Setup = (
  fileStorage: UploadFile & DeleteFile,
  crypto: UUIDGenerator,
  userProfileRepository: SaveUserPicture & LoadUserProfile
) => ChangeProfilePicture;
type Input = { id: string; file?: Buffer };
type Output = { pictureUrl?: string; initials?: string };
export type ChangeProfilePicture = (input: Input) => Promise<Output>;

export const setupChangeProfilePicture: Setup =
  (fileStorage, crypto, userProfileRepository) =>
  async ({ id, file }) => {
    const key = crypto.uuid({ key: id });
    const data: { pictureUrl?: string; name?: string } = {};
    if (file) {
      data.pictureUrl = await fileStorage.upload({
        file,
        key
      });
    } else {
      data.name = (await userProfileRepository.load({ id })).name;
    }
    const userProfile = new UserProfile(id);
    userProfile.setPicture(data);
    try {
      await userProfileRepository.savePicture(userProfile);
    } catch (error) {
      if (file) await fileStorage.delete({ key });
      throw new Error();
    }
    return userProfile;
  };
