import { HttpGetClient } from '@/infra/http';
import axios from 'axios';

jest.mock('axios');

class AxiosHttClient {
  async get(params: HttpGetClient.Params): Promise<void> {
    await axios.get(params.url, {
      params: params.params
    });
  }
}

describe('AxiosHttClient', () => {
  let sut: AxiosHttClient;
  let fakeAxios: jest.Mocked<typeof axios>;
  let url: string;
  let params: object;

  beforeEach(() => {
    url = 'any_url';
    params = { any: 'any' };
    fakeAxios = axios as jest.Mocked<typeof axios>;
    sut = new AxiosHttClient();
  });

  describe('get', () => {
    it('should call get with correct values', async () => {
      await sut.get({ url, params });
      expect(fakeAxios.get).toHaveBeenCalledWith(url, { params });
      expect(fakeAxios.get).toHaveBeenCalledTimes(1);
    });
  });
});
