import {
  badRequest,
  HttpResponse,
  ok,
  serverError,
  unauthorized
} from '@/application/helpers';
import { FacebookAuthentication } from '@/domain/features';
import { AccessToken } from '@/domain/models';
import { RequiredFieldError, UnknownError } from '@/application/errors';

export class FacebookLoginController {
  constructor(
    private readonly facebookAuthentication: FacebookAuthentication
  ) {}

  async handle(httpRequest: any): Promise<HttpResponse> {
    try {
      if (
        httpRequest.token === '' ||
        httpRequest.token === null ||
        httpRequest.token === undefined
      ) {
        return badRequest(new RequiredFieldError('token'));
      }
      const accessToken = await this.facebookAuthentication.perform({
        token: httpRequest.token
      });
      if (accessToken instanceof AccessToken) {
        return ok({ accessToken: accessToken.value });
      }
      return unauthorized();
    } catch (error) {
      if (error instanceof Error) return serverError(error);
      return serverError(new UnknownError());
    }
  }
}
