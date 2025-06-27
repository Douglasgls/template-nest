import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

export async function encryptPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt();
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
