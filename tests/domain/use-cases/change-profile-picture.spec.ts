import {
  ChangeProfilePicture,
  setupChangeProfilePicture
} from '@/domain/use-cases/change-profile-picture';
import {
  UUIDGenerator,
  UploadFile,
  DeleteFile
} from '@/domain/contracts/gateways';
import { LoadUserProfile, SaveUserPicture } from '@/domain/contracts/repos';
import { UserProfile } from '@/domain/entities';

import { mock, MockProxy } from 'jest-mock-extended';
import { mocked } from 'ts-jest/utils';

jest.mock('@/domain/entities/user-profile');

describe('ChangeProfilePicture', () => {
  let uuid: string;
  let crypto: MockProxy<UUIDGenerator>;
  let userProfileRepository: MockProxy<SaveUserPicture & LoadUserProfile>;
  let file: { buffer: Buffer; mimeType: string };
  let buffer: Buffer;
  let mimeType: string;
  let fileStorage: MockProxy<UploadFile & DeleteFile>;
  let sut: ChangeProfilePicture;

  beforeAll(() => {
    uuid = 'any_unique_id';
    crypto = mock();
    crypto.uuid.mockReturnValue(uuid);
    buffer = Buffer.from('any_buffer');
    mimeType = 'image/png';
    file = { buffer, mimeType };
    fileStorage = fileStorage = mock();
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
    await sut({ id: 'any_id', file: { buffer, mimeType: 'image/png' } });
    expect(fileStorage.upload).toHaveBeenCalledWith({
      file: buffer,
      fileName: uuid
    });
    expect(fileStorage.upload).toHaveBeenCalledTimes(1);
  });

  it('should call UploadFile with correct input', async () => {
    await sut({ id: 'any_id', file: { buffer, mimeType: 'image/jpeg' } });
    expect(fileStorage.upload).toHaveBeenCalledWith({
      file: buffer,
      fileName: uuid
    });
    expect(fileStorage.upload).toHaveBeenCalledTimes(1);
  });

  it('should not call UploadFile when file is undefined', async () => {
    await sut({ id: 'any_id', file: undefined });
    expect(fileStorage.upload).not.toHaveBeenCalled();
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
    await sut({ id: 'any_id', file });
    expect(userProfileRepository.savePicture).toHaveBeenCalledWith(
      mocked(UserProfile).mock.instances[0]
    );
    expect(userProfileRepository.savePicture).toHaveBeenCalledTimes(1);
  });

  it('should call SaveUserPicture with correct input', async () => {
    userProfileRepository.load.mockResolvedValueOnce(undefined);
    await sut({ id: 'any_id', file });
    expect(userProfileRepository.savePicture).toHaveBeenCalledWith(
      mocked(UserProfile).mock.instances[0]
    );
    expect(userProfileRepository.savePicture).toHaveBeenCalledTimes(1);
  });

  it('should return correct data on sucess', async () => {
    mocked(UserProfile).mockImplementationOnce((_) => ({
      setPicture: jest.fn(),
      id: 'any_id',
      pictureUrl: 'any_url',
      initials: 'any_initials'
    }));
    const result = await sut({ id: 'any_id', file });
    expect(result).toMatchObject({
      pictureUrl: 'any_url',
      initials: 'any_initials'
    });
  });

  it('should call DeleteFile when file exists and SaveUserPicture throws', async () => {
    expect.assertions(2);
    userProfileRepository.savePicture.mockRejectedValueOnce(new Error());
    const promise = sut({ id: 'any_id', file });
    promise.catch(() => {
      expect(fileStorage.delete).toHaveBeenLastCalledWith({
        fileName: `${uuid}.png`
      });
      expect(fileStorage.delete).toHaveBeenCalledTimes(1);
    });
  });

  it('should not call DeleteFile when file does exists and SaveUserPicture throws', async () => {
    expect.assertions(1);
    userProfileRepository.savePicture.mockRejectedValueOnce(new Error());
    const promise = sut({ id: 'any_id', file: undefined });
    promise.catch(() => {
      expect(fileStorage.delete).not.toHaveBeenCalled();
    });
  });

  it('should rethrow if SaveUserPicture throws', async () => {
    const error = new Error();
    userProfileRepository.savePicture.mockRejectedValueOnce(error);
    const promise = sut({ id: 'any_id', file: undefined });
    await expect(promise).rejects.toThrow(error);
  });
});
