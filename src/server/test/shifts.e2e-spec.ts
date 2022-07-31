import cookieParser from 'cookie-parser';
import { ShiftDto } from '../shifts/dto/create-shift.dto';
import { Role } from './../rbac/role.enum';
import { generateRequest } from './helpers/e2e-requests';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { ShiftsModule } from '../shifts/shifts.module';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from './../users/users.module';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from './../users/entities/user.entity';
import { Shift } from '../shifts/entities/shift.entity';
import { Repository } from 'typeorm';
import { INestApplication } from '@nestjs/common';
import { NODE_ENV } from '../../shared/constants/env';
describe('ShiftsController e2e', () => {
  let app: INestApplication;
  let cookie: string;
  let shiftsRepository: Repository<Shift>;
  let usersRepository: Repository<User>;
  let users: User[];
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
    shiftsRepository = app.get<Repository<Shift>>(getRepositoryToken(Shift));

    await app.init();

    const newUsers = [
      {
        email: 'abc123@abc.com',
        password: 'Awkward57!',
        firstName: 'Peter',
        lastName: 'Griffin',
      },
      {
        email: 'abc124@abc.com',
        password: 'Awkward57!',
        firstName: 'Lois',
        lastName: 'Griffin',
      },
      {
        email: 'abc125@abc.com',
        password: 'Awkward57!',
        firstName: 'Brian',
        lastName: 'Griffin',
      },
      {
        email: 'abc126@abc.com',
        password: 'Awkward57!',
        firstName: 'Meg',
        lastName: 'Griffin',
      },
    ];

    users = await Promise.all(
      newUsers.map(async (u) => {
        const response = await generateRequest(app, 'post', '/auth/signup', u);
        const user: User = response.body;
        return user;
      }),
    );

    cookie = await login(newUsers[0].email, newUsers[0].password);

    await usersRepository.save({ ...users[0], role: Role.MANAGER });
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
    await shiftsRepository.clear();
    await logout(cookie);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should properly set up a test environment with one manager and three employees', async () => {
    const users: User[] = (
      await generateRequest(app, 'get', '/users', null, cookie)
    ).body;

    expect(users.length).toEqual(4);
    expect(users.filter((u) => u.role === Role.MANAGER).length).toEqual(1);
    expect(users.filter((u) => u.role === Role.USER).length).toEqual(3);
  });

  it('should allow the manager to create multiple shifts and then assign them', async () => {
    let shiftDtos: ShiftDto[] = [];
    for (let i = 1; i < 5; i++) {
      const shift: ShiftDto = {
        name: 'Day Shift',
        start: new Date(2020, 0, i, 8, 0, 0),
        end: new Date(2020, 0, i, 17, 0, 0),
      };
      shiftDtos.push(shift);
    }

    const createShiftsResponse = await generateRequest(
      app,
      'post',
      '/shifts',
      { shifts: shiftDtos },
      cookie,
    );

    const shifts: Shift[] = createShiftsResponse.body;

    expect(shifts.length).toEqual(4);
    expect(shifts.filter((s) => !s.user).length).toEqual(4);

    const getUnassignedResponse = await generateRequest(
      app,
      'get',
      '/shifts/unassigned',
      null,
      cookie,
    );
    const unassigned: Shift[] = getUnassignedResponse.body;
    expect(unassigned.length).toEqual(4);

    const assignShiftsResponse = await generateRequest(
      app,
      'post',
      '/shifts/assign',
      {
        shiftIds: shifts.map((s) => s.id),
        userId: users[1].id,
      },
      cookie,
    );

    const assignedShifts: Shift[] = assignShiftsResponse.body;

    expect(assignedShifts.length).toEqual(4);
    expect(
      assignedShifts.filter((s) => s.user.id === users[1].id).length,
    ).toEqual(4);

    const getOpenShiftsResponse = await generateRequest(
      app,
      'get',
      '/shifts/unassigned',
      null,
      cookie,
    );
    const openShifts: Shift[] = getOpenShiftsResponse.body;

    expect(openShifts.length).toEqual(0);

    const getAssignedShiftsResponse = await generateRequest(
      app,
      'get',
      `/shifts/user/${users[1].id}`,
      null,
      cookie,
    );

    const assignedShiftsForUser: Shift[] = getAssignedShiftsResponse.body;
    expect(assignedShiftsForUser.length).toEqual(4);

    await generateRequest(
      app,
      'post',
      '/shifts/assign',
      {
        shiftIds: assignedShiftsForUser.map((s) => s.id),
      },
      cookie,
    );

    const getUnassignedShiftsResponse = await generateRequest(
        app,
        'get',
        '/shifts/unassigned',
        null,
        cookie,
      ),
      unassignedShifts: Shift[] = getUnassignedShiftsResponse.body;
    expect(unassignedShifts.length).toEqual(4);

    const deleteShiftResponse = await generateRequest(
      app,
      'delete',
      `/shifts/${shifts[0].id}`,
      null,
      cookie,
    );
    expect(deleteShiftResponse.status).toEqual(200);

    const getShiftsResponse = await generateRequest(
      app,
      'get',
      '/shifts',
      null,
      cookie,
    );
    const allShifts: Shift[] = getShiftsResponse.body;
    expect(allShifts.length).toEqual(3);
  });
});
