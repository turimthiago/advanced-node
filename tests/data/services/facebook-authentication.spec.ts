import { AuthenticationError } from '@/domain/errors';
import { FacebookAuthenticationService } from '@/data/services';
import { mock, MockProxy } from 'jest-mock-extended';
import { LoadFacebookUserApi } from '../contracts/apis/facebook';
import {
  CreateFacebookAccountRepository,
  LoadUserAccountRepository
} from '@/data/repos';

describe('Facebook AuthenticationService', () => {
  let facebookApi: MockProxy<LoadFacebookUserApi>;
  let userAccountRepository: MockProxy<
  LoadUserAccountRepository & CreateFacebookAccountRepository
  >;
  let sut: FacebookAuthenticationService;
  const token = { token: 'any_token' };

  beforeEach(() => {
    facebookApi = mock<LoadFacebookUserApi>();
    userAccountRepository = mock<
    LoadUserAccountRepository & CreateFacebookAccountRepository
    >();
    facebookApi.loadUser.mockResolvedValue({
      name: 'any_name',
      email: 'any_facebook@mail.com',
      facebookId: 'any_id'
    });
    sut = new FacebookAuthenticationService(facebookApi, userAccountRepository);
  });

  it('should call LoadFacebookUserApi with correct values', async () => {
    await sut.perform(token);
    expect(facebookApi.loadUser).toHaveBeenCalledWith(token);
    expect(facebookApi.loadUser).toHaveBeenCalledTimes(1);
  });

  it('should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    facebookApi.loadUser.mockResolvedValueOnce(undefined);
    const authResult = await sut.perform(token);
    expect(authResult).toEqual(new AuthenticationError());
  });

  it('should call LoadUserByEmailRepo when LoadFacebookUserApi returns data', async () => {
    await sut.perform(token);
    expect(userAccountRepository.load).toHaveBeenCalledWith({
      email: 'any_facebook@mail.com'
    });
    expect(userAccountRepository.load).toHaveBeenCalledTimes(1);
  });

  it('should call CreateUserByEmailRepo when LoadUserAccountRepo returns undefined', async () => {
    userAccountRepository.load.mockResolvedValueOnce(undefined);
    await sut.perform(token);
    expect(userAccountRepository.createFromFacebook).toHaveBeenCalledWith({
      email: 'any_facebook@mail.com',
      facebookId: 'any_id',
      name: 'any_name'
    });
    expect(userAccountRepository.createFromFacebook).toHaveBeenCalledTimes(1);
  });
});
