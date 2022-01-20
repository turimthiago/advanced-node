import { auth } from '@/main/middlewares/authentication';

import { Router } from 'express';
import { makeDeletePictureController } from '../factories/controllers';
import { adaptExpressRoute as adapt } from '@/main/adapters';

export default (router: Router): void => {
  router.delete('/users/picture', auth, adapt(makeDeletePictureController()));
};
