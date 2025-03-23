import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResponseDto, SignInDto, SignUpDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  public async signIn(
    @Body() credentials: SignInDto,
  ): Promise<AuthResponseDto> {
    return await this.authService.signIn(credentials);
  }

  @Post('sign-up')
  public async signUp(@Body() credentials: SignUpDto) {
    await this.authService.signUp(credentials);
  }
}
