import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.refreshToken || request?.body?.refreshToken;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    const refreshToken =
      req?.cookies?.refreshToken || req?.body?.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    const user = await this.usersService.findById(payload.sub);
    if (!user || user.refreshToken !== refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return user;
  }
}

