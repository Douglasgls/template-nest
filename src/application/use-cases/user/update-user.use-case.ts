import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { UserResquestDTO, UserResponseDTO } from '../../../domain/dtos/user.dto';
import { encryptPassword } from '../../../utils/utils';
import { omit } from 'lodash';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { User } from '../../../domain/entities/user.entity';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly repositoryUser: IUserRepository,
  ) {}

  async execute(id: string, user: Partial<UserResquestDTO>): Promise<UserResponseDTO> {
    const existUser = await this.repositoryUser.findOneByID(id);

    if (!existUser) {
      throw new BadRequestException('User not found');
    }

    if (user.email) {
      const existingUserByEmail = await this.repositoryUser.findOneByEmail(user.email);
      if (existingUserByEmail && existingUserByEmail.id !== id) {
        throw new BadRequestException('Email already in use');
      }
    }

    const fieldsToUpdate: Partial<User> = {};

    if (user.username) {
      fieldsToUpdate.username = user.username.toUpperCase();
    }
    if (user.email) {
      fieldsToUpdate.email = user.email;
    }
    if (user.password_hash) {
      fieldsToUpdate.password_hash = await encryptPassword(user.password_hash);
    }

    fieldsToUpdate.updated_at = new Date();

    await this.repositoryUser.update(id, fieldsToUpdate);

    const userUpdated = await this.repositoryUser.findOneByID(id);

    return omit(userUpdated, ['password_hash']) as UserResponseDTO;
  }
}
