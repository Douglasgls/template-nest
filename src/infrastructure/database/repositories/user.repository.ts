import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { User } from '../../../domain/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserSchema } from '../schemas/user.schema';

export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserSchema)
    private readonly repository: Repository<UserSchema>,
  ) {}

  private toDomain(userSchema: UserSchema): User {
    return new User(
      userSchema.username,
      userSchema.email,
      userSchema.password_hash,
      userSchema.created_at,
      userSchema.updated_at,
      userSchema.id,
    );
  }

  private toSchema(user: User): UserSchema {
    const userSchema = new UserSchema();
    userSchema.id = user.id;
    userSchema.username = user.username;
    userSchema.email = user.email;
    userSchema.password_hash = user.password_hash;
    userSchema.created_at = user.created_at;
    userSchema.updated_at = user.updated_at;
    return userSchema;
  }

  async getAll(): Promise<User[]> {
    const usersSchema = await this.repository.find();
    return usersSchema.map((userSchema) => this.toDomain(userSchema));
  }

  async findOneByID(id: string): Promise<User | null> {
    const userSchema = await this.repository.findOneBy({ id });
    return userSchema ? this.toDomain(userSchema) : null;
  }

  async findOneByEmail(email: string): Promise<User | null> {
    const userSchema = await this.repository.findOneBy({ email });
    return userSchema ? this.toDomain(userSchema) : null;
  }

  async create(user: User): Promise<User> {
    const userSchema = this.toSchema(user);
    const createdUser = await this.repository.save(userSchema);
    return this.toDomain(createdUser);
  }

  async update(id: string, user: Partial<User>): Promise<User | null> {
    await this.repository.update(id, user);
    return this.findOneByID(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected !== 0;
  }
}
