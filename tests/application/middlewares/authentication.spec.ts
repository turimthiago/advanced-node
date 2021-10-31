import { forbidden, HttpResponse } from '@/application/helpers';

type HttpRequest = { authorization: string };

class AuthenticationMiddleware {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse<Error>> {
    return forbidden();
  }
}

describe('AuthenticationMiddleware', () => {
  it('should return 403 if authorization is empty', async () => {
    const sut = new AuthenticationMiddleware();
    const response = await sut.handle({ authorization: '' });
    expect(response).toEqual(forbidden());
  });

  it('should return 403 if authorization is null', async () => {
    const sut = new AuthenticationMiddleware();
    const response = await sut.handle({ authorization: null as any });
    expect(response).toEqual(forbidden());
  });

  it('should return 403 if authorization is undefined', async () => {
    const sut = new AuthenticationMiddleware();
    const response = await sut.handle({ authorization: undefined as any });
    expect(response).toEqual(forbidden());
  });
});
