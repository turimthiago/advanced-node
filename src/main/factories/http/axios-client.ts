import { AxiosHttClient } from '@/infra/http';

export const makeAxiosHttpClient = (): AxiosHttClient => {
  return new AxiosHttClient();
};
