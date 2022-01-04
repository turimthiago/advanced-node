import { HttpResponse, ok, unauthorized } from '@/application/helpers';
import { ValidationBuilder, Validator } from '../validation';
import { Controller } from '@/application/controllers';
import { FacebookAuthentication } from '@/domain/use-cases';

type HttpRequest = { token: string };
type Model = Error | { accessToken: string };

export class FacebookLoginController extends Controller {
  constructor(private readonly facebookAuthentication: FacebookAuthentication) {
    super();
  }

  async perform({ token }: HttpRequest): Promise<HttpResponse<Model>> {
    try {
      const accessToken = await this.facebookAuthentication({
        token
      });
      return ok(accessToken);
    } catch (error) {
      return unauthorized();
    }
  }

  override buildersValidators({ token }: HttpRequest): Validator[] {
    return [
      ...ValidationBuilder.of({
        value: token,
        fieldName: 'token'
      })
        .required()
        .build()
    ];
  }
}
