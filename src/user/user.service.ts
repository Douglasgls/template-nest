import { Injectable } from '@nestjs/common';
import { User } from './entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDto, UserResponseDto } from './dto/user.dto';
import { encryptPassword } from 'src/utils/utils';
import { omit } from 'lodash';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private repUser: Repository<User>,
  ) {}

  async getAll(): Promise<User[]> {
    return await this.repUser.find();
  }

  async getOne(id: number): Promise<UserResponseDto | null> {
    const userExists = await this.repUser.findOne({ where: { id: id } });
    if (!userExists) {
      return null;
    }
    return omit(userExists, ['password_hash']);
  }

  async create(user: UserDto): Promise<User | null> {
    const userExists = await this.repUser.findOne({
      where: { email: user.email },
    });
    if (userExists) {
      return null;
    }
    user.password_hash = await encryptPassword(user.password_hash);
    user.username = user.username.toUpperCase();
    return await this.repUser.save(user);
  }

  async update(
    id: number,
    userDto?: UserDto,
    partial = false,
    data?: Partial<UserDto>,
  ): Promise<UserResponseDto | null> {
    const user = await this.repUser.findOneBy({ id });
    if (!user) return null;

    if (partial && data) {
      if (data.password_hash) {
        data.password_hash = await encryptPassword(data.password_hash);
      }
      await this.repUser.update(id, data);
      return await this.repUser.findOneBy({ id });
    }

    if (userDto) {
      userDto.password_hash = await encryptPassword(userDto.password_hash);
      await this.repUser.update(id, { ...userDto, updated_at: new Date() });
      return await this.repUser.findOneBy({ id });
    }

    return user;
  }

  async delete(id: number): Promise<UserResponseDto | null> {
    const userExists = await this.repUser.findOneBy({ id: id });
    if (!userExists) {
      return null;
    }
    await this.repUser.delete(id);
    return userExists;
  }

  async findOne(email: string): Promise<UserDto | null> {
    const userExists = await this.repUser.findOneBy({ email: email });

    if (!userExists) {
      return null;
    }

    return userExists;
  }

  async findOneByid(id: number): Promise<UserDto | null> {
    const userExists = await this.repUser.findOneBy({ id: id });

    if (!userExists) {
      return null;
    }

    return userExists;
  }
}
