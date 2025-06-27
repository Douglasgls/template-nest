import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entity/user.entity';
import { UserDto, UserResponseDto } from './dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getHello(): Promise<User[]> {
    return this.userService.getAll() || null;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() User: UserDto): Promise<UserResponseDto | null> {
    const user = await this.userService.create(User);
    if (!user) {
      return null;
    }
    const { password_hash, ...result } = user;
    return result;
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getOne(@Param('id') id: number): Promise<UserResponseDto | null> {
    const user = await this.userService.getOne(id);
    if (!user) {
      return null;
    }
    return user;
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: number,
    @Body() User: UserDto,
  ): Promise<UserResponseDto | null> {
    const user = await this.userService.update(id, User);
    if (!user) {
      return null;
    }
    return user;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: number): Promise<UserResponseDto | null> {
    const user = await this.userService.delete(id);
    if (!user) {
      return null;
    }
    return user;
  }
}
