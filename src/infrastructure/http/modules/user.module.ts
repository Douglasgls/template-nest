import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from '../../../presentation/controllers/user.controller';
import { CreateUserUseCase } from '../../../application/use-cases/user/create-user.use-case';
import { GetAllUsersUseCase } from '../../../application/use-cases/user/get-all-users.use-case';
import { GetUserByIdUseCase } from '../../../application/use-cases/user/get-user-by-id.use-case';
import { UpdateUserUseCase } from '../../../application/use-cases/user/update-user.use-case';
import { DeleteUserUseCase } from '../../../application/use-cases/user/delete-user.use-case';
import { UserRepository } from '../../database/repositories/user.repository';
import { UserSchema } from '../../database/schemas/user.schema';

@Module({
  imports: [TypeOrmModule.forFeature([UserSchema])],
  controllers: [UserController],
  providers: [
    CreateUserUseCase,
    GetAllUsersUseCase,
    GetUserByIdUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
  ],
})
export class UserModule {}
