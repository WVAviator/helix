import { Role } from './../rbac/role.enum';
import { RolesGuard } from './../rbac/role.guard';
import { SetRoleDto } from './dto/set-role.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import {
  Body,
  Controller,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { RequireRole } from '../rbac/role.decorator';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.createUser(createUserDto);
  }

  @RequireRole(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('roles')
  async setRole(@Body() setRoleDto: SetRoleDto) {
    return this.authService.setRole(setRoleDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Res({ passthrough: true }) response: Response) {
    const { access_token } = await this.authService.login(req.user);
    response.cookie('helix_access_token', access_token, {
      maxAge: 3600000,
      signed: true,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('helix_access_token');
  }
}
