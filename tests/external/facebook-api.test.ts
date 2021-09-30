import { FacebookApi } from '@/infra/apis';
import { AxiosHttClient } from '@/infra/http';
import { env } from '@/main/config/env';

describe('FacebookApi Integration Tests', () => {
  it('should return a Facebook User if token is valid', async () => {
    const axiosClient = new AxiosHttClient();
    const sut = new FacebookApi(
      axiosClient,
      env.facebookApi.clientId,
      env.facebookApi.clientSecret
    );
    const facebookUser = await sut.loadUser({
      token:
        'EAAIlI9Vl2qIBANakwcdG1MmannL3AvHkZBAbVCH72s0H38mmlkNUhBS53yvkkc4YZAfuvhxm2lZCVCqHENH1SvLcXHCmvXgJqXZCok53zGDUB4f0PjwxMIE6sZAE291Of3YoLmdGUW44bqcBg4EB9VQHBOUeKaHZAL1r6qUJlTbZCTsCrnXhHwbmFUYRiU12tLjY8X3oGymHKsVR0q5IKvi'
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
