import cookieParser from 'cookie-parser';
import { ShiftsModule } from '../shifts/shifts.module';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from './../users/users.module';
import { ConfigModule } from '@nestjs/config';
import { generateRequest } from './helpers/e2e-requests';
import { Role } from './../rbac/role.enum';
import { Shift } from '../shifts/entities/shift.entity';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { User } from './../users/entities/user.entity';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { NODE_ENV } from '../../shared/constants/env';

describe('AuthController e2e', () => {
  let app: INestApplication;
  let usersRepository: Repository<User>;
  let cookie;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: `.env.${NODE_ENV}`,
          isGlobal: true,
        }),
        UsersModule,
        AuthModule,
        ShiftsModule,
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: 'e2e.sqlite',
          entities: [User, Shift],
          logging: false,
          synchronize: true,
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser('abc'));

    usersRepository = app.get<Repository<User>>(getRepositoryToken(User));

    await app.init();
  });

  const login = async (email: string, password: string) => {
    const res = await generateRequest(app, 'post', '/auth/login', {
      email,
      password,
    });
    return res.header['set-cookie'];
  };

  const logout = async (cookie: string) => {
    const res = await generateRequest(app, 'post', '/auth/logout', cookie);
    cookie = undefined;
    return res;
  };

  afterEach(async () => {
    await usersRepository.clear();
    await logout(cookie);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should not allow login if the user does not exist', async () => {
    const res = await generateRequest(app, 'post', '/auth/login', {
      email: 'abcdefg@abcdefg.com',
      password: 'test',
    });
    expect(res.status).toEqual(401);
  });

  it('sets a cookie upon login', async () => {
    const newUser = {
      email: 'abc123@abc.com',
      password: 'Awkward57!',
      firstName: 'Joe',
      lastName: 'Test',
    };

    await generateRequest(app, 'post', '/auth/signup', newUser);

    cookie = await login(newUser.email, newUser.password);

    expect(cookie).toBeDefined();
  });

  it('should not allow access to guarded routes unless signed in', async () => {
    const newUser = {
      email: 'abc123@abc.com',
      password: 'Awkward57!',
      firstName: 'Joe',
      lastName: 'Test',
    };

    const signedUpUser = (
      await generateRequest(app, 'post', '/auth/signup', newUser)
    ).body;

    expect((await generateRequest(app, 'get', '/users/me')).status).toEqual(
      401,
    );

    cookie = await login(newUser.email, newUser.password);

    const retrievedUser = (
      await generateRequest(app, 'get', '/users/me', null, cookie)
    ).body;

    expect(retrievedUser.id).toEqual(signedUpUser.id);
  });

  it('deleting users requires admin priviliges', async () => {
    const adminUser = {
      email: 'abc123@abc.com',
      password: 'Awkward57!',
      firstName: 'Joe',
      lastName: 'Test',
    };
    const deleteUser = {
      email: 'deleteme@abc.com',
      password: 'Awkward57!',
      firstName: 'Don',
      lastName: 'Test',
    };
    const adminUserSaved = (
      await generateRequest(app, 'post', '/auth/signup', adminUser)
    ).body;
    const deleteUserSaved = (
      await generateRequest(app, 'post', '/auth/signup', deleteUser)
    ).body;

    cookie = await login(adminUser.email, adminUser.password);
    const deleteAttemptResponse = await generateRequest(
      app,
      'delete',
      `/users/${deleteUserSaved.id}`,
      null,
      cookie,
    );
    expect(deleteAttemptResponse.status).toEqual(403);

    await usersRepository.save({ ...adminUserSaved, role: Role.ADMIN });

    const deleteAttemptResponse2 = await generateRequest(
      app,
      'delete',
      `/users/${deleteUserSaved.id}`,
      null,
      cookie,
    );
    expect(deleteAttemptResponse2.status).toEqual(200);

    const retrievedUserResponse = await generateRequest(
      app,
      'get',
      `/users/${deleteUserSaved.id}`,
      null,
      cookie,
    );
    expect(retrievedUserResponse.status).toEqual(404);
  });
});
