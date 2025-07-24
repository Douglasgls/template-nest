import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { UserResquestDTO, UserResponseDTO } from '../../../domain/dtos/user.dto';
import { encryptPassword } from '../../../utils/utils';
import { omit } from 'lodash';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { User } from '../../../domain/entities/user.entity';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly repositoryUser: IUserRepository,
  ) {}

  async execute(user: UserResquestDTO): Promise<UserResponseDTO> {
    const existingUser = await this.repositoryUser.findOneByEmail(user.email);
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await encryptPassword(user.password_hash);
    const username = user.username.toUpperCase();
    const createdAt = new Date();
    const updatedAt = null;

    const newUser = new User(
      username,
      user.email,
      hashedPassword,
      createdAt,
      updatedAt,
    );

    const created = await this.repositoryUser.create(newUser);
    return omit(created, ['password_hash']) as UserResponseDTO;
  }
}
