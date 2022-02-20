import { mock, MockProxy } from 'jest-mock-extended';
import { Controller } from '@/application/controllers';
import { HttpResponse } from '../helpers';

class DbTransactionController {
  constructor(
    private readonly decoratee: Controller,
    private readonly dbTransaction: DbTransaction
  ) {}

  async perform(httpRequest: any): Promise<HttpResponse | undefined> {
    try {
      await this.dbTransaction.openTransaction();
      const httpResponse = await this.decoratee.perform(httpRequest);
      await this.dbTransaction.commit();
      await this.dbTransaction.closeTransaction();
      return httpResponse;
    } catch (error) {
      await this.dbTransaction.rollback();
      await this.dbTransaction.closeTransaction();
    }
  }
}

interface DbTransaction {
  openTransaction(): Promise<void>;
  closeTransaction(): Promise<void>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
}

describe('DbTransactionController', () => {
  let decoratee: MockProxy<Controller>;
  let dbTransaction: MockProxy<DbTransaction>;
  let sut: DbTransactionController;

  beforeAll(() => {
    dbTransaction = mock();
    decoratee = mock();
    decoratee.perform.mockResolvedValue({ statusCode: 204, data: null });
  });

  beforeEach(() => {
    sut = new DbTransactionController(decoratee, dbTransaction);
  });

  it('should open transaction', async () => {
    await sut.perform({ any: 'any' });
    expect(dbTransaction.openTransaction).toHaveBeenCalledWith();
    expect(dbTransaction.openTransaction).toHaveBeenCalledTimes(1);
  });

  it('should execute decoratee', async () => {
    await sut.perform({ any: 'any' });
    expect(decoratee.perform).toHaveBeenCalledWith({ any: 'any' });
    expect(decoratee.perform).toHaveBeenCalledTimes(1);
  });

  it('should call commit end close transaction on success', async () => {
    await sut.perform({ any: 'any' });
    expect(dbTransaction.rollback).not.toHaveBeenCalled();
    expect(dbTransaction.commit).toHaveBeenCalledWith();
    expect(dbTransaction.commit).toHaveBeenCalledTimes(1);
    expect(dbTransaction.closeTransaction).toHaveBeenCalledWith();
    expect(dbTransaction.closeTransaction).toHaveBeenCalledTimes(1);
  });

  it('should call rollback end close transaction on failure', async () => {
    decoratee.perform.mockRejectedValueOnce(new Error('decoratee'));
    await sut.perform({ any: 'any' });
    expect(dbTransaction.commit).not.toHaveBeenCalled();
    expect(dbTransaction.rollback).toHaveBeenCalledWith();
    expect(dbTransaction.rollback).toHaveBeenCalledTimes(1);
    expect(dbTransaction.closeTransaction).toHaveBeenCalledWith();
    expect(dbTransaction.closeTransaction).toHaveBeenCalledTimes(1);
  });

  it('should retun same result as decoratee on success', async () => {
    const httpReponse = await sut.perform({ any: 'any' });
    expect(httpReponse).toEqual({ statusCode: 204, data: null });
  });
});
