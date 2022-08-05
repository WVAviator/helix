import { NestInterceptor } from '@nestjs/common';

export class RedirectInterceptor implements NestInterceptor {
  constructor(private redirect: string) {}

  intercept(context, next) {
    context.switchToHttp().getResponse().redirect(this.redirect);
    return next.handle();
  }
}
