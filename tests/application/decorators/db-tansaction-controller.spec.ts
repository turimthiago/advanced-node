import { Controller } from '@/application/controllers';
import { DbTransactionController } from '@/application/decorators';
import { DbTransaction } from '@/application/contracts';

import { mock, MockProxy } from 'jest-mock-extended';

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

  it('should extends Conroller', async () => {
    expect(sut).toBeInstanceOf(Controller);
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
    decoratee.perform.mockRejectedValueOnce(new Error('decoratee_error'));
    sut.perform({ any: 'any' }).catch(() => {
      expect(dbTransaction.commit).not.toHaveBeenCalled();
      expect(dbTransaction.rollback).toHaveBeenCalledWith();
      expect(dbTransaction.rollback).toHaveBeenCalledTimes(1);
      expect(dbTransaction.closeTransaction).toHaveBeenCalledWith();
      expect(dbTransaction.closeTransaction).toHaveBeenCalledTimes(1);
    });
  });

  it('should retun same result as decoratee on success', async () => {
    const httpReponse = await sut.perform({ any: 'any' });
    expect(httpReponse).toEqual({ statusCode: 204, data: null });
  });

  it('should rethrow if decoratee throws', async () => {
    const decorateeError = new Error('decoratee_error');
    decoratee.perform.mockRejectedValueOnce(decorateeError);
    const promise = sut.perform({ any: 'any' });
    expect(promise).rejects.toThrow(decorateeError);
  });
});
