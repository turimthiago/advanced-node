import { RequiredFieldError } from '@/application/errors';
import { badRequest, HttpResponse } from '@/application/helpers';
import { ChangeProfilePicture } from '@/domain/use-cases';

type HttpRequest = {
  file: { buffer: Buffer; mimeType: string };
  userId: string;
};
type Model = Error;

export class SavePictureController {
  constructor(private readonly changeProfilePicture: ChangeProfilePicture) {}

  async handle({
    file,
    userId
  }: HttpRequest): Promise<HttpResponse<Model> | undefined> {
    if (!file || file === null)
      return badRequest(new RequiredFieldError('file'));
    if (file.buffer.length === 0)
      return badRequest(new RequiredFieldError('file'));
    if (!['image/png', 'image/jpg', 'image/jpeg'].includes(file.mimeType))
      return badRequest(new InvalidMimeTypeError(['png', 'jpeg']));
    if (file.buffer.length > 5 * 1024 * 1024)
      return badRequest(new MaxFileSizeError(5));
    await this.changeProfilePicture({
      id: userId,
      file: file.buffer
    });
  }
}

export class InvalidMimeTypeError extends Error {
  constructor(allowed: string[]) {
    super(`Unsupported type. Allowed types: ${allowed.join(', ')}`);
  }
}

export class MaxFileSizeError extends Error {
  constructor(maxSizeInMb: number) {
    super(`File upload limit is ${maxSizeInMb}`);
  }
}

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
    changeProfilePicture = jest.fn();
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
});
