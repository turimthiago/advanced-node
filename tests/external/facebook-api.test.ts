import { AxiosHttClient, FacebookApi } from '@/infra/gateways';
import { env } from '@/main/config/env';

describe('FacebookApi Integration Tests', () => {
  let axiosClient: AxiosHttClient;
  let sut: FacebookApi;

  beforeEach(() => {
    axiosClient = new AxiosHttClient();
    sut = new FacebookApi(
      axiosClient,
      env.facebookApi.clientId,
      env.facebookApi.clientSecret
    );
  });

  it.only('should return a Facebook User if token is valid', async () => {
    const facebookUser = await sut.loadUser({
      token:
        'EAAIlI9Vl2qIBANYGCOxZB0q8IQHcq90a33Okr69gYvSt1qzmZB5uDRyZBdrkcrBCpFkbPxXuWLeGgJZC8p6PIz1YsmA44RgKm4hFP1OynXzVSyeZCJ9eG9hL9a30RFXORJcIvlDDLr0J8OTjTAZCX9Fkt12vuu97YK1UoRAVixlznzDTZClOLoIrgYLSmDg0qgmQx9vYjvE3f2ksdH0brU6'
    });
    expect(facebookUser).toEqual({
      facebookId: '282347256907122',
      email: '	turim_bmulwui_teste@tfbnw.net',
      name: '	Turim Teste'
    });
  });

  it('should return undefined if token is invalid', async () => {
    const axiosClient = new AxiosHttClient();
    const sut = new FacebookApi(
      axiosClient,
      env.facebookApi.clientId,
      env.facebookApi.clientSecret
    );
    const facebookUser = await sut.loadUser({
      token: 'infalid'
    });
    expect(facebookUser).toBeUndefined();
  });
});
