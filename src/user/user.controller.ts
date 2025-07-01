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
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserResponseDTO, UserResquestDTO } from './dto/user.dto';
import { UserGuard } from './user.guard';
import { IsOwnerGuard } from 'src/auth/is-owner.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(UserGuard)
  getHello(): Promise<UserResponseDTO[]> {
    return this.userService.getAll();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() User: UserResquestDTO): Promise<UserResponseDTO | null> {
    return await this.userService.create(User);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(UserGuard, IsOwnerGuard)
  async getOne(@Param('id') id: string): Promise<UserResponseDTO | null> {
    console.log(id);
    return await this.userService.getOne(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(UserGuard, IsOwnerGuard)
  async update(
    @Param('id') id: string,
    @Body() User: UserResquestDTO,
  ): Promise<UserResponseDTO | null> {
    return await this.userService.update(id, User);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(UserGuard, IsOwnerGuard)
  async updatePartial(
    @Param('id') id: string,
    @Body() User: Partial<UserResquestDTO>,
  ): Promise<UserResponseDTO | null> {
    return await this.userService.updatePartial(id, User);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(UserGuard, IsOwnerGuard)
  async delete(@Param('id') id: string): Promise<UserResponseDTO | null> {
    return await this.userService.delete(id);
  }
}
