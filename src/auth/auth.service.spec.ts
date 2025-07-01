import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { comparePassword, generateJWT } from '../utils/utils';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';

const mockUser = {
  id: '123',
  name: 'teste da silva',
  email: 'teste@gmail.com',
  password_hash: '6243#Teste',
};

const mockUserService = {
  findByUserEmail: jest.fn(),
};

jest.mock('../utils/utils', () => ({
  generateJWT: jest.fn(),
  comparePassword: jest.fn(),
}));

const mockJwtService = {
  signAsync: jest.fn(),
};

const mockConfigService = {
  get: jest.fn(),
};

describe('UserService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();
    jest.clearAllMocks();
    authService = module.get<AuthService>(AuthService); // sempre vou passar a instante que vou pecisar acessar os metodos para teste
  });
  // Teste SignIn

  test('should be acess_token valid', async () => {
    mockUserService.findByUserEmail.mockResolvedValue(mockUser);
    (comparePassword as jest.Mock).mockImplementationOnce(() => true);
    (generateJWT as jest.Mock).mockImplementationOnce(() => 'token_falso');
    const result = await authService.signIn(
      mockUser.email,
      mockUser.password_hash,
    );
    expect(result.access_token).toBe('token_falso');
  });

  test('should be UnauthorizedException because user not found when email invalid', async () => {
    mockUserService.findByUserEmail.mockResolvedValueOnce(null);
    await expect(
      authService.signIn(mockUser.email, mockUser.password_hash),
    ).rejects.toThrow(UnauthorizedException);
  });

  test('should be UnauthorizedException because password invalid', async () => {
    mockUserService.findByUserEmail.mockResolvedValue(mockUser);
    (comparePassword as jest.Mock).mockImplementationOnce(() => false);
    await expect(
      authService.signIn(mockUser.email, mockUser.password_hash),
    ).rejects.toThrow(UnauthorizedException);
  });
});
