import { Injectable } from '@nestjs/common';
import { User } from './entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDto, UserResponseDto } from './dto/user.dto';
import { encryptPassword } from 'src/utils/utils';

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
    const { password_hash, ...result } = userExists;
    return result;
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

  async update(id: number, user: UserDto): Promise<UserResponseDto | null> {
    const userExists = await this.repUser.findOneBy({ id: id });
    if (!userExists) {
      return null;
    }
    const password_hash = await encryptPassword(user.password_hash);

    await this.repUser.update(id, {
      username: user.username,
      email: user.email,
      password_hash: password_hash,
      updated_at: new Date(),
    });
    const userUpdated = await this.repUser.findOneBy({ id: id });
    return userUpdated;
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
}
