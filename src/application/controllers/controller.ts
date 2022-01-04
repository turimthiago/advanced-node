import { badRequest, HttpResponse, serverError } from '@/application/helpers';
import { UnknownError } from '@/application/errors';
import { ValidationComposite, Validator } from '@/application/validation';

export abstract class Controller {
  async handle(httpRequest: any): Promise<HttpResponse> {
    const error = this.validate(httpRequest);
    if (error !== undefined) {
      return badRequest(error);
    }
    try {
      const res = await this.perform(httpRequest);
      return res;
    } catch (error) {
      return serverError(new UnknownError());
    }
  }

  private validate(httpRequest: any): Error | undefined {
    return new ValidationComposite(
      this.buildersValidators(httpRequest)
    ).validate();
  }

  buildersValidators(httpRequest: any): Validator[] {
    return [];
  }

  abstract perform(httpRequest: any): Promise<HttpResponse>;
}
