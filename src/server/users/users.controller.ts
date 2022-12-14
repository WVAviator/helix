import { JwtAuthGuard } from './../auth/jwt-auth.guard';
import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { RolesGuard } from '../rbac/role.guard';
import { Role } from '../rbac/role.enum';
import { RequireRole } from '../rbac/role.decorator';
import { User } from './entities/user.entity';
import { CurrentUser } from '../auth/currentuser.decorator';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('users/me')
  @UseGuards(JwtAuthGuard)
  getCurrentUser(@CurrentUser() user: User) {
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('users')
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('users/:id')
  findOne(@Param('id') id: string) {
    return this.usersService.findById(+id);
  }

  @RequireRole(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('users/:id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: Partial<UpdateUserDto>,
  ) {
    return this.usersService.update(+id, updateUserDto);
  }

  @RequireRole(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete('users/:id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
