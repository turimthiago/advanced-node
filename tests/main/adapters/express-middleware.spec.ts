import { Middleware } from '@/application/middlewares';
import { getMockReq, getMockRes } from '@jest-mock/express';
import { NextFunction, RequestHandler, Response, Request } from 'express';
import { mock, MockProxy } from 'jest-mock-extended';
import { adaptExpressMiddleware } from '@/main/adapters';

describe('ExpressMiddleware', () => {
  let middleware: MockProxy<Middleware>;
  let req: Request;
  let res: Response;
  let next: NextFunction;
  let sut: RequestHandler;

  beforeAll(() => {
    middleware = mock<Middleware>();
    middleware.handle.mockResolvedValue({
      statusCode: 200,
      data: {
        prop: 'any_data',
        emptyProp: '',
        nullProp: null,
        undefinedProp: undefined
      }
    });
    req = getMockReq({ headers: { any: 'any' } });
    res = getMockRes().res;
    next = getMockRes().next;
  });

  beforeEach(() => {
    sut = adaptExpressMiddleware(middleware);
  });

  it('should call handle with correct request', async () => {
    await sut(req, res, next);
    expect(middleware.handle).toHaveBeenCalledWith({ any: 'any' });
    expect(middleware.handle).toHaveBeenCalledTimes(1);
  });

  it('should call handle with empty request', async () => {
    req = getMockReq({});
    await sut(req, res, next);
    expect(middleware.handle).toHaveBeenCalledWith({});
    expect(middleware.handle).toHaveBeenCalledTimes(1);
  });

  it('should respons with correct error and status code', async () => {
    middleware.handle.mockResolvedValueOnce({
      statusCode: 500,
      data: new Error('any_error')
    });
    await sut(req, res, next);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ error: 'any_error' });
    expect(res.json).toHaveBeenCalledTimes(1);
  });

  it('should add valid data to request.locals', async () => {
    await sut(req, res, next);
    expect(req.locals).toEqual({ prop: 'any_data' });
    expect(next).toHaveBeenCalledTimes(1);
  });
});
