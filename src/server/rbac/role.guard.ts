import { ROLE_KEY } from './role.decorator';
import { Role } from './role.enum';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  async canActivate(context: ExecutionContext) {
    const requiredRole = this.reflector.getAllAndOverride<Role>(ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRole) {
      return true;
    }
    const { user } = await context.switchToHttp().getRequest();
    if (!user) {
      return false;
    }
    const role = user.role;

    const roleWeight = {
      [Role.USER]: 1,
      [Role.MANAGER]: 2,
      [Role.ADMIN]: 3,
    };

    return roleWeight[role] >= roleWeight[requiredRole];
  }
}
