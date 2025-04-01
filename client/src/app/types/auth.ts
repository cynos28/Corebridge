export type UserRole = 'student' | 'teacher' | 'admin';

export interface User {
  id: string;
  username: string;
  role: UserRole;
}

export interface SignInCredentials {
  username: string;
  password: string;
  role: UserRole;
}
