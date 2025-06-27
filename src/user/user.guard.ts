import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { verifyJWT } from 'src/utils/utils';
import { Request } from 'express';

@Injectable()
export class UserGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    if (!request.headers.authorization) {
      return false;
    }

    let token = request.headers.authorization;

    if (!token) {
      return false;
    }

    token = token.split(' ')[1];

    return await verifyJWT(token);
  }
}
