import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';


export async function encryptPassword(password: string): Promise<string> {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}

export function comparePassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}

export async function verifyJWT(token: string): Promise<boolean> {
  const configService = new ConfigService();
  const jwtService = new JwtService();

  try {
    await jwtService.verifyAsync(token, {
      secret: configService.get<string>('JWT_SECRET'),
      ignoreExpiration: true,
    });
    return true;
  } catch {
    return false;
  }
}

export async function generateJWT(payload: object): Promise<string> {
  const configService = new ConfigService();
  const jwtService = new JwtService();

  const access_token:string = await jwtService.signAsync(payload, {
    expiresIn: configService.get<string>('JWT_EXPIRATION'),
    secret: configService.get<string>('JWT_SECRET'),
    algorithm: 'HS256',
  });

  return access_token;
  }

  