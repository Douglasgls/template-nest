import { IUserRepository } from "../IUserRepository";
import { encryptPassword } from "src/utils/utils";
import { User } from "src/user/entity/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(User)
    private repositoryUser: Repository<User>,
  ) {}

  async getAll(): Promise<User[]> {
    return await this.repositoryUser.find();
  }

  async findOneByID(id: string): Promise<User | null> {
    return await this.repositoryUser.findOneBy({ id });
  }

  async create(user: User): Promise<User> {
    return await this.repositoryUser.save(user);
  }

  async update(id: string, user: User): Promise<User | null> {
    if (!user) return null;

    await this.repositoryUser.update(id, {
      ...user,
      updated_at: new Date(),
    });

    return await this.repositoryUser.findOneBy({ id });
  }

  async updatePartial(id: string, partial: Partial<User>): Promise<User | null> {
    const user = await this.repositoryUser.findOneBy({ id });
    if (!user) return null;
    await this.repositoryUser.update(id, partial);
    return await this.repositoryUser.findOneBy({ id });
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repositoryUser.delete(id);
    return result.affected !== 0;
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return await this.repositoryUser.findOneBy({ email });
  }
}
