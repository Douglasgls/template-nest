import { Injectable, Inject } from '@nestjs/common';
import { UserResponseDTO } from '../../../domain/dtos/user.dto';
import { omit } from 'lodash';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';

@Injectable()
export class GetAllUsersUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly repositoryUser: IUserRepository,
  ) {}

  async execute(): Promise<UserResponseDTO[]> {
    const users = await this.repositoryUser.getAll();
    return users.map((user) =>
      omit(user, ['password_hash']),
    ) as UserResponseDTO[];
  }
}
