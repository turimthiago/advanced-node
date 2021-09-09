import { mock } from "jest-mock-extended";
import { HttpGetClient } from "@/infra/http";
import { FacebookApi } from "@/infra/apis";

describe('FacebookApi', () => {
  let clientId: string;
  let clientSecret: string;
  let sut: FacebookApi;
  let httpClient: HttpGetClient;

  beforeAll(() => {
    httpClient = mock();
    clientId = 'any_client_id';
    clientSecret = 'any_client_secret';
  });

  beforeEach(() => {
    sut = new FacebookApi(httpClient, clientId, clientSecret);
  });

  it('should get app token', async () => {

    await sut.loadUser({ token: 'any_client_id' });
    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/oath/access_token',
      params: {
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'client_credentials'
      }
    });
  });
});
