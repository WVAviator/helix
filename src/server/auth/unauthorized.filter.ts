import { Catch, UnauthorizedException } from '@nestjs/common';
import { ExceptionFilter, ArgumentsHost } from '@nestjs/common';

@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter implements ExceptionFilter {
  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    response.redirect('/login');
  }
}
