import { Authorize } from '@/domain/use-cases';
import { forbidden, HttpResponse } from '@/application/helpers';
import { RequiredStringValidator } from '@/application/validation';

type HttpRequest = { authorization: string };

class AuthenticationMiddleware {
  constructor(private readonly authorize: Authorize) {}

  async handle({
    authorization
  }: HttpRequest): Promise<HttpResponse<Error> | undefined> {
    const error = new RequiredStringValidator(
      authorization,
      'authorization'
    ).validate();
    if (error !== undefined) return forbidden();
    await this.authorize({ token: authorization });
  }
}

describe('AuthenticationMiddleware', () => {
  let sut: AuthenticationMiddleware;
  let authorization: string;
  let authorize: jest.Mock;

  beforeAll(() => {
    authorize = jest.fn();
    authorization = 'any_authorization_token';
  });

  beforeEach(() => {
    sut = new AuthenticationMiddleware(authorize);
  });

  it('should return 403 if authorization is empty', async () => {
    const response = await sut.handle({ authorization: '' });
    expect(response).toEqual(forbidden());
  });

  it('should return 403 if authorization is null', async () => {
    const response = await sut.handle({ authorization: null as any });
    expect(response).toEqual(forbidden());
  });

  it('should return 403 if authorization is undefined', async () => {
    const response = await sut.handle({ authorization: undefined as any });
    expect(response).toEqual(forbidden());
  });

  it('should call authorize with correct input', async () => {
    await sut.handle({ authorization });
    expect(authorize).toHaveBeenLastCalledWith({
      token: authorization
    });
    expect(authorize).toHaveBeenCalledTimes(1);
  });
});
