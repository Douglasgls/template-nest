import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';

export class UserResquestDTO {
  @IsNotEmpty()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsStrongPassword()
  password_hash: string;
}

export class UserResponseDTO {
  id: string;
  username: string;
  email: string;
  created_at: Date;
  updated_at: Date | null;
}
