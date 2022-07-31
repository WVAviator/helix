import { UsersService } from '../users/users.service';
import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt } from 'passport-jwt';

const cookieExtractor = (req: any) => {
  let token = null;
  if (req && req.signedCookies) {
    token = req.signedCookies['helix_access_token'];
  }
  return token;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET_KEY,
    });
  }

  async validate(payload: any) {
    const user = await this.usersService.findById(payload.sub);
    console.log('JwtStrategy:', user);

    if (!user) {
      throw new UnauthorizedException(
        'Login information incorrect or user does not exist.',
      );
    }
    return user;
  }
}
