import { config, S3 } from 'aws-sdk';
import { AwsS3FileStorage } from '@/infra/gateways';

import { mocked } from 'ts-jest/utils';

jest.mock('aws-sdk');

describe('AwsS3FileStorage', () => {
  let accessKey: string;
  let secret: string;
  let bucket: string;
  let key: string;
  let sut: AwsS3FileStorage;

  beforeAll(() => {
    accessKey = 'any_access_key';
    secret = 'any_secret';
    bucket = 'any_bucket';
    key = 'any_key';
  });

  beforeEach(() => {
    sut = new AwsS3FileStorage(accessKey, secret, bucket);
  });

  it('should config aws credentials on creation', () => {
    expect(sut).toBeDefined();
    expect(config.update).toHaveBeenCalledWith({
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secret
      }
    });
    expect(config.update).toHaveBeenCalledTimes(1);
  });

  describe('upload', () => {
    let file: Buffer;
    let putObjectPromiseSpy: jest.Mock;
    let putObjectSpy: jest.Mock;

    beforeAll(() => {
      file = Buffer.from('any_buffer');
      putObjectPromiseSpy = jest.fn();
      putObjectSpy = jest
        .fn()
        .mockImplementation(() => ({ promise: putObjectPromiseSpy }));
      mocked(S3).mockImplementation(
        jest.fn().mockImplementation(() => ({
          putObject: putObjectSpy
        }))
      );
    });

    it('should call put object with correct input', async () => {
      await sut.upload({ key, file });
      expect(putObjectSpy).toHaveBeenCalledWith({
        Bucket: bucket,
        Key: key,
        Body: file,
        ACL: 'public-read'
      });
      expect(putObjectSpy).toHaveBeenCalledTimes(1);
      expect(putObjectPromiseSpy).toHaveBeenCalledTimes(1);
    });

    it('should return imageUrl', async () => {
      const imageUrl = await sut.upload({ key, file });
      expect(imageUrl).toBe(`https://${bucket}.s3.amazonaws.com/${key}`);
    });

    it('should return encoded imageUrl', async () => {
      const imageUrl = await sut.upload({ key: 'any key', file });
      expect(imageUrl).toBe(`https://${bucket}.s3.amazonaws.com/any%20key`);
    });

    it('should rethow if putObject throws', async () => {
      const uploadError = new Error();
      putObjectPromiseSpy.mockRejectedValueOnce(uploadError);
      const promise = sut.upload({ key: 'any key', file });
      await expect(promise).rejects.toThrow(uploadError);
    });
  });

  describe('delete', () => {
    let deleteObjectPromiseSpy: jest.Mock;
    let deleteObjectSpy: jest.Mock;

    beforeAll(() => {
      deleteObjectPromiseSpy = jest.fn();
      deleteObjectSpy = jest
        .fn()
        .mockImplementation(() => ({ promise: deleteObjectPromiseSpy }));
      mocked(S3).mockImplementation(
        jest.fn().mockImplementation(() => ({
          deleteObject: deleteObjectSpy
        }))
      );
    });

    it('should call delete object with correct input', async () => {
      await sut.delete({ key });
      expect(deleteObjectSpy).toHaveBeenCalledWith({
        Bucket: bucket,
        Key: key
      });
      expect(deleteObjectSpy).toHaveBeenCalledTimes(1);
      expect(deleteObjectPromiseSpy).toHaveBeenCalledTimes(1);
    });

    it('should rethow if deleteObject throws', async () => {
      const deleteError = new Error();
      deleteObjectPromiseSpy.mockRejectedValueOnce(deleteError);
      const promise = sut.delete({ key: 'any key' });
      await expect(promise).rejects.toThrow(deleteError);
    });
  });
});