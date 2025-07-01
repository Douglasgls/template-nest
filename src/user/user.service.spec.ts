import { UserService } from '../user/user.service';
import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { omit } from 'lodash';

const mockUserBase = {
  id: 'user-123',
  email: 'john.doe@example.com',
  username: 'John Doe',
  created_at: new Date('2025-06-30T10:00:00.000Z'),
  updated_at: new Date('2025-06-30T10:00:00.000Z'),
};

// INPUTS
const createUserInput = {
  email: 'jane.smith@example.com',
  username: 'Jane Smith',
  password_hash: 'securePass123!',
};

const updateUserInput = {
  email: 'jane.doe@example.com',
  username: 'Jane Doe',
  password_hash: 'updatedPass456!',
};

const partialUpdateUserInput = {
  email: 'jane.doe@example.com',
  username: 'Jane Doe',
};

// RETORNOS
const createdUserReturn = {
  id: 'user-456',
  email: 'jane.smith@example.com',
  username: 'Jane Smith',
  created_at: new Date('2025-07-01T12:00:00.000Z'),
  updated_at: null,
};

const updatedUserReturn = {
  id: 'user-456',
  email: 'jane.doe@example.com',
  username: 'Jane Doe',
  created_at: new Date('2025-06-30T10:00:00.000Z'),
  updated_at: new Date('2025-07-01T15:00:00.000Z'),
};

const mockUserAll = [
  {
    ...mockUserBase,
    id: 'user-123',
  },
  {
    ...mockUserBase,
    id: 'user-456',
  },
];

const UserRepository = {
  getAll: jest.fn(),
  findOneByID: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  updatePartial: jest.fn(),
  delete: jest.fn(),
  findOneByEmail: jest.fn(),
};

jest.mock('../utils/utils', () => ({
  encryptPassword: jest.fn().mockResolvedValue('encrypted_password'),
}));

describe('UserService', () => {
  let userService: UserService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: 'IUserRepository',
          useValue: UserRepository,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  // === GET ALL ===
  describe('[getAll]', () => {
    test('should return all users without password', async () => {
      UserRepository.getAll.mockResolvedValue(mockUserAll);
      const result = await userService.getAll();
      expect(result).toEqual(mockUserAll);
    });
  });

  //   // === GET ONE ===
  describe('[getOne]', () => {
    test('should return one user without password', async () => {
      const user = { ...mockUserAll[0] };
      UserRepository.findOneByID.mockResolvedValue(user);
      const result = await userService.getOne(user.id);
      expect(result).toEqual(user);
    });

    test('should throw BadRequestException if user not found', async () => {
      UserRepository.findOneByID.mockResolvedValue(null);
      await expect(userService.getOne('nonexistent-id')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  //   // === CREATE ===
  describe('[create]', () => {
    test('should return user created without password', async () => {
      UserRepository.create.mockResolvedValue(createdUserReturn);
      const result = await userService.create(createUserInput);
      expect(result).toEqual(createdUserReturn);
    });

    test('should throw BadRequestException if user already exists', async () => {
      UserRepository.findOneByEmail.mockResolvedValue(createdUserReturn);
      await expect(userService.create(createUserInput)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  //   // === UPDATE ===
  describe('[update]', () => {
    test('should return user updated without password', async () => {
      UserRepository.findOneByID.mockResolvedValue(updatedUserReturn);
      UserRepository.update.mockResolvedValue({
        ...updatedUserReturn,
        password_hash: 'updatedPass456!',
      });
      const result = await userService.update(
        updatedUserReturn.id,
        updateUserInput,
      );
      expect(result).toEqual(updatedUserReturn);
    });
    test('should throw BadRequestException if user not found', async () => {
      UserRepository.findOneByID.mockResolvedValue(null);
      await expect(
        userService.update('invalid-id', updateUserInput),
      ).rejects.toThrow(BadRequestException);
    });
  });

  // === UPDATE PARTIAL ===
  describe('[updatePartial]', () => {
    test('should return user partially updated without password', async () => {
      UserRepository.findOneByID.mockResolvedValue(updatedUserReturn);
      const result = await userService.updatePartial(
        updatedUserReturn.id,
        partialUpdateUserInput,
      );
      expect(result).toEqual(updatedUserReturn);
    });

    test('should throw BadRequestException if user not found', async () => {
      UserRepository.findOneByID.mockResolvedValue(null);
      await expect(
        userService.updatePartial('nonexistent-id', partialUpdateUserInput),
      ).rejects.toThrow(BadRequestException);
    });
  });

  // === UPDATE PARTIAL - EMAIL DUPLICADO ===
  describe('[updatePartial - email duplicado]', () => {
    test('should throw BadRequestException if email already exists and belongs to another user', async () => {
      UserRepository.findOneByID.mockResolvedValue({
        id: 'user-123',
        email: 'old.email@example.com',
      });

      UserRepository.findOneByEmail.mockResolvedValue({
        id: 'user-999', // usuário diferente
        email: 'jane.doe@example.com',
      });

      await expect(
        userService.updatePartial('user-123', {
          email: 'jane.doe@example.com',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  //   // === DELETE ===
  describe('[delete]', () => {
    test('should return user deleted without password', async () => {
      UserRepository.findOneByID.mockResolvedValue(mockUserBase);
      UserRepository.delete.mockResolvedValue(mockUserBase);

      const result = await userService.delete(mockUserBase.id);

      expect(result).toEqual(mockUserBase);
    });

    test('should throw BadRequestException if user not found', async () => {
      UserRepository.findOneByID.mockResolvedValue(null);
      await expect(userService.delete('invalid-id')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  // === FIND ONE BY EMAIL ===
  describe('[findOneByEmail]', () => {
    test('should return user without password', async () => {
      UserRepository.findOneByEmail.mockResolvedValue(mockUserBase);
      const result = await userService.findOneByEmail(mockUserBase.email);
      expect(result).toEqual(omit(mockUserBase, ['password_hash']));
    });

    test('should return null if user not found', async () => {
      UserRepository.findOneByEmail.mockResolvedValue(null);
      const result = await userService.findOneByEmail(
        'nonexistent@example.com',
      );
      expect(result).toBeNull();
    });
  });

  // === FIND ONE BY ID ===
  describe('[findOneById]', () => {
    test('should return user without password', async () => {
      UserRepository.findOneByID.mockResolvedValue(mockUserBase);
      const result = await userService.findOneById(mockUserBase.id);
      expect(result).toEqual(omit(mockUserBase, ['password_hash']));
    });

    test('should return null if user not found', async () => {
      UserRepository.findOneByID.mockResolvedValue(null);
      const result = await userService.findOneById('nonexistent-id');
      expect(result).toBeNull();
    });
  });

  // === FIND BY USER EMAIL (RAW ENTITY) ===
  describe('[findByUserEmail]', () => {
    test('should return full user entity', async () => {
      UserRepository.findOneByEmail.mockResolvedValue(mockUserBase);
      const result = await userService.findByUserEmail(mockUserBase.email);
      expect(result).toEqual(mockUserBase);
    });

    test('should return null if user not found', async () => {
      UserRepository.findOneByEmail.mockResolvedValue(null);
      const result = await userService.findByUserEmail(
        'nonexistent@example.com',
      );
      expect(result).toBeNull();
    });
  });
});
