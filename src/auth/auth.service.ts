import { JwtService } from '@nestjs/jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { comparePassword } from '../utils/utils';
import { ConfigService } from '@nestjs/config';
import { AuthTokenDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signIn(email: string, pass: string): Promise<{ access_token: string }> {
    const user = await this.usersService.findOne(email);

    if (!user) {
      throw new UnauthorizedException();
    }

    const password = await comparePassword(pass, user.password_hash);

    if (!password) {
      throw new UnauthorizedException();
    }

    const payload = { email: user.email, username: user.username };

    return {
      access_token: await this.jwtService.signAsync(payload, {
        expiresIn: this.configService.get<string>('JWT_EXPIRATION'),
        secret: this.configService.get<string>('JWT_SECRET'),
        algorithm: 'HS256',
      }),
    };
  }

  async refreshToken(
    userToken: AuthTokenDto,
  ): Promise<{ refresh_token: string }> {
    const access_token = userToken.access_token;

    const payload = await this.jwtService.verifyAsync(access_token, {
      secret: this.configService.get<string>('JWT_SECRET'),
      ignoreExpiration: true,
    });

    if (!payload) {
      throw new UnauthorizedException();
    }

    const { email, username, sub } = payload;

    const newPayload = { email, username, sub };

    const refresh_token = await this.jwtService.signAsync(newPayload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRATION'),
      algorithm: 'HS256',
    });
    return { refresh_token };
  }
}
