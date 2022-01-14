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
type Input = { id: string; file?: { buffer: Buffer; mimeType: string } };
type Output = { pictureUrl?: string; initials?: string };
export type ChangeProfilePicture = (input: Input) => Promise<Output>;

export const setupChangeProfilePicture: Setup =
  (fileStorage, crypto, userProfileRepository) =>
  async ({ id, file }) => {
    const key = crypto.uuid({ key: id });
    const data: { pictureUrl?: string; name?: string } = {};
    if (file) {
      data.pictureUrl = await fileStorage.upload({
        file: file.buffer,
        fileName: key
      });
    } else {
      data.name = (await userProfileRepository.load({ id }))?.name;
    }
    const userProfile = new UserProfile(id);
    userProfile.setPicture(data);
    try {
      await userProfileRepository.savePicture(userProfile);
    } catch (error) {
      if (file)
        await fileStorage.delete({
          fileName: `${key}.${file.mimeType.split('/')[1]}`
        });
      throw error;
    }
    return userProfile;
  };
