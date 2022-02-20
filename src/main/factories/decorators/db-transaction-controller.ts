import { Controller } from '@/application/controllers';
import { DbTransactionController } from '@/application/decorators';
import { makePgConnection } from '@/main/factories/repos/helpers';

export const makePgTransactionController = (
  controller: Controller
): DbTransactionController => {
  return new DbTransactionController(controller, makePgConnection());
};
