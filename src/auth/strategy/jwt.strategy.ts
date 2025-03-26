import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from '../user.repository';
import { JwtPayload } from '../interface/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userRepository: UserRepository,
    configService: ConfigService,
  ) {
    const secretOrKey = configService.get<string>('JWT_SECRET');

    if (!secretOrKey) {
      throw new Error('JWT_SECRET is not defined in the configuration');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secretOrKey as string,
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.userRepository.findByEmail(payload.email);
    if (!user) {
      throw new Error('User not found');
    }
    return { id: user.id, username: user.username, email: user.email };
  }
}
