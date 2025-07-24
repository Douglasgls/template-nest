import { User } from './user.entity';

describe('User Entity', () => {
  it('should create a new user', () => {
    const now = new Date();
    const user = new User(
      'testuser',
      'test@example.com',
      'password123',
      now,
      null,
      '123',
    );

    expect(user).toBeDefined();
    expect(user.id).toBe('123');
    expect(user.username).toBe('testuser');
    expect(user.email).toBe('test@example.com');
    expect(user.password_hash).toBe('password123');
    expect(user.created_at).toBe(now);
    expect(user.updated_at).toBeNull();
  });
});
