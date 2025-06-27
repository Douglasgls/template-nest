import { Body, Controller, Post } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { AuthTokenDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signin')
  async signIn(@Body() AuthDto: AuthDto): Promise<{ access_token: string }> {
    console.log(AuthDto);
    return await this.authService.signIn(AuthDto.email, AuthDto.password);
  }

  @Post('/refresh-token')
  async refreshToken(
    @Body() token: AuthTokenDto,
  ): Promise<{ refresh_token: string }> {
    return await this.authService.refreshToken(token);
  }
}
