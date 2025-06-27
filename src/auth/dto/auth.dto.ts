export class AuthDto {
  email: string;
  password: string;
}

export class AuthResponseDto {
  access_token: string;
  refresh_token: string;
}

export class AuthTokenDto {
  access_token: string;
}
