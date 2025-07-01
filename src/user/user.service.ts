import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { UserResquestDTO, UserResponseDTO } from './dto/user.dto';
import { encryptPassword } from '../utils/utils';
import { omit } from 'lodash';
import { IUserRepository } from './repository/IUserRepository';
import { User } from './entity/user.entity';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UserService {
  constructor(
    @Inject('IUserRepository')
    private readonly repositoryUser: IUserRepository,
  ) {}

  async getAll(): Promise<UserResponseDTO[]> {
    const users = await this.repositoryUser.getAll();
    return users.map((user) =>
      omit(user, ['password_hash']),
    ) as UserResponseDTO[];
  }

  async getOne(id: string): Promise<UserResponseDTO> {
    const user = await this.repositoryUser.findOneByID(id);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return omit(user, ['password_hash']) as UserResponseDTO;
  }

  async create(user: UserResquestDTO): Promise<UserResponseDTO> {
    const existingUser = await this.repositoryUser.findOneByEmail(user.email);
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    user.password_hash = await encryptPassword(user.password_hash);
    user.username = user.username.toUpperCase();

    const userWithFields = {
      ...user,
      created_at: new Date(),
      updated_at: null,
    };

    const created = await this.repositoryUser.create(userWithFields);
    return omit(created, ['password_hash']) as UserResponseDTO;
  }

  async update(id: string, user: UserResquestDTO): Promise<UserResponseDTO> {
    const existUser = await this.repositoryUser.findOneByID(id);
    const existingUser = await this.repositoryUser.findOneByEmail(user.email);

    if (!existUser) {
      throw new BadRequestException('User not found');
    }

    if (existingUser && existingUser.id !== id) {
      throw new BadRequestException('User already exists');
    }

    const userNewInstance = plainToInstance(User, user);
    userNewInstance.username = user.username.toUpperCase();
    userNewInstance.password_hash = await encryptPassword(user.password_hash);
    userNewInstance.email = user.email;
    userNewInstance.updated_at = new Date();

    await this.repositoryUser.update(id, userNewInstance);

    const userUpdated = await this.repositoryUser.findOneByID(id);

    return omit(userUpdated, ['password_hash']) as UserResponseDTO;
  }

  async updatePartial(
    id: string,
    user: Partial<UserResquestDTO>,
  ): Promise<UserResponseDTO> {
    const existUser = await this.repositoryUser.findOneByID(id);

    if (!existUser) {
      throw new BadRequestException('User not found');
    }

    const existingUser = await this.repositoryUser.findOneByEmail(
      existUser?.email,
    );

    if (existingUser && existingUser.id !== id) {
      throw new BadRequestException('User already exists');
    }

    const validKeys = {
      username: 'string',
      email: 'string',
      password_hash: 'string',
    };

    const updateFields: Record<string, any> = {};

    for (const key of Object.keys(user)) {
      if (key in validKeys && typeof user[key] === validKeys[key]) {
        updateFields[key] = user[key];
      }
    }

    if (updateFields.password_hash) {
      updateFields.password_hash = await encryptPassword(
        updateFields.password_hash,
      );
    }

    const userNewInstance = plainToInstance(User, updateFields);

    for (const key of Object.keys(updateFields)) {
      userNewInstance[key] = updateFields[key];
    }

    const updated = await this.repositoryUser.update(id, userNewInstance);
    return omit(updated, ['password_hash']) as UserResponseDTO;
  }

  async delete(id: string): Promise<UserResponseDTO> {
    const user = await this.repositoryUser.findOneByID(id);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    await this.repositoryUser.delete(id);
    return omit(user, ['password_hash']) as UserResponseDTO;
  }

  async findOneByEmail(email: string): Promise<UserResponseDTO | null> {
    const user = await this.repositoryUser.findOneByEmail(email);
    if (!user) {
      return null;
    }
    return omit(user, ['password_hash']) as UserResponseDTO;
  }

  async findOneById(id: string): Promise<UserResponseDTO | null> {
    const user = await this.repositoryUser.findOneByID(id);
    if (!user) {
      return null;
    }
    return omit(user, ['password_hash']) as UserResponseDTO;
  }

  async findByUserEmail(email: string): Promise<User | null> {
    const user = await this.repositoryUser.findOneByEmail(email);
    return user ?? null;
  }
}
