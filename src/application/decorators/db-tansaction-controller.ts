import { Controller } from '@/application/controllers';
import { DbTransaction } from '@/application/contracts';
import { HttpResponse } from '@/application/helpers';

export class DbTransactionController extends Controller {
  constructor(
    private readonly decoratee: Controller,
    private readonly dbTransaction: DbTransaction
  ) {
    super();
  }

  async perform(httpRequest: any): Promise<HttpResponse> {
    try {
      await this.dbTransaction.openTransaction();
      const httpResponse = await this.decoratee.perform(httpRequest);
      await this.dbTransaction.commit();
      return httpResponse;
    } catch (error) {
      await this.dbTransaction.rollback();
      throw error;
    } finally {
      await this.dbTransaction.closeTransaction();
    }
  }
}
