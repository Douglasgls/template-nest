import { IsEmail, IsNotEmpty, IsString, MinLength, IsStrongPassword } from 'class-validator';

export class UserResquestDTO {
  @IsString({ message: 'Username must be a string' })
  @IsNotEmpty({ message: 'Username is required' })
  @MinLength(3, { message: 'Username must be at least 3 characters long' })
  username: string;

  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsStrongPassword(
    {},
    {
      message:
        'Password must be at least 8 characters long, with at least one uppercase letter, one lowercase letter, one number, and one special character',
    },
  )
  password_hash: string;
}

export class UserResponseDTO {
  id: string;
  username: string;
  email: string;
  created_at: Date;
  updated_at: Date | null;
}
