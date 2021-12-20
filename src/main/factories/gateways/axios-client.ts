import { AxiosHttClient } from '@/infra/gateways';

export const makeAxiosHttpClient = (): AxiosHttClient => {
  return new AxiosHttClient();
};
