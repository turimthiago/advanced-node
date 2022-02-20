import { mock, MockProxy } from 'jest-mock-extended';

class DbTransactionController {
  constructor(private readonly dbTransaction: DbTransaction) {}

  async perform(httpRequest: any): Promise<void> {
    this.dbTransaction.openTransaction();
  }
}

interface DbTransaction {
  openTransaction(): Promise<void>;
}

describe('DbTransactionController', () => {
  let dbTransaction: MockProxy<DbTransaction>;
  let sut: DbTransactionController;

  beforeAll(() => {
    dbTransaction = mock();
  });

  beforeEach(() => {
    sut = new DbTransactionController(dbTransaction);
  });

  it('should open transaction', async () => {
    await sut.perform({ any: 'any' });
    expect(dbTransaction.openTransaction).toHaveBeenCalledWith();
    expect(dbTransaction.openTransaction).toHaveBeenCalledTimes(1);
  });
});
