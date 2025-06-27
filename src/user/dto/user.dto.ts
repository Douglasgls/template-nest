import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';


export class UserDto {

  @IsNotEmpty()
  username: string;
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
  })
  password_hash: string;
}

export class UserResponseDto {
  id: number;
  username: string;
  email: string;
  created_at: Date;
  updated_at: Date;
}
