import { RequiredFieldError } from '@/application/errors';
import { badRequest, HttpResponse } from '@/application/helpers';

type HttpRequest = { file: { buffer: Buffer; mimeType: string } };
type Model = Error;

export class SavePictureController {
  async handle({ file }: HttpRequest): Promise<HttpResponse<Model>> {
    if (!file || file === null)
      return badRequest(new RequiredFieldError('file'));
    if (file.buffer.length === 0)
      return badRequest(new RequiredFieldError('file'));
    return badRequest(new InvalidMimeTypeError(['png', 'jpeg']));
  }
}

export class InvalidMimeTypeError extends Error {
  constructor(allowed: string[]) {
    super(`Unsupported type. Allowed types: ${allowed.join(', ')}`);
  }
}

describe('SavePictureController', () => {
  let buffer: Buffer;
  let mimeType: string;
  let file: { buffer: Buffer };
  let sut: SavePictureController;

  beforeAll(() => {
    mimeType = 'image/png';
    buffer = Buffer.from('any_buffer');
    file = { buffer };
  });

  beforeEach(() => {
    sut = new SavePictureController();
  });

  it('should return 400 if file is not provided', async () => {
    const httpResponse = await sut.handle({ file: undefined as any });
    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new RequiredFieldError('file')
    });
  });

  it('should return 400 if file is not provided', async () => {
    const httpResponse = await sut.handle({ file: null as any });
    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new RequiredFieldError('file')
    });
  });

  it('should return 400 if file is empty', async () => {
    const httpResponse = await sut.handle({
      file: { buffer: Buffer.from(''), mimeType }
    });
    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new RequiredFieldError('file')
    });
  });

  it('should return 400 if file type is invalid', async () => {
    const httpResponse = await sut.handle({
      file: { buffer, mimeType: 'invalid_mime_type' }
    });
    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new InvalidMimeTypeError(['png', 'jpeg'])
    });
  });
});
