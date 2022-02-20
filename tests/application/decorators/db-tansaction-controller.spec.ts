import { mock, MockProxy } from 'jest-mock-extended';
import { Controller } from '@/application/controllers';

class DbTransactionController {
  constructor(
    private readonly decoratee: Controller,
    private readonly dbTransaction: DbTransaction
  ) {}

  async perform(httpRequest: any): Promise<void> {
    await this.dbTransaction.openTransaction();
    await this.decoratee.perform(httpRequest);
    await this.dbTransaction.commit();
    await this.dbTransaction.closeTransaction();
  }
}

interface DbTransaction {
  openTransaction(): Promise<void>;
  closeTransaction(): Promise<void>;
  commit(): Promise<void>;
}

describe('DbTransactionController', () => {
  let decoratee: MockProxy<Controller>;
  let dbTransaction: MockProxy<DbTransaction>;
  let sut: DbTransactionController;

  beforeAll(() => {
    dbTransaction = mock();
    decoratee = mock();
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
    expect(dbTransaction.commit).toHaveBeenCalledWith();
    expect(dbTransaction.commit).toHaveBeenCalledTimes(1);
    expect(dbTransaction.closeTransaction).toHaveBeenCalledWith();
    expect(dbTransaction.closeTransaction).toHaveBeenCalledTimes(1);
  });
});
