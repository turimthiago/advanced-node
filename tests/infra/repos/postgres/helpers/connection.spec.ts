import {
  ConnectionNotFoundError,
  PgConnection
} from '@/infra/repos/postgres/helpers';
import { release } from 'os';

import { mocked } from 'ts-jest/utils';
import { createConnection, getConnection, getConnectionManager } from 'typeorm';

jest.mock('typeorm', () => ({
  Entity: jest.fn(),
  PrimaryGeneratedColumn: jest.fn(),
  Column: jest.fn(),
  createConnection: jest.fn(),
  getConnectionManager: jest.fn(),
  getConnection: jest.fn()
}));

describe('PgConnection', () => {
  let getConnectionManagerSpy: jest.Mock;
  let createQueryRunnerSpy: jest.Mock;
  let startTransactionSpy: jest.Mock;
  let releaseSpy: jest.Mock;
  let commitTransactionSpy: jest.Mock;
  let createConnectionSpy: jest.Mock;
  let getConnectionSpy: jest.Mock;
  let hasSpy: jest.Mock;
  let closeSpy: jest.Mock;
  let sut: PgConnection;

  beforeAll(() => {
    hasSpy = jest.fn().mockReturnValue(true);
    getConnectionManagerSpy = jest.fn().mockReturnValue({
      has: hasSpy
    });
    mocked(getConnectionManager).mockImplementation(getConnectionManagerSpy);
    startTransactionSpy = jest.fn();
    commitTransactionSpy = jest.fn();
    releaseSpy = jest.fn();
    createQueryRunnerSpy = jest.fn().mockReturnValue({
      startTransaction: startTransactionSpy,
      release: releaseSpy,
      commitTransaction: commitTransactionSpy
    });
    createConnectionSpy = jest.fn().mockResolvedValue({
      createQueryRunner: createQueryRunnerSpy
    });
    mocked(createConnection).mockImplementation(createConnectionSpy);
    closeSpy = jest.fn();
    getConnectionSpy = jest.fn().mockReturnValue({
      createQueryRunner: createQueryRunnerSpy,
      close: closeSpy
    });
    mocked(getConnection).mockImplementation(getConnectionSpy);
  });

  beforeEach(() => {
    sut = PgConnection.getInstance();
  });

  it('should have only one instance', () => {
    const sut2 = PgConnection.getInstance();
    expect(sut).toBe(sut2);
  });

  it('should create a new connection', async () => {
    hasSpy.mockReturnValueOnce(false);
    await sut.connect();
    expect(createConnectionSpy).toHaveBeenCalledWith();
    expect(createConnectionSpy).toHaveBeenCalledTimes(1);
    expect(createQueryRunnerSpy).toHaveBeenCalledWith();
    expect(createQueryRunnerSpy).toHaveBeenCalledTimes(1);
  });

  it('should use an existing connection', async () => {
    await sut.connect();
    expect(getConnectionSpy).toHaveBeenCalledWith();
    expect(getConnectionSpy).toHaveBeenCalledTimes(1);
    expect(createConnectionSpy).not.toHaveBeenCalled();
    expect(createQueryRunnerSpy).toHaveBeenCalledWith();
    expect(createQueryRunnerSpy).toHaveBeenCalledTimes(1);
  });

  it('should close connection', async () => {
    await sut.connect();
    await sut.disconnect();
    expect(closeSpy).toHaveBeenCalledWith();
    expect(closeSpy).toHaveBeenCalledTimes(1);
  });

  it('should return ConnectionNotFoundError on disconnect if connection is not found', async () => {
    const promise = sut.disconnect();
    await expect(promise).rejects.toThrow(new ConnectionNotFoundError());
    expect(closeSpy).not.toHaveBeenCalled();
  });

  it('should open transaction', async () => {
    await sut.connect();
    await sut.openTransaction();
    expect(startTransactionSpy).toHaveBeenCalledWith();
    expect(startTransactionSpy).toHaveBeenCalledTimes(1);
    await sut.disconnect();
  });

  it('should return ConnectionNotFoundError on open transaction if connection is not found', async () => {
    const promise = sut.openTransaction();
    await expect(promise).rejects.toThrow(new ConnectionNotFoundError());
    expect(startTransactionSpy).not.toHaveBeenCalled();
  });

  it('should close transaction', async () => {
    await sut.connect();
    await sut.closeTransaction();
    expect(releaseSpy).toHaveBeenCalledWith();
    expect(releaseSpy).toHaveBeenCalledTimes(1);
    await sut.disconnect();
  });

  it('should return ConnectionNotFoundError on close transaction if connection is not found', async () => {
    const promise = sut.closeTransaction();
    await expect(promise).rejects.toThrow(new ConnectionNotFoundError());
    expect(releaseSpy).not.toHaveBeenCalled();
  });

  it('should commit transaction', async () => {
    await sut.connect();
    await sut.commit();
    expect(commitTransactionSpy).toHaveBeenCalledWith();
    expect(commitTransactionSpy).toHaveBeenCalledTimes(1);
    await sut.disconnect();
  });

  it('should return ConnectionNotFoundError on commit transaction if connection is not found', async () => {
    const promise = sut.commit();
    await expect(promise).rejects.toThrow(new ConnectionNotFoundError());
    expect(commitTransactionSpy).not.toHaveBeenCalled();
  });
});
