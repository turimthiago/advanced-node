import {
  ChangeProfilePicture,
  setupChangeProfilePicture
} from '@/domain/use-cases/change-profile-picture';
import { UUIDGenerator, UploadFile } from '@/domain/contracts/gateways';
import { SaveUserPicture } from '@/domain/contracts/repos';

import { mock, MockProxy } from 'jest-mock-extended';

describe('ChangeProfilePicture', () => {
  let uuid: string;
  let crypto: MockProxy<UUIDGenerator>;
  let userProfileRepository: MockProxy<SaveUserPicture>;
  let file: Buffer;
  let fileStorage: MockProxy<UploadFile>;
  let sut: ChangeProfilePicture;

  beforeAll(() => {
    uuid = 'any_unique_id';
    crypto = mock<UUIDGenerator>();
    crypto.uuid.mockReturnValue(uuid);
    file = Buffer.from('any_buffer');
    fileStorage = mock<UploadFile>();
    fileStorage.upload.mockResolvedValue('any_url');
    userProfileRepository = mock<SaveUserPicture>();
  });

  beforeEach(() => {
    sut = setupChangeProfilePicture(fileStorage, crypto, userProfileRepository);
  });

  it('should call UploadFile with correct input', async () => {
    await sut({ id: 'any_id', file });
    expect(fileStorage.upload).toHaveBeenCalledWith({ file, key: uuid });
    expect(fileStorage.upload).toHaveBeenCalledTimes(1);
  });

  it('should not call UploadFile when file is undefined', async () => {
    await sut({ id: 'any_id', file: undefined });
    expect(fileStorage.upload).not.toHaveBeenCalled();
  });

  it('should call SaveUserPicture with correct input', async () => {
    await sut({ id: 'any_id', file });
    expect(userProfileRepository.savePicture).toHaveBeenCalledWith({
      pictureUrl: 'any_url',
      initials: undefined
    });
    expect(userProfileRepository.savePicture).toHaveBeenCalledTimes(1);
  });

  it('should call SaveUserPicture with correct input when file is undefined', async () => {
    await sut({ id: 'any_id', file: undefined });
    expect(userProfileRepository.savePicture).toHaveBeenCalledWith({
      pictureUrl: undefined
    });
    expect(userProfileRepository.savePicture).toHaveBeenCalledTimes(1);
  });
});
