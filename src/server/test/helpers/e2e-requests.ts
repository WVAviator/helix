import { INestApplication } from '@nestjs/common';
import supertest from 'supertest';

type RequestMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';

export const generateRequest = async (
  app: INestApplication,
  method: RequestMethod,
  path: string,
  body: any = null,
  cookie: string = null,
) => {
  let req = supertest(app.getHttpServer())[method](path);
  if (cookie) {
    req = req.set('Cookie', cookie);
  }
  const res = body ? await req.send(body) : await req.send();
  return res;
};
