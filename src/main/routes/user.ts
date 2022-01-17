import { Router } from 'express';
import { makeFacebookLoginController } from '@/main/factories/controllers';
import { adaptExpressRoute as adapt } from '@/main/adapters';
import { auth } from '../middlewares';

export default (router: Router): void => {
  router.delete('/users/picture', auth);
};
