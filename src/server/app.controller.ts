import { RedirectInterceptor } from './auth/interceptors/redirect.interceptor';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import {
  Controller,
  Get,
  Render,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CurrentUser } from './auth/currentuser.decorator';
import { UnauthorizedExceptionFilter } from './auth/unauthorized.filter';

@Controller()
export class AppController {
  @Get()
  @UseInterceptors(new RedirectInterceptor('/dashboard'))
  home() {
    return {};
  }

  @Get('login')
  @Render('login')
  login() {
    return {};
  }

  @Get('dashboard')
  @UseGuards(JwtAuthGuard)
  @UseFilters(UnauthorizedExceptionFilter)
  @Render('dashboard')
  dashboard(@CurrentUser() currentUser) {
    console.log('Controller:', currentUser);

    return currentUser;
  }
}
