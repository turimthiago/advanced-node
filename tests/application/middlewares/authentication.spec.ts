import { forbidden } from '@/application/helpers';
import { AuthenticationMiddleware } from '@/application/middlewares';

describe('AuthenticationMiddleware', () => {
  let sut: AuthenticationMiddleware;
  let authorization: string;
  let authorize: jest.Mock;

  beforeAll(() => {
    authorization = 'any_authorization_token';
    authorize = jest.fn().mockResolvedValue('any_user_id');
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

  it('should return 403 if authorize throws', async () => {
    authorize.mockRejectedValueOnce(new Error('any_error'));
    const response = await sut.handle({ authorization });
    expect(response).toEqual(forbidden());
  });

  it('should return 200 with userId on success', async () => {
    const response = await sut.handle({ authorization });
    expect(response).toEqual({
      statusCode: 200,
      data: { userId: 'any_user_id' }
    });
  });
});
