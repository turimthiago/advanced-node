import { ServerError } from '@/application/errors';
import { ValidationComposite } from '@/application/validation';
import { HttpResponse } from '@/application/helpers';
import { Controller } from '@/application/controllers';

import { mocked } from 'ts-jest/utils';

jest.mock('@/application/validation/composite');

class ControllerStub extends Controller {
  result: HttpResponse = {
    statusCode: 200,
    data: 'any_date'
  };
  async perform(httpRequest: any): Promise<HttpResponse> {
    return this.result;
  }
}

describe('Controller', () => {
  let sut: ControllerStub;

  beforeEach(() => {
    sut = new ControllerStub();
  });

  it('should return 400 if validation fails', async () => {
    const error = new Error('validation_error');
    const ValidationCompositeSpy = jest.fn().mockImplementationOnce(() => ({
      validate: jest.fn().mockReturnValue(error)
    }));
    mocked(ValidationComposite).mockImplementationOnce(ValidationCompositeSpy);
    const httpResponse = await sut.handle('any_value');
    expect(ValidationCompositeSpy).toHaveBeenCalledWith([]);
    expect(httpResponse).toEqual({
      statusCode: 400,
      data: error
    });
  });

  it('should return 500 if perform throws', async () => {
    const error = new Error('perform_error');
    jest.spyOn(sut, 'perform').mockRejectedValueOnce(error);
    const httpResponse = await sut.handle('any_value');
    expect(httpResponse).toEqual({
      statusCode: 500,
      data: new ServerError(error)
    });
  });

  it('should return same result as perform', async () => {
    const httpResponse = await sut.handle('any_value');
    expect(httpResponse).toEqual(sut.result);
  });
});
