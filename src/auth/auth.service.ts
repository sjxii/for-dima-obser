import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthResponseDto, SignInDto, SignUpDto } from './dto/auth.dto';
import { UserRepository } from './user.repository';

export const HASH_SALT = 12;

@Injectable()
export class AuthService {
  constructor(
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
    const user = await this.userRepository.findByEmail(credentials.email);

    if (!user) {
      throw new NotFoundException("User doesn't exists");
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
