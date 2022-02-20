import { mock } from 'jest-mock-extended';

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
  it('should open transaction', async () => {
    const db = mock<DbTransaction>();
    const sut = new DbTransactionController(db);
    await sut.perform({ any: 'any' });
    expect(db.openTransaction).toHaveBeenCalledWith();
    expect(db.openTransaction).toHaveBeenCalledTimes(1);
  });
});
