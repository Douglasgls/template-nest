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
import { User } from './entity/user.entity';
import { UserDto, UserResponseDto } from './dto/user.dto';
import { UserGuard } from './user.guard';
import { omit } from 'lodash';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(UserGuard)
  getHello(): Promise<User[]> {
    return this.userService.getAll();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() User: UserDto): Promise<UserResponseDto | null> {
    const user = await this.userService.create(User);
    if (!user) {
      return null;
    }
    return omit(user, ['password_hash']);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(UserGuard)
  async getOne(@Param('id') id: number): Promise<UserResponseDto | null> {
    const user = await this.userService.getOne(id);
    if (!user) {
      return null;
    }
    return user;
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(UserGuard)
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

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(UserGuard)
  async updatePartial(
    @Param('id') id: number,
    @Body() User: any,
  ): Promise<UserResponseDto | null> {
    const validKeys = {
      username: 'string',
      email: 'string',
      password_hash: 'string',
    };

    const updateFields: Record<string, any> = {};

    for (const key of Object.keys(User)) {
      if (key in validKeys && typeof User[key] === validKeys[key]) {
        updateFields[key] = User[key];
      }
    }

    const user = await this.userService.update(
      id,
      undefined,
      true,
      updateFields,
    );

    if (!user) {
      return null;
    }

    return user;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(UserGuard)
  async delete(@Param('id') id: number): Promise<UserResponseDto | null> {
    const user = await this.userService.delete(id);
    if (!user) {
      return null;
    }
    return user;
  }
}
