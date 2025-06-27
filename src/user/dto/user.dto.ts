export class UserDto {
  username: string;
  email: string;
  password_hash: string;
}

export class UserResponseDto {
  id: number;
  username: string;
  email: string;
  created_at: Date;
  updated_at: Date;
}
