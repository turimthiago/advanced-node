import axios from 'axios';
import { AxiosHttClient } from '@/infra/gateways';

jest.mock('axios');

describe('AxiosHttClient', () => {
  let sut: AxiosHttClient;
  let fakeAxios: jest.Mocked<typeof axios>;
  let url: string;
  let params: object;

  beforeEach(() => {
    url = 'any_url';
    params = { any: 'any' };
    fakeAxios = axios as jest.Mocked<typeof axios>;
    fakeAxios.get.mockResolvedValue({ status: 200, data: 'any_data' });
    sut = new AxiosHttClient();
  });

  describe('get', () => {
    it('should call get with correct values', async () => {
      await sut.get({ url, params });
      expect(fakeAxios.get).toHaveBeenCalledWith(url, { params });
      expect(fakeAxios.get).toHaveBeenCalledTimes(1);
    });

    it('should return data on success', async () => {
      const result = await sut.get({ url, params });
      expect(result).toEqual('any_data');
    });

    it('should rethrow if get axios throws', async () => {
      fakeAxios.get.mockRejectedValueOnce(new Error('http_error'));
      const promise = sut.get({ url, params });
      expect(promise).rejects.toThrow(new Error('http_error'));
    });
  });
});
