import {
  ChangeProfilePicture,
  setupChangeProfilePicture
} from '@/domain/use-cases/change-profile-picture';
import { UUIDGenerator, UploadFile } from '@/domain/contracts/gateways';
import { LoadUserProfile, SaveUserPicture } from '@/domain/contracts/repos';

import { mock, MockProxy } from 'jest-mock-extended';

describe('ChangeProfilePicture', () => {
  let uuid: string;
  let crypto: MockProxy<UUIDGenerator>;
  let userProfileRepository: MockProxy<SaveUserPicture & LoadUserProfile>;
  let file: Buffer;
  let fileStorage: MockProxy<UploadFile>;
  let sut: ChangeProfilePicture;

  beforeAll(() => {
    uuid = 'any_unique_id';
    crypto = mock();
    crypto.uuid.mockReturnValue(uuid);
    file = Buffer.from('any_buffer');
    fileStorage = mock();
    fileStorage.upload.mockResolvedValue('any_url');
    userProfileRepository = mock();
    userProfileRepository.load.mockResolvedValue({
      name: 'Thiago Turim Carvalho'
    });
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
      pictureUrl: undefined,
      initials: 'TC'
    });
    expect(userProfileRepository.savePicture).toHaveBeenCalledTimes(1);
  });

  it('should call LoadUserProfile with correct input', async () => {
    await sut({ id: 'any_id', file: undefined });
    expect(userProfileRepository.load).toHaveBeenCalledWith({
      id: 'any_id'
    });
    expect(userProfileRepository.load).toHaveBeenCalledTimes(1);
  });

  it('should not call LoadUserProfile if file exists', async () => {
    await sut({ id: 'any_id', file });
    expect(userProfileRepository.load).not.toHaveBeenCalled();
  });

  it('should call SaveUserPicture with correct input', async () => {
    userProfileRepository.load.mockResolvedValueOnce({ name: 'Thiago' });
    await sut({ id: 'any_id', file: undefined });
    expect(userProfileRepository.savePicture).toHaveBeenCalledWith({
      pictureUrl: undefined,
      initials: 'TH'
    });
    expect(userProfileRepository.savePicture).toHaveBeenCalledTimes(1);
  });

  it('should call SaveUserPicture with correct input', async () => {
    userProfileRepository.load.mockResolvedValueOnce({ name: 't' });
    await sut({ id: 'any_id', file: undefined });
    expect(userProfileRepository.savePicture).toHaveBeenCalledWith({
      pictureUrl: undefined,
      initials: 'T'
    });
    expect(userProfileRepository.savePicture).toHaveBeenCalledTimes(1);
  });

  it('should call SaveUserPicture with correct input', async () => {
    userProfileRepository.load.mockResolvedValueOnce({ name: undefined });
    await sut({ id: 'any_id', file: undefined });
    expect(userProfileRepository.savePicture).toHaveBeenCalledWith({
      pictureUrl: undefined,
      initials: undefined
    });
    expect(userProfileRepository.savePicture).toHaveBeenCalledTimes(1);
  });
});
