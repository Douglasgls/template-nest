import { CreateUserUseCase } from './create-user.use-case';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { User } from '../../../domain/entities/user.entity';
import { BadRequestException } from '@nestjs/common';

describe('CreateUserUseCase', () => {
  let createUserUseCase: CreateUserUseCase;
  let userRepository: IUserRepository;

  beforeEach(() => {
    userRepository = {
      create: jest.fn(),
      findOneByEmail: jest.fn(),
      getAll: jest.fn(),
      findOneByID: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      updatePartial: jest.fn(),
    };
    createUserUseCase = new CreateUserUseCase(userRepository);
  });

  it('should create a new user', async () => {
    const now = new Date();
    const user = new User(
      'TESTUSER',
      'test@example.com',
      'hashedpassword',
      now,
      null,
    );
    const userRequest = {
      username: 'testuser',
      email: 'test@example.com',
      password_hash: 'password123',
    };

    (userRepository.findOneByEmail as jest.Mock).mockResolvedValue(null);
    (userRepository.create as jest.Mock).mockResolvedValue(user);

    const result = await createUserUseCase.execute(userRequest);

    expect(userRepository.findOneByEmail).toHaveBeenCalledWith(
      'test@example.com',
    );
    expect(userRepository.create).toHaveBeenCalled();
    expect(result.username).toBe('TESTUSER');
  });

  it('should throw an error if user already exists', async () => {
    const userRequest = {
      username: 'testuser',
      email: 'test@example.com',
      password_hash: 'password123',
    };
    const now = new Date();
    const user = new User(
        'testuser',
        'test@example.com',
        'password123',
        now,
        null,
        '123',
      );

    (userRepository.findOneByEmail as jest.Mock).mockResolvedValue(user);

    await expect(createUserUseCase.execute(userRequest)).rejects.toThrow(
      new BadRequestException('User already exists'),
    );
  });
});
