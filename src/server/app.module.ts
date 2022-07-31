import { AppController } from './app.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ShiftsModule } from './shifts/shifts.module';
import Next from 'next';
import { RenderModule } from 'nest-next';
import { NODE_ENV } from 'src/shared/constants/env';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'helix.sqlite',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, //TODO: Remove this line when in production
      autoLoadEntities: true,
    }),
    RenderModule.forRootAsync(Next({ dev: NODE_ENV === 'development' }), {
      viewsDir: null,
    }),
    ConfigModule.forRoot({
      envFilePath: `.env.${NODE_ENV}`,
      isGlobal: true,
    }),
    UsersModule,
    AuthModule,
    ShiftsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
