import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { UserResponseDTO } from '../../../domain/dtos/user.dto';
import { omit } from 'lodash';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';

@Injectable()
export class GetUserByIdUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly repositoryUser: IUserRepository,
  ) {}

  async execute(id: string): Promise<UserResponseDTO> {
    const user = await this.repositoryUser.findOneByID(id);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return omit(user, ['password_hash']) as UserResponseDTO;
  }
}
