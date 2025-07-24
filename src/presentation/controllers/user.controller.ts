import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserResponseDTO, UserResquestDTO } from '../../domain/dtos/user.dto';
import { UserGuard } from '../../infrastructure/http/guards/user.guard';
import { IsOwnerGuard } from '../../infrastructure/http/guards/is-owner.guard';
import { CreateUserUseCase } from '../../application/use-cases/user/create-user.use-case';
import { GetAllUsersUseCase } from '../../application/use-cases/user/get-all-users.use-case';
import { GetUserByIdUseCase } from '../../application/use-cases/user/get-user-by-id.use-case';
import { UpdateUserUseCase } from '../../application/use-cases/user/update-user.use-case';
import { DeleteUserUseCase } from '../../application/use-cases/user/delete-user.use-case';

@Controller('user')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getAllUsersUseCase: GetAllUsersUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(UserGuard)
  getHello(): Promise<UserResponseDTO[]> {
    return this.getAllUsersUseCase.execute();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() user: UserResquestDTO): Promise<UserResponseDTO | null> {
    return await this.createUserUseCase.execute(user);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(UserGuard, IsOwnerGuard)
  async getOne(@Param('id') id: string): Promise<UserResponseDTO | null> {
    return await this.getUserByIdUseCase.execute(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(UserGuard, IsOwnerGuard)
  async updatePartial(
    @Param('id') id: string,
    @Body() user: Partial<UserResquestDTO>,
  ): Promise<UserResponseDTO | null> {
    return await this.updateUserUseCase.execute(id, user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(UserGuard, IsOwnerGuard)
  async delete(@Param('id') id: string): Promise<UserResponseDTO | null> {
    return await this.deleteUserUseCase.execute(id);
  }
}
