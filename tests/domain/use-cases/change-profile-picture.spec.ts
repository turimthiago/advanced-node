import {
  ChangeProfilePicture,
  setupChangeProfilePicture
} from '@/domain/use-cases/change-profile-picture';
import { UUIDGenerator, UploadFile } from '@/domain/contracts/gateways';

import { mock, MockProxy } from 'jest-mock-extended';

describe('ChangeProfilePicture', () => {
  let uuid: string;
  let crypto: MockProxy<UUIDGenerator>;
  let file: Buffer;
  let fileStorage: MockProxy<UploadFile>;
  let sut: ChangeProfilePicture;

  beforeAll(() => {
    uuid = 'any_unique_id';
    crypto = mock<UUIDGenerator>();
    crypto.uuid.mockReturnValue(uuid);
    file = Buffer.from('any_buffer');
    fileStorage = mock<UploadFile>();
  });

  beforeEach(() => {
    sut = setupChangeProfilePicture(fileStorage, crypto);
  });

  it('should call UploadFile with correct input', async () => {
    await sut({ id: 'any_id', file });
    expect(fileStorage.upload).toHaveBeenCalledWith({ file, key: uuid });
    expect(fileStorage.upload).toHaveBeenCalledTimes(1);
  });
});
