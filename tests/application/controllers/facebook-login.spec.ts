import { AuthenticationError } from '@/domain/entities/errors';
import { FacebookLoginController } from '@/application/controllers';
import { UnauthorizedError } from '@/application/errors';
import { RequiredStringValidator } from '@/application/validation';

describe('FacebookLoginController', () => {
  let sut: FacebookLoginController;
  let facebookAuthentication: jest.Mock;
  let token: string;

  beforeAll(() => {
    token = 'any_token';
    facebookAuthentication = jest.fn();
    facebookAuthentication.mockResolvedValue({ accessToken: 'any_value' });
  });

  beforeEach(() => {
    sut = new FacebookLoginController(facebookAuthentication);
  });

  it('should build validators correctly', async () => {
    const validators = sut.buildersValidators({ token });
    expect(validators).toEqual([
      new RequiredStringValidator('any_token', 'token')
    ]);
  });

  it('should call FacebookAuthentication with correct params', async () => {
    await sut.handle({ token });
    expect(facebookAuthentication).toHaveBeenCalledWith({
      token
    });
    expect(facebookAuthentication).toHaveBeenCalledTimes(1);
  });

  it('should return 401 if authentication fails', async () => {
    facebookAuthentication.mockRejectedValueOnce(new AuthenticationError());
    const httpResponse = await sut.handle({ token });
    expect(httpResponse).toEqual({
      statusCode: 401,
      data: new UnauthorizedError()
    });
  });

  it('should return 200 if authentication succeeds', async () => {
    const httpResponse = await sut.handle({ token });
    expect(httpResponse).toEqual({
      statusCode: 200,
      data: {
        accessToken: 'any_value'
      }
    });
  });
});