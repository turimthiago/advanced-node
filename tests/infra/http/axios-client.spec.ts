import { HttpGetClient } from "@/infra/http";
import axios from 'axios';

jest.mock('axios');

class AxiosHttClient {
  async get(params: HttpGetClient.Params): Promise<void> {
    await axios.get(params.url, {
      params: params.params
    })
  }
}

describe('AxiosHttClient', () => {
  describe('get', () => {
    it('should call get with correct values', async () => {
      const fakeAxios = axios as jest.Mocked<typeof axios>;
      const sut = new AxiosHttClient();
      await sut.get({
        url: 'any_url',
        params: {
          any: 'any'
        }
      });
      expect(fakeAxios.get).toHaveBeenCalledWith('any_url', {
        params: {
          any: 'any'
        }
      });
      expect(fakeAxios.get).toHaveBeenCalledTimes(1);
    });
  });
});
