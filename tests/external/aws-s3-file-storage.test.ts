import { AwsS3FileStorage } from '@/infra/gateways';
import { env } from '@/main/config/env';
import axios from 'axios';

describe('Aws S3 Tests', () => {
  let fileName: string;
  let sut: AwsS3FileStorage;

  beforeAll(() => {
    fileName = 'any_file_name';
  });

  beforeEach(() => {
    sut = new AwsS3FileStorage(env.s3.accessKey, env.s3.secret, env.s3.bucket);
  });

  it('should upload image to aws s3', async () => {
    const onePixelImage =
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdj+M/A8B8ABQAB/6Zcm10AAAAASUVORK5CYII=';
    const file = Buffer.from(onePixelImage, 'base64');
    const pictureUrl = await sut.upload({
      fileName,
      file
    });
    const response = await axios.get(pictureUrl);
    expect(response.status).toBe(200);

    await sut.delete({ fileName });
    const promise = axios.get(pictureUrl);
    await expect(promise).rejects.toThrow();
  });
});
