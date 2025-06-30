import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class IsOwnerGuard implements CanActivate {
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

    const jwtService = new JwtService();

    const dataJWT = jwtService.decode(token);
    
    if (!dataJWT.id) {
      return false;
    }

    console.log(dataJWT.id, request.params.id);
    if (dataJWT.id !== request.params.id) {
      return false;
    }

    return true;

  }
}
