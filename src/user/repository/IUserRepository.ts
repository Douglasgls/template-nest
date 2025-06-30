import { User } from "../entity/user.entity";

export interface IUserRepository {
    create(user: User): Promise<User>;
    update(id: string, user: User): Promise<User | null>;
    updatePartial(id: string, partial: object): Promise<User | null>;
    delete(id: string): Promise<boolean>;
    findOneByID(id: string): Promise<User | null>;
    findOneByEmail(email: string): Promise<User | null>;
    getAll(): Promise<User[]>;
}