import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthResponseDto, SignInDto, SignUpDto } from './dto/auth.dto';
import { UserRepository } from './user.repository';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

export const HASH_SALT = 12;

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  public async signUp(credentials: SignUpDto): Promise<void> {
    const user = await this.userRepository.findByEmail(credentials.email);

    if (user) {
      throw new ConflictException('User has been already regirested');
    }

    const hashedPassword = await bcrypt.hash(credentials.password, HASH_SALT);

    await this.userRepository.create({
      email: credentials.email,
      username: credentials.username,
      hashedPassword,
    });
  }

  public async signIn(credentials: SignInDto): Promise<AuthResponseDto> {
    const cacheKey = `user:${credentials.email}`;

    let user = await this.cacheManager.get<any>(cacheKey);

    if (!user) {
      user = await this.userRepository.findByEmail(credentials.email);

      if (!user) {
        throw new NotFoundException("User doesn't exist");
      }

      await this.cacheManager.set(cacheKey, user, 60);
    }

    const isPasswordValid = await bcrypt.compare(
      credentials.password,
      user.hashedPassword,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = await this.jwtService.signAsync(
      { id: user.id, username: user.username, email: user.email },
      { secret: this.config.getOrThrow('JWT_SECRET') },
    );

    return { accessToken };
  }
}
