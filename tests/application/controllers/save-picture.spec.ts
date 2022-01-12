import {
  InvalidMimeTypeError,
  MaxFileSizeError,
  RequiredFieldError
} from '@/application/errors';
import { ChangeProfilePicture } from '@/domain/use-cases';
import { SavePictureController } from '@/application/controllers';

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

  it('should return 400 if file is not provided', async () => {
    const httpResponse = await sut.handle({ file: undefined as any, userId });
    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new RequiredFieldError('file')
    });
  });

  it('should return 400 if file is not provided', async () => {
    const httpResponse = await sut.handle({ file: null as any, userId });
    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new RequiredFieldError('file')
    });
  });

  it('should return 400 if file is empty', async () => {
    const httpResponse = await sut.handle({
      file: { buffer: Buffer.from(''), mimeType },
      userId
    });
    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new RequiredFieldError('file')
    });
  });

  it('should return 400 if file type is invalid', async () => {
    const httpResponse = await sut.handle({
      file: { buffer, mimeType: 'invalid_mime_type' },
      userId
    });
    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new InvalidMimeTypeError(['png', 'jpeg'])
    });
  });

  it('should not return 400 if file type is valid', async () => {
    const httpResponse = await sut.handle({
      file: { buffer, mimeType: 'image/png' },
      userId
    });
    expect(httpResponse).not.toEqual({
      statusCode: 400,
      data: new InvalidMimeTypeError(['png', 'jpeg'])
    });
  });

  it('should not return 400 if file type is valid', async () => {
    const httpResponse = await sut.handle({
      file: { buffer, mimeType: 'image/jpg' },
      userId
    });
    expect(httpResponse).not.toEqual({
      statusCode: 400,
      data: new InvalidMimeTypeError(['png', 'jpeg'])
    });
  });

  it('should not return 400 if file type is valid', async () => {
    const httpResponse = await sut.handle({
      file: { buffer, mimeType: 'image/jpeg' },
      userId
    });
    expect(httpResponse).not.toEqual({
      statusCode: 400,
      data: new InvalidMimeTypeError(['png', 'jpeg'])
    });
  });

  it('should not return 400 if file size is bigger then 5MB', async () => {
    const invalidBuffer = Buffer.from(new ArrayBuffer(6 * 1024 * 1024));
    const httpResponse = await sut.handle({
      file: { buffer: invalidBuffer, mimeType: 'image/jpeg' },
      userId
    });
    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new MaxFileSizeError(5)
    });
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
