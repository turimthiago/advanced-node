import { HttpGetClient } from '@/infra/gateways';

import axios from 'axios';

export class AxiosHttClient implements HttpGetClient {
  async get({ url, params }: HttpGetClient.Params): Promise<any> {
    const result = await axios.get(url, {
      params: params
    });
    return result.data;
  }
}
