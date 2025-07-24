export class User {
  id?: string;
  username: string;
  password_hash: string;
  email: string;
  created_at: Date;
  updated_at: Date | null;

  constructor(
    username: string,
    email: string,
    password_hash: string,
    created_at: Date,
    updated_at: Date | null,
    id?: string,
  ) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password_hash = password_hash;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
}
