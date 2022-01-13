import { ChangeProfilePicture } from '@/domain/use-cases';
import { Controller, SavePictureController } from '@/application/controllers';
import {
  AllowedMimeTypes,
  MaxFileSize,
  Required,
  RequiredBuffer
} from '@/application/validation';

describe('SavePictureController', () => {
  let userId: string;
  let changeProfilePicture: ChangeProfilePicture;
  let buffer: Buffer;
  let mimeType: string;
  let file: { buffer: Buffer; mimeType: string };
  let sut: SavePictureController;

  beforeAll(() => {
    userId = 'any_id';
    mimeType = 'image/png';
    buffer = Buffer.from('any_buffer');
    file = { buffer, mimeType };
    changeProfilePicture = jest.fn().mockResolvedValue({
      statusCode: 200,
      data: { initials: 'any_initials', pictureUrl: 'any_url' }
    });
  });

  beforeEach(() => {
    sut = new SavePictureController(changeProfilePicture);
  });

  it('should extends Controller', async () => {
    expect(sut).toBeInstanceOf(Controller);
  });

  it('should build validators correctly', async () => {
    const validators = sut.buildersValidators({ file, userId });
    expect(validators).toEqual([
      new Required(file, 'buffer'),
      new RequiredBuffer(buffer, 'buffer'),
      new AllowedMimeTypes(['jpg', 'png'], mimeType),
      new MaxFileSize(5, buffer)
    ]);
  });

  it('should call ChangeProfilePicture with correct input', async () => {
    await sut.handle({
      file,
      userId
    });
    expect(changeProfilePicture).toHaveBeenCalledWith({
      id: userId,
      file: buffer
    });
    expect(changeProfilePicture).toHaveBeenCalledTimes(1);
  });

  it('should return 200 with valid data', async () => {
    const httpResponse = await sut.handle({
      file,
      userId
    });
    expect(httpResponse).toEqual({
      statusCode: 200,
      data: {
        statusCode: 200,
        data: { initials: 'any_initials', pictureUrl: 'any_url' }
      }
    });
  });
});
