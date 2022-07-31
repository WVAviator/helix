import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { Controller, Get, Render, UseGuards } from '@nestjs/common';
import { CurrentUser } from './auth/currentuser.decorator';

@Controller()
export class AppController {
  @Get()
  @Render('index')
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
  @Render('dashboard')
  dashboard(@CurrentUser() currentUser) {
    console.log('Controller:', currentUser);

    return currentUser;
  }
}
