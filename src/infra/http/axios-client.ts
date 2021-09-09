import { HttpGetClient } from '@/infra/http';
import axios from 'axios';

export class AxiosHttClient implements HttpGetClient {
  async get(params: HttpGetClient.Params): Promise<any> {
    const result = await axios.get(params.url, { params: params.params });
    return result.data;
  }
}
