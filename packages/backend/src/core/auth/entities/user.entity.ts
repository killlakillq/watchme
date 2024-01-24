import { UserDto } from './dtos/auth.dto';

export interface User {
  id: string;
  username: string;
  picture: string;
  email: string;
  password: string;
  resetToken: string;
  refreshToken: string;
  reviewId: string;
  movieId: string;
}

export interface UserMethods {
  create(data: UserDto): Promise<User>;
  findUserByEmail(email: string): Promise<User>;
  findUserById(id: string): Promise<User>;
  updateRefreshToken(id: string, token: string): Promise<User>;
  updateResetToken(id: string, token: string): Promise<User>;
}
