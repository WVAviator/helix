import { ShiftsService } from './shifts/shifts.service';
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
  constructor(private shiftsService: ShiftsService) {}

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
  async dashboard(@CurrentUser() currentUser) {
    const shifts = await this.shiftsService.findAssigned(currentUser.id);

    const query = {
      user: {
        ...currentUser,
      },
      shifts: shifts.map((shift) => ({
        name: shift.name,
        start: shift.start.toISOString(),
        end: shift.end.toISOString(),
      })),
    };

    console.log('Controller:', query);
    return query;
  }
}
