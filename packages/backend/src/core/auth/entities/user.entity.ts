import { UserDto } from '@core/auth/entities/dtos/auth.dto';
import { User } from '@prisma/client';

export interface UserMethods {
  create(data: UserDto): Promise<User>;
  findByEmail(email: string): Promise<User>;
  findById(id: string): Promise<User>;
  updateRefreshToken(id: string, token: string): Promise<User>;
  updateResetToken(id: string, token: string): Promise<User>;
}
